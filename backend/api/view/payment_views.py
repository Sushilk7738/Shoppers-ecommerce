from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from api.serializers import OrderSerializer
from api.services.payment_service import PaymentService


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@csrf_exempt
def verify_payment(request):
    order = PaymentService.verify_and_create_order(
        request.user,
        request.data
    )

    serializer = OrderSerializer(order, context={"request": request})
    return Response(serializer.data, status=200)
