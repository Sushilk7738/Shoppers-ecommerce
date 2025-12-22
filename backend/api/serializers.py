from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Product, Review, Order, OrderItem, ShippingAddress, Contact


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "_id", "username", "email", "name", "isAdmin"]

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        return obj.first_name if obj.first_name else obj.email

class UserRegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only = True)        

    class Meta:
        model = User
        fields = ["name", "email", "password"]
    
    def validate_email(self, value):
        if User.objects.filter(email = value).exists():
            raise serializers.ValidationError("Email already registered!")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        
        user.first_name = validated_data["name"]
        user.save()
        return user
        
        
        
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "_id", "username", "email", "name", "isAdmin", "token"]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "_id",
            "name",
            "image",
            "brand",
            "category",
            "description",
            "price",
            "discount",
            "offer_price",
            "countInStock",
            "rating",
            "numReviews",
            "reviews",
            "createdAt",
        ]

    def get_image(self, obj):
        if not obj.image:
            return None
        return str(obj.image)


    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        return ReviewSerializer(reviews, many=True).data


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = "__all__"

    def get_image(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return None
        if obj.image.startswith("http"):
            return obj.image
        if request:
            return request.build_absolute_uri(obj.image)
        return obj.image


from decimal import Decimal

class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    itemsPrice = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    userInfo = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "_id",
            "user",
            "paymentMethod",
            "taxPrice",
            "shippingPrice",
            "totalPrice",
            "isPaid",
            "paidAt",
            "isDelivered",
            "createdAt",
            "orderItems",
            "itemsPrice",
            "shippingAddress",
            "userInfo",
        ]

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        return OrderItemSerializer(items, many=True, context=self.context).data

    def get_itemsPrice(self, obj):
        total = Decimal("0.00")
        for item in obj.orderitem_set.all():
            qty = item.qty or 0
            price = item.price or Decimal("0.00")
            total += price * qty
        return total

    def get_shippingAddress(self, obj):
        if hasattr(obj, "shippingaddress"):
            return ShippingAddressSerializer(obj.shippingaddress, many=False).data
        return None

    def get_userInfo(self, obj):
        return UserSerializer(obj.user, many=False).data




class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"
