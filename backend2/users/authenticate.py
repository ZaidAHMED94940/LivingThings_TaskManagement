from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from django.conf import settings
from users.models import User
import jwt

class NodeJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        try:
            # Decode the token as before, based on settings.SECRET_KEY
            decoded_token = jwt.decode(
                raw_token,
                settings.SECRET_KEY,
                algorithms=['HS256']
            )
            print(f"Decoded Token: {decoded_token}")

            token = AccessToken()
            token.payload = decoded_token
            return token
        except jwt.ExpiredSignatureError:
            raise InvalidToken('Token has expired')
        except jwt.InvalidTokenError as e:
            raise InvalidToken(str(e))

    def get_user(self, validated_token):
        """
        Get user based on validated token payload
        """
        user_id = validated_token.payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token contained no recognizable user identification')

        # Ensure the user exists
        try:
            user = User.objects.get(id=user_id)

            return user
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found')
