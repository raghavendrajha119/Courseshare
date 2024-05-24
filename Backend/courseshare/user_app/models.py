from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('educator', 'Educator'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=15, choices=ROLE_CHOICES)

class Student(models.Model):
    student_id=models.CharField(max_length=10)
    user=models.OneToOneField(CustomUser, on_delete=models.CASCADE,related_name='student_account')
    def __str__(self):
        return self.user.username
    
class Educator(models.Model):
    educator_id=models.CharField(max_length=10)
    user=models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name='educator_account')
    def __str__(self):
        return self.user.username
