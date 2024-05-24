from django.urls import path
from . import views

urlpatterns = [
    path('course/',views.Courselist_view.as_view(),name='course-listings'),
    path('course/<int:pk>',views.Coursedetail_view.as_view(),name='course-detail')
]
