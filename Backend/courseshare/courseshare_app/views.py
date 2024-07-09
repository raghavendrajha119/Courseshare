from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from .models import CourseList
from .api_file.serializers import Courseserializer
from .api_file.permissions import ReadOnlyPermission, UpdatePermission

class Courselist_view(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [ReadOnlyPermission]

    def get(self, request):
        courses = CourseList.objects.all()
        serializer = Courseserializer(courses, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['Educator'] = request.user.id
        serializer = Courseserializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Coursedetail_view(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [UpdatePermission]

    def get(self, request, pk):
        try:
            course = CourseList.objects.get(pk=pk)
        except CourseList.DoesNotExist:
            return Response({'Error: Course not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = Courseserializer(course)
        return Response(serializer.data)

    def put(self, request, pk):
        course = CourseList.objects.get(pk=pk)
        self.check_object_permissions(request, course)
        serializer = Courseserializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        course = CourseList.objects.get(pk=pk)
        self.check_object_permissions(request, course)
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
