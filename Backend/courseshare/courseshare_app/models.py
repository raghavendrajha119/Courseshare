from django.conf import settings
from django.db import models
from django.contrib.auth.models import User

class CourseList(models.Model):
    Coursename = models.CharField(max_length=100)
    Institutename = models.CharField(max_length=200)
    Details = models.CharField(max_length=500)
    Language = models.CharField(max_length=100)
    Coursefee = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    Duration = models.CharField(max_length=100, default='N/A', blank=True, null=True)  # Allowing null and blank values
    Thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    Educator = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    Created = models.DateTimeField(auto_now_add=True)
    Modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.Coursename
