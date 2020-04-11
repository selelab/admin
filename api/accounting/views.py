import django_filters
from django.shortcuts import render
from rest_framework import filters, permissions, viewsets

from utils import perm_method
from web import settings

from .models import Project, ProjectApproval, Purchase
from .serializer import (ProjectApprovalSerializer, ProjectDetailSerializer,
                         ProjectSerializer, PurchaseSerializer, CreateProjectApprovalSerializer, CreatePurchaseSerializer)


class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class ReadOnlyPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.method in permissions.SAFE_METHODS


class ProjectOwnerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if 'pk' not in view.kwargs:
            return False

        if not request.user:
            return False

        if request.method in {'DELETE'}:
            return False

        # データベース参照は最後の手段
        project = Project.objects.get(pk=view.kwargs['pk'])
        if request.user != project.leader:
            return False

        return True


class UserProjectPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method not in {'POST', 'PATCH', 'GET'}:
            return False

        return True

class ProjectApprovalRequestPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user:
            return False

        if request.method not in {'POST', 'PATCH'}:
            return False

        return True

class PurchaseOwnerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user:
            return False

        if request.method in {'DELETE'}:
            return False

        return True


class ProjectPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        allowed_perm_classes = [
            AdminPermission, ReadOnlyPermission, UserProjectPermission
        ]
        return any(perm_class().has_permission(request, view)
                   for perm_class in allowed_perm_classes)

    def has_object_permission(self, request, view, obj):
        if not request.user:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method not in {'PATCH'}:
            return False

        if request.user != obj.leader:
            return False

        if obj.closed:
            return False

        return True


class PurchasePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        allowed_perm_classes = [
            AdminPermission, ReadOnlyPermission, PurchaseOwnerPermission
        ]
        return any(perm_class().has_permission(request, view)
                   for perm_class in allowed_perm_classes)

    def has_object_permission(self, request, view, obj):
        if request.method == 'PATCH':
            if request.user.is_superuser:
                return True

            forbidden_queries = {
                'returned':
                False,
                'approved':
                perm_method.any_value,
                'price': [{
                    'to': perm_method.any_value,
                    'when': {
                        'approved': True
                    }
                }]
            }

            if not perm_method.request_param_validation(
                    obj, forbidden_queries, request.data):
                return False

            return request.user.id == obj.project.leader.id
        elif request.method == 'POST':
            return True
        else:
            return False


class ProjectApprovalPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        allowed_perm_classes = [AdminPermission, ReadOnlyPermission, ProjectApprovalRequestPermission]
        return any(perm_class().has_permission(request, view)
                   for perm_class in allowed_perm_classes)


class ProjectViewSet(viewsets.ModelViewSet):
    http_method_names = settings.DEFAULT_HTTP_METHOD_NAMES
    permission_classes = (ProjectPermission, )
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return self.serializer_class


class PurchaseViewSet(viewsets.ModelViewSet):
    http_method_names = settings.DEFAULT_HTTP_METHOD_NAMES
    permission_classes = (PurchasePermission, )
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer

    def get_queryset(self):
        is_open = self.request.GET.get('is_open')

        if is_open:
            return Purchase.objects.filter(approver__isnull=True)
        else:
            return Purchase.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return CreatePurchaseSerializer
        return self.serializer_class


class ProjectApprovalViewSet(viewsets.ModelViewSet):
    http_method_names = settings.DEFAULT_HTTP_METHOD_NAMES
    permission_classes = (ProjectApprovalPermission, )
    queryset = ProjectApproval.objects.all()
    serializer_class = ProjectApprovalSerializer

    def get_queryset(self):
        is_open = self.request.GET.get('is_open')

        if is_open:
            return ProjectApproval.objects.filter(approver__isnull=True)
        else:
            return ProjectApproval.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateProjectApprovalSerializer
        return self.serializer_class
