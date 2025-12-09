from django.db import models
from django.contrib.auth.models import User
from django.db.models.fields import BLANK_CHOICE_DASH

# Create your models here.

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200)
    image = models.ImageField(null=True, blank=True, default='images/placeholder.png', upload_to='images/')
    brand = models.CharField(max_length=200)
    category = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default= 0)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.IntegerField(default=0)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.name + " | " +self.brand+ " | "+ str(self.price)

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200)
    rating = models.IntegerField(default=0)
    comment = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.rating)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    paymentMethod = models.CharField(max_length=200 , null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=12,decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=12,decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True,blank=True)
    isDelivered = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.createdAt)

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, )
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    image = models.CharField(max_length=200, null= True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.name)

class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200)
    shippingPrice = models.DecimalField(max_digits=12, decimal_places=2)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return (self.address)



class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=150)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"
