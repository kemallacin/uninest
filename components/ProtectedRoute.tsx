'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, reload } from 'firebase/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireEmailVerification?: boolean
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireEmailVerification = true,
  redirectTo = '/giris'
}) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        
        // Kullanıcı bilgilerini yenile
        await reload(currentUser)
        
        if (currentUser.emailVerified) {
          setIsVerified(true)
        }
      } else {
        setUser(null)
        setIsVerified(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!loading) {
      // Giriş gerekiyorsa ve kullanıcı giriş yapmamışsa
      if (requireAuth && !user) {
        router.push(redirectTo)
        return
      }

      // E-posta doğrulama gerekiyorsa ve doğrulanmamışsa
      if (requireAuth && requireEmailVerification && user && !isVerified) {
        router.push('/email-verification')
        return
      }
    }
  }, [loading, user, isVerified, requireAuth, requireEmailVerification, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Giriş gerekiyorsa ve kullanıcı giriş yapmamışsa
  if (requireAuth && !user) {
    return null // Router zaten yönlendiriyor
  }

  // E-posta doğrulama gerekiyorsa ve doğrulanmamışsa
  if (requireAuth && requireEmailVerification && user && !isVerified) {
    return null // Router zaten yönlendiriyor
  }

  return <>{children}</>
}

export default ProtectedRoute 