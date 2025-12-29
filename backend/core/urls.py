from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # 1. Standard Auth (Login, Logout, User Details, Password Reset)
    # This SINGLE line automatically gives you:
    # - POST /api/auth/logout/
    # - GET  /api/auth/user/
    path('api/auth/', include('dj_rest_auth.urls')),

    # 2. Registration (Signup)
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # 3. Our Custom App Routes
    # This connects the 'base/urls.py' you just created.
    # It gives you:
    # - /api/auth/google/
    # - /api/interviewer/profile/
    # - /api/interviewer/availability/
    # - /api/interviewers/
    path('api/', include('base.urls')),
]