from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from django.utils.translation import ugettext_lazy as _

# ordinary Serializer can be treated like a form with field definitions
class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user authentication object"""
    uid = serializers.CharField()
    token = serializers.CharField()

    #Once the validation is successsful, it is required to return validated attrs at the end
    def validate(self, attrs):
        """Validate and authenticate the user"""
        uid = attrs.get('uid')
        token = attrs.get('token')

        user = authenticate(
            # When a request is made, django rest framework will pass the request into the context variable in the serializer object
            #   Therefore, it is a way to get the whole request
            request=self.context.get('request'),
            uid = uid, 
            token = token
        )
        if not user:
            msg = _('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authentication') # best practice is not to omit the code for error description
        
        attrs['user'] = user
        return attrs