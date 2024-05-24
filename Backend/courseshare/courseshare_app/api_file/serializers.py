from rest_framework import serializers
from ..models import CourseList

class Courseserializer(serializers.ModelSerializer):
    Educator_name=serializers.SerializerMethodField()
    class Meta:
        model = CourseList
        fields = '__all__'

    def get_Educator_name(self,obj):
        return obj.Educator.user.username if obj.Educator else None
        