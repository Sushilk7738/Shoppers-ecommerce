#Django Imports
from django.conf import settings
from django.core.exceptions import RequestDataTooBig
from django.shortcuts import render
from datetime import datetime

#rest framework imports
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.serializers import Serializer

#Local Import
from api.models import * 
from api.serializers import ProductSerializer, OrderSerializer


# views starts from here

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many = True, context = {"request" :request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    
    try:
        order = Order.objects.get(_id = pk)
        if order.user == user:
            serializer = OrderSerializer(order, many = False, context={"request": request})
            return Response(serializer.data)

        else:
            Response({'detail': 'Not authorized to view this order'},
                    status= status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail' : 'Order does not exist'},
                        status=status.HTTP_404_NOT_FOUND)
            
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id = pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response('Order was paid' , status=status.HTTP_200_OK)
