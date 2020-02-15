from rest_framework import serializers

from accounting.models import Project
from accounting.serializer import ProjectSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'display_name', 'email',
                  'last_modified', 'icon_media_key', 'date_registered', 'is_active')


class UserDetailSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'display_name', 'email',
                  'last_modified', 'icon_media_key', 'date_registered', 'is_active', 'is_superuser', 'projects')

    def get_projects(self, obj):
        try:
            return ProjectSerializer(Project.objects.filter(leader=obj.id), many=True).data
        except:
            return []
