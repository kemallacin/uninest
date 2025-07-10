'use client'

import React from 'react'
import Link from 'next/link'

const AppPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mobil Uygulama Yakında
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            UniNestcy mobil uygulaması ile öğrenci hayatınızı her yerden yönetin
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
          {/* Telefon Mockup */}
          <div className="relative w-[270px] h-[540px] flex items-center justify-center">
            {/* Telefon gövdesi */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-gray-200 to-gray-400 shadow-2xl border-4 border-white" />
            {/* Ekran */}
            <div className="absolute top-3 left-3 right-3 bottom-3 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-500 overflow-hidden flex flex-col items-center justify-between">
              {/* Üst bar */}
              <div className="w-full flex items-center justify-between px-6 pt-6">
                <span className="text-white font-bold text-lg tracking-wide">UniNestCy</span>
                <span className="flex space-x-1">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
                    </div>
              {/* Ana ikonlar */}
              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl">🏠</span>
                    <span className="text-white font-semibold mt-2">Ev Arkadaşı</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl">🛍️</span>
                    <span className="text-white font-semibold mt-2">2. El Eşya</span>
                </div>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl">🚌</span>
                    <span className="text-white font-semibold mt-2">Dolmuş</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl">🎉</span>
                    <span className="text-white font-semibold mt-2">Etkinlikler</span>
                  </div>
                </div>
              </div>
              {/* Alt bar */}
              <div className="w-full flex items-center justify-center pb-6">
                <span className="bg-white bg-opacity-30 text-white px-4 py-1 rounded-full text-sm font-medium shadow">Yakında Sizlerle!</span>
              </div>
            </div>
            {/* Üstte hoparlör */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full bg-gray-300 opacity-70" />
            {/* Altta home butonu */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gray-300 opacity-70" />
            {/* Animasyonlu renkli daireler */}
            <div className="absolute -top-6 -right-6 w-10 h-10 bg-yellow-400 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-blue-400 rounded-full blur-xl opacity-60 animate-pulse" />
          </div>
          {/* Özellikler */}
          <div className="space-y-8 max-w-lg">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Mobil Uygulama Özellikleri
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Anlık Bildirimler</h4>
                    <p className="text-gray-600">Ev arkadaşı ilanları, dolmuş saatleri değişiklikleri ve yeni etkinlikler hakkında anında bilgilendiril</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Konum Bazlı Hizmetler</h4>
                    <p className="text-gray-600">Yakınındaki etkinlikleri, dolmuş duraklarını ve ev arkadaşı ilanlarını kolayca bul</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Anlık Mesajlaşma</h4>
                    <p className="text-gray-600">Ev arkadaşı adayları ve etkinlik organizatörleri ile doğrudan iletişim kur</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Akıllı Filtreleme</h4>
                    <p className="text-gray-600">İhtiyaçlarına göre özelleştirilmiş arama ve filtreleme seçenekleri</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Early Access */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
              <h4 className="text-xl font-bold mb-3">Erken Erişim İçin Kayıt Ol</h4>
              <p className="text-primary-100 mb-4">
                Mobil uygulama çıktığında ilk kullananlardan biri ol ve özel avantajlardan yararlan
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <Link href="/hesap-olustur" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-lg transition-colors duration-200">
                  Kayıt Ol
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppPreview 
