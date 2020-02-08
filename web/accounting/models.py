from django.db import models


class User(models.Model):
    user_id = models.UUIDField(unique=True)
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True, max_length=254)
    last_modified = models.DateTimeField(auto_now=True)
    icon_media_key = models.UUIDField()
