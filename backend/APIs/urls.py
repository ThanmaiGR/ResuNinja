from django.urls import path
from .views import *
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('counter/', CounterView.as_view(), name='counter'),
    path('profile/', UserProfileView.as_view(), name='simple-user-profile'),
    
]

