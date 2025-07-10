'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Etkinlikler = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('')

  const categories = [
    { id: 'all', name: 'Tümü', icon: '🎉' },
    { id: 'academic', name: 'Akademik', icon: '📚' },
    { id: 'social', name: 'Sosyal', icon: '👥' },
    { id: 'sports', name: 'Spor', icon: '⚽' },
    { id: 'culture', name: 'Kültür', icon: '🎭' },
    { id: 'music', name: 'Müzik', icon: '🎵' },
    { id: 'food', name: 'Yemek', icon: '🍕' },
    { id: 'travel', name: 'Gezi', icon: '✈️' }
  ]

  const locations = [
    'Gazimağusa',
    'Girne',
    'Lefkoşa',
    'Lefke',
    'İskele'
  ]

  const mockEvents = [
    {
      id: 1,
      title: 'Öğrenci Buluşması - Gazimağusa',
      category: 'social',
      location: 'Gazimağusa',
      date: '2024-01-15',
      time: '19:00',
      price: 'Ücretsiz',
      description: 'Yeni öğrencilerle tanışma, sohbet ve networking etkinliği. Yemek ve içecek ikramı var.',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
      organizer: 'DAÜ Öğrenci Kulübü',
      attendees: 45,
      maxAttendees: 60,
      tags: ['Networking', 'Yeni Öğrenciler', 'Sosyal']
    },
    {
      id: 2,
      title: 'Basketbol Turnuvası',
      category: 'sports',
      location: 'Girne',
      date: '2024-01-20',
      time: '14:00',
      price: '50 TL',
      description: 'Üniversiteler arası basketbol turnuvası. Takım kayıtları açık.',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop',
      organizer: 'GAÜ Spor Kulübü',
      attendees: 80,
      maxAttendees: 100,
      tags: ['Basketbol', 'Turnuva', 'Spor']
    },
    {
      id: 3,
      title: 'Kıbrıs Mutfağı Workshop',
      category: 'food',
      location: 'Lefkoşa',
      date: '2024-01-18',
      time: '16:00',
      price: '100 TL',
      description: 'Geleneksel Kıbrıs yemeklerini öğrenin. Malzemeler dahil.',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop',
      organizer: 'Kıbrıs Mutfak Akademisi',
      attendees: 25,
      maxAttendees: 30,
      tags: ['Yemek', 'Workshop', 'Kültür']
    },
    {
      id: 4,
      title: 'Konser: Öğrenci Müzik Gecesi',
      category: 'music',
      location: 'Gazimağusa',
      date: '2024-01-25',
      time: '20:00',
      price: '75 TL',
      description: 'Öğrenci gruplarının performansları. Canlı müzik ve dans.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
      organizer: 'DAÜ Müzik Kulübü',
      attendees: 120,
      maxAttendees: 150,
      tags: ['Konser', 'Canlı Müzik', 'Dans']
    },
    {
      id: 5,
      title: 'Akademik Kariyer Semineri',
      category: 'academic',
      location: 'Girne',
      date: '2024-01-22',
      time: '15:00',
      price: 'Ücretsiz',
      description: 'Mezuniyet sonrası kariyer planlaması ve iş fırsatları hakkında seminer.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop',
      organizer: 'GAÜ Kariyer Merkezi',
      attendees: 65,
      maxAttendees: 80,
      tags: ['Kariyer', 'Seminer', 'Akademik']
    },
    {
      id: 6,
      title: 'Kıbrıs Tarihi Gezisi',
      category: 'travel',
      location: 'Lefke',
      date: '2024-01-28',
      time: '09:00',
      price: '150 TL',
      description: 'Rehber eşliğinde Kıbrıs\'ın tarihi yerlerini keşfedin. Ulaşım dahil.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      organizer: 'Kıbrıs Turizm Derneği',
      attendees: 35,
      maxAttendees: 40,
      tags: ['Gezi', 'Tarih', 'Kültür']
    }
  ]

  const filteredEvents = mockEvents.filter(event => {
    const matchesCategory = activeCategory === 'all' || event.category === activeCategory
    const matchesLocation = !selectedLocation || event.location === selectedLocation
    return matchesCategory && matchesLocation
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getAttendancePercentage = (attendees: number, maxAttendees: number) => {
    return Math.round((attendees / maxAttendees) * 100)
  }

  const handleModalClose = () => {
    setShowJoinModal(false)
    setShowDetailsModal(false)
    setShowCreateEventModal(false)
    setSelectedEvent(null)
    setUserName('')
    setUserEmail('')
    setUserPhone('')
  }

  // ESC tuşu ile modal'ları kapatma
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleModalClose()
      }
    }

    if (showJoinModal || showDetailsModal || showCreateEventModal) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [showJoinModal, showDetailsModal, showCreateEventModal])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Öğrenci Etkinlikleri
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kıbrıs'taki öğrenci etkinliklerini keşfet, yeni arkadaşlar edin ve unutulmaz anılar biriktir
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Kategori</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Konum</h3>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="input-field"
              >
                <option value="">Tüm Konumlar</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
                  {event.price}
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                  {event.category === 'social' && '👥'}
                  {event.category === 'sports' && '⚽'}
                  {event.category === 'food' && '🍕'}
                  {event.category === 'music' && '🎵'}
                  {event.category === 'academic' && '📚'}
                  {event.category === 'travel' && '✈️'}
                  {event.category === 'culture' && '🎭'}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <span className="mr-4">📅 {formatDate(event.date)}</span>
                  <span>🕒 {event.time}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <span className="mr-4">📍 {event.location}</span>
                  <span>👤 {event.organizer}</span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                {/* Attendance Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Katılımcılar: {event.attendees}/{event.maxAttendees}</span>
                    <span>{getAttendancePercentage(event.attendees, event.maxAttendees)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getAttendancePercentage(event.attendees, event.maxAttendees)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className="btn-primary flex-1"
                    onClick={() => {
                      setSelectedEvent(event)
                      setShowJoinModal(true)
                    }}
                    disabled={event.attendees >= event.maxAttendees}
                  >
                    {event.attendees >= event.maxAttendees ? 'Dolu' : 'Katıl'}
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedEvent(event)
                      setShowDetailsModal(true)
                    }}
                  >
                    Detaylar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Kendi Etkinliğini Oluştur
          </h2>
          <p className="text-purple-100 mb-6">
            Öğrenci topluluğuna katkıda bulun ve kendi etkinliğini organize et
          </p>
          <button 
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
            onClick={() => setShowCreateEventModal(true)}
          >
            Etkinlik Oluştur
          </button>
        </div>
      </div>

      {/* Join Event Modal */}
      {showJoinModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Etkinliğe Katıl</h3>
              <button 
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h4 className="font-semibold text-gray-900 mb-2">{selectedEvent.title}</h4>
              <div className="text-sm text-gray-600 mb-2">
                📅 {formatDate(selectedEvent.date)} - 🕒 {selectedEvent.time}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                📍 {selectedEvent.location} - 👤 {selectedEvent.organizer}
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span>Katılımcılar: {selectedEvent.attendees}/{selectedEvent.maxAttendees}</span>
                  <span>{getAttendancePercentage(selectedEvent.attendees, selectedEvent.maxAttendees)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${getAttendancePercentage(selectedEvent.attendees, selectedEvent.maxAttendees)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="input-field"
                  placeholder="Adınız ve soyadınız"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="input-field"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="input-field"
                  placeholder="+90 5XX XXX XX XX"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  type="submit"
                  className="btn-primary flex-1"
                  onClick={(e) => {
                    e.preventDefault()
                    if (userName && userEmail && userPhone) {
                      alert('Etkinliğe başarıyla kayıt oldunuz! Organizatör size e-posta ile bilgi gönderecek.')
                      handleModalClose()
                    } else {
                      alert('Lütfen tüm alanları doldurun.')
                    }
                  }}
                >
                  Kayıt Ol
                </button>
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={handleModalClose}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Etkinlik Detayları</h3>
              <button 
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
                  <div className="flex items-center mb-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedEvent.price}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div>📅 <strong>Tarih:</strong> {formatDate(selectedEvent.date)}</div>
                    <div>🕒 <strong>Saat:</strong> {selectedEvent.time}</div>
                    <div>📍 <strong>Konum:</strong> {selectedEvent.location}</div>
                    <div>👤 <strong>Organizatör:</strong> {selectedEvent.organizer}</div>
                  </div>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Katılım Bilgileri</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Mevcut Katılımcı:</span>
                      <span className="font-medium">{selectedEvent.attendees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maksimum Katılımcı:</span>
                      <span className="font-medium">{selectedEvent.maxAttendees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Doluluk Oranı:</span>
                      <span className="font-medium">{getAttendancePercentage(selectedEvent.attendees, selectedEvent.maxAttendees)}%</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${getAttendancePercentage(selectedEvent.attendees, selectedEvent.maxAttendees)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Etiketler</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag, index) => (
                      <span key={index} className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  className="btn-primary flex-1"
                  onClick={() => {
                    setShowDetailsModal(false)
                    setShowJoinModal(true)
                  }}
                  disabled={selectedEvent.attendees >= selectedEvent.maxAttendees}
                >
                  {selectedEvent.attendees >= selectedEvent.maxAttendees ? 'Etkinlik Dolu' : 'Etkinliğe Katıl'}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={handleModalClose}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Yeni Etkinlik Oluştur</h3>
              <button 
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Adı *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Etkinlik adını girin"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <select className="input-field" required>
                      <option value="">Kategori seçin</option>
                      {categories.slice(1).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tarih *</label>
                    <input
                      type="date"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saat *</label>
                    <input
                      type="time"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konum *</label>
                    <select className="input-field" required>
                      <option value="">Konum seçin</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Ücretsiz veya fiyat"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maksimum Katılımcı *</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="50"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Etkinlik hakkında detaylı bilgi verin"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizatör Bilgileri</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Organizatör adı"
                    />
                    <input
                      type="email"
                      className="input-field"
                      placeholder="İletişim e-postası"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    type="submit"
                    className="btn-primary flex-1"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Etkinlik başarıyla oluşturuldu! Onay için e-posta alacaksınız.')
                      handleModalClose()
                    }}
                  >
                    Etkinlik Oluştur
                  </button>
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={handleModalClose}
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}

export default Etkinlikler 