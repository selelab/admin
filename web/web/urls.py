from django.conf.urls import url, include
from django.contrib import admin

from accounting.urls import router as accounting_router

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # blog.urls‚ðinclude‚·‚é
    url(r'^api/', include(accounting_router.urls)),
]
