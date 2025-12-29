from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.linkedin_oauth2.views import LinkedInOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client as AllAuthOAuth2Client
OAuth2Client = AllAuthOAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings

from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import InterviewerProfile
from .serializers import InterviewerProfileSerializer
from datetime import timedelta
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.views import APIView # Needed for custom logic
from .models import AvailabilitySlot
from .serializers import AvailabilitySlotSerializer
from django.db import transaction

from .permissions import IsApprovedInterviewer, CanEditProfile
from .models import Booking
from .serializers import BookingSerializer

# Note: "callback_url" must match what you will eventually set in your React Frontend
# For now, we point to localhost:5173 (standard Vite React port)

class OAuth2ClientCompatibilityWrapper(AllAuthOAuth2Client):
    """Wrapper to avoid duplicate 'scope_delimiter' being passed both
    positionally and as a keyword (some versions of dj-rest-auth/allauth
    call the constructor differently).
    """
    def __init__(self, *args, **kwargs):
        # If caller provided scope_delimiter both positionally and as kw,
        # remove the kw to avoid TypeError: multiple values for argument.
        kwargs.pop('scope_delimiter', None)
        super().__init__(*args, **kwargs)


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    client_class = OAuth2ClientCompatibilityWrapper

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    callback_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    client_class = OAuth2Client

class LinkedInLogin(SocialLoginView):
    adapter_class = LinkedInOAuth2Adapter
    callback_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    client_class = OAuth2Client

class InterviewerProfileView(generics.RetrieveUpdateAPIView):
    # ... existing attributes ...
    serializer_class = InterviewerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, CanEditProfile]

    def get_object(self):
        # ... existing get_object logic ...
        profile, created = InterviewerProfile.objects.get_or_create(user=self.request.user)
        if created and not self.request.user.is_interviewer:
            self.request.user.is_interviewer = True
            self.request.user.save()
        return profile

    # ADD THIS METHOD:
    def perform_update(self, serializer):
        instance = serializer.save()
        
        # Logic: If they are currently 'AWAITING_INFORMATION' and fill out the required fields,
        # automatically move them to 'PENDING'.
        if instance.status == 'AWAITING_INFORMATION':
            # Check if critical fields are populated (customize this list as needed)
            if instance.title and instance.price_per_hour and instance.meeting_link:
                instance.status = 'PENDING'
                instance.save()

class AvailabilityView(APIView):
    """
    Manages Availability Slots.
    Strictly protected: Only 'APPROVED' interviewers can access this.
    """
    permission_classes = [permissions.IsAuthenticated, IsApprovedInterviewer]

    def get(self, request):
        """Show my future slots"""
        slots = AvailabilitySlot.objects.filter(interviewer__user=request.user)
        serializer = AvailabilitySlotSerializer(slots, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Input: [ { "start": "...", "end": "..." }, ... ]
        Action: Bulk creates slots. Fails if total slots > 20.
        """
        # 1. Validate Input is a List
        if not isinstance(request.data, list):
            return Response(
                {"error": "Expected a list of date ranges"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Get Profile (Already guaranteed to exist and be APPROVED by permission class)
        profile = request.user.interviewer_profile

        new_slots = []
        MAX_SLOTS = 20

        try:
            # 3. Dry Run Loop
            for time_range in request.data:
                start_str = time_range.get('start')
                end_str = time_range.get('end')

                if not start_str or not end_str:
                    continue

                current_time = parse_datetime(start_str)
                end_time = parse_datetime(end_str)

                if not current_time or not end_time:
                    continue

                # The "Chopping" Loop
                while current_time < end_time:
                    slot_end = current_time + timedelta(hours=1)
                    if slot_end > end_time:
                        break

                    slot = AvailabilitySlot(
                        interviewer=profile,
                        start_time=current_time,
                        end_time=slot_end,
                        is_booked=False
                    )
                    new_slots.append(slot)

                    # 4. LIMIT CHECK
                    if len(new_slots) > MAX_SLOTS:
                        return Response(
                            {"error": f"Limit exceeded. You can only create {MAX_SLOTS} slots at a time."},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    current_time = slot_end

            # 5. Save to Database
            if new_slots:
                AvailabilitySlot.objects.bulk_create(new_slots)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"message": f"Successfully created {len(new_slots)} slots"},
            status=status.HTTP_201_CREATED
        )

    serializer_class = InterviewerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return InterviewerProfile.objects.filter(status='ACTIVE')


class InterviewerListView(generics.ListAPIView):
    """
    GET: Returns a list of all APPROVED interviewers.
    Used by Interviewees to browse the directory.
    """
    serializer_class = InterviewerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # CRITICAL: Never show PENDING, REJECTED, or AWAITING_INFORMATION profiles
        return InterviewerProfile.objects.filter(status='APPROVED')
    
class MyBookingsView(generics.ListAPIView):
    """
    GET: Returns list of bookings where the current user is the interviewee.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter bookings for the logged-in user
        return Booking.objects.filter(interviewee=self.request.user).order_by('slot__start_time')
    
class CreateBookingView(APIView):
    """
    POST: Interviewee books a specific slot.
    Input: { "slot_id": "UUID..." }
    Logic: Checks if open -> Creates Booking -> Marks Slot as Booked -> Returns Booking
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        slot_id = request.data.get('slot_id')
        if not slot_id:
            return Response({"error": "slot_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Start a database transaction to prevent race conditions
            with transaction.atomic():
                # Lock the slot row until we are done
                slot = AvailabilitySlot.objects.select_for_update().get(id=slot_id)
                
                if slot.is_booked:
                    return Response(
                        {"error": "This slot has already been booked."}, 
                        status=status.HTTP_409_CONFLICT
                    )
                
                # Create the Booking
                booking = Booking.objects.create(
                    slot=slot,
                    interviewee=request.user,
                    interviewer=slot.interviewer,
                    meeting_link_snapshot=slot.interviewer.meeting_link,
                    status='CONFIRMED'
                )
                
                # Mark Slot as Booked
                slot.is_booked = True
                slot.save()
                
                # Serialize and return
                return Response(
                    BookingSerializer(booking).data, 
                    status=status.HTTP_201_CREATED
                )

        except AvailabilitySlot.DoesNotExist:
            return Response({"error": "Slot not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)