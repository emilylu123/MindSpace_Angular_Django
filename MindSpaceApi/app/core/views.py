from django.shortcuts import render

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from core.serializers import AuthTokenSerializer


# ObtainAuthToken is a helper class for token generation
class CreateTokenView(ObtainAuthToken):
    """Create a new auth token for user"""
    serializer_class = AuthTokenSerializer
    # This allows viewing the endpoint in browser with view provided by django rest framework (i.e. allow authentication and token retreival using Chrome)
    # Otherwise, it is required to use tools like cURL to create the POST request
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
