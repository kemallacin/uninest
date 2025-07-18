'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('')

  const popularPages = [
    { name: 'Ev Arkadaşı', href: '/ev-arkadasi', icon: '🏠' },
    { name: 'İkinci El Eşya', href: '/ikinci-el', icon: '🛍️' },
    { name: 'Etkinlikler', href: '/etkinlikler', icon: '🎉' },
    { name: 'Not Paylaşımı', href: '/notlar', icon: '📚' },
    { name: 'Özel Dersler', href: '/ozel-dersler', icon: '🎓' },
    { name: 'Dolmuş Saatleri', href: '/dolmus', icon: '🚌' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Basit arama - gerçek uygulamada daha gelişmiş arama yapılabilir
      const matchingPage = popularPages.find(page => 
        page.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (matchingPage) {
        window.location.href = matchingPage.href
      } else {
        // Arama sonucu bulunamadıysa ana sayfaya yönlendir
        window.location.href = '/'
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Ana hata mesajı */}
        <div className="mb-12">
          <div className="text-8xl font-black mb-6 text-purple-300">404</div>
          <h1 className="text-4xl font-bold mb-4">Sayfa Bulunamadı</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Aradığınız sayfa bulunamadı veya kaldırılmış olabilir. 
            Aşağıdaki seçeneklerden birini deneyebilirsiniz.
          </p>
        </div>

        {/* Arama kutusu */}
        <div className="mb-12 max-w-md mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ne arıyorsunuz?"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              🔍 Ara
            </button>
          </form>
        </div>

        {/* Popüler sayfalar */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popüler Sayfalar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {popularPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <div className="text-3xl mb-3">{page.icon}</div>
                <h3 className="font-semibold text-lg group-hover:text-purple-300 transition-colors">
                  {page.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigasyon butonları */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl text-lg shadow-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105"
          >
            🏠 Ana Sayfaya Dön
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl text-lg shadow-lg hover:bg-white/20 transition-all duration-200"
          >
            ⬅️ Geri Dön
          </button>
        </div>

        {/* Yardım linkleri */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-4">Yardıma mı ihtiyacınız var?</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm">
            <Link href="/sss" className="text-purple-300 hover:text-purple-200 transition-colors">
              ❓ Sık Sorulan Sorular
            </Link>
            <Link href="/rehber" className="text-purple-300 hover:text-purple-200 transition-colors">
              📖 Kıbrıs Rehberi
            </Link>
            <Link href="/iletisim" className="text-purple-300 hover:text-purple-200 transition-colors">
              📧 İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 