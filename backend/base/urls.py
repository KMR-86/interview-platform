from django.urls import path
from .views import (
    GoogleLogin, 
    FacebookLogin, 
    LinkedInLogin, 
    InterviewerProfileView, 
    AvailabilityView,
    InterviewerListView,
    CreateBookingView, 
    MyBookingsView
)

urlpatterns = [
    # 1. Social Auth Routes
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('auth/facebook/', FacebookLogin.as_view(), name='facebook_login'),
    path('auth/linkedin/', LinkedInLogin.as_view(), name='linkedin_login'),

    # 2. Private Interviewer Routes (Protected)
    # GET/PUT - Manage my own profile
    path('interviewer/profile/', InterviewerProfileView.as_view(), name='interviewer_profile'),
    # GET/POST - Manage my availability slots
    path('interviewer/availability/', AvailabilityView.as_view(), name='interviewer_availability'),

    # 3. Public Directory Routes (Read Only)
    # GET - List all APPROVED interviewers
    path('interviewers/', InterviewerListView.as_view(), name='interviewer_list'),

    path('bookings/my-bookings/', MyBookingsView.as_view(), name='my_bookings'),

    path('bookings/create/', CreateBookingView.as_view(), name='create_booking'),
]