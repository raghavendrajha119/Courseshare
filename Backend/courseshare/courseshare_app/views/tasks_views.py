from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from ..models import Task
from ..api_file.serializers import TaskSerializer
from ..utils.task_utils import calculate_pending_tasks, update_pending_tasks_in_range
from django.utils.dateparse import parse_date

from ..ml_algos.task_ml_utils import predict_risk, train_model

class TaskListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self,request):
        tasks=Task.objects.filter(user=request.user)
        serializer=TaskSerializer(tasks,many=True)
        
        # lets have the prediction for user tasks as well
        results=[]
        for task, task_data in zip(tasks, serializer.data):
            if task.completed_date is None:
                time_left=(task.deadline-task.start_date).days
                risk = predict_risk(task.task_type, time_left, task.other_tasks_pending)
                prediction = "High Risk" if risk == 1 else "Low Risk" if risk == 0 else "Not enough data"
            else:
                prediction = None
            task_data["risk_prediction"] = prediction
            results.append(task_data)
        
        return Response(results, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Create a new task with auto other_tasks_pending calculation."""
        data = request.data.copy()
        data["user"] = request.user

        start_date = parse_date(data.get("start_date"))
        deadline = parse_date(data.get("deadline"))

        if not start_date or not deadline:
            return Response({"error": "Invalid dates provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Use utility to calculate count
        pending_count = calculate_pending_tasks(request.user, start_date, deadline)

        # Increment pending counts for overlapping tasks
        update_pending_tasks_in_range(request.user, start_date, deadline)

        data["other_tasks_pending"] = pending_count

        # ML Prediction before saving the data
        time_left=(deadline-start_date).days
        risk=predict_risk(data["task_type"],time_left,pending_count)

        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # user set from request
            return Response({
                "task": serializer.data,
                "risk_prediction": "High Risk" if risk == 1 else "Low Risk" if risk == 0 else "Not enough data"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TaskUpdateCompleteView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def patch(self, request, pk):
        """Mark a task as completed (only completed_date allowed)."""
        try:
            task = Task.objects.get(pk=pk, user=request.user)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        completed_date = request.data.get("completed_date")
        if not completed_date:
            return Response({"error": "completed_date is required"}, status=status.HTTP_400_BAD_REQUEST)

        task.completed_date = parse_date(completed_date)
        task.save()
        # Retrain model with all tasks
        train_model(Task.objects.all())
        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)


class TaskUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def patch(self, request, pk):
        """Update other task details (except completed_date)."""
        try:
            task = Task.objects.get(pk=pk, user=request.user)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        # Prevent completed_date updates here
        if "completed_date" in request.data:
            return Response({"error": "Use the completion API for completed_date"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            updated_task=serializer.save()
            if "start_date" in request.data or "deadline" in request.data:
                start_date = updated_task.start_date
                deadline = updated_task.deadline
                pending_count = calculate_pending_tasks(request.user, start_date, deadline)
                update_pending_tasks_in_range(request.user, start_date, deadline)
                updated_task.other_tasks_pending=pending_count
                updated_task.save()
                
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, pk):
        """Delete a task."""
        try:
            task = Task.objects.get(pk=pk, user=request.user)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)