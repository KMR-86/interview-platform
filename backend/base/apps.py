from django.apps import AppConfig


class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'base'
    
    def ready(self):
        # Monkeypatch for older/newer django-allauth compatibility.
        try:
            from allauth.socialaccount.providers.google.provider import GoogleProvider

            if not hasattr(GoogleProvider, 'get_scope_from_request'):
                def get_scope_from_request(self, request, *args, **kwargs):
                    # Fallback to existing get_scope if explicit method missing
                    if hasattr(self, 'get_scope'):
                        return self.get_scope()
                    return []

                setattr(GoogleProvider, 'get_scope_from_request', get_scope_from_request)
        except Exception:
            # If import fails (package not installed yet) or other error, skip patching.
            pass
