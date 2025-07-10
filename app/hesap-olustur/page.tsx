'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const HesapOlustur = () => {
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    universite: '',
    bolum: '',
    sifre: '',
    sifreTekrar: ''
  })

  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter();

  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form gönderme işlemi burada yapılacak
    console.log('Form data:', formData)
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

        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
              Hesap Oluştur
            </h2>
            <p className="text-xl text-gray-300">
              Kıbrıs'ta öğrenci hayatını kolaylaştırmaya başla
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ad" className="block text-sm font-medium text-white mb-2">
                    Ad *
                  </label>
                  <input
                    type="text"
                    id="ad"
                    name="ad"
                    value={formData.ad}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="Adınız"
                  />
                </div>

                <div>
                  <label htmlFor="soyad" className="block text-sm font-medium text-white mb-2">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    id="soyad"
                    name="soyad"
                    value={formData.soyad}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="Soyadınız"
                  />
                </div>
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
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label htmlFor="telefon" className="block text-sm font-medium text-white mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="universite" className="block text-sm font-medium text-white mb-2">
                    Üniversite *
                  </label>
                  <select
                    id="universite"
                    name="universite"
                    value={formData.universite}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Üniversite seçin</option>
                    <option value="dogu-akdeniz">Doğu Akdeniz Üniversitesi</option>
                    <option value="yakın-dogu">Yakın Doğu Üniversitesi</option>
                    <option value="lefke-avrupa">Lefke Avrupa Üniversitesi</option>
                    <option value="girne-amerikan">Girne Amerikan Üniversitesi</option>
                    <option value="uluslararasi-kibris">Uluslararası Kıbrıs Üniversitesi</option>
                    <option value="orta-dogu-teknik">Orta Doğu Teknik Üniversitesi</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bolum" className="block text-sm font-medium text-white mb-2">
                    Bölüm *
                  </label>
                  <input
                    type="text"
                    id="bolum"
                    name="bolum"
                    value={formData.bolum}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="Bölümünüz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="En az 8 karakter"
                  />
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
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                    placeholder="Şifrenizi tekrar girin"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="kullanim-sartlari"
                  required
                  className="mt-1 w-4 h-4 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
                />
                <label htmlFor="kullanim-sartlari" className="text-sm text-gray-300">
                  <Link href="/kullanim-sartlari" className="text-yellow-400 hover:text-yellow-300 underline">
                    Kullanım Koşulları
                  </Link>
                  {' '}ve{' '}
                  <Link href="/gizlilik" className="text-yellow-400 hover:text-yellow-300 underline">
                    Gizlilik Politikası
                  </Link>
                  'nı okudum ve kabul ediyorum *
                </label>
              </div>

              <button
                type="submit"
                className="w-full group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25"
              >
                <span className="relative z-10">Hesap Oluştur</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Zaten hesabınız var mı?{' '}
                <Link href="/giris" className="text-yellow-400 hover:text-yellow-300 font-medium underline">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HesapOlustur 