from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('changepassword/',views.UserchangepasswordView.as_view(),name='change-password'),
    path('reset-password-mail/',views.SendPasswordResetEmailView.as_view(),name='send-reset-password-mail'),
    path('reset-password/<uid>/<token>/',views.UserPasswordResetView.as_view(),name='reset-password'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('update-profile/',views.UserUpdateView.as_view(),name='update-profile'),
]
