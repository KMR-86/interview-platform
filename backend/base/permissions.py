from rest_framework import permissions

class IsApprovedInterviewer(permissions.BasePermission):
    """
    Allows access only to Interviewers who are fully 'APPROVED'.
    Used for functional areas like Slots, Bookings, etc.
    """
    message = "Your account is not approved yet."

    def has_permission(self, request, view):
        if not request.user.is_authenticated or not getattr(request.user, 'is_interviewer', False):
            return False
        
        try:
            return request.user.interviewer_profile.status == 'APPROVED'
        except:
            return False

class CanEditProfile(permissions.BasePermission):
    """
    Allows write access to the profile ONLY if the user is:
    1. 'AWAITING_INFORMATION' (needs to complete onboarding)
    2. 'APPROVED' (maintenance)
    
    Blocks edits if 'PENDING' (under review) or 'REJECTED'.
    """
    message = "You cannot edit your profile while it is under review or rejected."

    def has_object_permission(self, request, view, obj):
        # Always allow GET (Read) requests so they can see their own profile
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check status for Write requests (PUT, PATCH)
        if obj.status in ['AWAITING_INFORMATION', 'APPROVED']:
            return True
        
        return False