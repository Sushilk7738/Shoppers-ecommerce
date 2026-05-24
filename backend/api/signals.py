from django.db.models.signals import post_save
from django.dispatch import receiver

from api.models import Order
from api.view.invoice_views import generate_invoice_pdf_bytes
from api.utils.email_utils import send_order_success_email


@receiver(post_save, sender=Order)
def order_success_email(sender, instance, created, **kwargs):
    print("SIGNAL HIT", created, instance.isPaid)

    #if not paid 
    if not instance.isPaid:
        return 
    
    # prevent duplicate email
    
    if getattr(instance, '_email_sent', False):
        return
    instance._email_sent = True
    
    
    #fetch fresh db 
    try:
        db_order = Order.objects.get(pk = instance.pk)
    except Order.DoesNotExist:
        print("ORDER NOT FOUND IN DB - skipping")
        return
    
    if not db_order.orderitem_set.exists():
        print("Order Items Empty - Skipping email")        
        return

    try:
        print("GENERATING INVOICE PDF")

        pdf_content = generate_invoice_pdf_bytes(db_order, db_order.user)

        send_order_success_email(
            user_email= db_order.user.email,
            order_id= db_order.pk,
            pdf_content= pdf_content,
        )
        
        print("EMAIL SENT SUCCESSFULLY")

    except Exception as e:
        print("ORDER EMAIL / PDF FAILED: ", e)

    