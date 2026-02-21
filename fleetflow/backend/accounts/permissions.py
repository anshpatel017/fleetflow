from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsManager(BasePermission):
    """Full access for managers."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'manager'


class IsDispatcher(BasePermission):
    """Access for dispatchers (trips management)."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('manager', 'dispatcher')


class IsSafetyOfficer(BasePermission):
    """Access for safety officers (driver management)."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('manager', 'safety_officer')


class IsFinance(BasePermission):
    """Read-only access for finance role."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role == 'manager':
            return True
        if request.user.role == 'finance':
            return request.method in SAFE_METHODS
        return False


class IsManagerOrReadOnly(BasePermission):
    """Manager can write; others can only read."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role == 'manager':
            return True
        return request.method in SAFE_METHODS


class IsSafetyOfficerOrDispatcher(BasePermission):
    """Read access for safety officers and dispatchers (and managers)."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ('manager', 'safety_officer', 'dispatcher')
        )
