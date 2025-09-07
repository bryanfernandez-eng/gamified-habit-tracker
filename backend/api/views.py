from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import (
    CustomUserDetailsSerializer, 
    AdminUserListSerializer, 
    AdminUserCreateSerializer, 
    AdminUserUpdateSerializer
)

User = get_user_model()

# Custom permission class for superuser access
class IsSuperUser(BasePermission):
    """
    Custom permission to only allow superusers.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser

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

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for admin user management - requires superuser access
    """
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = [IsSuperUser]  # Changed from IsAdminUser to IsSuperUser
    
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return AdminUserListSerializer
        elif self.action == 'create':
            return AdminUserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AdminUserUpdateSerializer
        return AdminUserListSerializer
    
    def destroy(self, request, *args, **kwargs):
        """
        Custom delete method to prevent admin from deleting themselves
        """
        user_to_delete = self.get_object()
        
        # Prevent admin from deleting themselves
        if user_to_delete.id == request.user.id:
            return Response(
                {"error": "You cannot delete your own account."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prevent deleting the last superuser
        if user_to_delete.is_superuser and User.objects.filter(is_superuser=True).count() <= 1:
            return Response(
                {"error": "Cannot delete the last superuser account."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().destroy(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        """
        Custom update method with additional validation
        """
        user_to_update = self.get_object()
        
        # Prevent admin from removing their own superuser status if they're the last one
        if (user_to_update.id == request.user.id and 
            user_to_update.is_superuser and 
            not request.data.get('is_superuser', True) and
            User.objects.filter(is_superuser=True).count() <= 1):
            return Response(
                {"error": "Cannot remove superuser status from the last superuser account."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get user statistics for admin dashboard
        """
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        admin_users = User.objects.filter(is_superuser=True).count()
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': total_users - active_users,
            'admin_users': admin_users,
        })