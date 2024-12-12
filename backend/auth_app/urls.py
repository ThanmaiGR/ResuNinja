# Add to urls.py
from django.urls import path
from auth_app import views

app_name = 'auth_app'
urlpatterns = [
    path('login/', views.LoginView.as_view(), name='api_login'),
    path('register/', views.RegisterView.as_view(), name='api_register'),
    path('logout/', views.LogoutView.as_view(), name='api_logout'),
    path('refresh/', views.RefreshTokenView.as_view(), name='refresh_token'),
    path('verify/', views.VerifyAuthView.as_view(), name='api_token'),

]
