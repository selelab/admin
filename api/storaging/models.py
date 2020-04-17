import uuid

from django.db import models
from django import utils

from authenticate.models import User

MEDIUM_SCOPES = (
    ('profile-images', 'profile-images'),
)

class Medium(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    scope = models.CharField(max_length=64, choices=MEDIUM_SCOPES)
    content_type = models.CharField(max_length=256)
    date_created = models.DateTimeField(default=utils.timezone.now, editable=False)

    class Meta:
        ordering = ['-date_created', 'id']
