from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

import razorpay

from api.utils.order_utils import create_order_from_cart
from api.view.invoice_views import generate_invoice_pdf_bytes
from api.utils.email_utils import send_order_success_email



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
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    print("VERIFY PAYMENT HIT")
    print("AMOUNT RECEIVED:", amount)
    print("CART ITEMS:", cart_items)

    try:
        data = request.data

        # Razorpay response fields
        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")

        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({"detail": "Invalid payment data"}, status=400)

        #Verify signature
        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })
        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"detail": "Payment verification failed"},
                status=400
            )

        # Order data
        amount = data.get("amount")
        address_data = data.get("address")
        cart_items = data.get("cartItems", [])

        if not amount or not cart_items:
            return Response({"detail": "Invalid order data"}, status=400)

        # Create order
        order = create_order_from_cart(
            user=request.user,
            payment_method="Razorpay",
            total_price=amount,
            cart_items=cart_items,
            shipping_address=address_data,
            mark_paid=True,
        )

        # email + invoice
        # try:
        #     pdf_bytes = generate_invoice_pdf_bytes(order, request.user)
        #     if pdf_bytes and request.user.email:
        #         send_order_success_email(
        #             user_email=request.user.email,
        #             order_id=order._id,
        #             pdf_content=pdf_bytes
        #         )
        # except Exception:
        #     pass

        return Response({
            "msg": "payment verified & order saved",
            "order_id": order._id
        }, status=200)

    except Exception as e:
        print("VERIFY PAYMENT ERROR:", str(e))
        return Response(
            {"detail": "Payment verification failed"},
            status=400
        )
