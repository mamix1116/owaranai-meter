from django.urls import path
from meetings.api.views import (MeetingViewset)

from rest_framework import routers

router = routers.DefaultRouter(trailing_slash='/?')

router.register('meetings', MeetingViewset)

urlpatterns = router.urls
