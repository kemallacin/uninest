'use client'

import React, { ReactNode } from 'react'
import { useAuth } from '../lib/auth/AuthContext'
import { UserRole, Permission } from '../lib/auth/roles'

interface PermissionGateProps {
  children: ReactNode
  requiredRole?: UserRole
  requiredPermission?: Permission
  fallback?: ReactNode
  showFallback?: boolean
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  showFallback = false
}) => {
  const { profile, hasPermission, hasRole } = useAuth()

  // Kullanıcı giriş yapmamışsa
  if (!profile) {
    return showFallback ? <>{fallback}</> : null
  }

  // Rol kontrolü
  if (requiredRole && !hasRole(requiredRole)) {
    return showFallback ? <>{fallback}</> : null
  }

  // Permission kontrolü
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return showFallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

export default PermissionGate

// Kısayol component'leri
export const AdminOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate requiredRole={UserRole.ADMIN} fallback={fallback}>
    {children}
  </PermissionGate>
)

export const ModeratorOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate requiredRole={UserRole.MODERATOR} fallback={fallback}>
    {children}
  </PermissionGate>
)

export const AuthenticatedOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate requiredRole={UserRole.USER} fallback={fallback}>
    {children}
  </PermissionGate>
)

export const PremiumOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  const { profile } = useAuth()
  
  if (!profile?.isPremium) {
    return <>{fallback}</> || null
  }
  
  return <>{children}</>
}

// Permission-specific component'ler
export const CanCreateContent: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate requiredPermission={Permission.CREATE_CONTENT} fallback={fallback}>
    {children}
  </PermissionGate>
)

export const CanEditContent: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate requiredPermission={Permission.EDIT_CONTENT} fallback={fallback}>
    {children}
  </PermissionGate>
)

export const CanDeleteContent: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate requiredPermission={Permission.DELETE_CONTENT} fallback={fallback}>
    {children}
  </PermissionGate>
)

export const CanApproveContent: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate requiredPermission={Permission.APPROVE_CONTENT} fallback={fallback}>
    {children}
  </PermissionGate>
)

export const CanAccessAdminPanel: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate requiredPermission={Permission.ACCESS_ADMIN_PANEL} fallback={fallback}>
    {children}
  </PermissionGate>
) 