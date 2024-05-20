from rest_framework import serializers
from ..models import CourseList

class Courseserializer(serializers.ModelSerializer):
    class Meta:
        model = CourseList
        fields = '__all__'
        