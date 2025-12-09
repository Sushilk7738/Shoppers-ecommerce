#Django Imports
from django.core import paginator
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework import status

# REST framework Import
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.serializers import Serializer

# from api.products import products
from api.models import *
from api.serializers import ProductSerializer

#Get all products with query

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''
    
    products = Product.objects.filter(name__icontains = query).order_by('-_id')
    page = request.query_params.get('page')
    if page is None or page.strip() == '':
        page = 1
    else:
        try :
            page = int(page)
        except ValueError:
            page = 1
    products = Product.objects.all().order_by("-_id")
    serializer = ProductSerializer(products, many=True)
    return Response({"products": serializer.data})

            

#Top Products
@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte = 4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many = True)
    return Response(serializer.data)

#Get single products
@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id = pk)
    data = request.data
    
    # 1 Review already exists
    alreadyExists = product.review_set.filter(user = user).exists()

    if alreadyExists:
        content = {'detail' : 'Product already reviewed.'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    
    #2 No rating or 0
    elif data['rating'] == 0:
        content = {'detail' : 'Please Select a rating.'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    #3 Create review
    else:
        review = Review.objects.create(
            user = user,
            product = product,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating
        product.rating = total / len(reviews)
        product.save()
        return Response('Review added successfully!')


    
        
    