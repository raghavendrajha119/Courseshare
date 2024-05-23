from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('educator','Educator'),
        ('student','Student'),
    )
    role = models.CharField(max_length=15,choices=ROLE_CHOICES)
