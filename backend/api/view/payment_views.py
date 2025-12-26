from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

import razorpay

from api.utils.order_utils import create_order_from_cart
from api.view.invoice_views import generate_invoice_pdf_bytes
from api.utils.email_utils import send_order_success_email
from api.serializers import OrderSerializer




# Razorpay client
client = razorpay.Client(auth=(
    settings.RAZORPAY_KEY_ID,
    settings.RAZORPAY_KEY_SECRET
))




#  Create Razorpay Order

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        amount = request.data.get("amount")

        if not amount:
            return Response({"detail": "Amount required"}, status=400)

        amount_in_paisa = int(amount) * 100

        razorpay_order = client.order.create({
            "amount": amount_in_paisa,
            "currency": "INR",
            "payment_capture": 1,
        })

        return Response({
            "id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "key": settings.RAZORPAY_KEY_ID,
        }, status=200)

    except Exception as e:
        return Response({"detail": str(e)}, status=500)


# Verify Payment 
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@csrf_exempt
def verify_payment(request):
    data = request.data

    amount = int(float(data.get("amount", 0)))
    cart_items = data.get("cartItems", [])

    client.utility.verify_payment_signature({
        "razorpay_order_id": data.get("razorpay_order_id"),
        "razorpay_payment_id": data.get("razorpay_payment_id"),
        "razorpay_signature": data.get("razorpay_signature"),
    })

    order = create_order_from_cart(
        user=request.user,
        payment_method="Razorpay",
        total_price=amount,
        cart_items=cart_items,
        shipping_address=data.get("address"),
        mark_paid=True,
    )

    response = Response(
        OrderSerializer(order, context={"request": request}).data,
        status=200
    )

    #  email 
    try:
        send_order_success_email(
            user_email=request.user.email,
            order_id=order.pk,
            pdf_content=None,  # text-only invoice 
        )
    except Exception as e:
        print("EMAIL FAILED (ignored):", e)

    return response
