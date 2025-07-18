'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { auth } from '../lib/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { useAuth } from '../lib/auth/AuthContext'
import { ROLE_NAMES, ROLE_COLORS } from '../lib/auth/roles'
import { CanAccessAdminPanel } from './PermissionGate'
import { SimpleNotificationBell } from './SimpleNotificationSystem'

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  // Firebase Auth'u direkt kullan
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const { profile, hasRole } = useAuth(); // Sadece profile için AuthContext kullan
  const [authOpen, setAuthOpen] = useState<null | 'login' | 'register'>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Firebase Auth'u direkt dinle
  useEffect(() => {
    console.log('🔥 Header - Firebase Auth dinleniyor...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Header - Firebase Auth değişti:', user ? 'Giriş yapıldı' : 'Çıkış yapıldı');
      console.log('🔥 Header - User:', user?.uid, user?.email);
      setFirebaseUser(user);
    });
    
    return () => unsubscribe();
  }, []);

  // Route değişince modalı kapat
  useEffect(() => {
    setAuthOpen(null);
  }, [pathname]);

  // Güvenli dışarı tıklama
  useEffect(() => {
    if (!isUserMenuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

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
            
            {firebaseUser ? (
              <>
                {/* Notification Bell */}
                <div className="mr-4">
                  <SimpleNotificationBell />
                </div>
                
                <div className="relative">
                  {/* User Dropdown Button */}
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center text-black font-semibold text-sm">
                      {firebaseUser.displayName ? firebaseUser.displayName.charAt(0).toUpperCase() : firebaseUser.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                      {firebaseUser.displayName || firebaseUser.email?.split('@')[0]}
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div ref={userMenuRef} className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 py-2 z-50 animate-fade-in-down">
                      <div className="px-4 py-3 border-b border-gray-200/20">
                        <p className="text-sm font-medium text-gray-900">{firebaseUser.displayName || 'Kullanıcı'}</p>
                        <p className="text-xs text-gray-500">{firebaseUser.email}</p>
                      </div>
                      
                      <a
                        href="/profil"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsUserMenuOpen(false);
                          window.location.href = '/profil';
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400/10 hover:text-yellow-600 transition-all duration-200"
                      >
                        <UserIcon className="w-4 h-4" />
                        Profilim
                      </a>
                      
                      <a
                        href="/ayarlar"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsUserMenuOpen(false);
                          window.location.href = '/ayarlar';
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400/10 hover:text-yellow-600 transition-all duration-200"
                      >
                        <Cog6ToothIcon className="w-4 h-4" />
                        Ayarlar
                      </a>
                      
                      {/* Admin Paneli ve Raporlar Linkleri */}
                      <CanAccessAdminPanel>
                        <>
                          <a
                            href="/admin"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsUserMenuOpen(false);
                              window.location.href = '/admin';
                            }}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100 transition-all duration-200"
                          >
                            <ShieldCheckIcon className="w-4 h-4" />
                            Admin Paneli
                          </a>
                          <a
                            href="/admin/reports"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsUserMenuOpen(false);
                              window.location.href = '/admin/reports';
                            }}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-purple-700 hover:bg-purple-100 transition-all duration-200"
                          >
                            📊 Raporlar
                          </a>
                        </>
                      </CanAccessAdminPanel>

                      <div className="border-t border-gray-200/20 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-all duration-200"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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
              
              {firebaseUser ? (
                <>
                  {/* Mobile User Info */}
                  <div className="px-3 py-3 bg-white/10 rounded-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center text-black font-semibold">
                        {firebaseUser.displayName ? firebaseUser.displayName.charAt(0).toUpperCase() : firebaseUser.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{firebaseUser.displayName || 'Kullanıcı'}</p>
                        <p className="text-xs text-gray-400">{firebaseUser.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile User Menu */}
                  <div className="space-y-1">
                    <Link
                      href="/profil"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-yellow-300 hover:bg-white/5 rounded-lg transition-all duration-300"
                    >
                      <UserIcon className="w-4 h-4" />
                      Profilim
                    </Link>
                    
                    <Link
                      href="/ayarlar"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-yellow-300 hover:bg-white/5 rounded-lg transition-all duration-300"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      Ayarlar
                    </Link>
                    
                    {/* Admin Paneli ve Raporlar Linkleri */}
                    <CanAccessAdminPanel>
                      <>
                        <a
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 rounded-lg transition-all duration-300 w-full text-left"
                        >
                          <ShieldCheckIcon className="w-4 h-4" />
                          Admin Paneli
                        </a>
                        <a
                          href="/admin/reports"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 rounded-lg transition-all duration-300 w-full text-left"
                        >
                          📊 Raporlar
                        </a>
                      </>
                    </CanAccessAdminPanel>

                    <button 
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-all duration-300 w-full text-left"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 