'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeStudents, setActiveStudents] = useState(0)
  const [successMatches, setSuccessMatches] = useState(0)
  const [dailyPosts, setDailyPosts] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)

  const targets = {
    activeStudents: 1000,
    successMatches: 500,
    dailyPosts: 50
  }

  // Sayaçları başlatan fonksiyon
  const startCounters = useCallback(() => {
    setActiveStudents(0)
    setSuccessMatches(0)
    setDailyPosts(0)
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps
    let step = 0
    const interval = setInterval(() => {
      step++
      setActiveStudents(prev => (prev < targets.activeStudents ? Math.min(targets.activeStudents, Math.round(targets.activeStudents * step / steps)) : prev))
      setSuccessMatches(prev => (prev < targets.successMatches ? Math.min(targets.successMatches, Math.round(targets.successMatches * step / steps)) : prev))
      setDailyPosts(prev => (prev < targets.dailyPosts ? Math.min(targets.dailyPosts, Math.round(targets.dailyPosts * step / steps)) : prev))
      if (step >= steps) clearInterval(interval)
    }, stepDuration)
    return () => clearInterval(interval)
  }, [])

  // Intersection Observer ile görünür olunca animasyon başlat
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
    setIsVisible(true)
          startCounters()
        }
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [startCounters])

  // Hover ile animasyon başlat
  const handleHover = () => {
    startCounters()
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Main heading with animated gradient */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-yellow-300 to-white bg-clip-text text-transparent animate-pulse">
                UniNestcy
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl font-light text-gray-300 mt-4">
                Kıbrıs'ta Öğrenci
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl font-light text-gray-300">
                Hayatını Kolaylaştırıyoruz
              </span>
            </h1>
          </div>

          {/* Subtitle with staggered animation */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent font-medium">
                Ev arkadaşı bul
              </span>
              , 
              <span className="bg-gradient-to-r from-green-300 to-teal-300 bg-clip-text text-transparent font-medium">
                2.el eşya al-sat
              </span>
              , 
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-medium">
                dolmuş saatlerini öğren
              </span>
              , 
              <span className="bg-gradient-to-r from-pink-300 to-red-300 bg-clip-text text-transparent font-medium">
                etkinliklere katıl
              </span>
              {' '}ve daha fazlası için tek platform
            </p>
          </div>

          {/* CTA buttons with hover effects */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/hesap-olustur" passHref legacyBehavior>
                <a className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25">
                <span className="relative z-10">Hemen Başla</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </Link>
              
              <button
                className="group relative px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
                onClick={() => {
                  const aboutSection = document.getElementById('about-section');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span className="relative z-10">Daha Fazla Bilgi</span>
                <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Stats section */}
          <div ref={statsRef} className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center cursor-pointer" onMouseEnter={handleHover}>
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">{activeStudents}+</div>
                <div className="text-gray-400 font-medium">Aktif Öğrenci</div>
              </div>
              <div className="text-center cursor-pointer" onMouseEnter={handleHover}>
                <div className="text-3xl md:text-4xl font-bold text-green-300 mb-2">{successMatches}+</div>
                <div className="text-gray-400 font-medium">Başarılı Eşleşme</div>
              </div>
              <div className="text-center cursor-pointer" onMouseEnter={handleHover}>
                <div className="text-3xl md:text-4xl font-bold text-blue-300 mb-2">{dailyPosts}+</div>
                <div className="text-gray-400 font-medium">Günlük İlan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 left-10 animate-bounce">
        <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
      </div>
      <div className="absolute top-20 right-20 animate-pulse">
        <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
      </div>
      <div className="absolute bottom-20 right-20 animate-spin">
        <div className="w-8 h-8 border-2 border-white/20 rounded-full"></div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero 