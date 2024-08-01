from django.urls import path
from . import views

urlpatterns = [
    path('course/', views.Courselist_view.as_view(), name='course-listings'),
    path('coursebyeducator/', views.Courselistedu_view.as_view(), name='course-educator'),
    path('course/<int:pk>', views.Coursedetail_view.as_view(), name='course-detail'),
    path('course/<int:pk>/enroll/', views.EnrollCourseView.as_view(), name='enroll-course'),
    path('enrolled_courses/', views.EnrolledCoursesView.as_view(), name='enrolled-courses'),
    path('course/<int:pk>/videos/', views.AddVideosToCourseView.as_view(), name='add-course-videos'),
    path('make_payment/',views.PaymentAPI.as_view(),name='make_payment')
]
