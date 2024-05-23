from rest_framework.views import APIView
from rest_framework.response import Response
from user_app.api.serializers import UserSerializer,StudentSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from ..models import CustomUser

class Register_view(APIView):
    def post(self,request):
        serializer=UserSerializer(data=request.data)
        data={}
        if serializer.is_valid():
            account=serializer.save()
            data['username']=account.username
            data['email']=account.email
            data['role']=account.role
            refresh=RefreshToken.for_user(user=account)
            data['token']={
                'refresh':str(refresh),
                'access':str(refresh.access_token),
            }
            return Response(data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
class Login_view(APIView):
    def post(self,request, *args, **kwargs):
        username=request.data.get('username')
        password=request.data.get('password')
        user=authenticate(request,username=username,password=password)
        if user is not None:
            refresh=RefreshToken.for_user(user=user)
            data={
                'username':user.username,
                'token':{
                    'refresh':str(refresh),
                    'access':str(refresh.access_token),
                }
            }
            if user.role=='student':
                student=user.student_account
                if student is not None:
                    student_data=StudentSerializer(student).data
                    data['data']=student_data
            return Response(data,status=status.HTTP_200_OK)
        else:
            return Response({'error':'Invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)

class Logout_view(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        try:
            refresh_token=request.data['refresh']
            token=RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail':'Successfully logged out'},status=status.HTTP_205_RESET_CONTENT)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class Users_view(APIView):
    def get(self,request):
        users=CustomUser.objects.all()
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data)
    
class StudentRegistrationView(APIView):
    def post(self,request):
        serializer=StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
