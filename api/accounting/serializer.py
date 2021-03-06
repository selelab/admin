from django.db.models import Sum, Q
from rest_framework import serializers

from .models import Project, ProjectApproval, Purchase
import authenticate as auth


class ProjectSerializer(serializers.ModelSerializer):
    sum_budget = serializers.SerializerMethodField()
    sum_purchase_price = serializers.SerializerMethodField()
    leader = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'accounting_type', 'leader', 'closed', 'sum_budget', 'date_created', 'date_updated', 'sum_purchase_price')

    def get_sum_budget(self, obj):
        query_result = ProjectApproval.objects.filter(
            project_id=obj.id, approved=True).aggregate(
                Sum('budget_amount'))['budget_amount__sum']
        return query_result or 0

    def get_sum_purchase_price(self, obj):
        query_result = Purchase.objects.filter(Q(approver__isnull=True) | Q(approved=True), project_id=obj.id).aggregate(
            Sum('price'))['price__sum']
        return query_result or 0

    def get_leader(self, obj):
        return auth.serializer.UserSerializer(obj.leader).data


class ProjectDetailSerializer(ProjectSerializer):
    purchases = serializers.SerializerMethodField()
    approvals = serializers.SerializerMethodField()

    sum_req_budget = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ('id', 'title', 'accounting_type', 'leader', 'closed',
                  'sum_budget', 'sum_req_budget', 'sum_purchase_price',
                  'approvals', 'purchases', 'description', 'date_created', 'date_updated')

    def get_purchases(self, obj):
        try:
            return PurchaseSerializer(
                Purchase.objects.filter(project_id=obj.id), many=True).data
        except:
            return []

    def get_approvals(self, obj):
        try:
            return ProjectApprovalSerializer(
                ProjectApproval.objects.filter(project_id=obj.id),
                many=True).data
        except:
            return []

    def get_sum_req_budget(self, obj):
        query_result = ProjectApproval.objects.filter(
            project_id=obj.id, approver__isnull=True).aggregate(
                Sum('budget_amount'))['budget_amount__sum']
        return query_result or 0


class CreateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'accounting_type', 'leader')

class ProjectApprovalSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()

    class Meta:
        model = ProjectApproval
        fields = ('id', 'project', 'comment', 'approver', 'budget_amount', 'approved', 'date_created')


class CreateProjectApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectApproval
        fields = ('id', 'project', 'budget_amount')


class PurchaseSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()

    class Meta:
        model = Purchase
        fields = ('id', 'title', 'project', 'comment', 'price', 'approver', 'approved', 'date_created')


class CreatePurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ('id', 'title', 'project', 'price')

