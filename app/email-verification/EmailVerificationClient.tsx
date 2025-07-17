'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged, sendEmailVerification, reload } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

const EmailVerificationClient = () => {
  const [user, setUser] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  const [resendLoading, setResendLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        
        // Kullanıcı bilgilerini yenile
        await reload(currentUser)
        
        if (currentUser.emailVerified) {
          setIsVerified(true)
          // Firestore'da emailVerified'i güncelle
          await updateDoc(doc(db, 'users', currentUser.uid), {
            emailVerified: true
          })
        }
      } else {
        router.push('/giris')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleResendEmail = async () => {
    if (!user) return
    
    setResendLoading(true)
    try {
      await sendEmailVerification(user)
      alert('Doğrulama e-postası tekrar gönderildi!')
    } catch (error: any) {
      alert('E-posta gönderilemedi: ' + error.message)
    }
    setResendLoading(false)
  }

  const handleCheckVerification = async () => {
    if (!user) return
    
    try {
      await reload(user)
      if (user.emailVerified) {
        setIsVerified(true)
        await updateDoc(doc(db, 'users', user.uid), {
          emailVerified: true
        })
        alert('E-posta doğrulandı! Ana sayfaya yönlendiriliyorsunuz.')
        router.push('/')
      } else {
        alert('E-posta henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.')
      }
    } catch (error: any) {
      alert('Doğrulama kontrolü başarısız: ' + error.message)
    }
  }

  const handleManualVerification = async () => {
    if (!user) return
    
    try {
      // Firestore'da emailVerified'i true yap
      await updateDoc(doc(db, 'users', user.uid), {
        emailVerified: true
      })
      
      // Firebase Auth'da da doğrula (bu sadece admin için geçici çözüm)
      // Not: Bu production'da güvenli değil, sadece geliştirme için
      alert('Hesabınız manuel olarak doğrulandı! Ana sayfaya yönlendiriliyorsunuz.')
      router.push('/')
    } catch (error: any) {
      alert('Manuel doğrulama başarısız: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-white">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">E-posta Doğrulandı!</h2>
          <p className="text-gray-300 mb-6">Hesabınız başarıyla doğrulandı. Artık platformun tüm özelliklerini kullanabilirsiniz.</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300"
          >
            Ana Sayfaya Git
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Sağ üst köşe kapat butonu */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-8 right-8 z-20 text-gray-300 hover:text-white text-3xl font-bold focus:outline-none bg-black/20 rounded-full w-12 h-12 flex items-center justify-center transition"
          aria-label="Kapat"
        >
          ×
        </button>

        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-8">
              <h1 className="text-4xl md:text-6xl font-black text-white">
                <span className="bg-gradient-to-r from-white via-yellow-300 to-white bg-clip-text text-transparent">
                  UniNestcy
                </span>
              </h1>
            </Link>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              E-posta Doğrulama
            </h2>
            <p className="text-xl text-gray-300">
              Hesabınızı aktifleştirmek için e-posta adresinizi doğrulayın
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Doğrulama E-postası Gönderildi
                </h3>
                <p className="text-gray-300 mb-4">
                  <strong>{user?.email}</strong> adresine doğrulama e-postası gönderdik.
                </p>
                <p className="text-gray-300 text-sm">
                  E-postanızı kontrol edin ve "E-posta Adresimi Doğrula" butonuna tıklayın.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCheckVerification}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25"
                >
                  Doğrulamayı Kontrol Et
                </button>

                <button
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  className="w-full bg-white/10 text-white font-semibold py-3 px-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                >
                  {resendLoading ? 'Gönderiliyor...' : 'E-postayı Tekrar Gönder'}
                </button>

                <button
                  onClick={handleManualVerification}
                  className="w-full bg-yellow-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-yellow-600 transition-all duration-300"
                >
                  Zaten Doğrulanmış Hesabım Var
                </button>
              </div>

              <div className="pt-6 border-t border-white/20">
                <p className="text-gray-400 text-sm mb-4">
                  E-posta gelmedi mi? Spam klasörünüzü kontrol edin.
                </p>
                <Link
                  href="/giris"
                  className="text-yellow-400 hover:text-yellow-300 underline text-sm font-medium"
                >
                  Giriş sayfasına dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationClient 