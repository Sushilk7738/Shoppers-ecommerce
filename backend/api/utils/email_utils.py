from django.core.mail import EmailMessage
from django.conf import settings

def send_order_success_email(user_email, order_id, pdf_content):
    subject = f"Order #{order_id} - Payment Successful🎉🔥"

    body = f"""
    Hi, 
    
    Thank you for shopping with Shoppers🛒
    
    Your payment was successful and your order has been confirmed💯.

    Order ID: {order_id}

    Please find your invoice attached with this email.

    If you need any help, feel free to contact our support team.

    Happy Shopping!
    
    Team Shoppers.
    
    """
    
    
    email = EmailMessage(
        subject= subject,
        body= body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user_email],
    )
    
    
    #attach pdf
    
    email.attach(
        filename=f"invoice_{order_id}.pdf",
        content=pdf_content,
        mimetype="application/pdf",
    )

    email.send(fail_silently=True)