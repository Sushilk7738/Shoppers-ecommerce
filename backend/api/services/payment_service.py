import razorpay
from django.conf import settings
from api.utils.order_utils import create_order_from_cart

client = razorpay.Client(auth=(
    settings.RAZORPAY_KEY_ID,
    settings.RAZORPAY_KEY_SECRET
))

class PaymentService:
    
    @staticmethod
    def create_razorpay_order(amount):
        if not amount:
            raise ValueError("Amount required")

        razorpay_order = client.order.create({
            "amount": int(amount) * 100,
            "currency": "INR",
            "payment_capture": 1,
        })

        return razorpay_order
    
    
    @staticmethod
    def verify_and_create_order(user, data):
        amount = int(float(data.get("amount", 0)))
        cart_items = data.get("cartItems", [])
        address_data = data.get("address")

        # Razorpay verify
        client.utility.verify_payment_signature({
            "razorpay_order_id": data.get("razorpay_order_id"),
            "razorpay_payment_id": data.get("razorpay_payment_id"),
            "razorpay_signature": data.get("razorpay_signature"),
        })

        # Create order 
        order = create_order_from_cart(
            user=user,
            payment_method="Razorpay",
            total_price=amount,
            cart_items=cart_items,
            shipping_address=address_data,
            mark_paid=True,
        )

        return order
