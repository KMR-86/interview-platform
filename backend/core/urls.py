"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from base.views import GoogleLogin, FacebookLogin, LinkedInLogin
from dj_rest_auth.views import LogoutView, UserDetailsView

urlpatterns = [
    path('admin/', admin.site.urls),

    # 1. Social Auth Endpoints
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('api/auth/facebook/', FacebookLogin.as_view(), name='facebook_login'),
    path('api/auth/linkedin/', LinkedInLogin.as_view(), name='linkedin_login'),

    # 2. Utilities (Logout & Check Current User)
    path('api/auth/logout/', LogoutView.as_view(), name='rest_logout'),
    path('api/auth/user/', UserDetailsView.as_view(), name='rest_user_details'),
]