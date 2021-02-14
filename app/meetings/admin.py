from django.contrib import admin
from .models import Meeting
from import_export import resources
from import_export.admin import ImportExportModelAdmin


class MeetingResource(resources.ModelResource):
    class Meta:
        model = Meeting
        widgets = {
                'created_at': {'format': '%Y-%m-%d %H:%M:%S'},
                }


class MeetingAdmin(ImportExportModelAdmin):
    list_display = ('meeting_id', 'num_men', 'num_women', 'duration_men', 'duration_women', 'created_at', 'is_done')
    list_per_page = 50
    resource_class = MeetingResource


admin.site.register(Meeting, MeetingAdmin)
