from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from . import views

urlpatterns = [
    path('api/token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('api/token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('register/',views.Register_view.as_view(),name='register'),
    path('register/student/',views.StudentRegistrationView.as_view(),name='student-registeration'),
    path('login/',views.Login_view.as_view(),name='login'),
    path('logout/',views.Logout_view.as_view(),name='logout'),
    path('users/',views.Users_view.as_view(),name='users'),
]
