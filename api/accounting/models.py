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
    accounting_type = models.CharField(max_length=10,
                                       choices=ACCOUNTING_TYPES,
                                       default='soft')
    leader = models.ForeignKey(User,
                               on_delete=models.PROTECT,
                               null=True,
                               blank=True)
    closed = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=utils.timezone.now, editable=False)
    date_updated = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        ordering = ['-date_updated', '-date_created', 'id']

class ProjectApproval(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    approver = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    budget_amount = models.IntegerField(default=0)
    comment = models.CharField(max_length=1024, null=True)
    approved = models.BooleanField(null=False, default=False)
    date_created = models.DateTimeField(default=utils.timezone.now, editable=False)

    class Meta:
        ordering = ['-date_created', 'id']

class Purchase(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    price = models.IntegerField(default=0)
    comment = models.CharField(max_length=1024, null=True)
    approver = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    approved = models.BooleanField(null=True, default=False)
    date_created = models.DateTimeField(default=utils.timezone.now, editable=False)

    class Meta:
        ordering = ['-date_created', 'id']
