"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static

# TEMP ONLY
from django.contrib.auth.models import User
from django.http import JsonResponse

def create_admin_once(request):
    from django.contrib.auth.models import User

    user, created = User.objects.get_or_create(
        username="admin",
        defaults={
            "email": "admin@test.com",
            "is_staff": True,
            "is_superuser": True,
        },
    )
    user.set_password("admin123")
    user.save()

    return JsonResponse({"status": "admin password reset"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path("setup-admin/", create_admin_once),
    path('api/products/', include('api.urls.product_urls')),
    path('api/users/', include('api.urls.user_urls')),
    path('api/orders/', include('api.urls.order_urls')),
    path('api/', include('api.urls.contact_urls')),
]       

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)
