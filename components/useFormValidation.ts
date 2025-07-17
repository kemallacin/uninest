'use client'

import { useState, useCallback } from 'react'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
  email?: boolean
  phone?: boolean
  price?: boolean
  age?: boolean
  url?: boolean
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  // E-posta validasyonu
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Telefon validasyonu (Türkiye/Kıbrıs formatı)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+90|90|0)?[5][0-9]{9}$|^(\+357|357|0)?[9][0-9]{7}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  // Fiyat validasyonu
  const validatePrice = (price: string): boolean => {
    const priceRegex = /^\d+(\.\d{1,2})?$/
    const numPrice = parseFloat(price)
    return priceRegex.test(price) && numPrice > 0 && numPrice <= 1000000
  }

  // Yaş validasyonu
  const validateAge = (age: string): boolean => {
    const numAge = parseInt(age)
    return numAge >= 16 && numAge <= 100
  }

  // URL validasyonu
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // XSS koruması için input temizleme
  const sanitizeInput = (input: string, name?: string): string => {
    if (name === 'aciklama') {
      // Sadece script ve iframe taglerini temizle, boşluk ve satırları koru
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    }
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  // Tek bir alanı validate et
  const validateField = useCallback((name: string, value: any): string => {
    const rule = rules[name]
    if (!rule) return ''

    const stringValue = String(value || '').trim()

    // Required kontrolü
    if (rule.required && !stringValue) {
      return 'Bu alan zorunludur'
    }

    // Boş değer kontrolü (required değilse)
    if (!stringValue) return ''

    // Min length kontrolü
    if (rule.minLength && stringValue.length < rule.minLength) {
      return `En az ${rule.minLength} karakter olmalıdır`
    }

    // Max length kontrolü
    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return `En fazla ${rule.maxLength} karakter olmalıdır`
    }

    // Pattern kontrolü
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return 'Geçersiz format'
    }

    // E-posta kontrolü
    if (rule.email && !validateEmail(stringValue)) {
      return 'Geçerli bir e-posta adresi giriniz'
    }

    // Telefon kontrolü
    if (rule.phone && !validatePhone(stringValue)) {
      return 'Geçerli bir telefon numarası giriniz'
    }

    // Fiyat kontrolü
    if (rule.price && !validatePrice(stringValue)) {
      return 'Geçerli bir fiyat giriniz (0-1.000.000 TL)'
    }

    // Yaş kontrolü
    if (rule.age && !validateAge(stringValue)) {
      return 'Yaş 16-100 arasında olmalıdır'
    }

    // URL kontrolü
    if (rule.url && !validateUrl(stringValue)) {
      return 'Geçerli bir URL giriniz'
    }

    // Custom kontrolü
    if (rule.custom) {
      const customResult = rule.custom(stringValue)
      if (typeof customResult === 'string') {
        return customResult
      }
      if (!customResult) {
        return 'Geçersiz değer'
      }
    }

    return ''
  }, [rules])

  // Tüm formu validate et
  const validateForm = useCallback((values: { [key: string]: any }): ValidationErrors => {
    const newErrors: ValidationErrors = {}
    
    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
      }
    })

    setErrors(newErrors)
    return newErrors
  }, [rules, validateField])

  // Alan dokunulduğunda validate et
  const handleBlur = useCallback((name: string, value: any) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [validateField])

  // Alan değiştiğinde validate et (her değişiklikte)
  const handleChange = useCallback((name: string, value: any) => {
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
    // Alanı touched olarak işaretle
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [validateField])

  // Form temizle
  const resetValidation = useCallback(() => {
    setErrors({})
    setTouched({})
  }, [])

  // Hata var mı kontrol et
  const hasErrors = Object.keys(errors).length > 0

  // Belirli bir alanda hata var mı kontrol et
  const hasFieldError = (fieldName: string): boolean => {
    return !!errors[fieldName]
  }

  // Alan dokunulmuş mu kontrol et
  const isFieldTouched = (fieldName: string): boolean => {
    return !!touched[fieldName]
  }

  return {
    errors,
    touched,
    validateField,
    validateForm,
    handleBlur,
    handleChange,
    resetValidation,
    hasErrors,
    hasFieldError,
    isFieldTouched,
    sanitizeInput,
    setErrors,
    setTouched
  }
}

// Önceden tanımlanmış validasyon kuralları
export const commonValidationRules = {
  // Kullanıcı adı
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    custom: (value: string) => {
      if (value.includes('admin') || value.includes('moderator')) {
        return 'Bu kullanıcı adı kullanılamaz'
      }
      return true
    }
  },

  // E-posta
  email: {
    required: true,
    email: true,
    maxLength: 100
  },

  // Şifre
  password: {
    required: true,
    minLength: 6,
    maxLength: 50,
    custom: (value: string) => {
      if (value.length < 6) {
        return 'Şifre en az 6 karakter olmalıdır'
      }
      return true
    }
  },

  // Telefon
  phone: {
    required: true,
    phone: true
  },

  // İsim
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/
  },

  // Başlık
  title: {
    required: true,
    minLength: 5,
    maxLength: 100
  },

  // Açıklama
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },

  // Fiyat
  price: {
    required: true,
    price: true
  },

  // Yaş
  age: {
    required: true,
    age: true
  },

  // URL
  url: {
    url: true
  }
} 