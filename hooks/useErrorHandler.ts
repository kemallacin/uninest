import { useState, useCallback } from 'react'
import { useToast } from '../components/ToastProvider'
import { 
  classifyError, 
  getUserFriendlyMessage, 
  getErrorTitle, 
  trackError, 
  logError,
  getRecoverySuggestions,
  ErrorType 
} from '../lib/errorUtils'

interface ErrorState {
  hasError: boolean
  error: Error | null
  errorType: ErrorType | null
  context: string | null
}

interface UseErrorHandlerOptions {
  showToast?: boolean
  trackAnalytics?: boolean
  logToConsole?: boolean
  autoRecover?: boolean
  recoveryDelay?: number
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const {
    showToast = true,
    trackAnalytics = true,
    logToConsole = true,
    autoRecover = false,
    recoveryDelay = 5000
  } = options

  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorType: null,
    context: null
  })

  const { showToast: showToastMessage } = useToast()

  // Hata yakalama
  const handleError = useCallback((
    error: Error | string, 
    context?: string,
    customMessage?: string
  ) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error
    const errorType = classifyError(errorObj)
    const userMessage = customMessage || getUserFriendlyMessage(errorType)

    // State'i güncelle
    setErrorState({
      hasError: true,
      error: errorObj,
      errorType,
      context: context || null
    })

    // Console'a logla
    if (logToConsole) {
      logError(errorObj, context)
    }

    // Analytics tracking
    if (trackAnalytics) {
      trackError(errorObj, context)
    }

    // Toast mesajı göster
    if (showToast) {
      showToastMessage(userMessage, 'error')
    }

    // Otomatik recovery
    if (autoRecover && errorType !== ErrorType.AUTHENTICATION && errorType !== ErrorType.AUTHORIZATION) {
      setTimeout(() => {
        clearError()
      }, recoveryDelay)
    }

    return {
      errorType,
      userMessage,
      suggestions: getRecoverySuggestions(errorType)
    }
  }, [showToast, trackAnalytics, logToConsole, autoRecover, recoveryDelay, showToastMessage])

  // Hata temizleme
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorType: null,
      context: null
    })
  }, [])

  // Async fonksiyon wrapper
  const withErrorHandler = useCallback(<T extends any[], R>(
    asyncFn: (...args: T) => Promise<R>,
    context?: string
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        return await asyncFn(...args)
      } catch (error) {
        handleError(error as Error, context)
        return null
      }
    }
  }, [handleError])

  // Retry mekanizması
  const retryOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
    context?: string
  ): Promise<T | null> => {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          handleError(error as Error, context, `İşlem ${maxRetries} deneme sonrası başarısız oldu`)
          return null
        }

        // Retry öncesi bekle
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
        
        // Retry mesajı göster
        if (showToast) {
          showToastMessage(`Yeniden deneniyor... (${attempt}/${maxRetries})`, 'info')
        }
      }
    }

    return null
  }, [handleError, showToast, showToastMessage])

  // Network error kontrolü
  const isNetworkError = useCallback((error: Error | string): boolean => {
    const errorType = classifyError(error)
    return errorType === ErrorType.NETWORK
  }, [])

  // Auth error kontrolü
  const isAuthError = useCallback((error: Error | string): boolean => {
    const errorType = classifyError(error)
    return errorType === ErrorType.AUTHENTICATION
  }, [])

  // Validation error kontrolü
  const isValidationError = useCallback((error: Error | string): boolean => {
    const errorType = classifyError(error)
    return errorType === ErrorType.VALIDATION
  }, [])

  return {
    // State
    hasError: errorState.hasError,
    error: errorState.error,
    errorType: errorState.errorType,
    context: errorState.context,
    
    // Actions
    handleError,
    clearError,
    withErrorHandler,
    retryOperation,
    
    // Utilities
    isNetworkError,
    isAuthError,
    isValidationError,
    
    // Error info
    getErrorInfo: () => errorState.error ? {
      type: errorState.errorType,
      title: errorState.errorType ? getErrorTitle(errorState.errorType) : 'Bilinmeyen Hata',
      message: getUserFriendlyMessage(errorState.errorType || ErrorType.UNKNOWN),
      suggestions: errorState.errorType ? getRecoverySuggestions(errorState.errorType) : []
    } : null
  }
}

// Kullanım örnekleri:
/*
const MyComponent = () => {
  const { handleError, withErrorHandler, retryOperation, hasError, error } = useErrorHandler({
    showToast: true,
    trackAnalytics: true,
    autoRecover: true
  })

  const fetchData = withErrorHandler(async () => {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('Veri yüklenemedi')
    return response.json()
  }, 'data-fetch')

  const handleSubmit = async () => {
    const result = await retryOperation(
      () => submitForm(),
      3,
      1000,
      'form-submit'
    )
    
    if (result) {
      // Başarılı
    }
  }

  if (hasError) {
    return <ErrorDisplay error={error} />
  }

  return <div>...</div>
}
*/ 