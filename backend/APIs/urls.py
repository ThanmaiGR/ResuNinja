from django.urls import path
from .views import *
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('counter/', CounterView.as_view(), name='counter'),
    path('profile/', UserProfileView.as_view(), name='simple-user-profile'),
    path('upload-resume/', UploadResumeView.as_view(), name='upload-resume'),
    path('user-skills/', UserSkillsView.as_view(), name='user-skills'),
    path('add-skill/', AddUserSkill.as_view(), name='add-skill'),
    path('generate-questionnaire/', GenerateQuestionnaireView.as_view(), name='generate-questionnaire'),
    path('generate-feedback/', GenerateFeedbackView.as_view(), name='generate-feedback'),
    path('generate-overall-feedback/', GenerateOverallFeedbackView.as_view(), name='generate-overall-feedback'),
]

