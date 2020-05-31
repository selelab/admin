from rest_framework import serializers
from django.core.mail import EmailMessage

import secrets

from accounting.models import Project
from accounting.serializer import ProjectSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'display_name', 'last_modified',
                  'icon_media_key', 'date_registered', 'is_active', 'is_superuser')


class UserDetailSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'display_name', 'email', 'last_modified',
                  'icon_media_key', 'date_registered', 'is_active',
                  'is_superuser', 'projects')

    def get_projects(self, obj):
        try:
            return ProjectSerializer(Project.objects.filter(leader=obj.id),
                                     many=True).data
        except:
            return []


class UserCreationSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        password = secrets.token_urlsafe(8)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            display_name=validated_data['display_name'],
            icon_media_key=validated_data['icon_media_key'],
            is_active=validated_data['is_active'],
            is_superuser=validated_data['is_superuser'],
        )
        EmailMessage(
            'エレラボ会計ソフト',
            f"""ログインし、パスワードの変更をお願いします。
https://selelab.com/admin/profile/

メアド: {validated_data['email']}
パスワード: {password}""",
            'no-reply',
            [validated_data['email']]
        ).send()
        return user

    class Meta:
        model = User
        fields = ('display_name', 'email', 'icon_media_key',
                  'is_active', 'is_superuser')

class UserUpdateSerializer(serializers.ModelSerializer):
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
        fields = ('display_name', 'password', 'email', 'icon_media_key',
                  'is_active', 'is_superuser')
        extra_kwargs = {
            'password': {
                'write_only': True
            },
        }
