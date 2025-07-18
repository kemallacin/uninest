// Hata türlerini tanımla
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

// Hata türüne göre sınıflandırma
export const classifyError = (error: Error | string): ErrorType => {
  const message = typeof error === 'string' ? error : error.message.toLowerCase()
  
  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return ErrorType.NETWORK
  }
  
  if (message.includes('auth') || message.includes('login') || message.includes('unauthorized')) {
    return ErrorType.AUTHENTICATION
  }
  
  if (message.includes('permission') || message.includes('forbidden') || message.includes('access denied')) {
    return ErrorType.AUTHORIZATION
  }
  
  if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
    return ErrorType.VALIDATION
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return ErrorType.NOT_FOUND
  }
  
  if (message.includes('server') || message.includes('500') || message.includes('internal')) {
    return ErrorType.SERVER
  }
  
  return ErrorType.UNKNOWN
}

// Kullanıcı dostu hata mesajları
export const getUserFriendlyMessage = (errorType: ErrorType): string => {
  const messages = {
    [ErrorType.NETWORK]: 'Ağ bağlantısı sorunu yaşanıyor. İnternet bağlantınızı kontrol edin.',
    [ErrorType.AUTHENTICATION]: 'Kimlik doğrulama hatası. Lütfen tekrar giriş yapın.',
    [ErrorType.AUTHORIZATION]: 'Bu işlem için yetkiniz bulunmuyor.',
    [ErrorType.VALIDATION]: 'Girilen bilgiler geçersiz. Lütfen kontrol edin.',
    [ErrorType.NOT_FOUND]: 'Aradığınız içerik bulunamadı.',
    [ErrorType.SERVER]: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    [ErrorType.UNKNOWN]: 'Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  }
  
  return messages[errorType]
}

// Hata başlıkları
export const getErrorTitle = (errorType: ErrorType): string => {
  const titles = {
    [ErrorType.NETWORK]: 'Bağlantı Hatası',
    [ErrorType.AUTHENTICATION]: 'Kimlik Doğrulama Hatası',
    [ErrorType.AUTHORIZATION]: 'Yetki Hatası',
    [ErrorType.VALIDATION]: 'Geçersiz Bilgi',
    [ErrorType.NOT_FOUND]: 'İçerik Bulunamadı',
    [ErrorType.SERVER]: 'Sunucu Hatası',
    [ErrorType.UNKNOWN]: 'Bir Hata Oluştu'
  }
  
  return titles[errorType]
}

// Hata ikonları
export const getErrorIcon = (errorType: ErrorType): string => {
  const icons = {
    [ErrorType.NETWORK]: '🌐',
    [ErrorType.AUTHENTICATION]: '🔐',
    [ErrorType.AUTHORIZATION]: '🚫',
    [ErrorType.VALIDATION]: '⚠️',
    [ErrorType.NOT_FOUND]: '🔍',
    [ErrorType.SERVER]: '⚙️',
    [ErrorType.UNKNOWN]: '❌'
  }
  
  return icons[errorType]
}

// Analytics tracking
export const trackError = (error: Error, context?: string) => {
  const errorType = classifyError(error)
  
  console.error('Error tracked:', {
    message: error.message,
    type: errorType,
    context,
    stack: error.stack
  })
  
  // Google Analytics tracking (isteğe bağlı)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      error_type: errorType,
      context
    })
  }
  
  // Sentry tracking (isteğe bağlı)
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      tags: {
        error_type: errorType,
        context
      }
    })
  }
}

// Hata loglama
export const logError = (error: Error | string, context?: string) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error
  const errorType = classifyError(errorObj)
  
  const logData = {
    timestamp: new Date().toISOString(),
    message: errorObj.message,
    type: errorType,
    context,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown'
  }
  
  console.error('Application Error Log:', logData)
  
  // Burada hataları bir log servisine gönderebilirsiniz
  // Örnek: Firebase Analytics, LogRocket, vb.
}

// Hata recovery önerileri
export const getRecoverySuggestions = (errorType: ErrorType): string[] => {
  const suggestions = {
    [ErrorType.NETWORK]: [
      'İnternet bağlantınızı kontrol edin',
      'Sayfayı yenileyin',
      'Daha sonra tekrar deneyin'
    ],
    [ErrorType.AUTHENTICATION]: [
      'Tekrar giriş yapın',
      'Şifrenizi sıfırlayın',
      'Farklı bir tarayıcı deneyin'
    ],
    [ErrorType.AUTHORIZATION]: [
      'Gerekli yetkilere sahip olduğunuzdan emin olun',
      'Yönetici ile iletişime geçin'
    ],
    [ErrorType.VALIDATION]: [
      'Girilen bilgileri kontrol edin',
      'Zorunlu alanları doldurun',
      'Geçerli format kullanın'
    ],
    [ErrorType.NOT_FOUND]: [
      'URL\'yi kontrol edin',
      'Ana sayfaya dönün',
      'Arama yapın'
    ],
    [ErrorType.SERVER]: [
      'Daha sonra tekrar deneyin',
      'Teknik destek ile iletişime geçin'
    ],
    [ErrorType.UNKNOWN]: [
      'Sayfayı yenileyin',
      'Daha sonra tekrar deneyin',
      'Teknik destek ile iletişime geçin'
    ]
  }
  
  return suggestions[errorType]
}

// Hata severity seviyesi
export const getErrorSeverity = (errorType: ErrorType): 'low' | 'medium' | 'high' | 'critical' => {
  const severity = {
    [ErrorType.NETWORK]: 'medium',
    [ErrorType.AUTHENTICATION]: 'medium',
    [ErrorType.AUTHORIZATION]: 'low',
    [ErrorType.VALIDATION]: 'low',
    [ErrorType.NOT_FOUND]: 'low',
    [ErrorType.SERVER]: 'high',
    [ErrorType.UNKNOWN]: 'medium'
  } as const
  
  return severity[errorType]
} 