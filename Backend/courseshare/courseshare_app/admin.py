from django.contrib import admin
from .models import CourseList,Enrollment,Video
# Register your models here.
admin.site.register(CourseList)
admin.site.register(Enrollment)
admin.site.register(Video)