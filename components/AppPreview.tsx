'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useToast } from './ToastProvider'

const AppPreview = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const handleEarlyAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      showToast('Lütfen e-posta adresinizi girin', 'error')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showToast('Lütfen geçerli bir e-posta adresi girin', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      // Firebase'e erken erişim kaydını ekle
      await addDoc(collection(db, 'early_access_registrations'), {
        email: email.trim(),
        timestamp: serverTimestamp(),
        status: 'pending'
      })

      showToast('Erken erişim kaydınız alındı! Mobil uygulama çıktığında size haber vereceğiz.', 'success')
      setEmail('')
    } catch (error) {
      console.error('Erken erişim kaydı hatası:', error)
      showToast('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mobil Uygulama Yakında
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            UniNestcy mobil uygulaması ile öğrenci hayatınızı her yerden yönetin
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
          {/* Gerçekçi Telefon Mockup */}
          <div className="relative w-[300px] h-[600px] flex items-center justify-center">
            {/* Telefon gövdesi - iPhone benzeri */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl border border-gray-700">
              {/* Telefon çerçevesi */}
              <div className="absolute inset-[3px] rounded-[2.8rem] bg-black">
                {/* Ekran */}
                <div className="absolute top-[12px] left-[12px] right-[12px] bottom-[12px] rounded-[2.5rem] bg-white dark:bg-gray-900 overflow-hidden">
                  {/* Status Bar */}
                  <div className="w-full h-8 bg-[#3B1E6D] flex items-center justify-between px-6 text-white text-xs font-medium">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                      <span className="text-xs">100%</span>
                      <div className="w-6 h-3 border border-white rounded-sm">
                        <div className="w-full h-full bg-green-400 rounded-sm"></div>
                      </div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="bg-gradient-to-r from-[#3B1E6D] to-[#4F46E5] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                          <span className="text-[#3B1E6D] font-bold text-lg">🏠</span>
                        </div>
                        <div>
                          <h1 className="text-white font-bold text-lg">UniNestcy</h1>
                          <p className="text-white/80 text-xs">Kıbrıs'ta Öğrenci Hayatı</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* App Content - Ev Arkadaşı Kartı */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 flex-1">
                    <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-6 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Zeynep Özkan</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Yakın Doğu Üniversitesi</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Tıp</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">4.7</span>
                        </div>
                      </div>

                      {/* Doğrulanmış Badge */}
                      <div className="mb-3">
                        <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                          ✓ Doğrulanmış
                        </span>
                      </div>

                      {/* Tip ve Fiyat */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          Ev Arıyor
                        </span>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                          <span>£ 450 GBP</span>
                        </div>
                      </div>

                      {/* Konum ve Tarih */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                          <span className="mr-2">📍</span>
                          <span>Lefkoşa</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                          <span className="mr-2">📅</span>
                          <span>Müsait: 2024-01-20</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                          <span className="mr-2">🏠</span>
                          <span>Tek kişilik oda</span>
                        </div>
                      </div>

                      {/* Açıklama */}
                      <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 leading-relaxed">
                        Tıp öğrencisi olduğum için çok çalışıyorum. Anlayışlı bir ev arkadaşı arıyorum.
                      </p>

                      {/* İlgi Alanları */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs">Tıp</span>
                        <span className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs">Müzik</span>
                        <span className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs">Spor</span>
                      </div>

                      {/* Tercihler */}
                      <div className="flex items-center gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="text-green-600 dark:text-green-400">🚭 Sigara İçmez</span>
                        <span className="text-gray-500 dark:text-gray-400">🚫 Evcil Hayvan Yok</span>
                      </div>

                      {/* Butonlar */}
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-lg text-xs font-medium">
                          👁️ Detay
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium">
                          💬 İletişim
                        </button>
                      </div>
                    </div>

                    {/* Alt kısımda diğer kartların başlangıcı */}
                    <div className="bg-white dark:bg-gray-700 rounded-t-2xl h-8 shadow-lg"></div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-3">
                    <div className="flex items-center justify-around">
                      <div className="flex flex-col items-center">
                        <span className="text-lg">🏠</span>
                        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Ev Arkadaşı</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg opacity-50">🛍️</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">2. El Eşya</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg opacity-50">🚌</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">Dolmuş</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg opacity-50">🎉</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">Etkinlikler</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notch (Çentik) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl flex items-center justify-center">
                  <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>

            {/* Gölge ve Işık Efektleri */}
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-[4rem] blur-2xl -z-10"></div>
            <div className="absolute top-0 left-8 w-20 h-20 bg-yellow-300/20 dark:bg-yellow-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 bg-blue-300/20 dark:bg-blue-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>

          {/* Özellikler */}
          <div className="space-y-8 max-w-lg">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Mobil Uygulama Özellikleri
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Anlık Bildirimler</h4>
                    <p className="text-gray-600 dark:text-gray-300">Ev arkadaşı ilanları, dolmuş saatleri değişiklikleri ve yeni etkinlikler hakkında anında bilgilendiril</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Konum Bazlı Hizmetler</h4>
                    <p className="text-gray-600 dark:text-gray-300">Yakınındaki etkinlikleri, dolmuş duraklarını ve ev arkadaşı ilanlarını kolayca bul</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Anlık Mesajlaşma</h4>
                    <p className="text-gray-600 dark:text-gray-300">Ev arkadaşı adayları ve etkinlik organizatörleri ile doğrudan iletişim kur</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Akıllı Filtreleme</h4>
                    <p className="text-gray-600 dark:text-gray-300">İhtiyaçlarına göre özelleştirilmiş arama ve filtreleme seçenekleri</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Early Access */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 rounded-xl p-6 text-white">
              <h4 className="text-xl font-bold mb-3">Erken Erişim İçin Kayıt Ol</h4>
              <p className="text-primary-100 dark:text-primary-200 mb-4">
                Mobil uygulama çıktığında ilk kullananlardan biri ol ve özel avantajlardan yararlan
              </p>
              <form onSubmit={handleEarlyAccessSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-900 font-bold px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Kayıt Ediliyor...' : 'Kayıt Ol'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppPreview 
