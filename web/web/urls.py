from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import RedirectView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from accounting.urls import router as accounting_router
from authenticate.urls import router as authenticate_router

schema_view = get_schema_view(
    openapi.Info(
        title="Selelab Admin API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    url(r'^$', RedirectView.as_view(url='/swagger/')),
    url(r'^swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^admin/', admin.site.urls),
    url(r'^v1/api/', include(authenticate_router.urls)),
    url(r'^v1/api/', include(accounting_router.urls)),
    url(r'api-auth/', include('rest_framework.urls')),
]
