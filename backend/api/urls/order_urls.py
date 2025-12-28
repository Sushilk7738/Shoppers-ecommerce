from django.urls import path
from api.view import order_views as views
from api.view.payment_views import verify_payment
from api.view.invoice_views import generate_invoice

urlpatterns = [
    # Razorpay order creation
    path('create-order/', views.create_razorpay_order, name='create-order'),
    
    # Payment verification 
    path('verify-payment/', verify_payment, name='verify-payment'),


    # Orders
    path('myorders/', views.my_orders, name='myorders'),
    path('<int:pk>/', views.order_detail, name='user-order'),

    # Invoice
    path('<int:pk>/invoice/', generate_invoice, name='invoice'),
]
