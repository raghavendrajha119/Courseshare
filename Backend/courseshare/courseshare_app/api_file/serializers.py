from rest_framework import serializers
from ..models import CourseList, Enrollment, Video
from datetime import timedelta
import json

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_url', 'is_preview', 'course']

class PublicCourseList(serializers.ModelSerializer):
    class Meta:
        model = CourseList
        fields = ['id','Coursename','Institutename','EducatorName','category','level','Thumbnail','Coursefee','Language','Details']

class Courseserializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = CourseList
        fields = [
            'id', 'Coursename', 'Institutename', 'Details',
            'Language', 'Coursefee', 'Duration', 'Thumbnail',
            'EducatorName', 'videos', 'category', 'level'
        ]

    def validate_duration(self, value):
        if isinstance(value, str):
            try:
                hours, minutes, seconds = map(int, value.split(":"))
                print(hours,minutes,seconds)
                return timedelta(hours=hours, minutes=minutes, seconds=seconds)
            except:
                raise serializers.ValidationError("Duration must be in HH:MM:SS format.")
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        videos_data = request.data.get("videos")
        validated_data['Duration'] = self.validate_duration(request.data.get("Duration"))
        course = CourseList.objects.create(**validated_data)
        if videos_data:
            try:
                videos_list = json.loads(videos_data)
                for video in videos_list:
                    Video.objects.create(
                        course=course,
                        title=video.get("title"),
                        video_url=video.get("video_url"),
                        is_preview=video.get("is_preview", False),
                    )
            except json.JSONDecodeError:
                raise serializers.ValidationError({"videos": "Invalid videos format. Must be a JSON array."})

        return course
    
    def update(self, instance, validated_data):
        request = self.context.get("request")
        try:
            validated_data['Duration'] = self.validate_duration(request.data.get("Duration"))
        except Exception:
            pass  

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['user', 'course', 'enrolled_date']
