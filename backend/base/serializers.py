from rest_framework import serializers
from .models import InterviewerProfile, User
from .models import AvailabilitySlot
from .models import Booking

class UserSerializer(serializers.ModelSerializer):
    # Field to carry the status directly on the User object
    interviewer_status = serializers.SerializerMethodField()

    class Meta:
        model = User
        # Added 'is_interviewee' and 'interviewer_status' to the response
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'is_interviewer', 
            'is_interviewee', 
            'interviewer_status'
        ]

    def get_interviewer_status(self, obj):
        """
        Returns the status (AWAITING_INFORMATION, PENDING, APPROVED, REJECTED) 
        if the user is an Interviewer. Returns None for Interviewees.
        """
        if obj.is_interviewer:
            try:
                return obj.interviewer_profile.status
            except InterviewerProfile.DoesNotExist:
                # Fallback if profile hasn't been created yet
                return 'AWAITING_INFORMATION'
        return None

class InterviewerProfileSerializer(serializers.ModelSerializer):
    # We nest the User info so the frontend gets everything in one packet
    user_info = UserSerializer(source='user', read_only=True)

    class Meta:
        model = InterviewerProfile
        fields = [
            'id',
            'user_info',      # Returns {username, email...}
            'title',
            'company',
            'bio',
            'price_per_hour',
            'meeting_link',
            'status'          # 'PENDING', 'APPROVED', etc.
        ]
        # User cannot change their own status (only Admin can)
        read_only_fields = ['id', 'status', 'user_info']

class AvailabilitySlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilitySlot
        fields = ['id', 'start_time', 'end_time', 'is_booked']
        read_only_fields = ['id', 'is_booked']


class BookingSerializer(serializers.ModelSerializer):
    interviewer_name = serializers.ReadOnlyField(source='interviewer.user.username')
    interviewer_title = serializers.ReadOnlyField(source='interviewer.title')
    start_time = serializers.DateTimeField(source='slot.start_time', read_only=True)
    end_time = serializers.DateTimeField(source='slot.end_time', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 
            'interviewer_name', 
            'interviewer_title', 
            'start_time', 
            'end_time', 
            'status', 
            'meeting_link_snapshot'
        ]