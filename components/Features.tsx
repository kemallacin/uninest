'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'

const Features = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.querySelector('#features-section')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      title: 'Ev Arkadaşı Bul',
      description: 'Kıbrıs\'ta ev arkadaşı arayan veya ev arkadaşı arayan öğrencileri buluşturuyoruz.',
      icon: '🏠',
      href: '/ev-arkadasi',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0
    },
    {
      title: '2.El Eşya Pazarı',
      description: 'İkinci el eşyalarını sat veya ihtiyacın olan eşyaları uygun fiyata bul.',
      icon: '🛍️',
      href: '/ikinci-el',
      gradient: 'from-green-500 to-emerald-500',
      delay: 100
    },
    {
      title: 'Dolmuş Saatleri',
      description: 'Güncel dolmuş saatlerini öğren, rotaları planla ve zamanında git.',
      icon: '🚌',
      href: '/dolmus',
      gradient: 'from-yellow-500 to-orange-500',
      delay: 200
    },
    {
      title: 'Etkinlikler',
      description: 'Kıbrıs\'taki öğrenci etkinliklerini keşfet ve yeni arkadaşlar edin.',
      icon: '🎉',
      href: '/etkinlikler',
      gradient: 'from-purple-500 to-pink-500',
      delay: 300
    },
    {
      title: 'Özel Dersler',
      description: 'Özel ders ver veya al, akademik başarını artır.',
      icon: '📚',
      href: '/ozel-dersler',
      gradient: 'from-red-500 to-rose-500',
      delay: 400
    },
    {
      title: 'Not Paylaşımı',
      description: 'Ders notlarını ve ödevleri paylaş, birlikte öğren.',
      icon: '📝',
      href: '/notlar',
      gradient: 'from-indigo-500 to-blue-500',
      delay: 500
    },
    {
      title: 'Kıbrıs Rehberi',
      description: 'Kıbrıs hakkında her şeyi öğren, yaşam rehberi ve ipuçları.',
      icon: '🗺️',
      href: '/rehber',
      gradient: 'from-orange-500 to-amber-500',
      delay: 600
    }
  ]

  // Sayaç animasyonu için state
  const [stats, setStats] = useState({
    active: 0,
    match: 0,
    event: 0
  });
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const animStarted = useRef(false);

  // Sayaç animasyon fonksiyonu (senkronize)
  const animateStats = useCallback(() => {
    if (animStarted.current) return;
    animStarted.current = true;
    setStats({ active: 0, match: 0, event: 0 });
    const duration = 1500;
    const steps = 50;
    const stepDuration = duration / steps;
    let step = 0;
    const targets = { active: 1000, match: 500, event: 50 };
    const interval = setInterval(() => {
      step++;
      setStats({
        active: Math.min(targets.active, Math.round(targets.active * step / steps)),
        match: Math.min(targets.match, Math.round(targets.match * step / steps)),
        event: Math.min(targets.event, Math.round(targets.event * step / steps)),
      });
      if (step >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);
  }, []);

  // Intersection Observer ile görünür olunca animasyon başlat
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          animateStats();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [animateStats]);

  return (
    <section id="features-section" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
              Öğrenci Hayatını
            </span>
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Kolaylaştıran Özellikler
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Kıbrıs'ta öğrenci olmanın tüm zorluklarını çözen{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
              kapsamlı platform
            </span>
          </p>
        </div>

        {/* 3+2+2 özel grid */}
        <div className="flex flex-col gap-8 items-center">
          {/* 1. satır: 3 kart */}
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {features.slice(0, 3).map((feature, index) => (
            <div 
              key={index} 
                className={`group transition-all duration-700 w-[320px] max-w-xs min-w-[260px] flex-shrink-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{transitionDelay: `${feature.delay}ms`}}
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="relative text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                  <a
                    href={feature.href}
                    className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group-hover:translate-x-1`}
                  >
                    Keşfet
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
          </div>
          {/* 2. satır: 2 kart */}
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {features.slice(3, 5).map((feature, index) => (
              <div 
                key={index+3} 
                className={`group transition-all duration-700 w-[320px] max-w-xs min-w-[260px] flex-shrink-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{transitionDelay: `${feature.delay}ms`}}
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    <a
                      href={feature.href}
                      className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group-hover:translate-x-1`}
                    >
                      Keşfet
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 3. satır: 2 kart */}
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {features.slice(5, 7).map((feature, index) => (
              <div 
                key={index+5} 
                className={`group transition-all duration-700 w-[320px] max-w-xs min-w-[260px] flex-shrink-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{transitionDelay: `${feature.delay}ms`}}
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    <a
                      href={feature.href}
                      className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group-hover:translate-x-1`}
                    >
                      Keşfet
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className={`mt-24 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            <div className="relative" ref={statsRef}>
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Platform İstatistikleri
                  </span>
                </h3>
                <p className="text-xl text-gray-300 font-light">
                  Binlerce öğrenciye hizmet veriyoruz
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="group">
                  <div className="text-4xl md:text-5xl font-black text-yellow-300 mb-3 group-hover:scale-110 transition-transform duration-300">{stats.active > 0 ? stats.active + '+' : '0+'}</div>
                  <div className="text-gray-300 font-medium text-lg">Aktif Öğrenci</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-black text-green-300 mb-3 group-hover:scale-110 transition-transform duration-300">{stats.match > 0 ? stats.match + '+' : '0+'}</div>
                  <div className="text-gray-300 font-medium text-lg">Başarılı Eşleşme</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-black text-blue-300 mb-3 group-hover:scale-110 transition-transform duration-300">{stats.event > 0 ? stats.event + '+' : '0+'}</div>
                  <div className="text-gray-300 font-medium text-lg">Günlük Etkinlik</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-black text-purple-300 mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-gray-300 font-medium text-lg">Destek</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features 