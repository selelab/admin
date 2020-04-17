from rest_framework import serializers

from .models import Medium


class MediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medium
        fields = ('id', 'scope', 'content_type', 'date_created')
