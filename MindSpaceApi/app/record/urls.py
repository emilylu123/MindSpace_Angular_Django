from django.urls import path, include
from rest_framework.routers import DefaultRouter

from record import views

app_name = 'record'

class CustomDefaultRouter(DefaultRouter):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.trailing_slash = '/?'

router = CustomDefaultRouter()
router.register('emotions', views.RecordViewSet)
router.register('insights', views.InsightViewSet)

#name field is the name for reverse function to map 
urlpatterns = [
    path('', include(router.urls))
]