from django.contrib import admin
from .models import CustomUser,Student,Educator
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Student)
admin.site.register(Educator)