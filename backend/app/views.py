from django.views.generic import TemplateView


client_view = TemplateView.as_view(template_name="index.html")
