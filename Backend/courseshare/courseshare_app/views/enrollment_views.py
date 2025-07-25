from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status, generics, permissions
from rest_framework import status
from ..models import Enrollment, CourseList
from ..api_file.serializers import EnrollmentSerializer, Courseserializer

class EnrollCourseView(generics.CreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            course = CourseList.objects.get(id=kwargs['pk'])
        except CourseList.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        user = request.user
        if Enrollment.objects.filter(user=user, course=course).exists():
            return Response({'status': 'already enrolled'}, status=status.HTTP_200_OK)
        Enrollment.objects.create(user=user, course=course)
        return Response({'status': 'enrolled'}, status=status.HTTP_201_CREATED)

class EnrolledCoursesView(generics.ListAPIView):
    serializer_class = Courseserializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        enrollments = Enrollment.objects.filter(user=user)
        courses = [enrollment.course for enrollment in enrollments]
        return courses