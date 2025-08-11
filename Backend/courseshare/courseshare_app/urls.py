from django.urls import path
from .views import *

urlpatterns = [
    path('courses/', CourseListView.as_view(), name='course-listings'),
    path('courses/my/', CourseListEduView.as_view(), name='course-educator'),
    path('courses/filter/',CourseListFilterView.as_view(),name='course-filter'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('enroll/<int:pk>/', EnrollCourseView.as_view(), name='enroll-course'),
    path('enrollments/', EnrolledCoursesView.as_view(), name='enrolled-courses'),
    path('courses/<int:pk>/videos/', AddVideosToCourseView.as_view(), name='add-course-videos'),
    path('api/checkout/<int:pk>/',StripeCheckoutSessionAPIView.as_view(),name='payment-view'),
    #tasks
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/complete/', TaskUpdateCompleteView.as_view(), name='task-complete'),
    path('tasks/<int:pk>/update/', TaskUpdateView.as_view(), name='task-update'),
    path('tasks/<int:pk>/delete/', TaskDeleteView.as_view(), name='task-delete'),
]
