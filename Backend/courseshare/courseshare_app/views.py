#class based apiview or decorators
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CourseList
from .api_file.serializers import Courseserializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from .api_file.permissions import ReadOnlyPermission,UpdatePermission
from rest_framework import status

class Courselist_view(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[ReadOnlyPermission]
    def get(self,request):
        course=CourseList.objects.all()
        serializer=Courseserializer(course,many=True)
        return Response(serializer.data)
    def post(self,request,*args,**kwargs):
        serializer=Courseserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)
        
class Coursedetail_view(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[UpdatePermission]
    def get(self,request,pk):
        try:
            course=CourseList.objects.get(pk=pk)
        except CourseList.DoesNotExist:
            return Response({'Error: Course not found'},status=status.HTTP_404_NOT_FOUND)
        serializer=Courseserializer(course)
        return Response(serializer.data,status=status.HTTP_200_OK)
    def put(self,request,pk):
        course=CourseList.objects.get(pk=pk)
        self.check_object_permissions(request, course)
        serializer=Courseserializer(course,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,pk):
        course=CourseList.objects.get(pk=pk)
        self.check_object_permissions(request, course)
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        

            