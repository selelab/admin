from rest_framework import routers

from .views import UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
# router.register(r'token', TokenViewSet)
