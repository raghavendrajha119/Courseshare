from django.urls import path
from . import views

urlpatterns = [
    path('course/',views.Courselist_view.as_view(),name='course-listings'),
]
