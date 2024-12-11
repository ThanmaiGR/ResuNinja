from rest_framework import serializers
from .models import Resume, UserSkill, ResumeSkill, Questionnaire, Feedback, Project
from django.contrib.auth.models import User
from APIs.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['name', 'username', 'email', 'phone_number', 'address', 'country']

    def update(self, instance, validated_data):
        # Remove read-only fields if present in the request data
        validated_data.pop('user', None)  # Handles nested user data if mistakenly sent
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ResumeSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeSkill
        fields = ['id', 'name']


class ProjectSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Project
        fields = ['id', 'title', 'tech_stack', 'description', 'user']


class ResumeSerializer(serializers.ModelSerializer):
    skills = ResumeSkillSerializer(many=True, read_only=True)# Show skill names
    user = serializers.StringRelatedField()  # Show username instead 

    class Meta:
        model = Resume
        fields = ['id', 'user', 'skills', 'certifications', 'projects', 'upload_date']


class UserSkillSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  
    skill = ResumeSkillSerializer()  

    class Meta:
        model = UserSkill
        fields = ['id', 'user', 'skill']


class QuestionnaireSerializer(serializers.ModelSerializer):
    skill = serializers.StringRelatedField()  

    class Meta:
        model = Questionnaire
        fields = ['id', 'skill', 'question', 'complexity']


class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show username
    session_id = serializers.UUIDField(read_only=True)  #session_id ss immutable

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'datetime', 'feedback_content', 'session_id']