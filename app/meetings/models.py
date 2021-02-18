import uuid
from django.utils import timezone
from datetime import datetime
from django.db import models


class Meeting(models.Model):
    """会議モデル"""
    class Meta:
        # テーブル名を定義
        db_table = 'meeting'
        ordering = ['created_at']
        verbose_name = verbose_name_plural = "会議"

    # テーブルのカラムに対応するフィールドを定義
    meeting_id = models.AutoField(verbose_name='会議ID', primary_key=True)
    num_men = models.IntegerField(verbose_name='男性の人数', null=True)
    num_women = models.IntegerField(verbose_name='女性の人数', null=True)
    duration_men = models.IntegerField(verbose_name='男性の継続時間', null=True, blank=True)
    duration_women = models.IntegerField(verbose_name='女性の継続時間', null=True, blank=True)
    is_done = models.BooleanField(verbose_name='会議終了済み', default=False)
    locale = models.CharField(verbose_name='ロケール', max_length=128, blank=True, null=True, default="")
    created_at = models.DateTimeField(verbose_name='登録日時', auto_now_add=True)
