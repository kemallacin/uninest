'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { UserRole, Permission, hasPermission, hasRole, canManageRole } from './roles'

interface UserProfile {
  id: string
  email: string
  displayName?: string
  role: UserRole
  isEmailVerified: boolean
  createdAt: Date
  lastLoginAt: Date
  isPremium: boolean
  isBanned: boolean
  banReason?: string
  permissions: Permission[]
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: UserRole) => boolean
  canManageRole: (targetRole: UserRole) => boolean
  refreshProfile: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Kullanıcı profili çek
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, 'users', userId)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        const data = userSnap.data()
        return {
          id: userSnap.id,
          email: data.email || '',
          displayName: data.displayName || '',
          role: data.role || UserRole.USER,
          isEmailVerified: data.isEmailVerified || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          isPremium: data.isPremium || false,
          isBanned: data.isBanned || false,
          banReason: data.banReason || '',
          permissions: data.permissions || []
        }
      }
      return null
    } catch (error) {
      console.error('Kullanıcı profili çekme hatası:', error)
      return null
    }
  }

  // Profil güncelle
  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('Kullanıcı giriş yapmamış')
    
    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      })
      
      // Profili yenile
      await refreshProfile()
    } catch (error) {
      console.error('Profil güncelleme hatası:', error)
      throw error
    }
  }

  // Profili yenile
  const refreshProfile = async (): Promise<void> => {
    if (!user) return
    
    const userProfile = await fetchUserProfile(user.uid)
    setProfile(userProfile)
  }

  // Permission kontrol
  const checkPermission = (permission: Permission): boolean => {
    if (!profile) return false
    return hasPermission(profile.role, permission)
  }

  // Rol kontrol
  const checkRole = (role: UserRole): boolean => {
    if (!profile) return false
    return hasRole(profile.role, role)
  }

  // Rol yönetim kontrol
  const checkCanManageRole = (targetRole: UserRole): boolean => {
    if (!profile) return false
    return canManageRole(profile.role, targetRole)
  }

  useEffect(() => {
    let profileUnsubscribe: (() => void) | undefined;
    
    console.log('🔐 AuthContext - Auth state listener başlatılıyor...');
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        console.log('🔐 AuthContext - Auth state değişti:', currentUser ? 'Giriş yapıldı' : 'Çıkış yapıldı');
        console.log('🔐 AuthContext - User ID:', currentUser?.uid);
        console.log('🔐 AuthContext - Email:', currentUser?.email);
        
        setUser(currentUser)
        
        if (currentUser) {
          console.log('🔍 AuthContext - Kullanıcı profili çekiliyor...');
          // Kullanıcı profili çek
          const userProfile = await fetchUserProfile(currentUser.uid)
          console.log('📋 AuthContext - Çekilen profil:', userProfile);
          setProfile(userProfile)
          
          // Real-time profil güncellemelerini dinle
          const userRef = doc(db, 'users', currentUser.uid)
          profileUnsubscribe = onSnapshot(userRef, (doc) => {
            console.log('📡 AuthContext - Profil güncellendi:', doc.exists());
            if (doc.exists()) {
              const data = doc.data()
              console.log('📋 AuthContext - Profil verisi:', data);
              setProfile({
                id: doc.id,
                email: data.email || '',
                displayName: data.displayName || '',
                role: data.role || UserRole.USER,
                isEmailVerified: data.isEmailVerified || false,
                createdAt: data.createdAt?.toDate() || new Date(),
                lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
                isPremium: data.isPremium || false,
                isBanned: data.isBanned || false,
                banReason: data.banReason || '',
                permissions: data.permissions || []
              })
            } else {
              console.log('❌ AuthContext - Kullanıcı profili bulunamadı!');
            }
          }, (error) => {
            console.error('❌ AuthContext - Profil dinleme hatası:', error)
            setLoading(false)
          })
        } else {
          console.log('🔕 AuthContext - Kullanıcı çıkış yaptı, profil temizleniyor');
          setProfile(null)
        }
      } catch (error) {
        console.error('❌ AuthContext - Auth state değişikliği hatası:', error)
        setProfile(null)
      } finally {
        console.log('✅ AuthContext - Loading durumu false yapılıyor');
        setLoading(false)
      }
    }, (error) => {
      console.error('❌ AuthContext - Auth state listener hatası:', error)
      setUser(null)
      setProfile(null)
      setLoading(false)
    })

    return () => {
      console.log('🔕 AuthContext - Auth listeners temizleniyor');
      unsubscribe()
      if (profileUnsubscribe) {
        profileUnsubscribe()
      }
    }
  }, [])

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isAuthenticated: !!user && !!profile,
    hasPermission: checkPermission,
    hasRole: checkRole,
    canManageRole: checkCanManageRole,
    refreshProfile,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Kısayol hook'ları
export const useUser = () => {
  const { user, profile } = useAuth()
  return { user, profile }
}

export const usePermissions = () => {
  const { hasPermission, hasRole, canManageRole } = useAuth()
  return { hasPermission, hasRole, canManageRole }
}

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
} 