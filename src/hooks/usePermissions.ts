import { useAuth } from './useAuth';
import { DEFAULT_PERMISSIONS, Permission, UserRole } from '../types/roles';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permissionId: string): boolean => {
    if (!user?.role) return false;

    const rolePermissions = DEFAULT_PERMISSIONS[user.role as UserRole];
    return rolePermissions.some(permission => permission.id === permissionId);
  };

  const getPermissions = (): Permission[] => {
    if (!user?.role) return [];
    return DEFAULT_PERMISSIONS[user.role as UserRole] || [];
  };

  const isSuperAdmin = (): boolean => user?.role === 'super_admin';
  const isAdmin = (): boolean => user?.role === 'admin' || user?.role === 'super_admin';

  return {
    hasPermission,
    getPermissions,
    isSuperAdmin,
    isAdmin
  };
};