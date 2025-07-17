'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, reload, sendEmailVerification } from 'firebase/auth';
import TouchButton from '../../components/TouchButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useMobileOptimization } from '../../hooks/useMobileOptimization';

const GirisClient = () => {
  const [formData, setFormData] = useState({
    email: '',
    sifre: ''
  })
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();
  const { isMobile, isTouchDevice } = useMobileOptimization();

  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.sifre);
      const user = userCredential.user;
      
      // Kullanıcı bilgilerini yenile
      await reload(user);
      
      // Admin hesapları için email doğrulama kontrolünü atla
      // Eski admin hesapları email doğrulaması olmadan oluşturulduğu için
      if (!user.emailVerified) {
        // Admin kontrolü yap
        try {
          const { getDoc, doc } = await import('firebase/firestore');
          const { db } = await import('../../lib/firebase');
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists() && userDoc.data().isAdmin) {
            // Admin hesabı - email doğrulama kontrolünü atla
            console.log('Admin hesabı - email doğrulama atlandı');
          } else {
            // Normal kullanıcı - email doğrulama gerekli
            setCurrentUser(user);
            setShowEmailVerification(true);
            setError('E-posta adresinizi doğrulamanız gerekiyor. Doğrulama e-postası göndermek için butona tıklayın.');
            await auth.signOut();
            return;
          }
        } catch (error) {
          console.error('Admin kontrolü sırasında hata:', error);
          // Hata durumunda normal email doğrulama kontrolü yap
          setCurrentUser(user);
          setShowEmailVerification(true);
          setError('E-posta adresinizi doğrulamanız gerekiyor. Doğrulama e-postası göndermek için butona tıklayın.');
          await auth.signOut();
          return;
        }
      }
      
      // Başarılı giriş - ana sayfaya yönlendir
      router.push('/');
      
    } catch (err: any) {
      setError('Giriş başarısız: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSendVerificationEmail = async () => {
    if (!currentUser) return;
    
    try {
      await sendEmailVerification(currentUser);
      setError('Doğrulama e-postası gönderildi! E-posta kutunuzu kontrol edin.');
      setShowEmailVerification(false);
      setCurrentUser(null);
    } catch (error: any) {
      setError('E-posta gönderilirken hata oluştu: ' + error.message);
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
              Giriş Yap
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Hesabına güvenli ve hızlı şekilde giriş yap
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
                  required
                  autoComplete="email"
                  inputMode="email"
                  className="w-full px-4 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 text-base"
                  placeholder="ornek@email.com"
                />
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
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 text-base"
                  placeholder="Şifreniz"
                />
              </div>

              <div className="flex items-center justify-between">
                <Link href="/sifremi-unuttum" className="text-yellow-400 hover:text-yellow-300 underline text-sm font-medium">
                  Şifremi Unuttum
                </Link>
              </div>

              {error && <div className="text-red-400 font-semibold text-center text-sm md:text-base">{error}</div>}

              {showEmailVerification && currentUser && (
                <TouchButton
                  onClick={handleSendVerificationEmail}
                  className="w-full group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl md:rounded-2xl text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25"
                >
                  <span className="relative z-10">Doğrulama E-postası Gönder</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-700 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TouchButton>
              )}

              <TouchButton
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl md:rounded-2xl text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">{isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </TouchButton>
            </form>

            <div className="mt-6 md:mt-8 text-center">
              <p className="text-gray-300 text-sm md:text-base">
                Hesabın yok mu?{' '}
                <Link href="/hesap-olustur" className="text-yellow-400 hover:text-yellow-300 font-medium underline">
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GirisClient; 