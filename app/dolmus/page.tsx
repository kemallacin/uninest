'use client'

import React, { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Dolmus = () => {
  const [selectedRoute, setSelectedRoute] = useState('gazimagusa-girne')
  const [selectedDay, setSelectedDay] = useState('weekday')

  const routes = [
    { id: 'gazimagusa-girne', name: 'Gazimağusa - Girne', distance: '45 km', duration: '45 dk' },
    { id: 'gazimagusa-lefkosia', name: 'Gazimağusa - Lefkoşa', distance: '55 km', duration: '55 dk' },
    { id: 'girne-lefkosia', name: 'Girne - Lefkoşa', distance: '25 km', duration: '30 dk' },
    { id: 'lefke-gazimagusa', name: 'Lefke - Gazimağusa', distance: '35 km', duration: '40 dk' },
    { id: 'lefke-lefkosia', name: 'Lefke - Lefkoşa', distance: '50 km', duration: '50 dk' }
  ]

  const schedules = {
    'gazimagusa-girne': {
      weekday: [
        { time: '06:00', type: 'normal' },
        { time: '07:00', type: 'normal' },
        { time: '08:00', type: 'express' },
        { time: '09:00', type: 'normal' },
        { time: '10:00', type: 'normal' },
        { time: '11:00', type: 'normal' },
        { time: '12:00', type: 'express' },
        { time: '13:00', type: 'normal' },
        { time: '14:00', type: 'normal' },
        { time: '15:00', type: 'normal' },
        { time: '16:00', type: 'express' },
        { time: '17:00', type: 'normal' },
        { time: '18:00', type: 'normal' },
        { time: '19:00', type: 'normal' },
        { time: '20:00', type: 'normal' },
        { time: '21:00', type: 'normal' },
        { time: '22:00', type: 'normal' }
      ],
      weekend: [
        { time: '07:00', type: 'normal' },
        { time: '08:00', type: 'normal' },
        { time: '09:00', type: 'normal' },
        { time: '10:00', type: 'normal' },
        { time: '11:00', type: 'normal' },
        { time: '12:00', type: 'normal' },
        { time: '13:00', type: 'normal' },
        { time: '14:00', type: 'normal' },
        { time: '15:00', type: 'normal' },
        { time: '16:00', type: 'normal' },
        { time: '17:00', type: 'normal' },
        { time: '18:00', type: 'normal' },
        { time: '19:00', type: 'normal' },
        { time: '20:00', type: 'normal' },
        { time: '21:00', type: 'normal' }
      ]
    }
  }

  const currentSchedule = schedules[selectedRoute as keyof typeof schedules]?.[selectedDay as keyof typeof schedules['gazimagusa-girne']] || []

  // Duraklar verisi: Her rota için duraklar
  const routeStops = {
    'gazimagusa-girne': ['Gazimağusa', 'İskele', 'Bogaz', 'Lapta', 'Girne'],
    'gazimagusa-lefkosia': ['Gazimağusa', 'İskele', 'Bogaz', 'Lefkoşa'],
    'girne-lefkosia': ['Girne', 'Lapta', 'Lefkoşa'],
    'lefke-gazimagusa': ['Lefke', 'Güzelyurt', 'Lefkoşa', 'Gazimağusa'],
    'lefke-lefkosia': ['Lefke', 'Güzelyurt', 'Lefkoşa'],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dolmuş Saatleri
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kıbrıs'ta dolmuş saatlerini öğren, rotaları planla ve zamanında git
          </p>
        </div>

        {/* Route Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Rota Seçin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedRoute === route.id
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-900'
                }`}
              >
                <div className="text-left">
                  <h4 className={`font-semibold ${selectedRoute === route.id ? 'text-primary-700' : 'text-gray-900'}`}>{route.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {route.distance} • {route.duration}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">
              {routes.find(r => r.id === selectedRoute)?.name} Saatleri
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDay('weekday')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedDay === 'weekday'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Hafta İçi
              </button>
              <button
                onClick={() => setSelectedDay('weekend')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedDay === 'weekend'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Hafta Sonu
              </button>
            </div>
          </div>

          {currentSchedule.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentSchedule.map((schedule, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-center transition-colors ${
                    schedule.type === 'express'
                      ? 'bg-yellow-100 border-2 border-yellow-300'
                      : 'bg-gray-100 border-2 border-gray-200'
                  }`}
                >
                  <div className="text-xl font-bold text-gray-900">
                    {schedule.time}
                  </div>
                  {schedule.type === 'express' && (
                    <div className="text-xs text-yellow-700 font-medium mt-1">
                      Express
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Bu rota için henüz saat bilgisi bulunmuyor.
            </div>
          )}
        </div>

        {/* Route Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Dolmuş Durakları</h3>
            <div className="space-y-3">
              {(routeStops[selectedRoute] || []).map((stop, idx) => (
                <div className="flex items-center" key={stop + '-' + idx}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${idx === 0 || idx === (routeStops[selectedRoute] || []).length - 1 ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                  <span className={`font-medium text-gray-900 ${idx === 0 || idx === (routeStops[selectedRoute] || []).length - 1 ? 'font-bold' : ''}`}>{stop}</span>
              </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Önemli Bilgiler</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <span className="text-gray-700">Express dolmuşlar daha az durak yapar</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">💰</span>
                <span className="text-gray-700">Fiyat: 15-25 TL (mesafeye göre)</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">📱</span>
                <span className="text-gray-700">Rezervasyon için 24 saat önceden haber verin</span>
              </div>
              <div className="flex items-start">
                <span className="text-red-500 mr-2">⏰</span>
                <span className="text-gray-700">Hafta sonu saatler değişebilir</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Güncel Saatleri Takip Et
          </h2>
          <p className="text-blue-100 mb-6">
            Dolmuş saatlerinde değişiklik olursa anında haberdar ol
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Bildirim Al
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Dolmus 