from rest_framework import serializers
from .models import Resume, UserSkill, ResumeSkill, Questionnaire, Feedback
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']




class ResumeSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeSkill
        fields = ['id', 'name']

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