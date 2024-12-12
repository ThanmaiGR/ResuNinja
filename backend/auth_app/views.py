from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from auth_app import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from APIs.models import Profile


class RegisterView(APIView):
    """API endpoint for user registration."""

    authentication_classes = []
    def post(self, request):
        serializer = serializers.UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        Profile.objects.create(user=user)
        refresh = RefreshToken.for_user(user)
        username = serializer.data.get('username')
        response = Response({"username": username}, status=201)
        response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True, samesite='None')
        response.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True, samesite='None')
        return response


class LoginView(APIView):
    """API endpoint for user login."""
    authentication_classes = []
    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        username = serializer.validated_data['username']
        response = Response({"username": username}, status=200)
        response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True, samesite='None')
        response.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True, samesite='None')
        return response


class LogoutView(APIView):
    """API endpoint for user logout."""
    authentication_classes = []
    def post(self, request):
        try:
            # Get the refresh token from the cookies
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            # Prepare the response and delete the cookies
            response = Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)

            # Delete cookies with appropriate path and domain
            response.delete_cookie('refresh_token', path='/')
            response.delete_cookie('access_token', path='/')

            # Clear session (optional but ensures no session data persists)
            request.session.flush()

            return response
        except Exception as e:
            # Log the exception for debugging purposes (if needed)
            print(f"Error during logout: {str(e)}")
            return Response({"error": "Invalid token or already logged out"}, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(APIView):
    """API endpoint for refreshing access tokens."""

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

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


class VerifyAuthView(APIView):
    """API endpoint for verifying authentication."""
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        return Response({"message": "Authentication successful"}, status=status.HTTP_200_OK)
