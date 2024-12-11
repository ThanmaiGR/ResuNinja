from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from auth_app import serializers
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from APIs.models import Profile


class RegisterView(APIView):
    """API endpoint for user registration."""
    def post(self, request):
        serializer = serializers.UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        Profile.objects.create(user=user)
        refresh = RefreshToken.for_user(user)
        data = {
            'username': serializer.data.get('username'),
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
        }
        return Response(data, status=201)


class LoginView(APIView):
    """API endpoint for user login."""
    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        username = serializer.validated_data['username']
        data = {
            'username': username,
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
        }
        return Response(data, status=200)


class LogoutView(APIView):
    """API endpoint for user logout."""

    def post(self, request):
        try:
            # Get the refresh token from the request data
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token or already logged out"}, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListCreateAPIView):
    """API endpoint for listing and creating users."""
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class RefreshTokenView(APIView):
    """API endpoint for refreshing access tokens."""

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Generate a new access token
            token = RefreshToken(refresh_token)
            data = {
                "access": str(token.access_token)
            }
            return Response(data, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)
