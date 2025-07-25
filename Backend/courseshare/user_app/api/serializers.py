from user_app.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from ..utils import Util

class UserRegisterationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'},write_only=True)

    class Meta:
        model = User
        fields = ['email', 'name','password', 'password2','tc']
        extra_kwargs={
            'password':{'write_only':True}
        }

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.ModelSerializer):
    email=serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields=['email','password']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','email','name','profile_image','bio','dob']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['profile_image','bio','dob']

class UserChangePasswordSerializer(serializers.Serializer):
    password=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
    password2=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
    class Meta:
        fields=['password','password2']
    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        user= self.context.get('user')
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        user.set_password(password)
        user.save()
        return data
    
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email=serializers.EmailField(max_length=255)
    class Meta:
        fields=['email']
    def validate(self, attrs):
        email=attrs.get('email')
        if User.objects.filter(email=email).exists():
            user=User.objects.get(email=email)
            uid=urlsafe_base64_encode(force_bytes(user.id))
            print('Encoded id',uid)
            token=PasswordResetTokenGenerator().make_token(user)
            print('token',token)
            link='http://localhost:3000/api/user/reset/'+uid+'/'+token
            print(link)
            #send email
            body='click following link to reset your password'
            data={
                'email_subject':'Reset Your Password',
                'email_body':body,
                'to_email':user.email
            }
            Util.send_email(data)
            return attrs
        else:
            raise serializers.ValidationError('you are not register User')
        
class UserPasswordResetSerializer(serializers.Serializer):
    password=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
    password2=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
    class Meta:
        fields=['password','password2']
    def validate(self, data):
        try:
            password = data.get('password')
            password2 = data.get('password2')
            uid= self.context.get('uid')
            token=self.context.get('token')
            if password != password2:
                raise serializers.ValidationError({'password': 'Passwords do not match.'})
            id=smart_str(urlsafe_base64_decode(uid))
            user=User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user,token):
                raise serializers.ValidationError('Token in not valid or expired')
            user.set_password(password)
            user.save()
            return data
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user,token)
            if not PasswordResetTokenGenerator().check_token(user,token):
                raise serializers.ValidationError('Token in not valid or expired')


