from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import ProfileSerializer, ResumeSerializer
from .functions import LLM, jsonify
from .models import Resume, ResumeSkill, UserSkill, Questionnaire, Feedback
from rest_framework import status
import os
import tempfile
import json


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the authenticated user's username and email.
        """
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)


class UploadResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Upload a resume, extract data using LLM, and save the parsed content to the database.
        """
        # Check if the user already has a resume
        user_resume = Resume.objects.filter(user=request.user).first()

        # Replace the existing resume or create a new one
        if not user_resume:
            user_resume = Resume.objects.create(user=request.user)

        # Save the uploaded file temporarily
        uploaded_file = request.FILES.get('resume_file')
        if not uploaded_file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        llm = LLM('gemini-1.5-flash')  # Initialize the LLM model
        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(uploaded_file.read())  # Save uploaded file to temp location
                temp_file_path = temp_file.name

            # Extract text from the temporary file
            resume_text = LLM.extract_text_from_pdf(temp_file_path)

            # Parse content using the LLM
            parsed_data = llm.parse_resume(resume_text)
            print("printing Parsed data: ", parsed_data)
            if 'error' in parsed_data:
                return Response({"error": "Parsing failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            parsed_data = jsonify(parsed_data)
            # Update database with parsed data
            user_resume.certifications = parsed_data.get("Certifications", "")
            user_resume.projects = parsed_data.get("Projects", "")
            user_resume.save()
            # Add extracted skills
            skills = parsed_data.get("Skills", [])
            for skill_name in skills:
                skill, _ = ResumeSkill.objects.get_or_create(name=skill_name)
                UserSkill.objects.get_or_create(user=request.user, skill=skill)

            return Response({"message": "Resume uploaded and processed successfully", "skills": skills}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Failed to process resume: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        finally:
            # Delete the temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)


class UserSkillsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the authenticated user's skills.
        """
        user_skills = UserSkill.objects.filter(user=request.user).select_related('skill')
        skills_data = [user_skill.skill.name for user_skill in user_skills]
        return Response({"skills": skills_data}, status=status.HTTP_200_OK)


class AddUserSkill(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        """
        Add a skill to the authenticated user's profile.
        """
        skill_name = request.data.get('skill')
        print(skill_name)
        if not skill_name:
            return Response({"error": "No skill provided"}, status=status.HTTP_400_BAD_REQUEST)

        skill, _ = ResumeSkill.objects.get_or_create(name=skill_name)
        user_skill, created = UserSkill.objects.get_or_create(user=request.user, skill=skill)
        if created:
            return Response({"message": "Skill added successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Skill already exists"}, status=status.HTTP_200_OK)


class GenerateQuestionnaireView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Generate a questionnaire for a given skill.
        """
        skill_name = request.data.get('skill')
        if not skill_name:
            return Response({"error": "No skill provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the skill exists
        try:
            skill = ResumeSkill.objects.get(name=skill_name)
        except ResumeSkill.DoesNotExist:
            return Response({"error": f"Skill '{skill_name}' does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve questions from the database
        questions = Questionnaire.objects.filter(skill=skill)
        if questions.exists():
            questionnaire = [{"question": q.question, "complexity": q.complexity} for q in questions]
            return Response({"questionnaire": questionnaire}, status=status.HTTP_200_OK)

        # Generate questions using LLM if none exist
        llm = LLM('gemini-1.5-flash')  # Initialize the LLM model
        try:
            generated_questions = llm.generate_questionnaire(skill_name)  # Get raw LLM output
            if generated_questions==None:
                print("Not generated")
            print(f"Generated Questions: {generated_questions}")
            try:
                parsed_questions = jsonify(generated_questions)
                print(parsed_questions)
            except Exception as e:
                # logger.error(f"JSON parsing error: {str(e)}")
                return Response({"error": f"Failed to parse LLM response error:{str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


            # Add generated questions to the database
            questionnaire = []
            for item in parsed_questions:
                question_text = item.get("Question")
                complexity_rating = item.get("Rating")
                # complexity = self.map_complexity(complexity_rating)  # Convert rating to complexity label

                # Create a Questionnaire object
                new_question = Questionnaire.objects.create(skill=skill, question=question_text, complexity=complexity_rating)
                questionnaire.append({"question": new_question.question, "complexity": new_question.complexity})

            return Response({"questionnaire": questionnaire}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Failed to generate questionnaire: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # def map_complexity(self, rating):
    #     """
    #     Map numeric rating to a complexity label.
    #     """
    #     if rating == 1:
    #         return "easy"
    #     elif rating in [2, 3]:
    #         return "medium"
    #     else:
    #         return "hard"

class GenerateFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Generate LLM-based feedback for a given skill's questionnaire.
        """
        skill_name = request.data.get("skill")
        answers = request.data.get("answers")  # User's answers to the questions

        if not skill_name or not answers:
            return Response({"error": "Skill and answers are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch questions for the skill
            questions = Questionnaire.objects.filter(skill__name=skill_name)
            if not questions.exists():
                return Response({"error": f"No questions found for skill '{skill_name}'."}, status=status.HTTP_404_NOT_FOUND)

            question_texts = [q.question for q in questions]
            
            # Generate feedback using the LLM
            llm = LLM('gemini-1.5-flash')  # Initialize the LLM
            feedback = llm.generate_feedback_per_skill(questions=question_texts, answers=answers)
            print(feedback)
            parsed_feedback = jsonify(feedback)  # Ensure feedback is properly parsed JSON
            
            # Save feedback to the database
            feedback_obj = Feedback.objects.create(user=request.user, feedback_content=parsed_feedback)

            return Response({"feedback": parsed_feedback}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Failed to generate feedback: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CounterView(APIView):
    # authentication_classes = [JWTAuthentication]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the current counter value from the session.
        """
        print(f"Session Key: {request.session.session_key}")
        print(f"Session Data: {request.session.items()}")
        counter = request.session.get('counter', 0)
        return Response({"counter": counter})

    def post(self, request):
        """
        Increment the counter in the session by 1.
        """
        counter = request.session.get('counter', 0)
        counter += 1
        request.session['counter'] = counter
        return Response({"message": "Counter updated", "counter": counter})
