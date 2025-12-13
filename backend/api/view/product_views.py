from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import Product, Review
from api.serializers import ProductSerializer


@api_view(["GET"])
def getProducts(request):
    query = request.query_params.get("keyword", "")
    products = Product.objects.filter(
        name__icontains=query
    ).order_by("-_id")

    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request},
    )
    return Response({"products": serializer.data})


@api_view(["GET"])
def getTopProducts(request):
    products = Product.objects.filter(
        rating__gte=4
    ).order_by("-rating")[:5]

    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request},
    )
    return Response(serializer.data)


@api_view(["GET"])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)

    serializer = ProductSerializer(
        product,
        many=False,
        context={"request": request},
    )
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    already_exists = product.review_set.filter(user=user).exists()
    if already_exists:
        return Response(
            {"detail": "Product already reviewed."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if data.get("rating") == 0:
        return Response(
            {"detail": "Please Select a rating."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    Review.objects.create(
        user=user,
        product=product,
        name=user.first_name,
        rating=data["rating"],
        comment=data["comment"],
    )

    reviews = product.review_set.all()
    product.numReviews = reviews.count()
    product.rating = sum(r.rating for r in reviews) / reviews.count()
    product.save()

    return Response("Review added successfully!")
