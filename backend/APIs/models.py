from django.db import models
from django.contrib.auth.models import User


# Model to store resumes and related metadata
class Resume(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='resume')
    skills = models.ManyToManyField('UserSkill', related_name='resumes')
    certifications = models.TextField(blank=True, null=True)
    projects = models.TextField(blank=True, null=True)
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Resume"


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

    def __str__(self):
        return f"Feedback for {self.user.username} on {self.datetime}"
