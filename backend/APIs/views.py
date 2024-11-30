from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import ProfileSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the authenticated user's username and email.
        """
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)


class CounterView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the current counter value from the session.
        """
        print(f"Session Key: {request.session.session_key}")
        print(f"Session Data: {request.session.items()}")
        counter = request.session.get('counter', 0)
        return Response({"counter": counter})

    def post(self, request):
        """
        Increment the counter in the session by 1.
        """
        counter = request.session.get('counter', 0)
        counter += 1
        request.session['counter'] = counter
        return Response({"message": "Counter updated", "counter": counter})
