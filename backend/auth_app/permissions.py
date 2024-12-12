from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken


class IsAuthenticated(JWTAuthentication):
    def authenticate(self, request):
        """
        Authenticate a request using a JSON Web Token.
        """
        # Try to authenticate the user using the access token from the request cookies
        # If authentication fails, raise an AuthenticationFailed exception
        # If authentication succeeds, return the user and the JWT data

        try:
            token = request.COOKIES.get('access_token')
            if not token:
                raise AuthenticationFailed('Authentication credentials were not provided.')
            data = AccessToken(token)
            user = self.get_user(data)
            if user is None:
                raise AuthenticationFailed('No user was found.')
            return user, data

        except AuthenticationFailed:
            raise AuthenticationFailed('Authentication credentials were not provided.')
