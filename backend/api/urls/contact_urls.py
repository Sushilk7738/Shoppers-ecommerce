from django.urls import path
from api.view.contact_views import ContactMessageAPIView

urlpatterns = [
    path('contact/', ContactMessageAPIView.as_view(), name='contact'),
]
