from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status, generics, permissions
from .models import CourseList, Enrollment, Video
from .api_file.serializers import Courseserializer,EnrollmentSerializer,VideoSerializer,CardInformationSerializer
import os

# from .api_file.permissions import ReadOnlyPermission, UpdatePermission
#from django.conf import settings
#from django.http import JsonResponse
import stripe

class Courselist_view(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        courses = CourseList.objects.all()
        serializer = Courseserializer(courses, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['EducatorName'] = request.user.name
        serializer = Courseserializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Courselistedu_view(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        courses = CourseList.objects.filter(EducatorName=request.user.name)
        serializer = Courseserializer(courses, many=True)
        return Response(serializer.data)

class Coursedetail_view(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        try:
            course = CourseList.objects.get(pk=pk)
        except CourseList.DoesNotExist:
            return Response({'Error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        # Serialize basic course details
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

class EnrollCourseView(generics.CreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        course = CourseList.objects.get(id=kwargs['pk'])
        user = request.user
        Enrollment.objects.create(user=user, course=course)
        return Response({'status': 'enrolled'}, status=status.HTTP_201_CREATED)


class EnrolledCoursesView(generics.ListAPIView):
    serializer_class = Courseserializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        enrollments = Enrollment.objects.filter(user=user)
        courses = [enrollment.course for enrollment in enrollments]
        return courses

class AddVideosToCourseView(APIView):
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

        videos_data = request.data  # Assuming the request data is a list of video objects

        for video_data in videos_data:
            video_data['course'] = pk  # Assign the course id to each video data
            serializer = VideoSerializer(data=video_data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Videos added successfully'}, status=status.HTTP_201_CREATED)
    
class PaymentAPI(APIView):
    serializer_class = CardInformationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            data_dict = serializer.validated_data
            stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
            response = self.stripe_card_payment(data_dict=data_dict)
        else:
            response = {'errors': serializer.errors, 'status': status.HTTP_400_BAD_REQUEST}
        
        return Response(response)

    def stripe_card_payment(self, data_dict):
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=10000,  # This should be dynamically set or retrieved from the database
                currency='inr',
                payment_method_data={
                    'type': 'card',
                    'card': {
                        'number': data_dict['card_number'],
                        'exp_month': data_dict['expiry_month'],
                        'exp_year': data_dict['expiry_year'],
                        'cvc': data_dict['cvc'],
                    }
                },
                confirm=True,
                automatic_payment_methods={
                    'enabled': True,
                    'allow_redirects': 'never'
                }
            )

            if payment_intent['status'] == 'succeeded':
                response = {
                    'message': "Card Payment Success",
                    'status': status.HTTP_200_OK,
                    'payment_intent': payment_intent
                }
            else:
                response = {
                    'message': "Card Payment Failed",
                    'status': status.HTTP_400_BAD_REQUEST,
                    'payment_intent': payment_intent
                }
        except stripe.error.CardError as e:
            # Handle card errors
            err = e.error
            response = {
                'error': err.message,
                'status': status.HTTP_400_BAD_REQUEST
            }
        except Exception as e:
            # Handle other errors
            response = {
                'error': str(e),
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            }
        return response