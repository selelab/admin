from rest_framework import serializers

from accounting.models import Project
from accounting.serializer import ProjectSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'display_name', 'email', 'last_modified', 'icon_path', 'date_registered', 'is_active')


class UserDetailSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'display_name', 'email', 'last_modified', 'icon_path', 'date_registered', 'is_active', 'is_superuser', 'projects'
        )

    def get_projects(self, obj):
        try:
            return ProjectSerializer(Project.objects.filter(leader=obj.id), many=True).data
        except:
            return []


class UserCreationSerializer(serializers.ModelSerializer):
    
    def create(self, request):
        created = False

        if 'icon' in request:
            icon = request['icon']
            path = os.path.join(settings.IMAGE_ROOT, icon_file.name)
            with open(path, 'wb') as icon_fs:
                for chunk in file.chunks():
                    icon_fs.write(chunk)

            if not os.path.exists(path):
                print('failed to save image:', path)
                return {'error': 'failed to save image'}
            
            user, created = User.objects.get_or_create(icon_path=path)
        else:
            path = '/static/images/profile.png'
            user, created = User.objects.get_or_create(email=request['email'])

        if created:
            user.display_name = request['display_name']
            user.email = request['email']
            user.icon_path = path
            user.is_active = request['is_active']
            user.is_superuser = request['is_superuser']
            user.save()

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
            'display_name', 'password', 'email', 'icon_path', 'is_active', 'is_superuser'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'icon_path': {'read_only': True},
        }

