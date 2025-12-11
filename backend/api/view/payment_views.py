from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models import Order, ShippingAddress, Product, OrderItem
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from django.conf import settings
import razorpay
import os


client = razorpay.Client(auth=(
    os.getenv("RAZORPAY_KEY_ID"),
    os.getenv("RAZORPAY_KEY_SECRET")
))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    print("KEY CHECK:", settings.RAZORPAY_KEY_ID)
    print("AUTH HEADER RECEIVED:", request.META.get('HTTP_AUTHORIZATION'))
    print("USER AUTHENTICATED:", request.user, request.user.is_authenticated)

    try:
        amount = request.data.get("amount")

        if not amount:
            return Response({"detail": "Amount required"}, status=400)

        amount_in_paisa = int(amount) * 100

        # ✅ Create Razorpay order
        razorpay_order = client.order.create({
            "amount": amount_in_paisa,
            "currency": "INR",
            "payment_capture": 1,
        })

        response_data = {
            "id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "key": settings.RAZORPAY_KEY_ID,   # ✅ THIS IS THE FIX
        }

        print("RESPONSE SENT TO FRONTEND:", response_data)

        return Response(response_data, status=200)

    except Exception as e:
        print("RAZORPAY ERROR:", e)
        return Response({"detail": str(e)}, status=500)
    
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    try:
        print("\n---- VERIFY PAYMENT HIT ----")
        print("AUTH HEADER:", request.headers.get("Authorization"))
        data = request.data
        print("CLIENT SENT:", data)

        amount = data.get("amount")
        address_data = data.get("address")
        cart_items = data.get("cartItems", [])

        order = Order.objects.create(
            user=request.user,
            paymentMethod="Razorpay",
            totalPrice=amount,
            isPaid=True,
            paidAt=timezone.now(),
        )

        print("ORDER CREATED WITH ID:", order._id)
        print("ALL PRODUCTS IN DB:", list(Product.objects.values("_id", "name")))

        for item in cart_items:
            raw_id = item.get("_id") or item.get("id")
            print("ITEM ID RAW:", raw_id, type(raw_id))

            product = None
            if raw_id is not None:
                try:
                    product = Product.objects.get(_id=int(raw_id))
                except Product.DoesNotExist:
                    print(f"⚠ Product with _id {raw_id} NOT found. Saving line without FK.")

            OrderItem.objects.create(
                product=product,          
                order=order,
                name=item["title"],
                qty=item["qty"],
                price=item["price"],
                image=item["image"],
            )

        ShippingAddress.objects.create(
            order=order,
            address=address_data["address"],
            city="",
            postalCode="000000",
            country="India",
            shippingPrice=0,
        )

        print("SHIPPING ADDRESS SAVED")

        return Response({
            "msg": "order saved",
            "order_id": order._id
        }, status=200)

    except Exception as e:
        print("PAYMENT VERIFY ERROR:", str(e))
        return Response({"error": str(e)}, status=500)