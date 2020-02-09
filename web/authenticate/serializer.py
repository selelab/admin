from rest_framework import serializers

from .models import User
from accounting.models import Project
from accounting.serializer import ProjectSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email',
                  'last_modified', 'icon_media_key', 'date_registered')


class UserDetailSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'email',
                  'last_modified', 'icon_media_key', 'date_registered', 'projects')

    def get_projects(self, obj):
        try:
            return ProjectSerializer(Project.objects.filter(leader=obj.id), many=True).data
        except:
            return []