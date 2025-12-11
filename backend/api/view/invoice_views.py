import os
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import Order

def link_callback(uri, rel):
    """
    Convert HTML URIs to absolute system paths so xhtml2pdf can access them.
    Supports static files placed under api/static/ and media files under MEDIA_ROOT.
    """
    # if uri is already a file:// URL, return local path
    if uri.startswith("file://"):
        return uri.replace("file://", "")

    static_root = os.path.join(settings.BASE_DIR, "api", "static")
    static_path = os.path.join(static_root, uri.lstrip("/"))
    if os.path.exists(static_path):
        return static_path

    if getattr(settings, "STATIC_ROOT", None):
        candidate = os.path.join(settings.STATIC_ROOT, uri.lstrip("/"))
        if os.path.exists(candidate):
            return candidate

    if getattr(settings, "MEDIA_ROOT", None):
        candidate = os.path.join(settings.MEDIA_ROOT, uri.lstrip("/"))
        if os.path.exists(candidate):
            return candidate

    return uri

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_invoice(request, pk):
    """
    Generate a PDF invoice for order pk.
    Sends only template-safe dicts (no underscore-starting keys).
    """
    try:
        order = Order.objects.get(_id=pk)
    except Order.DoesNotExist:
        return Response({"detail": "Order not found"}, status=404)

    clean_order = {
        "id": order._id,
        "created": order.createdAt.isoformat() if getattr(order, "createdAt", None) else str(order.createdAt or ""),
        "paymentMethod": getattr(order, "paymentMethod", None),
        "isPaid": bool(getattr(order, "isPaid", False)),
        "isDelivered": bool(getattr(order, "isDelivered", False)),
        "taxPrice": float(getattr(order, "taxPrice", 0) or 0),
        "shippingPrice": float(getattr(order, "shippingPrice", 0) or 0),
        "itemsPrice": float(getattr(order, "totalPrice", 0) or 0) - float(getattr(order, "shippingPrice", 0) or 0) or 0,
        "total": float(getattr(order, "totalPrice", 0) or 0),
    }

    items = []
    for it in order.orderitem_set.all():
        items.append({
            "name": it.name,
            "qty": int(it.qty or 0),
            "price": float(it.price or 0),
            "image": it.image or "",  # plain string in your model
            "line_total": round((float(it.price or 0) * int(it.qty or 0)), 2),
        })

    shipping = None
    if hasattr(order, "shippingaddress") and getattr(order, "shippingaddress") is not None:
        sa = order.shippingaddress
        name = getattr(sa, "name", None) or getattr(order.user, "first_name", "") or getattr(order.user, "username", "")
        shipping = {
            "name": name,
            "address": getattr(sa, "address", ""),
            "city": getattr(sa, "city", ""),
            "postalCode": getattr(sa, "postalCode", "") or getattr(sa, "postal_code", ""),
            "country": getattr(sa, "country", ""),
        }

    logo_fs = os.path.join(settings.BASE_DIR, "api", "static", "logo.png")
    logo_path = f"file://{logo_fs}" if os.path.exists(logo_fs) else ""

    template = get_template("invoice_template.html")
    html = template.render({
        "order": clean_order,
        "items": items,
        "shipping": shipping,
        "user": request.user,
        "logo_path": logo_path,
    })

    # ---------- Create PDF ----------
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="Invoice_{pk}.pdf"'

    pisa_status = pisa.CreatePDF(html, dest=response, link_callback=link_callback)

    if pisa_status.err:
        return Response({"detail": "Error generating PDF", "pisa_errors": True}, status=500)

    return response
