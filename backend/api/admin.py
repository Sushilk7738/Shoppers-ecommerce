from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Review)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'createdAt', 'totalPrice'
    ]

@admin.register(Contact)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at")
    search_fields = ("name", "email", "subject")
    readonly_fields = ("created_at",)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name",) 