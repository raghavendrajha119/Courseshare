from django.contrib import admin
from .models import CourseList,Enrollment,Video,Task
# Register your models here.
admin.site.register(CourseList)
admin.site.register(Enrollment)
admin.site.register(Video)
admin.site.register(Task)