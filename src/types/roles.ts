export type UserRole = 'super_admin' | 'admin' | 'user';

export interface Permission {
  id: string;
  name: string;
  description: string;
  scope: 'global' | 'limited';
}

export interface RolePermissions {
  super_admin: Permission[];
  admin: Permission[];
  user: Permission[];
}

export const DEFAULT_PERMISSIONS: RolePermissions = {
  super_admin: [
    { id: 'manage_admins', name: 'Manage Admins', description: 'Create and manage admin accounts', scope: 'global' },
    { id: 'manage_settings', name: 'Manage Settings', description: 'Modify system settings', scope: 'global' },
    { id: 'view_analytics', name: 'View Analytics', description: 'Access all analytics data', scope: 'global' },
    { id: 'manage_users', name: 'Manage Users', description: 'Full user management access', scope: 'global' },
  ],
  admin: [
    { id: 'view_analytics', name: 'View Analytics', description: 'Access analytics data', scope: 'limited' },
    { id: 'manage_users', name: 'Manage Users', description: 'Limited user management', scope: 'limited' },
    { id: 'manage_content', name: 'Manage Content', description: 'Content management access', scope: 'limited' },
  ],
  user: [
    { id: 'chat_access', name: 'Chat Access', description: 'Access to chat features', scope: 'limited' },
    { id: 'profile_management', name: 'Profile Management', description: 'Manage own profile', scope: 'limited' },
  ]
};