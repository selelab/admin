import datetime
import logging
import uuid
import pytz

import boto3

from rest_framework import permissions, views
from rest_framework.response import Response
from rest_framework.generics import (
    CreateAPIView,
)

import constants
from web import settings

from .models import Medium
from .serializer import MediumSerializer


class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class GeneralPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated


class StoragingPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        allowed_perm_classes = [
            AdminPermission, GeneralPermission
        ]
        return any(perm_class().has_permission(request, view)
                   for perm_class in allowed_perm_classes)

def presigned_url(object_key, content_type):
    return boto3.client('s3').generate_presigned_url(
        ClientMethod="put_object",
        Params={
            'Bucket': constants.S3_STATIC_BUCKET_NAME,
            'Key': object_key,
            'ContentType': content_type
        },
        ExpiresIn=1800,
        HttpMethod='PUT'
    )


class StoragingView(CreateAPIView):
    http_method_names = ['post']
    permission_classes = (StoragingPermission, )
    queryset = Medium.objects.all()
    serializer_class = MediumSerializer

    def create(self, request, *args, **kwargs):
        obj = super(StoragingView, self).create(request, *args, **kwargs)
        s3_object_key = f'{request.data["scope"]}/{obj.data["id"]}'
        return Response({
            "id": obj.data["id"],
            "pre_signed_url": presigned_url(s3_object_key, request.data["content_type"])
        })
