#class based apiview or decorators
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CourseList
from .api_file.serializers import Courseserializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

class Courselist_view(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        course=CourseList.objects.all()
        serializer=Courseserializer(course,many=True)
        return Response(serializer.data)
    def post(self,request,data):
        serializer=Courseserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)