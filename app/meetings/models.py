import uuid
import datetime

from django.db import models


class Meeting(models.Model):
    """会議モデル"""
    class Meta:
        # テーブル名を定義
        db_table = 'meeting'
        verbose_name_plural = "会議"

    # テーブルのカラムに対応するフィールドを定義
    meeting_id = models.UUIDField(verbose_name='会議ID', primary_key=True, default=uuid.uuid4, editable=False)
    num_men = models.IntegerField(verbose_name='男性の人数')
    num_women = models.IntegerField(verbose_name='女性の人数')
    duration_men = models.TimeField(verbose_name='男性の継続時間', null=True, blank=True)
    duration_women = models.TimeField(verbose_name='女性の継続時間', null=True, blank=True)
    meeting_status = models.CharField(verbose_name='会議ステータス', max_length=25, blank=True)

    def __str__(self):
        return self.meeting_id
