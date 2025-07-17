'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useFormValidation, commonValidationRules } from '../../components/useFormValidation';
import TouchButton from '../../components/TouchButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useMobileOptimization } from '../../hooks/useMobileOptimization';

const HesapOlusturClient = () => {
  const [formData, setFormData] = useState({
    kullaniciAdi: '',
    email: '',
    sifre: '',
    sifreTekrar: ''
  })
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { isMobile, isTouchDevice } = useMobileOptimization();

  // Validasyon kuralları
  const validationRules = {
    kullaniciAdi: commonValidationRules.username,
    email: commonValidationRules.email,
    sifre: commonValidationRules.password,
    sifreTekrar: {
      required: true,
      custom: (value: string) => {
        if (value !== formData.sifre) {
          return 'Şifreler eşleşmiyor'
        }
        return true
      }
    }
  }

  const {
    errors,
    touched,
    validateForm,
    handleBlur,
    handleChange,
    resetValidation,
    hasErrors,
    hasFieldError,
    isFieldTouched,
    sanitizeInput
  } = useFormValidation(validationRules);

  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const sanitizedValue = sanitizeInput(value)
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))

    // Validasyon
    handleChange(name, sanitizedValue)
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    handleBlur(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Form validasyonu
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setError('Lütfen form hatalarını düzeltin');
        setIsSubmitting(false);
        return;
      }

      // Kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.sifre);
      const user = userCredential.user;

      // Profil güncelle
      await updateProfile(user, {
        displayName: formData.kullaniciAdi
      });

      // E-posta doğrulama gönder
      await sendEmailVerification(user);

      // Firestore'a kullanıcı bilgilerini kaydet
      await setDoc(doc(db, 'users', user.uid), {
        displayName: formData.kullaniciAdi,
        email: formData.email,
        createdAt: serverTimestamp(),
        emailVerified: false,
        role: 'user'
      });

      // Başarı mesajı göster ve doğrulama sayfasına yönlendir
      alert('Hesabınız başarıyla oluşturuldu! E-posta adresinizi doğrulamak için gönderdiğimiz e-postayı kontrol edin.');
      router.push('/email-verification');
      
    } catch (err: any) {
      setError('Hesap oluşturma başarısız: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Sağ üst köşe kapat butonu */}
        <TouchButton
          onClick={() => router.push('/')}
          className="absolute top-4 md:top-8 right-4 md:right-8 z-20 text-gray-300 hover:text-white text-3xl font-bold focus:outline-none bg-black/20 rounded-full w-12 h-12 flex items-center justify-center transition"
          aria-label="Kapat"
        >
          ×
        </TouchButton>
        
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <Link href="/" className="inline-block mb-6 md:mb-8">
              <h1 className="text-3xl md:text-6xl font-black text-white">
                <span className="bg-gradient-to-r from-white via-yellow-300 to-white bg-clip-text text-transparent">
                  UniNestcy
                </span>
              </h1>
            </Link>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Hesap Oluştur
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Hemen ücretsiz hesap oluştur, platformun avantajlarından yararlan
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="kullaniciAdi" className="block text-sm font-medium text-white mb-2">
                  Kullanıcı Adı *
                </label>
                <input
                  type="text"
                  id="kullaniciAdi"
                  name="kullaniciAdi"
                  value={formData.kullaniciAdi}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  required
                  autoComplete="username"
                  className={`w-full px-4 py-3 md:py-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-base ${
                    hasFieldError('kullaniciAdi') && isFieldTouched('kullaniciAdi')
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-white/20 focus:ring-yellow-400'
                  }`}
                  placeholder="Kullanıcı adınız"
                />
                {hasFieldError('kullaniciAdi') && isFieldTouched('kullaniciAdi') && (
                  <p className="mt-1 text-sm text-red-400">{errors.kullaniciAdi}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  required
                  autoComplete="email"
                  inputMode="email"
                  className={`w-full px-4 py-3 md:py-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-base ${
                    hasFieldError('email') && isFieldTouched('email')
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-white/20 focus:ring-yellow-400'
                  }`}
                  placeholder="ornek@email.com"
                />
                {hasFieldError('email') && isFieldTouched('email') && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="sifre" className="block text-sm font-medium text-white mb-2">
                  Şifre *
                </label>
                <input
                  type="password"
                  id="sifre"
                  name="sifre"
                  value={formData.sifre}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  required
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 md:py-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-base ${
                    hasFieldError('sifre') && isFieldTouched('sifre')
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-white/20 focus:ring-yellow-400'
                  }`}
                  placeholder="En az 6 karakter"
                />
                {hasFieldError('sifre') && isFieldTouched('sifre') && (
                  <p className="mt-1 text-sm text-red-400">{errors.sifre}</p>
                )}
              </div>

              <div>
                <label htmlFor="sifreTekrar" className="block text-sm font-medium text-white mb-2">
                  Şifre Tekrar *
                </label>
                <input
                  type="password"
                  id="sifreTekrar"
                  name="sifreTekrar"
                  value={formData.sifreTekrar}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  required
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 md:py-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-base ${
                    hasFieldError('sifreTekrar') && isFieldTouched('sifreTekrar')
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-white/20 focus:ring-yellow-400'
                  }`}
                  placeholder="Şifrenizi tekrar girin"
                />
                {hasFieldError('sifreTekrar') && isFieldTouched('sifreTekrar') && (
                  <p className="mt-1 text-sm text-red-400">{errors.sifreTekrar}</p>
                )}
              </div>

              {error && <div className="text-red-400 font-semibold text-center text-sm md:text-base">{error}</div>}

              <TouchButton
                type="submit"
                disabled={isSubmitting || !formData.kullaniciAdi || !formData.email || !formData.sifre || !formData.sifreTekrar}
                className="w-full group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl md:rounded-2xl text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">{isSubmitting ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </TouchButton>
            </form>

            <div className="mt-6 md:mt-8 text-center">
              <p className="text-gray-300 text-sm md:text-base">
                Zaten hesabın var mı?{' '}
                <Link href="/giris" className="text-yellow-400 hover:text-yellow-300 font-medium underline">
                  Giriş Yap
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HesapOlusturClient; 