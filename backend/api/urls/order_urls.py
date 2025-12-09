from django.urls import path
from api.view import order_views as views
from api.view.payment_views import create_order, verify_payment

urlpatterns = [
    path('create-order/', create_order, name='create-order'),
    path('verify-payment/', verify_payment, name='verify-payment'),
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='myorders'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
]
