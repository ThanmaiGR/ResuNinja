# Add to urls.py
from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path
from auth_app import views

app_name = 'auth_app'
urlpatterns = [
    path('login/', views.LoginView.as_view(), name='api_login'),
    path('register/', views.RegisterView.as_view(), name='api_register'),
    path('logout/', views.LogoutView.as_view(), name='api_logout'),
    path('list/', views.UserListView.as_view(), name='user_list'),
    path('refresh/', views.RefreshTokenView.as_view(), name='refresh_token'),

]
