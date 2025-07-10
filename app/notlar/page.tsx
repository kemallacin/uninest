'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Notlar = () => {
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadSubject, setUploadSubject] = useState('all');
  const [uploadFile, setUploadFile] = useState(null);

  const subjects = [
    { id: 'all', name: 'Tüm Dersler', icon: '📚' },
    { id: 'mathematics', name: 'Matematik', icon: '🔢' },
    { id: 'physics', name: 'Fizik', icon: '⚡' },
    { id: 'chemistry', name: 'Kimya', icon: '🧪' },
    { id: 'biology', name: 'Biyoloji', icon: '🧬' },
    { id: 'computer', name: 'Bilgisayar', icon: '💻' },
    { id: 'economics', name: 'Ekonomi', icon: '💰' },
    { id: 'engineering', name: 'Mühendislik', icon: '⚙️' },
    { id: 'medicine', name: 'Tıp', icon: '🏥' },
    { id: 'law', name: 'Hukuk', icon: '⚖️' }
  ]

  const universities = [
    'Doğu Akdeniz Üniversitesi',
    'Girne Amerikan Üniversitesi',
    'Lefke Avrupa Üniversitesi',
    'Yakın Doğu Üniversitesi',
    'Uluslararası Kıbrıs Üniversitesi'
  ]

  const mockNotes = [
    {
      id: 1,
      title: 'Calculus I - Türev Konusu Notları',
      subject: 'mathematics',
      university: 'Doğu Akdeniz Üniversitesi',
      department: 'Bilgisayar Mühendisliği',
      year: '1. Sınıf',
      author: 'Ahmet Yılmaz',
      uploadDate: '2024-01-10',
      downloads: 156,
      rating: 4.8,
      fileSize: '2.3 MB',
      fileType: 'PDF',
      description: 'Türev konusunun detaylı notları, örnekler ve çözümler dahil. Final sınavı için ideal.',
      tags: ['Calculus', 'Türev', 'Matematik', 'Final']
    },
    {
      id: 2,
      title: 'Fizik I - Mekanik Formülleri',
      subject: 'physics',
      university: 'Girne Amerikan Üniversitesi',
      department: 'Fizik Mühendisliği',
      year: '1. Sınıf',
      author: 'Zeynep Özkan',
      uploadDate: '2024-01-08',
      downloads: 89,
      rating: 4.6,
      fileSize: '1.8 MB',
      fileType: 'PDF',
      description: 'Mekanik konusundaki tüm formüller ve açıklamalar. Pratik çözümler eklenmiş.',
      tags: ['Fizik', 'Mekanik', 'Formüller', 'Vize']
    },
    {
      id: 3,
      title: 'Veri Yapıları ve Algoritmalar',
      subject: 'computer',
      university: 'Lefke Avrupa Üniversitesi',
      department: 'Bilgisayar Mühendisliği',
      year: '2. Sınıf',
      author: 'Mehmet Kaya',
      uploadDate: '2024-01-05',
      downloads: 234,
      rating: 4.9,
      fileSize: '4.1 MB',
      fileType: 'PDF',
      description: 'Veri yapıları konusunun kapsamlı notları. Kod örnekleri ve algoritma analizleri.',
      tags: ['Programlama', 'Algoritma', 'Veri Yapıları', 'Java']
    },
    {
      id: 4,
      title: 'İngilizce Gramer Notları',
      subject: 'english',
      university: 'Doğu Akdeniz Üniversitesi',
      department: 'İngiliz Dili ve Edebiyatı',
      year: '1. Sınıf',
      author: 'Ayşe Demir',
      uploadDate: '2024-01-12',
      downloads: 67,
      rating: 4.7,
      fileSize: '3.2 MB',
      fileType: 'PDF',
      description: 'İngilizce gramer kuralları ve örnekler. IELTS sınavı için hazırlanmış.',
      tags: ['İngilizce', 'Gramer', 'IELTS', 'Dil']
    },
    {
      id: 5,
      title: 'Mikroekonomi Ödev Çözümleri',
      subject: 'economics',
      university: 'Girne Amerikan Üniversitesi',
      department: 'İşletme',
      year: '2. Sınıf',
      author: 'Can Yıldız',
      uploadDate: '2024-01-15',
      downloads: 45,
      rating: 4.5,
      fileSize: '1.5 MB',
      fileType: 'PDF',
      description: 'Mikroekonomi dersindeki ödev sorularının detaylı çözümleri.',
      tags: ['Ekonomi', 'Mikroekonomi', 'Ödev', 'Çözüm']
    },
    {
      id: 6,
      title: 'Organik Kimya Laboratuvar Raporu',
      subject: 'chemistry',
      university: 'Yakın Doğu Üniversitesi',
      department: 'Kimya Mühendisliği',
      year: '2. Sınıf',
      author: 'Elif Arslan',
      uploadDate: '2024-01-14',
      downloads: 78,
      rating: 4.4,
      fileSize: '2.8 MB',
      fileType: 'PDF',
      description: 'Organik kimya laboratuvar deneylerinin raporları ve sonuçları.',
      tags: ['Kimya', 'Laboratuvar', 'Organik', 'Rapor']
    }
  ]

  const filteredNotes = mockNotes.filter(note => {
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject
    const matchesUniversity = !selectedUniversity || note.university === selectedUniversity
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSubject && matchesUniversity && matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

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

  // Modal kapatma fonksiyonu ve ESC ile kapama
  const handleModalClose = () => {
    setShowUploadModal(false);
    setUploadTitle('');
    setUploadDesc('');
    setUploadSubject('all');
    setUploadFile(null);
  };
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') handleModalClose(); };
    if (showUploadModal) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [showUploadModal]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Not ve Ödev Paylaşımı
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ders notlarını ve ödevleri paylaş, birlikte öğren ve akademik başarını artır
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Not ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="input-field"
            >
              <option value="">Tüm Üniversiteler</option>
              {universities.map((university) => (
                <option key={university} value={university}>{university}</option>
              ))}
            </select>
            <button className="btn-primary">
              Ara
            </button>
          </div>

          {/* Subject Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ders Kategorileri</h3>
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
                  <span className="text-3xl mb-2">{subject.icon}</span>
                  <span className="text-base font-semibold text-gray-900 text-center leading-tight">{subject.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {note.university} - {note.department}
                    </p>
                    <p className="text-sm text-gray-500">{note.year}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm text-gray-500">{note.fileType}</div>
                    <div className="text-sm text-gray-500">{note.fileSize}</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>👤 {note.author}</span>
                    <span>📅 {formatDate(note.uploadDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>⬇️ {note.downloads} indirme</span>
                    <div className="flex items-center">
                      {renderStars(note.rating)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {note.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <button className="btn-primary flex-1">İndir</button>
                  <button className="btn-secondary">Önizle</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Notlarını Paylaş, Topluluğa Katkıda Bulun
          </h2>
          <p className="text-indigo-100 mb-6">
            Sen de notlarını ve ödevlerini paylaşarak diğer öğrencilere yardım et
          </p>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
            onClick={() => setShowUploadModal(true)}
          >
            Not Yükle
          </button>
        </div>
      </div>
      
      <Footer />

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Not Yükle</h3>
              <button onClick={handleModalClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                <input type="text" className="input-field" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} required placeholder="Not başlığı" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
                <textarea className="input-field" rows={3} value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} required placeholder="Kısa açıklama" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ders *</label>
                <select className="input-field" value={uploadSubject} onChange={e => setUploadSubject(e.target.value)} required>
                  {subjects.map(subj => (
                    <option key={subj.id} value={subj.id}>{subj.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosya *</label>
                <input type="file" className="input-field" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => setUploadFile(e.target.files[0])} required />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  onClick={e => {
                    e.preventDefault();
                    if (uploadTitle && uploadDesc && uploadSubject && uploadFile) {
                      alert('Not başarıyla yüklendi! (Simülasyon)');
                      handleModalClose();
                    } else {
                      alert('Lütfen tüm alanları doldurun.');
                    }
                  }}
                >
                  Yükle
                </button>
                <button type="button" className="btn-secondary" onClick={handleModalClose}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notlar 