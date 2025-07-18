'use client'

import { useAuth } from '../../lib/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function BannedPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Eğer kullanıcı banlanmamışsa ana sayfaya yönlendir
    if (!loading && profile && !profile.isBanned) {
      router.push('/')
    }
  }, [profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!profile?.isBanned) {
    return null // Router zaten yönlendiriyor
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Ban Icon */}
        <div className="mb-6">
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
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Hesabınız Yasaklandı
        </h1>
        
        <p className="text-gray-600 mb-6">
          Hesabınız platform kurallarını ihlal ettiği için geçici olarak yasaklanmıştır.
        </p>

        {/* Ban Reason */}
        {profile.banReason && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-900 mb-2">Yasaklama Nedeni:</h3>
            <p className="text-sm text-red-800">{profile.banReason}</p>
          </div>
        )}

        {/* User Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Hesap Bilgileri:</h3>
          <div className="text-sm text-gray-600">
            <p>E-posta: {profile.email}</p>
            <p>Rol: {profile.role}</p>
            <p>Kayıt Tarihi: {profile.createdAt.toLocaleDateString('tr-TR')}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Durumu Kontrol Et
          </button>
          
          <button
            onClick={() => router.push('/contact')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            İtiraz Et
          </button>
        </div>

        {/* Help */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Yardım:</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• Yasaklama süreniz dolduğunda hesabınız otomatik olarak açılacaktır</li>
            <li>• İtiraz etmek için destek ekibimizle iletişime geçebilirsiniz</li>
            <li>• Platform kurallarını tekrar gözden geçirmenizi öneririz</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Destek: support@uninestcy.com</p>
          <p>Telefon: +90 XXX XXX XX XX</p>
        </div>
      </div>
    </div>
  )
} 