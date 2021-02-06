from rest_framework import generics
from rest_framework import mixins
from rest_framework import viewsets

from meetings.models import Meeting
from meetings.api.serializers import MeetingSerializer


class MeetingViewset(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

class MeetingListCreateAPIView(generics.ListCreateAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
