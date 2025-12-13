from api.models import Order, OrderItem, ShippingAddress, Product
from django.utils import timezone

def create_order_from_cart(
    *,
    user,
    payment_method,
    total_price,
    cart_items,
    shipping_address=None,
    mark_paid=False
):

    # Shared internal helper to create Order, OrderItems and ShippingAddress.
    
    order = Order.objects.create(
        user=user,
        paymentMethod=payment_method,
        totalPrice=total_price,
        isPaid=mark_paid,
        paidAt=timezone.now() if mark_paid else None,
    )

    for item in cart_items:
        raw_id = item.get("_id") or item.get("id")
        product = None

        if raw_id is not None:
            try:
                product = Product.objects.get(_id=int(raw_id))
            except Product.DoesNotExist:
                product = None

        OrderItem.objects.create(
            product=product,
            order=order,
            name=item.get("title") or item.get("name"),
            qty=item.get("qty", 0),
            price=item.get("price", 0),
            image=item.get("image", ""),
        )

        if product:
            product.countInStock -= int(item.get("qty", 0))
            product.save()

    if shipping_address:
        ShippingAddress.objects.create(
            order=order,
            address=shipping_address.get("address", ""),
            city=shipping_address.get("city", ""),
            postalCode=shipping_address.get("postalCode", ""),
            country=shipping_address.get("country", "India"),
            shippingPrice=shipping_address.get("shippingPrice", 0),
        )

    return order
