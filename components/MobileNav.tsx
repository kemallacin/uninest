'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { XMarkIcon, Bars3Icon, HomeIcon, UserGroupIcon, ShoppingBagIcon, CalendarIcon, AcademicCapIcon, DocumentTextIcon, MapIcon } from '@heroicons/react/24/outline'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onSignOut: () => void
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, user, onSignOut }) => {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      document.body.style.overflow = 'unset'
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const navigation = [
    { name: 'Ana Sayfa', href: '/', icon: HomeIcon },
    { name: 'Ev Arkadaşı', href: '/ev-arkadasi', icon: UserGroupIcon },
    { name: '2.El Eşya', href: '/ikinci-el', icon: ShoppingBagIcon },
    { name: 'Dolmuş Saatleri', href: '/dolmus', icon: MapIcon }, // BusIcon yerine MapIcon kullanıldı
    { name: 'Etkinlikler', href: '/etkinlikler', icon: CalendarIcon },
    { name: 'Özel Dersler', href: '/ozel-dersler', icon: AcademicCapIcon },
    { name: 'Not Paylaşımı', href: '/notlar', icon: DocumentTextIcon },
    { name: 'Kıbrıs Rehberi', href: '/rehber', icon: MapIcon },
  ]

  const handleLinkClick = () => {
    onClose()
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Navigation Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">UniNestcy</h2>
              <p className="text-sm text-gray-500">Kıbrıs Öğrenci Platformu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* User Section */}
        {user && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {user.displayName || 'Kullanıcı'}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          {user ? (
            <>
              <Link
                href="/profil"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">👤</span>
                </div>
                <span className="font-medium">Profilim</span>
              </Link>
              <Link
                href="/ayarlar"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">⚙️</span>
                </div>
                <span className="font-medium">Ayarlar</span>
              </Link>
              <button
                onClick={() => {
                  onSignOut()
                  handleLinkClick()
                }}
                className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
              >
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">🚪</span>
                </div>
                <span className="font-medium">Çıkış Yap</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/giris"
                onClick={handleLinkClick}
                className="block w-full px-4 py-3 text-center bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Giriş Yap
              </Link>
              <Link
                href="/hesap-olustur"
                onClick={handleLinkClick}
                className="block w-full px-4 py-3 text-center bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                Hesap Oluştur
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default MobileNav 