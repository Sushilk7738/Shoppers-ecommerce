import resend
import base64
from django.conf import settings


if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY


def send_order_success_email(user_email, order_id, pdf_content):
    print("EMAIL FUNC CALLED")
    print("RESEND API KEY VALUE:", settings.RESEND_API_KEY)
    encoded_pdf = base64.b64encode(pdf_content).decode("utf-8")

    if not user_email or not pdf_content:
        return

    try:
        response = resend.Emails.send({
            "from": "Acme <onboarding@resend.dev>",
            "to": [settings.RESEND_TEST_EMAIL],
            "subject": f"Order #{order_id} - Payment Successful 🎉 order placed by {user_email}",
            "html": f"""
                <h2>Thank you for shopping with Shoppers 🛒</h2>
                <p>Your payment was successful and your order is confirmed.</p>
                <p><b>Order ID:</b> {order_id}</p>
                <p>Please find your invoice attached.</p>
            """,

            "attachments": [
                {
                    "filename": f"invoice_{order_id}.pdf",
                    "content": encoded_pdf,
                }
            ],

        })

        print("RESEND RESPONSE:", response)

    except Exception as e:
        print("RESEND ERROR:", e)
