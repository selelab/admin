from rest_framework import serializers

from accounting.models import Project
from accounting.serializer import ProjectSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'display_name', 'email', 'last_modified', 'icon_media_key', 'date_registered', 'is_active')


class UserDetailSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'display_name', 'email', 'last_modified', 'icon_media_key', 'date_registered', 'is_active', 'is_superuser', 'projects'
        )

    def get_projects(self, obj):
        try:
            return ProjectSerializer(Project.objects.filter(leader=obj.id), many=True).data
        except:
            return []


class UserCreationSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            display_name=validated_data['display_name'],
            icon_media_key=validated_data['icon_media_key'],
            is_active=validated_data['is_active'],
            is_superuser=validated_data['is_superuser'],
        )
        return user

    def update(self, instance, validated_data):
        print(validated_data)
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)

        instance.save()
        return instance

    class Meta:
        model = User
        fields = (
            'display_name', 'password', 'email', 'icon_media_key', 'is_active', 'is_superuser'
        )
        extra_kwargs = {
            'password': {'write_only': True},
        }

