from django.shortcuts import get_object_or_404
from api.models import Order

class OrderService:
    @staticmethod
    def list_for_user(user):
        return Order.objects.filter(user=user).order_by("-createdAt")

    @staticmethod
    def get_for_user(user, pk):
        order = get_object_or_404(Order, pk=pk)
        if order.user != user:
            raise PermissionError("Not authorized")
        return order
