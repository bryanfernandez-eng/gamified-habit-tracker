from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root(_request):
    return JsonResponse({
        "name": "Gamified Habit Tracker API",
        "health": "/api/health/",
        "auth": {
            "login": "/auth/login/",
            "logout": "/auth/logout/",
            "registration": "/auth/registration/"
        },
        "docs": None  # plug in DRF Spectacular/Swagger later
    })

urlpatterns = [
    path("", root),  # <— add this line
    path("admin/", admin.site.urls),
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/", include("api.urls")),
]
