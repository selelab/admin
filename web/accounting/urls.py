from rest_framework import routers

from .views import ProjectViewSet, PurchaseViewSet

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'purchases', PurchaseViewSet)