'use client'

import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-400 mb-4">
              UniNestcy
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Kıbrıs'ta öğrenci hayatını kolaylaştırmak için tasarlanmış kapsamlı dijital platform.
            </p>
            <div className="flex space-x-4 mt-4">
              {/* Instagram */}
              <a href="https://www.instagram.com/uninestapp/" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110" aria-label="Instagram">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2">
              <li><a href="/ev-arkadasi" className="text-gray-400 hover:text-white transition-colors">Ev Arkadaşı</a></li>
              <li><a href="/ikinci-el" className="text-gray-400 hover:text-white transition-colors">2.El Eşya</a></li>
              <li><a href="/dolmus" className="text-gray-400 hover:text-white transition-colors">Dolmuş Saatleri</a></li>
              <li><a href="/etkinlikler" className="text-gray-400 hover:text-white transition-colors">Etkinlikler</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Destek</h4>
            <ul className="space-y-2">
              <li><a href="/iletisim" className="text-gray-400 hover:text-white transition-colors">İletişim</a></li>
              <li><a href="/sss" className="text-gray-400 hover:text-white transition-colors">SSS</a></li>
              <li><a href="/gizlilik-politikasi" className="text-gray-400 hover:text-white transition-colors">Gizlilik Politikası</a></li>
              <li><a href="/kullanim-sartlari" className="text-gray-400 hover:text-white transition-colors">Kullanım Şartları</a></li>
              <li><a href="/cerez-politikasi" className="text-gray-400 hover:text-white transition-colors">Çerez Politikası</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 UniNestcy. Tüm hakları saklıdır. | Versiyon 1.0.0
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 