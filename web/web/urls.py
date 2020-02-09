from django.conf.urls import include, url
from django.contrib import admin

from accounting.urls import router as accounting_router
from authenticate.urls import router as authenticate_router

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^v1/api/', include(authenticate_router.urls)),
    url(r'^v1/api/', include(accounting_router.urls)),
]
