from rest_framework import routers

from .views import ProjectApprovalViewSet, ProjectViewSet, PurchaseViewSet

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'purchases', PurchaseViewSet)
router.register(r'approvals', ProjectApprovalViewSet)
