from rest_framework import routers

from .views import UserViewSet, LoginViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'auth', LoginViewSet, basename='auth')
