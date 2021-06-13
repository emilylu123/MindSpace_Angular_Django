from django.urls import path

from core import views

app_name = 'core'

#name field is the name for reverse function to map 
urlpatterns = [
    path('token/', views.CreateTokenView.as_view(), name='token'), 
]