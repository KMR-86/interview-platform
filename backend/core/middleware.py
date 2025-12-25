from django.conf import settings
from django.http import HttpResponse


class CrossOriginOpenerPolicyMiddleware:
    """Ensure responses include the Cross-Origin-Opener-Policy header.

    Also provide a minimal, safe response to CORS preflight (OPTIONS) by
    reflecting the `Origin` header when allowed. This complements
    `django-cors-headers` in environments where the preflight might reach
    other middleware or return an error without CORS headers.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def _apply_cors_headers(self, request, response):
        origin = request.META.get('HTTP_ORIGIN')
        allow_all = getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', False)
        allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', []) or []

        if origin and (allow_all or origin in allowed_origins):
            response['Access-Control-Allow-Origin'] = origin
            if getattr(settings, 'CORS_ALLOW_CREDENTIALS', False):
                response['Access-Control-Allow-Credentials'] = 'true'

            # Methods and headers for preflight
            response.setdefault('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
            request_headers = request.META.get('HTTP_ACCESS_CONTROL_REQUEST_HEADERS')
            if request_headers:
                response['Access-Control-Allow-Headers'] = request_headers
            else:
                response.setdefault('Access-Control-Allow-Headers', 'Authorization, Content-Type')

        return response

    def __call__(self, request):
        # Always let the request pass through so other middleware (notably
        # `corsheaders.middleware.CorsMiddleware`) can run and attach CORS
        # headers on the response. Handling OPTIONS here early prevented
        # CorsMiddleware from setting `Access-Control-Allow-*` headers.
        response = self.get_response(request)

        response.setdefault('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
        response = self._apply_cors_headers(request, response)
        return response
