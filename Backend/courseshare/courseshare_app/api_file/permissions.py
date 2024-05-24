from rest_framework import permissions

class ReadOnlyPermission(permissions.BasePermission):
    def has_permission(self,request,view):
        if request.method in permissions.SAFE_METHODS:
            #read only perms for all
            return True
        else:
            #write only perms only for educator
            return request.user.is_authenticated and request.user.role == 'educator'
        
class UpdatePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            #read only perms for all
            return True
        else:
            return bool(obj.Educator.user == request.user)