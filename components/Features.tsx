'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, MapPin, Clock, Heart, Eye, Crown, Zap, Search, X } from 'lucide-react'
import Link from 'next/link'

interface AdItem {
  id: string
  type: string
  icon: string
  color: string
  collection: string
  createdAt?: any
  isApproved?: boolean
  isPremium?: boolean
  urun_adi?: string
  title?: string
  baslik?: string
  ders_adi?: string
  etkinlik_adi?: string
  aciklama?: string
  description?: string
  detaylar?: string
  satis_fiyati?: number
  kira?: number
  fiyat?: number
  ucret?: number
  konum?: string
  lokasyon?: string
  location?: string
  telefon?: string
  email?: string
  urun_fotograf?: string
  images?: string[]
  cinsiyet?: string
  yas?: number
  meslek?: string
  [key: string]: any
}

const Features = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [premiumAds, setPremiumAds] = useState<AdItem[]>([])
  const [filteredAds, setFilteredAds] = useState<AdItem[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [showFilters, setShowFilters] = useState(false)

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

  // Premium ilanları çek
  useEffect(() => {
    const fetchPremiumAds = async () => {
      console.log('🔍 Premium ilanları çekiliyor...')
      try {
        const { db } = await import('../lib/firebase')
        const { collection, query, orderBy, limit, getDocs, where } = await import('firebase/firestore')

        console.log('🔥 Firebase bağlantısı kuruldu')

        // Tüm koleksiyonları dahil et
        const testCollections = [
          { name: 'secondhand', type: 'İkinci El', icon: '🛍️', color: 'from-green-500 to-emerald-500' },
          { name: 'roommates', type: 'Ev Arkadaşı', icon: '🏠', color: 'from-blue-500 to-cyan-500' },
          { name: 'events', type: 'Etkinlik', icon: '🎉', color: 'from-purple-500 to-pink-500' },
          { name: 'tutors', type: 'Özel Ders', icon: '📚', color: 'from-red-500 to-rose-500' },
          { name: 'students', type: 'Özel Ders', icon: '📚', color: 'from-red-500 to-rose-500' },
          { name: 'notes', type: 'Not', icon: '📝', color: 'from-indigo-500 to-blue-500' }
        ]

        const allAds: AdItem[] = []

        for (const col of testCollections) {
          try {
            console.log(`📊 ${col.name} koleksiyonu kontrol ediliyor...`)
            
            // Premium ilanları çek - onay durumuna bakmaksızın
            const simpleQuery = query(
              collection(db, col.name),
              where('isPremium', '==', true),
              limit(20)
            )
            
            const snapshot = await getDocs(simpleQuery)
            console.log(`✅ ${col.name} - Toplam approved+premium ilan: ${snapshot.size}`)
            
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
            
            // Her bir dokümanı kontrol et
            docs.forEach((doc, index) => {
              console.log(`📄 ${col.name}[${index}] - ID: ${doc.id}, isPremium: ${doc.isPremium}, isApproved: ${doc.isApproved}`)
            })
            
            console.log(`👑 ${col.name} - Premium ilan sayısı: ${docs.length}`)
            
            if (docs.length > 0) {
              console.log(`🎯 ${col.name} premium ilanları:`, docs.map(doc => ({
                id: doc.id,
                title: doc.urun_adi || doc.title || doc.baslik || 'Başlık yok',
                isPremium: doc.isPremium,
                isApproved: doc.isApproved
              })))
            }

            // Premium ilanları ekle (zaten filtreli)
            const ads = docs.map(doc => ({
              id: doc.id,
              ...doc,
              type: col.type,
              icon: col.icon,
              color: col.color,
              collection: col.name
            })) as AdItem[]
            
            allAds.push(...ads)
          } catch (error) {
            console.error(`❌ ${col.name} koleksiyonunda hata:`, error)
          }
        }

        console.log('🏆 Toplam premium ilan sayısı:', allAds.length)
        console.log('🎯 Premium ilanlar:', allAds)
        setPremiumAds(allAds)
        setFilteredAds(allAds) // İlk yüklemede tüm ilanları göster
      } catch (error) {
        console.error('💥 Premium ilanları çekerken hata:', error)
        setPremiumAds([])
      } finally {
        setLoading(false)
      }
    }

    fetchPremiumAds()
  }, [])

  // Premium ilanları otomatik yenileme
  useEffect(() => {
    const interval = setInterval(() => {
      // Premium ilanları otomatik yenileme
      const refreshAds = async () => {
        try {
          const { db } = await import('../lib/firebase')
          const { collection, query, orderBy, limit, getDocs, where } = await import('firebase/firestore')

                     const collections = [
             { name: 'secondhand', type: 'İkinci El', icon: '🛍️', color: 'from-green-500 to-emerald-500' },
             { name: 'roommates', type: 'Ev Arkadaşı', icon: '🏠', color: 'from-blue-500 to-cyan-500' },
             { name: 'events', type: 'Etkinlik', icon: '🎉', color: 'from-purple-500 to-pink-500' },
             { name: 'tutors', type: 'Özel Ders', icon: '📚', color: 'from-red-500 to-rose-500' },
             { name: 'students', type: 'Özel Ders', icon: '📚', color: 'from-red-500 to-rose-500' },
             { name: 'notes', type: 'Not', icon: '📝', color: 'from-indigo-500 to-blue-500' }
           ]

          const allAds: AdItem[] = []

          for (const col of collections) {
                         try {
               const q = query(
                 collection(db, col.name),
                 where('isPremium', '==', true),
                 limit(10)
               )
               
               const snapshot = await getDocs(q)
               const ads = snapshot.docs.map(doc => ({
                 id: doc.id,
                 ...doc.data(),
                 type: col.type,
                 icon: col.icon,
                 color: col.color,
                 collection: col.name
               })) as AdItem[]
               
               allAds.push(...ads)
             } catch (error) {
               console.log(`${col.name} koleksiyonunda premium ilan yok:`, error)
             }
          }

          const sortedAds = allAds
            .sort((a, b) => {
              const timeA = a.createdAt?.seconds || 0
              const timeB = b.createdAt?.seconds || 0
              return timeB - timeA
            })
            .slice(0, 8)

          setPremiumAds(sortedAds)
        } catch (error) {
          console.error('Premium ilanları yenilerken hata:', error)
        }
      }
      refreshAds()
    }, 30000) // 30 saniyede bir yenile

    return () => clearInterval(interval)
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

  const nextSlide = () => {
    if (premiumAds.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, Math.ceil(premiumAds.length / 4)))
  }

  const prevSlide = () => {
    if (premiumAds.length === 0) return
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, Math.ceil(premiumAds.length / 4))) % Math.max(1, Math.ceil(premiumAds.length / 4)))
  }

  const formatTimeAgo = (timestamp: any) => {
    try {
      if (!timestamp) return 'Bilinmiyor'
      const now = new Date()
      const createdAt = new Date(timestamp.seconds * 1000)
      const diffInHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60))
      
      if (diffInHours < 1) return 'Az önce'
      if (diffInHours < 24) return `${diffInHours} saat önce`
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays} gün önce`
      return `${Math.floor(diffInDays / 7)} hafta önce`
    } catch (error) {
      return 'Bilinmiyor'
    }
  }

  const getAdLink = (ad: AdItem) => {
    const links: { [key: string]: string } = {
      'secondhand': '/ikinci-el',
      'roommates': '/ev-arkadasi',
      'events': '/etkinlikler',
      'tutoring': '/ozel-dersler',
      'notes': '/notlar'
    }
    return `${links[ad.collection] || '#'}/${ad.id}`
  }

  const getAdTitle = (ad: AdItem) => {
    return ad.urun_adi || ad.title || ad.baslik || ad.ders_adi || ad.etkinlik_adi || 'Premium İlan'
  }

  const getAdDescription = (ad: AdItem) => {
    const desc = ad.aciklama || ad.description || ad.detaylar || 'Açıklama yok'
    return desc.length > 100 ? desc.substring(0, 100) + '...' : desc
  }

  const getAdPrice = (ad: AdItem) => {
    const price = ad.satis_fiyati || ad.kira || ad.fiyat || ad.ucret
    if (!price) return null
    
    // Fiyatı formatla
    if (typeof price === 'number') {
      return price.toLocaleString('tr-TR')
    }
    return price
  }

  const getAdLocation = (ad: AdItem) => {
    return ad.konum || ad.lokasyon || ad.location || 'Kıbrıs'
  }

  const getAdImage = (ad: AdItem) => {
    return ad.urun_fotograf || (ad.images && ad.images[0]) || null
  }

  const getAdContact = (ad: AdItem) => {
    return ad.telefon || ad.email || 'İletişim bilgisi yok'
  }

  // Filtreleme fonksiyonu
  const applyFilters = () => {
    let filtered = premiumAds.filter(ad => {
      const matchesSearch = getAdTitle(ad).toLowerCase().includes(searchTerm.toLowerCase()) ||
                           getAdDescription(ad).toLowerCase().includes(searchTerm.toLowerCase()) ||
                           getAdLocation(ad).toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'Tümü' || ad.type === selectedCategory
      
      return matchesSearch && matchesCategory
    })
    
    setFilteredAds(filtered)
    setCurrentSlide(0) // Filtreleme sonrası ilk slide'a dön
  }

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('Tümü')
    setFilteredAds(premiumAds)
    setCurrentSlide(0)
  }

  // Filtreleme değişikliklerini izle
  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedCategory, premiumAds])

  // Kategori listesi
  const categories = ['Tümü', 'İkinci El', 'Ev Arkadaşı', 'Etkinlik', 'Özel Ders', 'Not']

  return (
    <section id="features-section" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-200">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-200 dark:bg-yellow-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Premium İlanlar Bölümü - ÜST */}
        <div className={`mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            {/* Premium Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M30 30m-10 0a10 10 0 1 1 20 0a10 10 0 1 1 -20 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            <div className="relative">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="w-12 h-12 text-blue-200 mr-3" />
                  <h2 className="text-3xl md:text-4xl font-bold">
                    <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                      Premium İlanlar
                    </span>
                  </h2>
                  <Crown className="w-12 h-12 text-blue-200 ml-3" />
                </div>
                <p className="text-xl text-blue-100 font-light mb-6">
                  Öne çıkan premium ilanları keşfedin - Daha fazla görünürlük!
                </p>
              </div>

              {/* Arama ve Filtreleme Bölümü */}
              <div className="mb-8">
                {/* Arama Çubuğu */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Premium ilanlarda ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Kategori Filtreleri */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-white text-blue-600 shadow-lg scale-105'
                          : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Filtreleme Bilgileri */}
                <div className="flex justify-between items-center text-blue-100 text-sm">
                  <div className="flex items-center space-x-4">
                    <span>Toplam: {premiumAds.length} ilan</span>
                    <span>Gösterilen: {filteredAds.length} ilan</span>
                  </div>
                  {(searchTerm || selectedCategory !== 'Tümü') && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                      <span>Filtreleri Temizle</span>
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-200"></div>
                </div>
              ) : filteredAds.length > 0 ? (
                <div className="relative">
                  {/* Navigation Buttons */}
                  {filteredAds.length > 4 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-20 bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-20 bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </>
                  )}

                  {/* Premium Ads Slider */}
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`
                      }}
                    >
                      {Array.from({ length: Math.ceil(filteredAds.length / 4) }).map((_, slideIndex) => (
                        <div key={slideIndex} className="w-full flex-shrink-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredAds.slice(slideIndex * 4, (slideIndex + 1) * 4).map((ad, index) => (
                              <div
                                key={ad.id}
                                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-blue-300/30 hover:border-blue-400/50 dark:border-gray-600 dark:hover:border-gray-500 relative overflow-hidden"
                              >
                                {/* Premium Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                {/* Ad Image */}
                                <div className="relative">
                                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                                    {getAdImage(ad) ? (
                                      <img
                                        src={getAdImage(ad)}
                                        alt={getAdTitle(ad)}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                                        <span className="text-6xl">{ad.icon}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Premium Badge */}
                                  <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg">
                                      <Crown className="w-3 h-3 mr-1" />
                                      PREMIUM
                                    </div>
                                  </div>

                                  {/* Category Badge */}
                                  <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                                      {ad.icon} {ad.type}
                                    </span>
                                  </div>

                                  {/* Gradient Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                  {/* Title */}
                                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    {getAdTitle(ad)}
                                  </h4>
                                  
                                  {/* Description */}
                                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                                    {getAdDescription(ad)}
                                  </p>

                                  {/* Price */}
                                  <div className="mb-4">
                                    {getAdPrice(ad) && (
                                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {getAdPrice(ad)}₺
                                      </div>
                                    )}
                                  </div>

                                  {/* Location */}
                                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                    <span className="text-sm font-medium">{getAdLocation(ad)}</span>
                                  </div>

                                  {/* Additional Info for Roommate */}
                                  {ad.collection === 'roommates' && (
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                      {ad.cinsiyet && <span className="flex items-center"><span className="mr-1">👤</span>{ad.cinsiyet}</span>}
                                      {ad.yas && <span className="flex items-center"><span className="mr-1">🎂</span>{ad.yas} yaş</span>}
                                      {ad.meslek && <span className="flex items-center"><span className="mr-1">💼</span>{ad.meslek}</span>}
                                    </div>
                                  )}

                                  {/* Time and Status */}
                                  <div className="flex items-center justify-between mb-6 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      <span>{formatTimeAgo(ad.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Zap className="w-3 h-3 mr-1 text-blue-500" />
                                      <span className="text-blue-600 dark:text-blue-400 font-medium">Premium</span>
                                    </div>
                                  </div>

                                  {/* Action Button */}
                                  <Link
                                    href={getAdLink(ad)}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl group-hover:scale-105"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    <span>Detayları Görüntüle</span>
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dots Indicator */}
                  {filteredAds.length > 4 && (
                    <div className="flex justify-center mt-12 space-x-3">
                                              {Array.from({ length: Math.ceil(filteredAds.length / 4) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-110 ${
                            index === currentSlide 
                              ? 'bg-blue-200 shadow-lg' 
                              : 'bg-white/60 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">
                    {premiumAds.length === 0 ? '👑' : '🔍'}
                  </div>
                  <h3 className="text-xl font-semibold text-blue-100 mb-2">
                    {premiumAds.length === 0 ? 'Henüz premium ilan bulunmuyor' : 'Arama kriterlerinize uygun ilan bulunamadı'}
                  </h3>
                  <p className="text-blue-200 text-sm mt-2">
                    {premiumAds.length === 0 
                      ? 'İlk premium ilanları vermek için admin panelini kullanın!' 
                      : 'Farklı arama kriterleri deneyin veya filtreleri temizleyin.'
                    }
                  </p>
                  {premiumAds.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition-all duration-300"
                    >
                      Filtreleri Temizle
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Özellikler
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            UniNestcy ile öğrenci hayatınızı kolaylaştırın. Tüm ihtiyaçlarınız tek platformda!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{transitionDelay: `${feature.delay + 400}ms`}}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
              
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-light">
                  {feature.description}
                </p>
                
                {/* CTA Button */}
                <Link
                  href={feature.href}
                  className={`inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg`}
                >
                  Keşfet
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features 