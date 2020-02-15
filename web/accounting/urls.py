from rest_framework import routers

from .views import ProjectViewSet, ProjectApprovalViewSet, PurchaseViewSet

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'purchases', PurchaseViewSet)
router.register(r'approvals', ProjectApprovalViewSet)
