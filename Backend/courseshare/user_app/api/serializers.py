from ..models import CustomUser
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password_confirmation=serializers.CharField(style={'input_type':'password'},write_only=True)
    class Meta:
        model=CustomUser
        fields=['username','email','password','password_confirmation','role']
        extra_kwargs={
            'password':{'write_only':True}
        }
    #over writing the default save function so that i can check passwords and unique email
    def save(self):
        password=self.validated_data['password']
        password2=self.validated_data['password_confirmation']
        if password != password2:
            raise serializers.ValidationError({'error':'Password not matching'})
        if CustomUser.objects.filter(email=self.validated_data['email']).exists():
            raise serializers.ValidationError({'error':'Email already registered'})
        account = CustomUser(email=self.validated_data['email'],username=self.validated_data['username'],role=self.validated_data['role'])
        account.set_password(password)
        account.save()
        return account