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
    """
    GET: Get my profile
    PUT: Update my profile (Title, Bio, Price, etc.)
    """
    serializer_class = InterviewerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Try to get the profile for the logged-in user
        profile, created = InterviewerProfile.objects.get_or_create(user=self.request.user)

        # If this was just created, ensure the User flag is set correctly
        if created and not self.request.user.is_interviewer:
            self.request.user.is_interviewer = True
            self.request.user.save()

        return profile


class AvailabilityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

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

        # 2. Get Profile
        try:
            profile = request.user.interviewer_profile
        except:
            return Response(
                {"error": "Interviewer profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        new_slots = []
        MAX_SLOTS = 20

        try:
            # 3. Dry Run Loop (Generate objects in memory first)
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

                    # Create object in memory
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

            # 5. Save to Database (Bulk Create)
            if new_slots:
                AvailabilitySlot.objects.bulk_create(new_slots)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"message": f"Successfully created {len(new_slots)} slots"},
            status=status.HTTP_201_CREATED
        )