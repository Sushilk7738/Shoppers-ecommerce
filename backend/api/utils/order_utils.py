from api.models import Order, OrderItem, ShippingAddress, Product
from django.utils import timezone
from decimal import Decimal

def create_order_from_cart(
    *,
    user,
    payment_method,
    total_price,
    cart_items,
    shipping_address=None,
    mark_paid=False
):
    order = Order.objects.create(
        user=user,
        paymentMethod=payment_method,
        totalPrice=Decimal(total_price),
        isPaid=mark_paid,
        paidAt=timezone.now() if mark_paid else None,
    )

    for item in cart_items:
        product = None
        raw_id = item.get("_id")

        if raw_id:
            try:
                product = Product.objects.get(_id=int(raw_id))
            except Product.DoesNotExist:
                product = None

        qty = int(item.get("qty", 0))
        price = (
            Decimal(item.get("offer_price"))
            if item.get("offer_price") is not None
            else Decimal(item.get("price", 0))
        )

        order_item = OrderItem.objects.create(
            product=product,
            name=item.get("name"),
            qty=qty,
            price=price,
            image=item.get("image", ""),
        )

        order_item.order_id = order._id
        order_item.save()

        if product:
            product.countInStock -= qty
            product.save()

    if shipping_address:
        ShippingAddress.objects.create(
            order=order,
            address=shipping_address.get("address", ""),
            city=shipping_address.get("city", ""),
            postalCode=shipping_address.get("postalCode", ""),
            country=shipping_address.get("country", "India"),
            shippingPrice=Decimal(shipping_address.get("shippingPrice", 0)),
        )

    return order
