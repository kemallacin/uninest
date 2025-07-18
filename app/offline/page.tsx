'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // İlk kontrol
    checkOnlineStatus()

    // Online/offline event listener'ları
    window.addEventListener('online', checkOnlineStatus)
    window.addEventListener('offline', checkOnlineStatus)

    return () => {
      window.removeEventListener('online', checkOnlineStatus)
      window.removeEventListener('offline', checkOnlineStatus)
    }
  }, [])

  const handleRetry = () => {
    if (isOnline) {
      router.push('/')
    } else {
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Offline Icon */}
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
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          İnternet Bağlantısı Yok
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isOnline 
            ? 'Bağlantınız geri geldi! Ana sayfaya yönlendiriliyorsunuz...'
            : 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.'
          }
        </p>

        {/* Status Indicator */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isOnline 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {isOnline ? 'Ana Sayfaya Git' : 'Tekrar Dene'}
          </button>
          
          {!isOnline && (
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Ana Sayfaya Git
            </button>
          )}
        </div>

        {/* Helpful Tips */}
        {!isOnline && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">İpuçları:</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Wi-Fi bağlantınızı kontrol edin</li>
              <li>• Mobil veri kullanıyorsanız sinyal gücünü kontrol edin</li>
              <li>• Tarayıcınızı yeniden başlatın</li>
              <li>• Farklı bir ağ deneyin</li>
            </ul>
          </div>
        )}

        {/* Cached Content Info */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Bazı içerikler çevrimdışı olarak kullanılabilir</p>
        </div>
      </div>
    </div>
  )
} 