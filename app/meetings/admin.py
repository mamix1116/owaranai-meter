from django.contrib import admin
from .models import Meeting

class MeetingAdmin(admin.ModelAdmin):
    list_display = ('meeting_id', 'num_men', 'num_women', 'duration_men', 'duration_women', 'created_at')
    list_per_page = 50


admin.site.register(Meeting, MeetingAdmin)
