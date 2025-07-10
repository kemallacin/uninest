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
              {/* Twitter */}
              <a href="#" className="group bg-[#1da1f2] hover:bg-[#1a8cd8] rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110" aria-label="Twitter">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="group bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110" aria-label="Instagram">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a href="#" className="group bg-[#e60023] hover:bg-[#ad081b] rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110" aria-label="Pinterest">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 4.991 3.657 9.128 8.438 10.093-.117-.858-.223-2.178.047-3.115.242-.828 1.557-5.28 1.557-5.28s-.396-.793-.396-1.963c0-1.838 1.067-3.211 2.396-3.211 1.13 0 1.676.849 1.676 1.867 0 1.138-.724 2.84-1.096 4.422-.312 1.322.663 2.4 1.965 2.4 2.358 0 3.953-3.027 3.953-6.607 0-2.73-1.844-4.779-5.193-4.779-3.778 0-6.145 2.83-6.145 5.987 0 1.087.418 2.256.941 2.89.104.127.119.238.087.366-.095.39-.308 1.241-.35 1.413-.055.222-.18.27-.418.163-1.563-.646-2.537-2.67-2.537-4.302 0-3.5 2.956-7.687 8.803-7.687 4.708 0 7.813 3.406 7.813 7.062 0 4.845-2.698 8.466-6.687 8.466-1.343 0-2.606-.728-3.037-1.547l-.826 3.146c-.25.963-.74 2.17-1.104 2.905C9.293 23.82 10.62 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" className="group bg-[#25d366] hover:bg-[#128c7e] rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110" aria-label="WhatsApp">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z"/>
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
              <li><a href="/yardim" className="text-gray-400 hover:text-white transition-colors">Yardım</a></li>
              <li><a href="/sss" className="text-gray-400 hover:text-white transition-colors">SSS</a></li>
              <li><a href="/gizlilik" className="text-gray-400 hover:text-white transition-colors">Gizlilik</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 UniNestcy. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 