from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import ProfileSerializer, ResumeSerializer
from .functions import LLM, jsonify
from .models import Resume, ResumeSkill, UserSkill
from rest_framework import status
import os
import tempfile


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
        if not skill_name:
            return Response({"error": "No skill provided"}, status=status.HTTP_400_BAD_REQUEST)

        skill, _ = ResumeSkill.objects.get_or_create(name=skill_name)
        user_skill, created = UserSkill.objects.get_or_create(user=request.user, skill=skill)
        if created:
            return Response({"message": "Skill added successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Skill already exists"}, status=status.HTTP_200_OK)


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
