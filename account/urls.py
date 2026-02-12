from django.shortcuts import redirect
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),

    path('forgot-password/', views.forgot_password, name='forgot-password'),
    path('verify-otp/', views.verify_otp, name='verify-otp'),
    path('reset-password/', views.reset_password, name='reset-password'),
    path('resend-otp/', views.resend_otp, name='resend-otp'),
]

