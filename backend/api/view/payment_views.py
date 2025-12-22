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
    print("VERIFY USER:", request.user, request.user.is_authenticated)
    try:
        data = request.data

        amount = data.get("amount")
        amount = int(float(amount))
        cart_items = data.get("cartItems", [])

        print("AMOUNT RECEIVED:", amount)
        print("CART ITEMS:", cart_items)

        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")

        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({"detail": "Invalid payment data"}, status=400)

        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })
        except razorpay.errors.SignatureVerificationError:
            return Response({"detail": "Payment verification failed"}, status=400)

        address_data = data.get("address")

        order = create_order_from_cart(
            user=request.user,
            payment_method="Razorpay",
            total_price=amount,
            cart_items=cart_items,
            shipping_address=address_data,
            mark_paid=True,
        )

        serializer = OrderSerializer(order, context={"request": request})
        return Response(serializer.data, status=200)

    except Exception as e:
        print("VERIFY PAYMENT ERROR:", str(e))
        return Response(
            {"detail": "Payment verification failed", "error": str(e)},
            status=500
        )
