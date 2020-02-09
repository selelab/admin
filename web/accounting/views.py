import django_filters
from django.shortcuts import render
from rest_framework import filters, viewsets

from .models import Project, Purchase
from .serializer import ProjectSerializer, ProjectDetailSerializer, PurchaseSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return self.serializer_class

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
