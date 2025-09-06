from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok"})
# backend/api/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import CustomUserDetailsSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Test endpoint to verify user data is returned correctly
    """
    serializer = CustomUserDetailsSerializer(request.user)
    return Response({
        "user": serializer.data,
        "auth_method": "Token authentication working"
    })