from rest_framework import serializers

from .models import Project, Purchase


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'accounting_type', 'leader', 'closed')

class ProjectDetailSerializer(serializers.ModelSerializer):
    purchases = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ('id', 'title', 'accounting_type', 'leader', 'closed', 'purchases')

    def get_purchases(self, obj):
        try:
            return PurchaseSerializer(Purchase.objects.filter(project_id=obj.id), many=True).data
        except:
            return []

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ('id', 'title', 'description', 'project_id', 'evidence_media_key', 'price', 'returned', 'approved')
