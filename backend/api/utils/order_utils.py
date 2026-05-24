from api.utils.email_utils import send_order_success_email
from api.view.invoice_views import generate_invoice_pdf_bytes
from api.models import Order, OrderItem, ShippingAddress, Product
from django.utils import timezone
from django.db import transaction


@transaction.atomic
def create_order_from_cart(
    *,
    user,
    payment_method,
    total_price,
    cart_items,
    shipping_address=None,
    mark_paid=False
):
    calculated_total = 0

    for item in cart_items:
        qty = int(item.get("qty", 0))
        price = float(item.get("price", 0))
        calculated_total += qty * price

    order = Order.objects.create(
        user=user,
        paymentMethod=payment_method,
        totalPrice=calculated_total,
        isPaid=mark_paid,
        paidAt=timezone.now() if mark_paid else None,
    )

    order.refresh_from_db()

    for item in cart_items:
        product = None
        raw_id = item.get("_id") or item.get("id")

        if raw_id:
            try:
                product = Product.objects.get(_id=int(raw_id))
            except Product.DoesNotExist:
                pass

        OrderItem.objects.create(
            order=order,                     
            product=product,
            name=item.get("title") or item.get("name"),
            qty=int(item.get("qty", 0)),
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

    if mark_paid:
        try:
            pdf_content = generate_invoice_pdf_bytes(order, user)
            send_order_success_email(
                user_email=user.email,
                order_id=order.pk,
                pdf_content=pdf_content,
            )
            print("EMAIL SENT SUCCESSFULLY")
        except Exception as e:
            print("EMAIL FAILED — order still saved:", e)

    return order
