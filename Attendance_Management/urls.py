from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from django.views.generic import TemplateView
from .views import index
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),
    url('attendance/', include('AttendanceApp.urls'))

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
