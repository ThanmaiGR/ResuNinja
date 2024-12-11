from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import ProfileSerializer, ResumeSerializer
from .functions import LLM, jsonify
from .models import Profile, Resume, ResumeSkill, UserSkill, Questionnaire, Feedback, Project
from django.contrib.auth.models import User
from rest_framework import status
import os
import tempfile
import json
import re


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the authenticated user's username and email.
        """
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        """
        Update the authenticated user's profile.
        """
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # This will update only Profile fields
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            if 'error' in parsed_data:
                return Response({"error": "Parsing failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            parsed_data = jsonify(parsed_data)
            # Update database with parsed data
            user_resume.certifications = parsed_data.get("Certifications", "")
            user_resume.save()

            # Add extracted skills
            skills = parsed_data.get("Skills", [])
            for skill_name in skills:
                skill, _ = ResumeSkill.objects.get_or_create(name=skill_name)
                UserSkill.objects.get_or_create(user=request.user, skill=skill)

            print("Successfully added skills")

            projects = parsed_data.get("Projects", [])
            for project in projects:
                title = project.get("title")
                tech_stack = project.get("tech_stack")
                description = project.get("description")
                Project.objects.get_or_create(
                    user=request.user,
                    title=title,
                    tech_stack=tech_stack,
                    description=description
                )

            print("Successfully added projects")
            return Response(
                {"message": "Resume uploaded and processed successfully", "skills": skills, "projects": projects},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({"error": f"Failed to process resume: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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


class UserProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the authenticated user's projects.
        """
        user_projects = Project.objects.filter(user=request.user)
        projects_data = []
        for project in user_projects:
            project_data = project.title
            projects_data.append(project_data)
        return Response({"projects": projects_data}, status=status.HTTP_200_OK)


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

    def delete(self, request):
        """
        Delete a skill from the authenticated user's profile.
        """
        skill_name = request.data.get('skill')
        if not skill_name:
            return Response({"error": "No skill provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            skill = ResumeSkill.objects.get(name=skill_name)
            user_skill = UserSkill.objects.get(user=request.user, skill=skill)
            user_skill.delete()
            return Response({"message": "Skill deleted successfully"}, status=status.HTTP_200_OK)
        except ResumeSkill.DoesNotExist:
            return Response({"error": f"Skill '{skill_name}' does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except UserSkill.DoesNotExist:
            return Response({"error": f"Skill '{skill_name}' is not associated with the user"},
                            status=status.HTTP_404_NOT_FOUND)


class AddUserProject(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        """
        Add a project to the authenticated user's profile.
        """
        title = request.data.get('title')

        if not title:
            return Response({"error": "Title Required"}, status=status.HTTP_400_BAD_REQUEST)

        project, created = Project.objects.get_or_create(user=request.user, title=title)
        if created:
            project.save()
            return Response({"message": "Project added successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Project already exists"}, status=status.HTTP_200_OK)


    def delete(self, request):
        """
        Delete a project from the authenticated user's profile.
        """
        title = request.data.get('title')
        if not title:
            return Response({"error": "No title provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(user=request.user, title=title)
            project.delete()
            return Response({"message": "Project deleted successfully"}, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            return Response({"error": f"Project with title '{title}' does not exist"}, status=status.HTTP_404_NOT_FOUND)


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
            if generated_questions == None:
                print("Not generated")
            print(f"Generated Questions: {generated_questions}")
            try:
                parsed_questions = jsonify(generated_questions)
                print(parsed_questions)
            except Exception as e:
                # logger.error(f"JSON parsing error: {str(e)}")
                return Response({"error": f"Failed to parse LLM response error:{str(e)}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Add generated questions to the database
            questionnaire = []
            for item in parsed_questions:
                question_text = item.get("Question")
                complexity_rating = item.get("Rating")
                # complexity = self.map_complexity(complexity_rating)  # Convert rating to complexity label

                # Create a Questionnaire object
                new_question = Questionnaire.objects.create(skill=skill, question=question_text,
                                                            complexity=complexity_rating)
                questionnaire.append({"question": new_question.question, "complexity": new_question.complexity})

            return Response({"questionnaire": questionnaire}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Failed to generate questionnaire: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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


class GenerateProjectQuestionnaireView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Generate a questionnaire for a given skill.
        """
        project_title = request.data.get('title')
        if not project_title:
            return Response({"error": "No project provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve questions from the database
        # questions = Questionnaire.objects.filter(skill=skill_name)
        # if questions.exists():
        #     questionnaire = [{"question": q.question, "complexity": q.complexity} for q in questions]
        #     return Response({"questionnaire": questionnaire}, status=status.HTTP_200_OK)

        # Fetch projects details from DB
        tech_stack, description = Project.objects.filter(title=project_title).values('tech_stack', 'description').first()
        # Generate questions using LLM if none exist
        llm = LLM('gemini-1.5-flash')  # Initialize the LLM model
        try:
            generated_questions = llm.generate_project_questionnaire(project_title, tech_stack, description)  # Get raw LLM output
            if generated_questions is None:
                print("Not generated")
                pass
            # print(f"Generated Questions: {generated_questions}")
            try:
                parsed_questions = jsonify(generated_questions)
            except Exception as e:
                # logger.error(f"JSON parsing error: {str(e)}")
                return Response({"error": f"Failed to parse LLM response error:{str(e)}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Add generated questions to the database
            questionnaire = []
            for item in parsed_questions:
                question_text = item.get("Question")
                complexity_rating = item.get("Rating")
                # complexity = self.map_complexity(complexity_rating)  # Convert rating to complexity label

                # Create a Questionnaire object
                # new_question = Questionnaire.objects.create(skill=skill_name, question=question_text, complexity=complexity_rating)
                questionnaire.append({"question": question_text, "complexity": complexity_rating})

            return Response({"questionnaire": questionnaire}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Failed to generate questionnaire: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Generate LLM-based feedback for a given skill's questionnaire.
        """
        form_type = request.data.get("type")
        if form_type == "project":
            key = "project_"
            name = request.data.get("title")
        else:
            key = "feedback_"
            name = request.data.get("skill")
        answers = request.data.get("answers")  # User's answers to the questions
        questions = request.data.get("questions")
        if not questions or not answers:
            return Response({"error": "Questions and answers are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Generate feedback using the LLM
            llm = LLM('gemini-1.5-flash')  # Initialize the LLM
            feedback = ''
            parsed_feedback = ''
            while not (
                    parsed_feedback
                    and (parsed_feedback.get("descriptive") or (
            not isinstance(parsed_feedback.get("descriptive"), str)))
                    and (parsed_feedback.get("quantitative") or (
            not isinstance(parsed_feedback.get("quantitative"), dict)))
            ):
                feedback = llm.generate_feedback(questions=questions, answers=answers)
                print(feedback)
                parsed_feedback = jsonify(feedback)
            descriptive, quantitative = parsed_feedback.get("descriptive"), parsed_feedback.get("quantitative")

            # Save feedback to the session
            session_key = f"{key}{name}"
            request.session[session_key] = parsed_feedback

            # Testing session storage
            for key, value in request.session.items():
                if key.startswith("feedback_"):
                    name = key.split("feedback_")[1]
            return Response({"feedback": parsed_feedback, "session_key": session_key}, status=status.HTTP_201_CREATED)

            # return Response({"feedback": parsed_feedback}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Failed to generate feedback: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateOverallFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Generate an overall feedback for all skills stored in the session.
        """
        try:
            # Collect all feedback from session
            feed_type = request.data.get('type')
            if feed_type == "project":
                session_key = "project_"
                feedback_type = "Project"
            else:
                session_key = "feedback_"
                feedback_type = "Technical"
            all_feedback = {}
            keys_to_clear = []
            all_skills = []
            for key, value in request.session.items():
                if key.startswith(session_key):
                    name = key.split(session_key)[1]
                    all_skills.append(name)
                    all_feedback[name] = value
                    keys_to_clear.append(key)

            print(request.session.keys())
            if not all_feedback:
                return Response({"error": "No feedback available in the session."}, status=status.HTTP_204_NO_CONTENT)

            # Initialize LLM
            llm = LLM('gemini-1.5-flash')
            # Clear the session keys used for feedback storage

            # for key in keys_to_clear:
            #     if key.startswith("feedback_"):
            #         del request.session[key]

            # Use the LLM function to generate overall feedback
            overall_feedback = llm.generate_overall_feedback(all_feedback)

            overall_feedback = jsonify(overall_feedback)
            # print(overall_feedback)
            # quantitative_summary = overall_feedback.get("Quantitative Summary")
            # quantitative_summary = jsonify(quantitative_summary)
            # overall_feedback["Summary"] = quantitative_summary
            # for key, value in overall_feedback.items():
            #     print(key, value)
            # print(overall_feedback)
            Feedback.objects.create(
                user=request.user,  # Store the feedback for the logged-in user
                feedback_content=overall_feedback,  # Store the generated feedback
                feedback_type=feedback_type,  # Store the feedback
            )

            return Response(
                {"overall_feedback": overall_feedback, 'all_feedback': all_feedback, 'all_skills': all_skills, "type": "Technical"},
                status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(e)
            return Response({"error": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AllFeedbacks(APIView):
    def get(self, request):
        """
        Retrieve all feedbacks.
        """
        feedbacks = Feedback.objects.filter(user=request.user).order_by('-datetime')  # Order by most recent feedback
        feedback_data = []
        feedback_dates = []
        feedback_type = []
        for idx, feedback in enumerate(feedbacks):
            data = feedback.feedback_content
            feed_type = feedback.feedback_type
            try:
                # Step 1: Escape single quotes inside strings to prevent modification later
                # Match strings that are enclosed in quotes (either single or double quotes)
                # print(data)
                # break
                # cleaned_data = re.sub(r'(["\'])((?:\\\1|.)*?)\1', r'\1\2\1', data)  # Keeps quotes within strings intact
                # # Step 2: Now replace single quotes outside of string literals (i.e., apostrophes in words)
                # cleaned_data = re.sub(r"(?<!\\)'", '"', cleaned_data)  # Replace single quotes outside of strings
                # # Step 3: Match keys and wrap them in quotes (only alphanumeric, for now)
                # cleaned_data = re.sub(r'(\w+):', r'"\1":', cleaned_data)
                # # Step 4: Clean up excessive spaces
                # cleaned_data = re.sub(r"\s+", " ", cleaned_data)
                feed_dict = {}
                pattern = r"'([^']+)':\s*(\[[^\]]*\]|'[^']*'|\"[^\"]*\")"
                matches = re.findall(pattern, data)
                key_value_pairs = {key: value.strip("'\"") for key, value in matches}
                for key, value in key_value_pairs.items():
                    if key in ["recommendations", "strengths"]:
                        # value = re.sub(r"'", '"', value)
                        value = re.sub(r"(?<=\w)'(?=\w)", "__APOSTROPHE__", value)
                        value = value.replace("'", '"')
                        value = value.replace("__APOSTROPHE__", "'")
                        feed_dict[key] = json.loads(value)
                    else:
                        feed_dict[key] = value
                # feed_dict = json.loads(cleaned_data)
                # print(feed_dict['strengths'])
                feedback_data.append(feed_dict)
                date_time = feedback.datetime
                date_time = date_time.strftime("%H:%M %d-%m-%Y")
                feedback_dates.append(date_time)
                feedback_type.append(feed_type)
            except Exception as e:
                print(idx, value)
                print("Error for idx", idx)
                print(e)
        return Response({"feedbacks": feedback_data, "dates": feedback_dates, "type": feedback_type}, status=status.HTTP_200_OK)
