from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, generics
from rest_framework import status
from ..models import CourseList, Video, Enrollment
from ..utils.filters import CourseFilter
from ..api_file.serializers import Courseserializer, VideoSerializer, PublicCourseList

class CourseListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        courses = CourseList.objects.all()
        serializer = PublicCourseList(courses, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['EducatorName'] = request.user.name
        serializer = Courseserializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseListFilterView(generics.ListAPIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticatedOrReadOnly]
    queryset=CourseList.objects.all()
    serializer_class=Courseserializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CourseFilter
    search_fields = ['Coursename','Institutename','EducatorName']

class CourseListEduView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = CourseList.objects.filter(EducatorName=request.user.name)
        serializer = Courseserializer(courses, many=True)
        return Response(serializer.data)

class CourseDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        try:
            course = CourseList.objects.get(pk=pk)
        except CourseList.DoesNotExist:
            return Response({'Error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        is_enrolled = False
        if user and user.is_authenticated:
            is_enrolled = (
                Enrollment.objects.filter(user=user, course=course).exists() or
                course.EducatorName == user.name
            )

        # Dynamically include videos based on enrollment status
        if is_enrolled:
            videos = course.videos.all()
            enrollment_status = "enrolled"
        else:
            videos = course.videos.filter(is_preview=True)
            enrollment_status = "not enrolled"

        course_data = Courseserializer(course).data
        course_data['videos'] = VideoSerializer(videos, many=True).data
        course_data['status'] = enrollment_status

        return Response(course_data)


    def put(self, request, pk):
        try:
            course = CourseList.objects.get(pk=pk)
        except CourseList.DoesNotExist:
            return Response({'Error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        # Only educator who created this course can update it
        if course.EducatorName != request.user.name:
            return Response({'Error': 'Not authorized to update this course'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        print(data)
        serializer = Courseserializer(course, data=data, partial=True, context={'request': request})

        if serializer.is_valid():
            updated_course = serializer.save()
            videos_data = request.data.get("videos")
            if videos_data:
                import json
                try:
                    Video.objects.filter(course=updated_course).delete()

                    videos_list = json.loads(videos_data)
                    for video in videos_list:
                        Video.objects.create(
                            course=updated_course,
                            title=video.get("title"),
                            video_url=video.get("video_url"),
                            is_preview=video.get("is_preview", False),
                        )
                except json.JSONDecodeError:
                    return Response({'videos': 'Invalid videos format. Must be JSON list.'}, status=status.HTTP_400_BAD_REQUEST)

            return Response(Courseserializer(updated_course).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, pk):
        course = CourseList.objects.get(pk=pk)
        self.check_object_permissions(request, course)
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)