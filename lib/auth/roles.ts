// Rol ve Permission sistemi

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum Permission {
  // Kullanıcı yönetimi
  VIEW_USERS = 'view_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  MANAGE_ROLES = 'manage_roles',
  
  // İçerik yönetimi
  VIEW_CONTENT = 'view_content',
  CREATE_CONTENT = 'create_content',
  EDIT_CONTENT = 'edit_content',
  DELETE_CONTENT = 'delete_content',
  APPROVE_CONTENT = 'approve_content',
  
  // İlan yönetimi
  VIEW_LISTINGS = 'view_listings',
  CREATE_LISTINGS = 'create_listings',
  EDIT_LISTINGS = 'edit_listings',
  DELETE_LISTINGS = 'delete_listings',
  APPROVE_LISTINGS = 'approve_listings',
  
  // Etkinlik yönetimi
  VIEW_EVENTS = 'view_events',
  CREATE_EVENTS = 'create_events',
  EDIT_EVENTS = 'edit_events',
  DELETE_EVENTS = 'delete_events',
  APPROVE_EVENTS = 'approve_events',
  
  // Not yönetimi
  VIEW_NOTES = 'view_notes',
  CREATE_NOTES = 'create_notes',
  EDIT_NOTES = 'edit_notes',
  DELETE_NOTES = 'delete_notes',
  APPROVE_NOTES = 'approve_notes',
  
  // Ev arkadaşı yönetimi
  VIEW_ROOMMATES = 'view_roommates',
  CREATE_ROOMMATES = 'create_roommates',
  EDIT_ROOMMATES = 'edit_roommates',
  DELETE_ROOMMATES = 'delete_roommates',
  APPROVE_ROOMMATES = 'approve_roommates',
  
  // Admin paneli
  ACCESS_ADMIN_PANEL = 'access_admin_panel',
  VIEW_ADMIN_REPORTS = 'view_admin_reports',
  MANAGE_SYSTEM_SETTINGS = 'manage_system_settings',
  
  // Premium özellikler
  ACCESS_PREMIUM_FEATURES = 'access_premium_features',
  CREATE_PREMIUM_CONTENT = 'create_premium_content',
  
  // Sistem yönetimi
  MANAGE_SYSTEM = 'manage_system',
  VIEW_LOGS = 'view_logs',
  MANAGE_BACKUPS = 'manage_backups'
}

// Rol-Permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [
    Permission.VIEW_CONTENT,
    Permission.VIEW_LISTINGS,
    Permission.VIEW_EVENTS,
    Permission.VIEW_NOTES,
    Permission.VIEW_ROOMMATES
  ],
  
  [UserRole.USER]: [
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.VIEW_LISTINGS,
    Permission.CREATE_LISTINGS,
    Permission.EDIT_LISTINGS,
    Permission.DELETE_LISTINGS,
    Permission.VIEW_EVENTS,
    Permission.CREATE_EVENTS,
    Permission.EDIT_EVENTS,
    Permission.DELETE_EVENTS,
    Permission.VIEW_NOTES,
    Permission.CREATE_NOTES,
    Permission.EDIT_NOTES,
    Permission.DELETE_NOTES,
    Permission.VIEW_ROOMMATES,
    Permission.CREATE_ROOMMATES,
    Permission.EDIT_ROOMMATES,
    Permission.DELETE_ROOMMATES,
    Permission.ACCESS_PREMIUM_FEATURES
  ],
  
  [UserRole.MODERATOR]: [
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.APPROVE_CONTENT,
    Permission.VIEW_LISTINGS,
    Permission.CREATE_LISTINGS,
    Permission.EDIT_LISTINGS,
    Permission.DELETE_LISTINGS,
    Permission.APPROVE_LISTINGS,
    Permission.VIEW_EVENTS,
    Permission.CREATE_EVENTS,
    Permission.EDIT_EVENTS,
    Permission.DELETE_EVENTS,
    Permission.APPROVE_EVENTS,
    Permission.VIEW_NOTES,
    Permission.CREATE_NOTES,
    Permission.EDIT_NOTES,
    Permission.DELETE_NOTES,
    Permission.APPROVE_NOTES,
    Permission.VIEW_ROOMMATES,
    Permission.CREATE_ROOMMATES,
    Permission.EDIT_ROOMMATES,
    Permission.DELETE_ROOMMATES,
    Permission.APPROVE_ROOMMATES,
    Permission.ACCESS_ADMIN_PANEL,
    Permission.VIEW_ADMIN_REPORTS,
    Permission.VIEW_USERS,
    Permission.ACCESS_PREMIUM_FEATURES,
    Permission.CREATE_PREMIUM_CONTENT
  ],
  
  [UserRole.ADMIN]: [
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.APPROVE_CONTENT,
    Permission.VIEW_LISTINGS,
    Permission.CREATE_LISTINGS,
    Permission.EDIT_LISTINGS,
    Permission.DELETE_LISTINGS,
    Permission.APPROVE_LISTINGS,
    Permission.VIEW_EVENTS,
    Permission.CREATE_EVENTS,
    Permission.EDIT_EVENTS,
    Permission.DELETE_EVENTS,
    Permission.APPROVE_EVENTS,
    Permission.VIEW_NOTES,
    Permission.CREATE_NOTES,
    Permission.EDIT_NOTES,
    Permission.DELETE_NOTES,
    Permission.APPROVE_NOTES,
    Permission.VIEW_ROOMMATES,
    Permission.CREATE_ROOMMATES,
    Permission.EDIT_ROOMMATES,
    Permission.DELETE_ROOMMATES,
    Permission.APPROVE_ROOMMATES,
    Permission.ACCESS_ADMIN_PANEL,
    Permission.VIEW_ADMIN_REPORTS,
    Permission.VIEW_USERS,
    Permission.EDIT_USERS,
    Permission.DELETE_USERS,
    Permission.MANAGE_ROLES,
    Permission.MANAGE_SYSTEM_SETTINGS,
    Permission.ACCESS_PREMIUM_FEATURES,
    Permission.CREATE_PREMIUM_CONTENT,
    Permission.VIEW_LOGS
  ],
  
  [UserRole.SUPER_ADMIN]: [
    // Tüm permissionlar
    ...Object.values(Permission)
  ]
};

// Rol hiyerarşisi
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.GUEST]: 0,
  [UserRole.USER]: 1,
  [UserRole.MODERATOR]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPER_ADMIN]: 4
};

// Rol kontrol fonksiyonları
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission);
};

export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const canManageRole = (userRole: UserRole, targetRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole];
};

// Rol adları (Türkçe)
export const ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.GUEST]: 'Misafir',
  [UserRole.USER]: 'Kullanıcı',
  [UserRole.MODERATOR]: 'Moderatör',
  [UserRole.ADMIN]: 'Yönetici',
  [UserRole.SUPER_ADMIN]: 'Süper Yönetici'
};

// Rol renkleri
export const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.GUEST]: 'bg-gray-100 text-gray-800',
  [UserRole.USER]: 'bg-blue-100 text-blue-800',
  [UserRole.MODERATOR]: 'bg-yellow-100 text-yellow-800',
  [UserRole.ADMIN]: 'bg-red-100 text-red-800',
  [UserRole.SUPER_ADMIN]: 'bg-purple-100 text-purple-800'
};

// Rol açıklamaları
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.GUEST]: 'Sadece içerik görüntüleme',
  [UserRole.USER]: 'Temel kullanıcı yetkileri',
  [UserRole.MODERATOR]: 'İçerik moderasyon yetkileri',
  [UserRole.ADMIN]: 'Tam yönetim yetkileri',
  [UserRole.SUPER_ADMIN]: 'Sistem geneli tam yetki'
}; 