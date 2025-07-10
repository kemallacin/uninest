'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SecondHandForm from '../../components/SecondHandForm'

const IkinciEl = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showListingModal, setShowListingModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Fake login state - set to true to show form

  const categories = [
    { id: 'all', name: 'Tümü', icon: '🏠' },
    { id: 'electronics', name: 'Elektronik', icon: '💻' },
    { id: 'furniture', name: 'Mobilya', icon: '🪑' },
    { id: 'books', name: 'Kitap', icon: '📚' },
    { id: 'clothing', name: 'Giyim', icon: '👕' },
    { id: 'sports', name: 'Spor', icon: '⚽' },
    { id: 'other', name: 'Diğer', icon: '📦' }
  ]

  const mockItems = [
    {
      id: 1,
      title: 'MacBook Pro 2019',
      price: 15000,
      originalPrice: 25000,
      category: 'electronics',
      location: 'Gazimağusa',
      description: 'Çok iyi durumda, 8GB RAM, 256GB SSD',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop',
      seller: 'Ahmet Y.',
      condition: 'Çok İyi',
      postedDate: '2 gün önce'
    },
    {
      id: 2,
      title: 'Çalışma Masası ve Sandalye',
      price: 800,
      originalPrice: 1500,
      category: 'furniture',
      location: 'Girne',
      description: 'Ahşap çalışma masası ve ergonomik sandalye seti',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      seller: 'Ayşe D.',
      condition: 'İyi',
      postedDate: '1 hafta önce'
    },
    {
      id: 3,
      title: 'Mühendislik Ders Kitapları',
      price: 200,
      originalPrice: 500,
      category: 'books',
      location: 'Lefkoşa',
      description: 'Bilgisayar mühendisliği 1-2. sınıf ders kitapları',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
      seller: 'Mehmet K.',
      condition: 'Yeni',
      postedDate: '3 gün önce'
    },
    {
      id: 4,
      title: 'Bisiklet',
      price: 1200,
      originalPrice: 2000,
      category: 'sports',
      location: 'Lefke',
      description: 'Dağ bisikleti, 21 vites, çok az kullanılmış',
      image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=300&h=200&fit=crop',
      seller: 'Can Ö.',
      condition: 'İyi',
      postedDate: '5 gün önce'
    }
  ]

  const filteredItems = mockItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleModalClose = () => {
    setShowContactModal(false)
    setShowDetailsModal(false)
    setShowListingModal(false)
    setSelectedItem(null)
  }

  const handleİlanVer = () => {
    if (!isLoggedIn) {
      // Redirect to login (for now, just show an alert)
      alert('İlan vermek için giriş yapmanız gerekiyor!')
      return
    }
    setShowListingModal(true)
  }



  // ESC tuşu ile modal'ları kapatma
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleModalClose()
      }
    }

    if (showContactModal || showDetailsModal || showListingModal) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [showContactModal, showDetailsModal, showListingModal])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            2.El Eşya Pazarı
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İkinci el eşyalarını sat veya ihtiyacın olan eşyaları uygun fiyata bul
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Ne arıyorsun?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field text-gray-900 bg-white"
              style={{ color: '#111827', backgroundColor: 'white' }}
            />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="input-field text-gray-900 bg-white"
              style={{ color: '#111827', backgroundColor: 'white' }}
            >
              <option value="" style={{ color: '#111827', backgroundColor: 'white' }}>Fiyat Aralığı</option>
              <option value="0-500" style={{ color: '#111827', backgroundColor: 'white' }}>0-500 TL</option>
              <option value="500-1000" style={{ color: '#111827', backgroundColor: 'white' }}>500-1000 TL</option>
              <option value="1000-5000" style={{ color: '#111827', backgroundColor: 'white' }}>1000-5000 TL</option>
              <option value="5000+" style={{ color: '#111827', backgroundColor: 'white' }}>5000+ TL</option>
            </select>
            <button className="btn-primary">
              Ara
            </button>
          </div>

          {/* Categories */}
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

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                  %{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)} İndirim
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary-600">
                    {item.price.toLocaleString()} TL
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {item.originalPrice.toLocaleString()} TL
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>📍 {item.location}</span>
                  <span>👤 {item.seller}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {item.condition}
                  </span>
                  <span className="text-gray-500">{item.postedDate}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className="btn-primary flex-1"
                    onClick={() => {
                      setSelectedItem(item)
                      setShowContactModal(true)
                    }}
                  >
                    İletişime Geç
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedItem(item)
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
            Eşyalarını Sat, Para Kazan
          </h2>
          <p className="text-green-100 mb-6">
            Kullanmadığın eşyalarını satarak para kazan ve başka öğrencilere yardım et
          </p>
          <button 
            onClick={handleİlanVer}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            İlan Ver
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">İletişim Bilgileri</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h4 className="font-semibold text-gray-900 mb-2">{selectedItem.title}</h4>
              <p className="text-2xl font-bold text-primary-600 mb-4">{selectedItem.price.toLocaleString()} TL</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-gray-600 w-20">Satıcı:</span>
                <span className="font-medium">{selectedItem.seller}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-20">Konum:</span>
                <span className="font-medium">{selectedItem.location}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-20">Durum:</span>
                <span className="font-medium">{selectedItem.condition}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                📞 Telefon Ara
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                💬 WhatsApp
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                📧 E-posta Gönder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Ürün Detayları</h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
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
                    src={selectedItem.image} 
                    alt={selectedItem.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl font-bold text-primary-600">{selectedItem.price.toLocaleString()} TL</span>
                    <span className="text-lg text-gray-500 line-through ml-2">{selectedItem.originalPrice.toLocaleString()} TL</span>
                  </div>
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                    %{Math.round(((selectedItem.originalPrice - selectedItem.price) / selectedItem.originalPrice) * 100)} İndirim
                  </div>
                  <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Satıcı Bilgileri</h4>
                  <p className="text-gray-600">👤 {selectedItem.seller}</p>
                  <p className="text-gray-600">📍 {selectedItem.location}</p>
                  <p className="text-gray-600">📅 {selectedItem.postedDate}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Ürün Bilgileri</h4>
                  <p className="text-gray-600">🏷️ Durum: {selectedItem.condition}</p>
                  <p className="text-gray-600">📦 Kategori: {categories.find(c => c.id === selectedItem.category)?.name}</p>
                </div>
              </div>

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
                  onClick={() => setShowDetailsModal(false)}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SecondHandForm Modal */}
      {showListingModal && (
        <SecondHandForm 
          onClose={() => setShowListingModal(false)}
          onSuccess={() => {
            console.log('Item posted successfully!')
            // You can add additional success handling here
            // For example, refresh the items list
          }}
        />
      )}
      
      <Footer />
    </div>
  )
}

export default IkinciEl 