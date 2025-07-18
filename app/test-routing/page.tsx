'use client'

import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function TestRouting() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Routing Test Sayfası
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Bu sayfa routing'in çalışıp çalışmadığını test etmek için oluşturuldu.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Test Sonuçları</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                <span>Sayfa yüklendi: ✅</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                <span>Header component: ✅</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                <span>Footer component: ✅</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                <span>Routing çalışıyor: ✅</span>
              </div>
            </div>
            
            <div className="mt-8">
              <a 
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ana Sayfaya Dön
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 