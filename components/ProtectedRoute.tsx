'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/auth/AuthContext'
import { UserRole, Permission } from '../lib/auth/roles'
import LoadingSpinner from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireEmailVerification?: boolean
  requiredRole?: UserRole
  requiredPermission?: Permission
  redirectTo?: string
  fallback?: React.ReactNode
  showLoading?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireEmailVerification = true,
  requiredRole,
  requiredPermission,
  redirectTo = '/giris',
  fallback,
  showLoading = true
}) => {
  const { user, profile, loading, isAuthenticated, hasPermission, hasRole } = useAuth()
  const [accessDenied, setAccessDenied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Giriş kontrolü
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
        return
      }

      // E-posta doğrulama kontrolü
      if (requireAuth && requireEmailVerification && profile && !profile.isEmailVerified) {
        router.push('/email-verification')
        return
      }

      // Ban kontrolü
      if (profile && profile.isBanned) {
        router.push('/banned')
        return
      }

      // Rol kontrolü
      if (requiredRole && profile && !hasRole(requiredRole)) {
        setAccessDenied(true)
        return
      }

      // Permission kontrolü
      if (requiredPermission && profile && !hasPermission(requiredPermission)) {
        setAccessDenied(true)
        return
      }

      setAccessDenied(false)
    }
  }, [
    loading,
    isAuthenticated,
    profile,
    requireAuth,
    requireEmailVerification,
    requiredRole,
    requiredPermission,
    hasRole,
    hasPermission,
    redirectTo,
    router
  ])

  // Loading durumu
  if (loading && showLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Yetkilendirme kontrol ediliyor..." />
      </div>
    )
  }

  // Erişim reddedildi
  if (accessDenied) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-10 h-10 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Erişim Reddedildi
          </h1>
          
          <p className="text-gray-600 mb-6">
            {requiredRole && `Bu sayfaya erişmek için ${requiredRole} rolüne sahip olmanız gerekiyor.`}
            {requiredPermission && `Bu sayfaya erişmek için ${requiredPermission} yetkisine sahip olmanız gerekiyor.`}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Geri Dön
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Ana Sayfaya Git
            </button>
          </div>

          {profile && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Mevcut Yetkileriniz:</h3>
              <div className="text-sm text-blue-800">
                <p>Rol: {profile.role}</p>
                <p>E-posta: {profile.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Giriş gerekiyorsa ve kullanıcı giriş yapmamışsa
  if (requireAuth && !isAuthenticated) {
    return null // Router zaten yönlendiriyor
  }

  // E-posta doğrulama gerekiyorsa ve doğrulanmamışsa
  if (requireAuth && requireEmailVerification && profile && !profile.isEmailVerified) {
    return null // Router zaten yönlendiriyor
  }

  return <>{children}</>
}

export default ProtectedRoute 