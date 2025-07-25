from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import status
from ..models import CourseList, Video
from ..api_file.serializers import VideoSerializer

class AddVideosToCourseView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticatedOrReadOnly]
    def get(self, request, pk):
        try:
            course = CourseList.objects.get(pk=pk)
        except CourseList.DoesNotExist:
            return Response({'Error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        videos = Video.objects.filter(course=course)
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)
    def post(self, request, pk):
        try:
            course = CourseList.objects.get(pk=pk)
        except CourseList.DoesNotExist:
            return Response({'Error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        videos_data = request.data
        for video_data in videos_data:
            video_data['course'] = pk
            serializer = VideoSerializer(data=video_data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Videos added successfully'}, status=status.HTTP_201_CREATED)
    