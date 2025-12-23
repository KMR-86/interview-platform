from rest_framework import serializers
from .models import InterviewerProfile, User
from .models import AvailabilitySlot

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_interviewer']

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
            'status'          # 'PENDING', 'ACTIVE', etc.
        ]
        # User cannot change their own status (only Admin can)
        read_only_fields = ['id', 'status', 'user_info']

class AvailabilitySlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilitySlot
        fields = ['id', 'start_time', 'end_time', 'is_booked']
        read_only_fields = ['id', 'is_booked']