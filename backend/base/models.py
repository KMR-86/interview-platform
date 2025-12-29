from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# 1. THE USER
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_interviewer = models.BooleanField(default=False)
    is_interviewee = models.BooleanField(default=False)
    linkedin_url = models.URLField(max_length=255, blank=True, null=True)

# 2. INTERVIEWER PROFILE
class InterviewerProfile(models.Model):
    STATUS_CHOICES = (
        ('AWAITING_INFORMATION', 'Awaiting Information'), # 1. Profile incomplete
        ('PENDING', 'Pending Approval'),                  # 2. Submitted for review
        ('APPROVED', 'Approved'),                         # 3. Live & Public
        ('REJECTED', 'Rejected'),                         # 4. Application declined
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='interviewer_profile')
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    bio = models.TextField()
    price_per_hour = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    meeting_link = models.URLField(help_text="Static Zoom/Meet link")
    
    # Updated to 25 chars to fit 'AWAITING_INFORMATION'
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='AWAITING_INFORMATION')

    def __str__(self):
        return f"{self.user.username} - {self.get_status_display()}"

# 3. AVAILABILITY SLOT
class AvailabilitySlot(models.Model):
    interviewer = models.ForeignKey(InterviewerProfile, on_delete=models.CASCADE, related_name='slots')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_booked = models.BooleanField(default=False)

# 4. BOOKING
class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slot = models.OneToOneField(AvailabilitySlot, on_delete=models.PROTECT)
    interviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings_made')
    interviewer = models.ForeignKey(InterviewerProfile, on_delete=models.PROTECT, related_name='bookings_received')
    status = models.CharField(max_length=20, default='CONFIRMED')
    meeting_link_snapshot = models.URLField()