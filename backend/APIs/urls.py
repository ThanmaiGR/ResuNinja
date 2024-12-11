from django.urls import path
from .views import *
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='simple-user-profile'),
    path('upload-resume/', UploadResumeView.as_view(), name='upload-resume'),
    path('user-skills/', UserSkillsView.as_view(), name='user-skills'),
    path('user-projects/', UserProjectsView.as_view(), name='all-skills'),
    path('add-skill/', AddUserSkill.as_view(), name='add-skill'),
    path('add-project/', AddUserProject.as_view(), name='add-project'),
    path('generate-questionnaire/', GenerateQuestionnaireView.as_view(), name='generate-questionnaire'),
    path('generate-project-questionnaire/', GenerateProjectQuestionnaireView.as_view(), name='generate-project-questionnaire'),
    path('generate-feedback/', GenerateFeedbackView.as_view(), name='generate-feedback'),
    path('generate-overall-feedback/', GenerateOverallFeedbackView.as_view(), name='generate-overall-feedback'),
    path('get-feedback/', AllFeedbacks.as_view(), name='get-feedback'),


]

