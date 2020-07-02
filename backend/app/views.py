import os
import logging
from django.http import HttpResponse
from django.conf import settings
from django.views.generic import View


class ClientView(View):
    """
    View for serving the frontend client static build files
    """

    CLIENT_ENTRY_POINT = os.path.join(settings.FRONTEND_DIR, "build", "index.html")
    BACKEND_STATIC_DIR = os.path.join(settings.BACKEND_DIR, "static")
    feedback_msg = """
                This view is only used for the production version of the client. Make sure the
                client static files have been built and collected into the Django static directory
                before accessing this view.
                """

    def get(self, request):
        # Handle empty server static dir case
        # N.B. .gitkeep file may be present
        if len(os.listdir(self.BACKEND_STATIC_DIR)) <= 1:
            logging.exception("Static file server build files not found!")
            return HttpResponse(self.feedback_msg, status=501)
        else:
            try:
                with open(self.CLIENT_ENTRY_POINT) as page:
                    return HttpResponse(page.read())
            except FileNotFoundError:
                logging.exception("Production build client not found!")
                return HttpResponse(self.feedback_msg, status=501)

