import logging

import django_filters
from django.shortcuts import render
from rest_framework import filters, viewsets, decorators, response

from .models import User
from .serializer import UserSerializer, UserDetailSerializer
from accounting.models import Project


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserDetailSerializer
        return self.serializer_class

