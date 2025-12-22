from django.urls import path
from api.view import order_views as views
from api.view.payment_views import create_order, verify_payment
from api.view.invoice_views import generate_invoice

urlpatterns = [
    path('create-order/', create_order, name='create-order'),
    path('verify-payment/', verify_payment, name='verify-payment'),
    path('myorders/', views.getMyOrders, name='myorders'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/invoice/', generate_invoice, name='invoice'),
]
