#class based apiview or decorators
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CourseList
from .api_file.serializers import Courseserializer

class Courselist_view(APIView):
    def get(self,request):
        course=CourseList.objects.all()
        serializer=Courseserializer(course,many=True)
        return Response(serializer.data)
    def post(self,request,data):
        serializer=Courseserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)