from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)


# Model to store resumes and related metadata
class Resume(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='resume')
    skills = models.ManyToManyField('UserSkill', related_name='resumes')
    certifications = models.TextField(blank=True, null=True)
    projects = models.ManyToManyField('Project', related_name='resumes')
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Resume"


class Project(models.Model):
    title = models.CharField(max_length=100)
    tech_stack = models.TextField()
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')

    def __str__(self):
        return self.title


# Model to store individual skills
class ResumeSkill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# Model to map users to their skills
class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_skills')
    skill = models.ForeignKey(ResumeSkill, on_delete=models.CASCADE, related_name='user_skills')

    def __str__(self):
        return f"{self.user.username} - {self.skill.name}"


# Model to store questions and their complexity for each skill
class Questionnaire(models.Model):
    skill = models.ForeignKey(ResumeSkill, on_delete=models.CASCADE, related_name='questions')
    question = models.TextField()
    complexity = models.CharField(max_length=10, choices=(('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')))

    def __str__(self):
        return f"{self.skill.name} - {self.complexity}"


# Model to store feedback generated after the interview
class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    datetime = models.DateTimeField(auto_now_add=True)
    feedback_content = models.TextField(blank=True, null=True)
    feedback_type = models.CharField(max_length=100, default='Technical')

    def __str__(self):
        return f"Feedback for {self.user.username} on {self.datetime} is {self.feedback_content}"
