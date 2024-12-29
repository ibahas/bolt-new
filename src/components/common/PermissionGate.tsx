import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

interface Props {
  permissionId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<Props> = ({ 
  permissionId, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permissionId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};