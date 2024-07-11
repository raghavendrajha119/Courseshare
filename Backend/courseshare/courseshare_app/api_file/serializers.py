from rest_framework import serializers
from ..models import CourseList,Enrollment,Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_url', 'is_preview','course']

class Courseserializer(serializers.ModelSerializer):
    class Meta:
        model = CourseList
        fields = ['id', 'Coursename', 'Institutename', 'Details', 'Language', 'Coursefee', 'Duration', 'Thumbnail', 'EducatorName', 'videos']

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['user', 'course', 'enrolled_date']
