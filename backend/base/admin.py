from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, InterviewerProfile, AvailabilitySlot, Booking

# Register the User model using Django's built-in UserAdmin
# This gives you the nice "Change Password" form in the UI
admin.site.register(User, UserAdmin)

# Register the other tables
admin.site.register(InterviewerProfile)
admin.site.register(AvailabilitySlot)
admin.site.register(Booking)