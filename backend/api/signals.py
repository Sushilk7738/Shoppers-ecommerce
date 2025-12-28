from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from api.models import Order
from api.view.invoice_views import generate_invoice_pdf_bytes
from api.utils.email_utils import send_order_success_email


@receiver(post_save, sender=Order)
def order_success_email(sender, instance, created, **kwargs):
    print("SIGNAL HIT", created, instance.isPaid)

    if instance.isPaid and getattr(settings, "ENABLE_ORDER_EMAILS", False):
        try:
            pdf_content = generate_invoice_pdf_bytes(instance, instance.user)

            send_order_success_email(
                user_email=instance.user.email,
                order_id=instance.pk,
                pdf_content=pdf_content,
            )

        except Exception as e:
            print("ORDER EMAIL / PDF FAILED:", e)