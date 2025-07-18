'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Hata bilgilerini state'e kaydet
    this.setState({ errorInfo })
    
    // Custom error handler çağır
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Analytics tracking (isteğe bağlı)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        component: errorInfo.componentStack
      })
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleGoBack = () => {
    window.history.back()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            {/* Hata ikonu */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            {/* Hata başlığı */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bir Hata Oluştu
            </h2>
            
            {/* Hata açıklaması */}
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Üzgünüz, beklenmeyen bir hata oluştu. Bu sorun geçici olabilir. 
              Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>

            {/* Hata detayları (development modunda) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-8 text-left bg-red-50 border border-red-200 rounded-lg p-4">
                <summary className="cursor-pointer text-sm text-red-700 hover:text-red-800 font-medium mb-3">
                  🔍 Hata Detayları (Geliştirici Modu)
                </summary>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-red-800 mb-1">Hata Mesajı:</h4>
                    <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto whitespace-pre-wrap">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-800 mb-1">Component Stack:</h4>
                      <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Aksiyon butonları */}
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🔄 Tekrar Dene
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  🏠 Ana Sayfaya Dön
                </button>
                <button
                  onClick={this.handleGoBack}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  ⬅️ Geri Dön
                </button>
              </div>
            </div>

            {/* Yardım linkleri */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Hala sorun yaşıyorsanız:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a href="/sss" className="text-blue-600 hover:text-blue-700 transition-colors">
                  ❓ SSS
                </a>
                <a href="/iletisim" className="text-blue-600 hover:text-blue-700 transition-colors">
                  📧 İletişim
                </a>
                <a href="/rehber" className="text-blue-600 hover:text-blue-700 transition-colors">
                  📖 Rehber
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 