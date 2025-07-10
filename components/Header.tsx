'use client'

import React, { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Ev Arkadaşı', href: '/ev-arkadasi' },
    { name: '2.El Eşya', href: '/ikinci-el' },
    { name: 'Dolmuş Saatleri', href: '/dolmus' },
    { name: 'Etkinlikler', href: '/etkinlikler' },
    { name: 'Özel Dersler', href: '/ozel-dersler' },
    { name: 'Not Paylaşımı', href: '/notlar' },
    { name: 'Kıbrıs Rehberi', href: '/rehber' },
  ]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const [authOpen, setAuthOpen] = useState<null | 'login' | 'register'>(null);

  // Route değişince modalı kapat
  useEffect(() => {
    setAuthOpen(null);
  }, [pathname]);

  return (
    <header className="bg-gradient-to-r from-[#1c0f3f] to-[#2e0f5f] text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm border-b border-white/10">
      <div className="w-full flex items-center h-16 px-2">
          {/* Logo */}
        <div className="flex flex-col justify-center group cursor-pointer select-none pl-2">
          <div className="flex items-center space-x-2">
            {/* SVG Logo Icon */}
            <span className="relative p-1 rounded bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
              <svg 
                className="w-7 h-7 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M3 12l9-9 9 9" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 21V9h6v12" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="1" fill="currentColor" className="opacity-60"/>
              </svg>
            </span>
            <span className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 ml-1 group-hover:scale-105">UniNestcy</span>
          </div>
          <span className="text-xs text-gray-300 group-hover:text-gray-200 transition-colors duration-300 font-medium tracking-wide mt-0.5 ml-1">Kıbrıs'ta Öğrenci Hayatı</span>
          </div>

        {/* Menü + Butonlar */}
        <div className="flex items-center ml-4">
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-200 whitespace-nowrap h-16 items-center">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                key={item.name}
                href={item.href}
                  className={`relative transition-all duration-300 px-4 py-2 flex items-center h-16 group
                    ${isActive 
                      ? 'text-yellow-400 font-bold' 
                      : 'text-gray-200 hover:text-yellow-300 hover:scale-105'
                    }
                  `}
                >
                  <span className="relative">
                {item.name}
                    {/* Modern underline animation */}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-300 transition-all duration-300 group-hover:w-full ${
                      isActive ? 'w-full' : ''
                    }`}></span>
                  </span>
                  {/* Active page indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full shadow-lg"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex flex-row items-center gap-3 ml-6 h-16">
            <Link 
              href="/giris" 
              className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center h-16 hover:scale-105 border border-transparent hover:border-white/20"
            >
              Giriş
            </Link>
            <Link 
              href="/hesap-olustur" 
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 text-black shadow-lg hover:shadow-xl transition-all duration-300 flex items-center hover:scale-105 transform"
            >
              Kayıt
            </Link>
          </div>
          </div>

          {/* Mobile menu button */}
        <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-200 hover:text-yellow-300 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              {isMenuOpen ? (
              <XMarkIcon className="h-7 w-7" />
              ) : (
              <Bars3Icon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-[#1c0f3f] to-[#2e0f5f] border-t border-white/10 shadow-lg animate-fade-in-down backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 hover:scale-105 ${
                    isActive 
                      ? 'text-yellow-400 bg-white/10 border-l-4 border-yellow-400' 
                      : 'text-gray-200 hover:text-yellow-300 hover:bg-white/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 space-y-3">
              <Link 
                href="/giris" 
                className="w-full text-sm text-gray-200 hover:text-white transition-all duration-300 hover:scale-105 font-medium py-2 block text-center rounded-lg hover:bg-white/10"
              >
                Giriş
              </Link>
              <Link 
                href="/hesap-olustur" 
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 text-black font-medium py-3 rounded-lg text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform block text-center"
              >
                Kayıt
              </Link>
              </div>
            </div>
          </div>
        )}

    </header>
  )
}

export default Header 