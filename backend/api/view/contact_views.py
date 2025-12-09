from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.serializers import ContactSerializer

class ContactMessageAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = ContactSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Message sent successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
