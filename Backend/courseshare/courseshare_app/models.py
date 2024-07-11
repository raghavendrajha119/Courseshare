from django.db import models
from django.contrib.auth.models import User

class CourseList(models.Model):
    Coursename = models.CharField(max_length=100)
    Institutename = models.CharField(max_length=200)
    Details = models.CharField(max_length=500)
    Language = models.CharField(max_length=100)
    Coursefee = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    Duration = models.CharField(max_length=100, default='N/A', blank=True, null=True)
    Thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    EducatorName = models.CharField(max_length=150, default='Default Educator')
    Created = models.DateTimeField(auto_now_add=True)
    Modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.Coursename
    
class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(CourseList, on_delete=models.CASCADE)
    enrolled_date = models.DateTimeField(auto_now_add=True)
    

class Video(models.Model):
    course = models.ForeignKey(CourseList, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=200)
    video_url = models.URLField()
    is_preview = models.BooleanField(default=False)  # Indicates if the video is available for preview

    def __str__(self):
        return self.title

