from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
import os

from firebase_admin import auth

from django.contrib.auth import get_user_model
from django.urls import reverse

TOKEN_URL = reverse('core:token') # token url in 'core' app

from urllib import request, parse
import json

# A helper function for getting idToken of a user on FireBase for performing unit test
def getIdToken(google_uid):
    custom_token = auth.create_custom_token(uid=google_uid)
    url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=' + os.environ.get('FIREBASE_CLIENT_API_KEY')
    data = parse.urlencode({'token': custom_token, 'returnSecureToken': True}).encode()
    req = request.Request(url, data=data)
    resp = request.urlopen(req)
    json_resp = json.load(resp)
    return json_resp['idToken']

class PublicUserApiTests(TestCase):
    """Test authenticated core API access"""

    def setUp(self):
        self.client = APIClient()
        self.u1IdToken = getIdToken(os.environ.get('U1_UID'))
        self.u2IdToken = getIdToken(os.environ.get('U2_UID'))
        #Assume user with U1_UID has already existed in the database
        password = 'secret123'
        extra_fields = {'email': 'test@test.com'}
        self.user = get_user_model().objects.create_user(os.environ.get('U1_UID'), password, **extra_fields)
        

    def test_retrieve_token(self):
        """Test django token can be generated if valid google uid and token are provided"""
        payload = {
            'uid': os.environ.get('U1_UID'),
            'token': self.u1IdToken
        }
        res = self.client.post(TOKEN_URL, payload)
        # Check if 'token' field is presence and return HTTP status 200
        self.assertIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    
    def test_new_user_create(self):
        """Test a new user is created if it is not existed in database at the time of creating django token"""
        payload = {
            'uid': os.environ.get('U2_UID'),
            'token': self.u2IdToken
        }
        res = self.client.post(TOKEN_URL, payload)
        # Check if 'token' field is presence, return HTTP status 200 and user exists
        self.assertIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        user_exists = get_user_model().objects.filter(uid=os.environ.get('U2_UID')).exists()
        self.assertTrue(user_exists)

    
    def test_invalid_google_token(self):
        """Test if error returns when the google token provided is invalid"""
        payload = {
            'uid': os.environ.get('U1_UID'),
            'token': self.u2IdToken #mismatched token
        }
        res = self.client.post(TOKEN_URL, payload)
        # Check if 'token' field is absence and return HTTP status 400 
        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)