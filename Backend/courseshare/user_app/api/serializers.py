# serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User  # Use Django's built-in User model
        fields = ['username', 'email', 'password', 'password_confirmation']

    def validate(self, data):
        password = data.get('password')
        password_confirmation = data.pop('password_confirmation', None)

        if password != password_confirmation:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
