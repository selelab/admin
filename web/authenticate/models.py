import uuid

from django.db import models
from django import utils


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True, max_length=254)
    last_modified = models.DateTimeField(auto_now=True)
    date_registered = models.DateTimeField(default=utils.timezone.now)
    icon_media_key = models.UUIDField()
