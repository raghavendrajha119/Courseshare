from django.db import models
from user_app.models import Educator

class CourseList(models.Model):
    Coursename=models.CharField(max_length=100)
    Institutename=models.CharField(max_length=200)
    Details=models.CharField(max_length=500)
    Educator=models.ForeignKey(Educator,on_delete=models.CASCADE,related_name='courses',null=True)
    Language=models.CharField(max_length=100)
    Coursefee=models.DecimalField(max_digits=9,decimal_places=2,blank=True,null=True)
    Created = models.DateTimeField(auto_now_add=True) #updated only once created
    Modified = models.DateTimeField(auto_now=True) #updated at every instance save() at model

    def __str__(self):
        return self.Coursename
