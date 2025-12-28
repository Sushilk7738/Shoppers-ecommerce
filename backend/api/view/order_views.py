# Django imports
from datetime import datetime
from django.conf import settings
from django.shortcuts import get_object_or_404

# DRF imports
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Local imports
from api.models import Order
from api.serializers import OrderSerializer
from api.services.order_service import OrderService
from api.services.payment_service import PaymentService

#Razorpay imports
import razorpay


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    
    # Get all orders for the logged-in user
    
    orders = OrderService.list_for_user(request.user)
    serializer = OrderSerializer(
        orders,
        many=True,
        context={"request": request}
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, pk):
    
    # Get a single order for the logged-in user
    
    try:
        order = OrderService.get_for_user(request.user, pk)
    except PermissionError:
        return Response(
            {"detail": "Not authorized to view this order"},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = OrderSerializer(
        order,
        many=False,
        context={"request": request}
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def mark_order_paid(request, pk):
    order = get_object_or_404(Order, pk=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response(
        {"detail": "Order marked as paid"},
        status=status.HTTP_200_OK
    )



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_razorpay_order(request):
    try:
        amount = request.data.get("amount")
        rp_order = PaymentService.create_razorpay_order(amount)

        return Response({
            "id": rp_order["id"],
            "amount": rp_order["amount"],
            "currency": rp_order["currency"],
            "key": settings.RAZORPAY_KEY_ID,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"detail": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
