from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

from firebase_admin import auth

User = get_user_model()
    
class MindSpaceCustomBackend(BaseBackend):
    """Custom user authentication supports token verification from google"""
    def authenticate(self, request, uid, token, **extra_fields):
        token_valid = False
        try:
            decoded_token = auth.verify_id_token(token)
            if decoded_token['uid'] == uid:
                token_valid = True
            else:
                print('Invalid Token Error: Uid mistach')
        except firebase_admin._auth_utils.InvalidIdTokenError as error:
            print('Invalid Token Error:', error)
            pass

        if token_valid:
            try:
                user = User.objects.get(uid=uid)
            except User.DoesNotExist:
                # Create a new user
                password = User.objects.make_random_password()
                email_field = {'email': decoded_token['email']}
                extra_fields.update(email_field)
                email = decoded_token['email']
                user = User.objects.create_user(uid, password, **extra_fields)
            return user
        return None

    def get_user(self, uid):
        try:
            return User.objects.get(uid=uid)
        except User.DoesNotExist:
            return None