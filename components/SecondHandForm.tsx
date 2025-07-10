'use client'

import React, { useState, useRef } from 'react'
// Supabase ile ilgili import ve client oluşturma kaldırıldı

interface SecondHandFormProps {
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  urun_adi: string
  kategori: string
  satis_fiyati: string
  orijinal_fiyat: string
  urun_durumu: string
  konum: string
  telefon: string
  eposta: string
  aciklama: string
  urun_fotograf: string | null // Artık sadece string (URL) veya null
}

const SecondHandForm: React.FC<SecondHandFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    urun_adi: '',
    kategori: '',
    satis_fiyati: '',
    orijinal_fiyat: '',
    urun_durumu: '',
    konum: '',
    telefon: '',
    eposta: '',
    aciklama: '',
    urun_fotograf: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'mobilya', label: 'Mobilya' },
    { value: 'kitap', label: 'Kitap' },
    { value: 'giyim', label: 'Giyim' },
    { value: 'spor', label: 'Spor' },
    { value: 'diger', label: 'Diğer' }
  ]

  const conditions = [
    { value: 'yeni', label: 'Yeni' },
    { value: 'çok iyi', label: 'Çok İyi' },
    { value: 'iyi', label: 'İyi' },
    { value: 'orta', label: 'Orta' },
    { value: 'kötü', label: 'Kötü' }
  ]

  const locations = [
    { value: 'lefkosa', label: 'Lefkoşa' },
    { value: 'gazimagusa', label: 'Gazimağusa' },
    { value: 'girne', label: 'Girne' },
    { value: 'lefke', label: 'Lefke' },
    { value: 'iskele', label: 'İskele' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      urun_fotograf: file ? URL.createObjectURL(file) : null
    }))
  }

  // uploadImageToSupabase ve Supabase ile ilgili fonksiyonlar kaldırıldı

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    // Supabase ile ilgili işlemler kaldırıldı, sadece form validation ve success state bırakıldı
    if (!formData.urun_adi || !formData.kategori || !formData.satis_fiyati || !formData.urun_durumu || !formData.konum || !formData.telefon) {
      setError('Tüm alanlar zorunludur.')
      setIsSubmitting(false)
      return
    }

    try {
      // Form verilerini al
      const itemData = {
        urun_adi: formData.urun_adi,
        kategori: formData.kategori,
        satis_fiyati: parseFloat(formData.satis_fiyati),
        orijinal_fiyat: formData.orijinal_fiyat ? parseFloat(formData.orijinal_fiyat) : null,
        urun_durumu: formData.urun_durumu,
        konum: formData.konum,
        telefon: formData.telefon,
        eposta: formData.eposta,
        aciklama: formData.aciklama,
        urun_fotograf: formData.urun_fotograf ? URL.createObjectURL(formData.urun_fotograf) : null, // Yüklenen dosyanın URL'sini tut
        created_at: new Date().toISOString()
      }

      // Form verilerini state'e kaydet
      setFormData(prev => ({
        ...prev,
        urun_fotograf: null // Yüklenen dosyayı temizle
      }))

      // Success state'i aktif et
      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        urun_fotograf: URL.createObjectURL(file)
      }))
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            İlan Başarıyla Yayınlandı!
          </h3>
          <p className="text-gray-600">
            İlanınız başarıyla yayınlandı ve diğer kullanıcılar tarafından görülebilir.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Yeni İlan Ver</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ürün Bilgileri */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Ürün Bilgileri</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  name="urun_adi"
                  value={formData.urun_adi}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Örn: MacBook Pro 2019"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Satış Fiyatı (TL) *
                  </label>
                  <input
                    type="number"
                    name="satis_fiyati"
                    value={formData.satis_fiyati}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orijinal Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    name="orijinal_fiyat"
                    value={formData.orijinal_fiyat}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="2500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Durumu *
                </label>
                <select
                  name="urun_durumu"
                  value={formData.urun_durumu}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Durum Seçin</option>
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">İletişim Bilgileri</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum *
                </label>
                <select
                  name="konum"
                  value={formData.konum}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Şehir Seçin</option>
                  {locations.map(location => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numarası *
                </label>
                <input
                  type="tel"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+90 555 123 45 67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  name="eposta"
                  value={formData.eposta}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>
          </div>

          {/* Açıklama */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Açıklaması *
            </label>
            <textarea
              name="aciklama"
              value={formData.aciklama}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ürününüzün detaylı açıklamasını yazın..."
            />
          </div>

          {/* Fotoğraf Yükleme */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Fotoğrafı
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.urun_fotograf ? (
                <div>
                  <img 
                    src={formData.urun_fotograf} 
                    alt="Preview" 
                    className="mx-auto h-32 w-32 object-cover rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-600">
                    {formData.urun_fotograf.name}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFormData(prev => ({ ...prev, urun_fotograf: null }))
                    }}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Fotoğrafı Kaldır
                  </button>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Fotoğraf yüklemek için tıklayın veya sürükleyin
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF maksimum 10MB
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Yükleniyor...
                </>
              ) : (
                'İlanı Yayınla'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SecondHandForm 