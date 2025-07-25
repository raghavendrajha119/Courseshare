import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models import CourseList, Enrollment
from django.utils.decorators import method_decorator
from django.views.decorators .csrf import csrf_exempt
from django.http import HttpResponse
stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeCheckoutSessionAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request,pk,*args,**kwargs):
        course=get_object_or_404(CourseList,pk=pk)
        user=request.user
        try:
            session=stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price_data":{
                        "currency":"inr",
                        "unit_amount": int(course.Coursefee*100),
                        "product_data":{
                            "name": course.Coursename,
                            "description": 'CourseShare Educations'
                        },
                    },
                    "quantity": 1,
                }],
                metadata={
                    "course_id": str(course.id),
                    "user_email": user,
                },
                mode="payment",
                success_url=f"http://localhost:5173/enroll/{course.pk}?success=true",
                cancel_url=f"http://localhost:5173/course/{course.pk}?canceled=true",
                customer_email=user,
                billing_address_collection='required',
            )
            return Response({"url": session.url}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
