import django_filters
from django.shortcuts import render
from rest_framework import filters, permissions, viewsets

from .models import Project, ProjectApproval, Purchase
from .serializer import (ProjectApprovalSerializer, ProjectDetailSerializer,
                         ProjectSerializer, PurchaseSerializer)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return self.serializer_class

class PurchaseViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer

class ProjectApprovalViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = ProjectApproval.objects.all()
    serializer_class = ProjectApprovalSerializer
