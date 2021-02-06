from rest_framework import generics
from rest_framework import mixins
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from meetings.models import Meeting
from meetings.api.serializers import MeetingSerializer


class MeetingViewset(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    #serializer_class = MeetingSerializer
    def get_serializer_class(self):
        if self.request.version == 'v1':
            return MeetingSerializer
        else:
            raise ValidationError("バージョンが異なるため利用できません。")

class MeetingListCreateAPIView(generics.ListCreateAPIView):
    queryset = Meeting.objects.all()
    #serializer_class = MeetingSerializer

    def get_serializer_class(self):
        if self.request.version == 'v1':
            return MeetingSerializer
        else:
            raise ValidationError("バージョンが異なるため利用できません。")
