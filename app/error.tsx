'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  // Hata analitiklerini gönder
  useEffect(() => {
    if (error) {
      console.error('Application Error:', error)
      
      // Analytics tracking (isteğe bağlı)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: true
        })
      }
    }
  }, [error])

  // Hata türüne göre mesaj belirle
  const getErrorMessage = (error: Error) => {
    if (error.message.includes('fetch')) {
      return 'Ağ bağlantısı sorunu yaşanıyor. İnternet bağlantınızı kontrol edin.'
    }
    if (error.message.includes('auth')) {
      return 'Kimlik doğrulama hatası. Lütfen tekrar giriş yapın.'
    }
    if (error.message.includes('permission')) {
      return 'Bu işlem için yetkiniz bulunmuyor.'
    }
    return 'Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  }

  const getErrorTitle = (error: Error) => {
    if (error.message.includes('fetch')) {
      return 'Bağlantı Hatası'
    }
    if (error.message.includes('auth')) {
      return 'Kimlik Doğrulama Hatası'
    }
    if (error.message.includes('permission')) {
      return 'Yetki Hatası'
    }
    return 'Bir Hata Oluştu'
  }

  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-yellow-900 to-slate-900 text-white px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="text-8xl font-black mb-4 text-red-400">500</div>
            <h1 className="text-3xl font-bold mb-4">{getErrorTitle(error)}</h1>
            <p className="text-lg text-gray-300 mb-6">{getErrorMessage(error)}</p>
          </div>

          {/* Hata detayları (sadece development'ta) */}
          {process.env.NODE_ENV === 'development' && error?.message && (
            <details className="mb-8 text-left bg-red-950/50 rounded-lg p-4">
              <summary className="cursor-pointer text-sm text-red-200 hover:text-red-100 font-medium mb-2">
                🔍 Hata Detayları (Geliştirici Modu)
              </summary>
              <pre className="text-sm text-red-200 bg-red-950/30 rounded p-3 overflow-x-auto whitespace-pre-wrap">
                {error.message}
              </pre>
              {error.stack && (
                <pre className="text-xs text-red-300 bg-red-950/20 rounded p-2 mt-2 overflow-x-auto whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </details>
          )}

          {/* Aksiyon butonları */}
          <div className="space-y-4">
            <button 
              onClick={() => reset()} 
              className="w-full sm:w-auto px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-xl text-lg shadow-lg hover:bg-yellow-300 transition-all duration-200 transform hover:scale-105"
            >
              🔄 Tekrar Dene
            </button>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/" 
                className="px-6 py-3 bg-white/10 text-yellow-300 font-bold rounded-xl text-lg shadow-lg hover:bg-white/20 transition-all duration-200"
              >
                🏠 Ana Sayfaya Dön
              </a>
              
              <button 
                onClick={() => window.history.back()} 
                className="px-6 py-3 bg-white/5 text-gray-300 font-bold rounded-xl text-lg shadow-lg hover:bg-white/10 transition-all duration-200"
              >
                ⬅️ Geri Dön
              </button>
            </div>
          </div>

          {/* Yardım linkleri */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-4">Hala sorun yaşıyorsanız:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a href="/sss" className="text-yellow-300 hover:text-yellow-200 transition-colors">
                ❓ SSS
              </a>
              <a href="/iletisim" className="text-yellow-300 hover:text-yellow-200 transition-colors">
                📧 İletişim
              </a>
              <a href="/rehber" className="text-yellow-300 hover:text-yellow-200 transition-colors">
                📖 Rehber
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}