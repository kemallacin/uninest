'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import UKFlag from '../../components/flags/UKFlag';
import TRFlag from '../../components/flags/TRFlag';

const OzelDersler = () => {
  const [activeTab, setActiveTab] = useState('veren')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showTeachModal, setShowTeachModal] = useState(false)
  const [showLearnModal, setShowLearnModal] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [tutors, setTutors] = useState([])
  const [students, setStudents] = useState([])

  const subjects = [
    { id: 'all', name: 'Tüm Dersler', icon: '📚' },
    { id: 'mathematics', name: 'Matematik', icon: '🔢' },
    { id: 'physics', name: 'Fizik', icon: '⚡' },
    { id: 'chemistry', name: 'Kimya', icon: '🧪' },
    { id: 'biology', name: 'Biyoloji', icon: '🧬' },
    { id: 'english', name: 'İngilizce', icon: '🇬🇧' },
    { id: 'turkish', name: 'Türkçe', icon: '🇹🇷' },
    { id: 'computer', name: 'Bilgisayar', icon: '💻' },
    { id: 'economics', name: 'Ekonomi', icon: '💰' },
    { id: 'music', name: 'Müzik', icon: '🎵' }
  ]

  const locations = [
    'Gazimağusa',
    'Girne',
    'Lefkoşa',
    'Lefke',
    'İskele',
    'Online'
  ]

  // Mock veriler
  const mockTutors = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      subject: 'mathematics',
      university: 'Doğu Akdeniz Üniversitesi',
      department: 'Matematik Mühendisliği',
      year: '3. Sınıf',
      location: 'Gazimağusa',
      price: '150 TL/saat',
      rating: 4.8,
      reviews_count: 24,
      description: 'Matematik ve geometri derslerinde 2 yıllık deneyim. Özellikle calculus ve lineer cebir konularında uzmanım.',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      availability: ['Pazartesi', 'Çarşamba', 'Cuma'],
      languages: ['Türkçe', 'İngilizce'],
      online: true
    },
    {
      id: 2,
      name: 'Ayşe Demir',
      subject: 'english',
      university: 'Girne Amerikan Üniversitesi',
      department: 'İngiliz Dili ve Edebiyatı',
      year: '4. Sınıf',
      location: 'Girne',
      price: '120 TL/saat',
      rating: 4.9,
      reviews_count: 31,
      description: 'IELTS ve TOEFL sınavlarına hazırlık, konuşma pratiği ve gramer dersleri. Native speaker seviyesinde İngilizce.',
      image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      availability: ['Salı', 'Perşembe', 'Cumartesi'],
      languages: ['Türkçe', 'İngilizce'],
      online: true
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      subject: 'computer',
      university: 'Lefke Avrupa Üniversitesi',
      department: 'Bilgisayar Mühendisliği',
      year: 'Mezun',
      location: 'Lefkoşa',
      price: '200 TL/saat',
      rating: 4.7,
      reviews_count: 18,
      description: 'Programlama dilleri (Python, Java, C++), web geliştirme ve veri yapıları konularında özel ders.',
      image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      availability: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe'],
      languages: ['Türkçe', 'İngilizce'],
      online: false
    },
    {
      id: 4,
      name: 'Zeynep Özkan',
      subject: 'physics',
      university: 'Doğu Akdeniz Üniversitesi',
      department: 'Fizik Mühendisliği',
      year: '2. Sınıf',
      location: 'Gazimağusa',
      price: '130 TL/saat',
      rating: 4.6,
      reviews_count: 15,
      description: 'Mekanik, elektrik ve manyetizma konularında özel ders. Laboratuvar deneyimleri ile destekli öğretim.',
      image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      availability: ['Cumartesi', 'Pazar'],
      languages: ['Türkçe'],
      online: true
    }
  ]

  const mockStudents = [
    {
      id: 1,
      name: 'Can Yıldız',
      subject: 'mathematics',
      university: 'Doğu Akdeniz Üniversitesi',
      department: 'İnşaat Mühendisliği',
      year: '1. Sınıf',
      location: 'Gazimağusa',
      budget: '100-150 TL/saat',
      description: 'Calculus dersinde zorlanıyorum. Haftada 2 saat ders almak istiyorum.',
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      urgency: 'Acil',
      online: true
    },
    {
      id: 2,
      name: 'Elif Arslan',
      subject: 'english',
      university: 'Girne Amerikan Üniversitesi',
      department: 'İşletme',
      year: '2. Sınıf',
      location: 'Girne',
      budget: '80-120 TL/saat',
      description: 'IELTS sınavına hazırlanıyorum. Konuşma pratiği yapmak istiyorum.',
      image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      urgency: 'Normal',
      online: false
    }
  ]

  // Verileri yükle
  useEffect(() => {
    setTutors(mockTutors)
    setStudents(mockStudents)
  }, [])

  const filteredData = activeTab === 'veren' 
    ? tutors.filter(tutor => {
        const matchesSubject = selectedSubject === 'all' || tutor.subject === selectedSubject
        const matchesLocation = !selectedLocation || tutor.location === selectedLocation
        return matchesSubject && matchesLocation
      })
    : students.filter(student => {
        const matchesSubject = selectedSubject === 'all' || student.subject === selectedSubject
        const matchesLocation = !selectedLocation || student.location === selectedLocation
        return matchesSubject && matchesLocation
      })

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  const handleModalClose = () => {
    setShowContactModal(false)
    setShowDetailsModal(false)
    setShowTeachModal(false)
    setShowLearnModal(false)
    setSelectedPerson(null)
    setUserName('')
    setUserEmail('')
    setUserPhone('')
    setUserMessage('')
  }

  // İletişim mesajı gönderme
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userName || !userEmail || !userPhone || !userMessage || !selectedPerson) {
      alert('Lütfen tüm alanları doldurun.')
      return
    }

    try {
      // Mock mesaj gönderme
      alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapılacak.')
      handleModalClose()
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error)
      alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  // ESC tuşu ile modal'ları kapatma
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleModalClose()
      }
    }

    if (showContactModal || showDetailsModal || showTeachModal || showLearnModal) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [showContactModal, showDetailsModal, showTeachModal, showLearnModal])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Özel Dersler
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Özel ders ver veya al, akademik başarını artır ve yeni arkadaşlar edin
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('veren')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'veren'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ders Verenler
            </button>
            <button
              onClick={() => setActiveTab('alan')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'alan'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ders Alanlar
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ders Kategorisi</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors h-28 shadow-sm bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                      selectedSubject === subject.id
                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md'
                        : 'border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <span className="mb-2">
                      {subject.id === 'english' ? <UKFlag className="w-8 h-8" /> : subject.id === 'turkish' ? <TRFlag className="w-8 h-8" /> : <span className="text-3xl">{subject.icon}</span>}
                    </span>
                    <span className="text-base font-semibold text-gray-900 text-center leading-tight">{subject.name}</span>
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

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((person) => (
            <div key={person.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={person.image_url}
                    alt={person.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-gray-600">{person.university}</p>
                    <p className="text-sm text-gray-500">{person.department} - {person.year}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Ders:</span> {subjects.find(s => s.id === person.subject)?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Konum:</span> {person.location}
                  </p>
                  {activeTab === 'veren' && (
                    <>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Fiyat:</span> {person.price}
                      </p>
                      <div className="flex items-center">
                        {renderStars(person.rating)}
                        <span className="ml-2 text-sm text-gray-500">({person.reviews_count} değerlendirme)</span>
                      </div>
                    </>
                  )}
                  {activeTab === 'alan' && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Bütçe:</span> {person.budget}
                    </p>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4">{person.description}</p>
                
                {activeTab === 'veren' && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Müsait Günler:</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {person.availability.map((day, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'alan' && (
                  <div className="mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      person.urgency === 'Acil' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {person.urgency}
                    </span>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button 
                    className="btn-primary flex-1"
                    onClick={() => {
                      setSelectedPerson(person)
                      setShowContactModal(true)
                    }}
                  >
                    İletişime Geç
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedPerson(person)
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
        <div className="mt-12 bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Sen de Özel Ders Ver veya Al
          </h2>
          <p className="text-green-100 mb-6">
            Bilgilerini paylaş ve öğrenci topluluğuna katkıda bulun
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
              onClick={() => setShowTeachModal(true)}
            >
              Ders Ver
            </button>
            <button 
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
              onClick={() => setShowLearnModal(true)}
            >
              Ders Al
            </button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">İletişim</h3>
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
              <div className="flex items-center mb-4">
                <img
                  src={selectedPerson.image_url}
                  alt={selectedPerson.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedPerson.name}</h4>
                  <p className="text-gray-600">{selectedPerson.university}</p>
                  <p className="text-sm text-gray-500">{selectedPerson.department} - {selectedPerson.year}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ders:</span> {subjects.find(s => s.id === selectedPerson.subject)?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Konum:</span> {selectedPerson.location}
                </p>
                {activeTab === 'veren' && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fiyat:</span> {selectedPerson.price}
                  </p>
                )}
                {activeTab === 'alan' && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Bütçe:</span> {selectedPerson.budget}
                  </p>
                )}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder="Mesajınızı yazın..."
                  required
                ></textarea>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  type="submit"
                  className="btn-primary flex-1"
                  onClick={(e) => {
                    e.preventDefault()
                    handleSendMessage(e)
                  }}
                >
                  Mesaj Gönder
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

      {/* Details Modal */}
      {showDetailsModal && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Detaylı Bilgiler</h3>
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
                    src={selectedPerson.image_url} 
                    alt={selectedPerson.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPerson.name}</h2>
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div>🎓 <strong>Üniversite:</strong> {selectedPerson.university}</div>
                    <div>📚 <strong>Bölüm:</strong> {selectedPerson.department}</div>
                    <div>📅 <strong>Sınıf:</strong> {selectedPerson.year}</div>
                    <div>📍 <strong>Konum:</strong> {selectedPerson.location}</div>
                    <div>📖 <strong>Ders:</strong> {subjects.find(s => s.id === selectedPerson.subject)?.name}</div>
                  </div>
                  
                  {activeTab === 'veren' && (
                    <div className="space-y-2 mb-4">
                      <div>💰 <strong>Fiyat:</strong> {selectedPerson.price}</div>
                      <div className="flex items-center">
                        {renderStars(selectedPerson.rating)}
                        <span className="ml-2 text-sm text-gray-500">({selectedPerson.reviews_count} değerlendirme)</span>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'alan' && (
                    <div className="space-y-2 mb-4">
                      <div>💰 <strong>Bütçe:</strong> {selectedPerson.budget}</div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedPerson.urgency === 'Acil' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedPerson.urgency}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-700">{selectedPerson.description}</p>
                </div>
              </div>

              {activeTab === 'veren' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Müsait Günler</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPerson.availability.map((day, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Diller</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPerson.languages.map((language, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button 
                  className="btn-primary flex-1"
                  onClick={() => {
                    setShowDetailsModal(false)
                    setShowContactModal(true)
                  }}
                >
                  İletişime Geç
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

      {/* Teach Modal */}
      {showTeachModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Ders Ver</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Adınız ve soyadınız"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="+90 5XX XXX XX XX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vereceğin Ders *</label>
                    <select className="input-field" required>
                      <option value="">Ders seçin</option>
                      {subjects.slice(1).map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.icon} {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Üniversite *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Üniversite adı"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bölüm *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Bölüm adı"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf *</label>
                    <select className="input-field" required>
                      <option value="">Sınıf seçin</option>
                      <option value="1">1. Sınıf</option>
                      <option value="2">2. Sınıf</option>
                      <option value="3">3. Sınıf</option>
                      <option value="4">4. Sınıf</option>
                      <option value="mezun">Mezun</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konum *</label>
                    <select className="input-field" required>
                      <option value="">Konum seçin</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saatlik Ücret *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="150 TL/saat"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Online Ders</label>
                    <select className="input-field">
                      <option value="true">Evet</option>
                      <option value="false">Hayır</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Müsait Günler *</label>
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                    {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day) => (
                      <label key={day} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-gray-900">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Ders verme deneyiminiz ve özel alanlarınız hakkında bilgi verin"
                    required
                  ></textarea>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    type="submit"
                    className="btn-primary flex-1"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Başvurunuz başarıyla gönderildi! Onay için e-posta alacaksınız.')
                      handleModalClose()
                    }}
                  >
                    Başvuru Gönder
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

      {/* Learn Modal */}
      {showLearnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Ders Al</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Adınız ve soyadınız"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="+90 5XX XXX XX XX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Almak İstediğin Ders *</label>
                    <select className="input-field" required>
                      <option value="">Ders seçin</option>
                      {subjects.slice(1).map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.icon} {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Üniversite</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Üniversite adı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bölüm</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Bölüm adı"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf</label>
                    <select className="input-field">
                      <option value="">Sınıf seçin</option>
                      <option value="1">1. Sınıf</option>
                      <option value="2">2. Sınıf</option>
                      <option value="3">3. Sınıf</option>
                      <option value="4">4. Sınıf</option>
                      <option value="mezun">Mezun</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konum *</label>
                    <select className="input-field" required>
                      <option value="">Konum seçin</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bütçe Aralığı *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="100-150 TL/saat"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Online Ders</label>
                    <select className="input-field">
                      <option value="true">Evet</option>
                      <option value="false">Hayır</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Hangi konularda zorlandığınız ve ne tür bir yardım istediğiniz hakkında bilgi verin"
                    required
                  ></textarea>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    type="submit"
                    className="btn-primary flex-1"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('İsteğiniz başarıyla gönderildi! Uygun öğretmenler size ulaşacak.')
                      handleModalClose()
                    }}
                  >
                    İstek Gönder
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

export default OzelDersler 