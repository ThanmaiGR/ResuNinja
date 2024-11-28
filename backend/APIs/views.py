from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

class CounterView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the current counter value from the session.
        """
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
