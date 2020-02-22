import uuid

from django.db import models
from django import utils

from authenticate.models import User

ACCOUNTING_TYPES = (
    ('soft', 'software_accounting'),
    ('hard', 'hardware_accounting'),
)


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=500)
    accounting_type = models.CharField(max_length=10, choices=ACCOUNTING_TYPES, default='soft')
    leader = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True)
    closed = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=utils.timezone.now, editable=False)


class ProjectApproval(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    approver = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    budget_amount = models.IntegerField(default=0)
    approved = models.BooleanField(null=True)


class Purchase(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=500)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    evidence_media_key = models.UUIDField()
    price = models.IntegerField(default=0)
    approver = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    returned = models.BooleanField(default=False)
    approved = models.BooleanField(null=True, default=False)
