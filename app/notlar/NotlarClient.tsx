'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaFilePdf, FaDownload, FaEye, FaUpload, FaUniversity, FaUser, FaCalendar, FaSearch, FaFilter, FaSpinner, FaHeart, FaRegHeart, FaShare, FaFlag, FaTrash } from 'react-icons/fa';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, getDocs, orderBy, query, where, Timestamp, serverTimestamp, deleteDoc, setDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  department?: string;
  university: string;
  fileUrl: string;
  fileName?: string;
  uploader: string;
  uploaderEmail: string;
  date: string;
  fileSize: string;
  pageCount: number;
  downloadCount: number;
  createdAt: any;
  isApproved?: boolean;
  uploadedBy?: string;
}

const dummyNotes = [
  {
    id: '1',
    title: 'Matematik 1 - Vize Notları',
    description: '2023 güz dönemi matematik 1 dersi vize notları. Limit, türev ve integral konularını içerir.',
    subject: 'Matematik',
    university: 'Doğu Akdeniz Üniversitesi',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploader: 'Ali Yılmaz',
    uploaderEmail: 'ali@example.com',
    date: '2024-03-10',
    fileSize: '2.5 MB',
    pageCount: 12,
    downloadCount: 127,
    createdAt: new Date('2024-03-10')
  },
  {
    id: '2',
    title: 'Fizik 2 - Final Notları',
    description: 'Fizik 2 dersi için final sınavı notları. Elektrik, manyetizma ve optik konuları.',
    subject: 'Fizik',
    university: 'Yakın Doğu Üniversitesi',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploader: 'Ayşe Demir',
    uploaderEmail: 'ayse@example.com',
    date: '2024-02-28',
    fileSize: '3.8 MB',
    pageCount: 18,
    downloadCount: 89,
    createdAt: new Date('2024-02-28')
  },
  {
    id: '3',
    title: 'Kimya - Organik Kimya Özeti',
    description: 'Organik kimya dersi özet notları. Fonksiyonel gruplar ve reaksiyonlar.',
    subject: 'Kimya',
    university: 'Girne Amerikan Üniversitesi',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploader: 'Mehmet Kaya',
    uploaderEmail: 'mehmet@example.com',
    date: '2024-03-05',
    fileSize: '1.9 MB',
    pageCount: 8,
    downloadCount: 156,
    createdAt: new Date('2024-03-05')
  }
];

const subjects = [
  'Tüm Dersler', 
  'Matematik', 
  'Fizik', 
  'Kimya', 
  'Biyoloji', 
  'Bilgisayar', 
  'İngilizce', 
  'Türkçe', 
  'Tarih', 
  'Coğrafya', 
  'Felsefe', 
  'Psikoloji', 
  'İktisat', 
  'İşletme', 
  'Muhasebe', 
  'Finans', 
  'Hukuk', 
  'Siyaset Bilimi', 
  'Uluslararası İlişkiler', 
  'Mimarlık', 
  'Tıp', 
  'Diş Hekimliği', 
  'Eczacılık', 
  'Hemşirelik', 
  'Veterinerlik', 
  'Ziraat', 
  'Mühendislik', 
  'Diğer'
];

const departments = [
  'Tüm Bölümler',
  'Mühendislik Fakültesi',
  'Tıp Fakültesi',
  'Diş Hekimliği Fakültesi',
  'Eczacılık Fakültesi',
  'Fen-Edebiyat Fakültesi',
  'İktisadi ve İdari Bilimler Fakültesi',
  'Hukuk Fakültesi',
  'Eğitim Fakültesi',
  'İletişim Fakültesi',
  'Güzel Sanatlar Fakültesi',
  'Mimarlık Fakültesi',
  'Sağlık Bilimleri Fakültesi',
  'Veterinerlik Fakültesi',
  'Ziraat Fakültesi',
  'Denizcilik Fakültesi',
  'Havacılık Fakültesi',
  'Diğer'
];
const universities = [
  'Tümü',
  'Doğu Akdeniz Üniversitesi',
  'Girne Amerikan Üniversitesi',
  'Lefke Avrupa Üniversitesi',
  'Yakın Doğu Üniversitesi',
  'Uluslararası Kıbrıs Üniversitesi',
];

const NotlarClient = () => {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Tüm Dersler');
  const [selectedDepartment, setSelectedDepartment] = useState('Tüm Bölümler');
  const [selectedUniversity, setSelectedUniversity] = useState('Tümü');
  const [showUpload, setShowUpload] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    department: '',
    university: '',
    uploader: '',
    uploaderEmail: '',
    file: null as File | null
  });

  // Load notes from Firestore and monitor auth state
  useEffect(() => {
    loadNotes();
    
    // Monitor auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      console.log('Auth state changed:', currentUser);
      
      // Auto-fill form with user data if logged in
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          uploader: currentUser.displayName || currentUser.email || '',
          uploaderEmail: currentUser.email || ''
        }));
        
        // Load favorites when user logs in
        await loadFavorites(currentUser);
      } else {
        // Clear favorites when user logs out
        setFavorites([]);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      // Load only real Firebase data - no dummy data
      const notesRef = collection(db, 'notes');
      const notesQuery = query(notesRef, orderBy('createdAt', 'desc'));
      const notesSnapshot = await getDocs(notesQuery);
      
      const firestoreNotes = notesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          uploadDate: data.createdAt?.toDate?.() || new Date()
        } as unknown as Note;
      });
      
      // Sadece onaylanmış notları filtrele
      const approvedNotes = firestoreNotes.filter(note => note.isApproved === true);
      
      setNotes(approvedNotes);
      
      // Notlar yüklendikten sonra favorileri yükle
      if (user?.uid) {
        await loadFavorites(user);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async (currentUser?: any) => {
    const userId = currentUser?.uid || user?.uid;
    if (!userId) return;
    
    try {
      console.log('Loading favorites for user:', userId);
      const favRef = collection(db, 'users', userId, 'favorites');
      const favSnapshot = await getDocs(favRef);
      
      console.log('Found favorites:', favSnapshot.docs.length);
      
      // Get all current notes
      const notesRef = collection(db, 'notes');
      const notesSnapshot = await getDocs(notesRef);
      const validNoteIds = new Set(notesSnapshot.docs.map(doc => doc.id));
      
      // Filter favorites to only include existing notes with contentType 'note'
      const validFavorites = favSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          const isValid = data.contentType === 'note' && validNoteIds.has(data.itemId);
          console.log(`Favorite ${doc.id}:`, { itemId: data.itemId, contentType: data.contentType, isValid });
          return isValid;
        })
        .map(doc => doc.data().itemId);
      
      console.log('Valid favorites:', validFavorites);
      setFavorites(validFavorites);
      
      // Clean up any invalid favorites
      const cleanupPromises = favSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return data.contentType === 'note' && !validNoteIds.has(data.itemId);
        })
        .map(doc => deleteDoc(doc.ref));
      
      if (cleanupPromises.length > 0) {
        await Promise.all(cleanupPromises);
        console.log(`Cleaned up ${cleanupPromises.length} invalid note favorites`);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (note: Note) => {
    if (!user) {
      alert('Favorilere eklemek için giriş yapmalısınız');
      return;
    }

    try {
      const favRef = doc(db, 'users', user.uid, 'favorites', note.id);
      
      if (favorites.includes(note.id)) {
        // Favorilerden çıkar
        await deleteDoc(favRef);
        setFavorites(prev => prev.filter(id => id !== note.id));
        console.log('Removed from favorites:', note.id);
      } else {
        // Favorilere ekle
        await setDoc(favRef, {
          itemId: note.id,
          contentType: 'note',
          title: note.title,
          description: note.description || note.university,
          category: note.subject,
          addedAt: serverTimestamp(),
        });
        setFavorites(prev => [...prev, note.id]);
        console.log('Added to favorites:', note.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Favori işlemi sırasında bir hata oluştu');
    }
  };

  const handleShare = async (note: Note) => {
    try {
      const shareData = {
        title: note.title,
        text: `${note.title} - ${note.university}`,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        alert('Link kopyalandı!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // PDF sayfa sayısını hesapla
  const getPdfPageCount = async (file: File): Promise<number> => {
    try {
      // PDF.js kütüphanesini dinamik olarak yükle
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch (error) {
      console.error('PDF sayfa sayısı hesaplanamadı:', error);
      // Hata durumunda dosya boyutuna göre tahmin et
      const estimatedPages = Math.max(1, Math.floor(file.size / (50 * 1024))); // 50KB per page estimate
      return estimatedPages;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Lütfen sadece PDF dosyası yükleyin.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Dosya boyutu 10MB\'dan büyük olamaz.');
        return;
      }
      setFormData(prev => ({ ...prev, file }));
    }
  };

  // Gerçek dosya yükleme fonksiyonu
  const handleRealUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file || !formData.title || !formData.description || !formData.subject || 
        !formData.university || !formData.uploader || !formData.uploaderEmail) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      
      console.log('PDF yükleme süreci başlatılıyor...');
      console.log('Dosya:', formData.file);
      console.log('Kullanıcı:', user);
      
      // Kullanıcı giriş kontrolü
      if (!user || !auth.currentUser) {
        alert('PDF yüklemek için giriş yapmanız gerekiyor.');
        setUploading(false);
        return;
      }
      
      setUploadProgress(10);
      
      // Dosya türü ve boyut kontrolü
      if (formData.file.type !== 'application/pdf') {
        alert('Sadece PDF dosyaları yüklenebilir.');
        setUploading(false);
        return;
      }
      
      if (formData.file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Dosya boyutu 10MB\'dan büyük olamaz.');
        setUploading(false);
        return;
      }

      setUploadProgress(30);
      
      // PDF'i base64'e çevir
      console.log('PDF base64\'e çevriliyor...');
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            resolve(result);
          } else {
            reject(new Error('PDF okunamadı'));
          }
        };
        reader.onerror = () => reject(new Error('Dosya okuma hatası'));
        reader.readAsDataURL(formData.file);
      });
      
      console.log('PDF base64\'e çevrildi');
      setUploadProgress(70);
      
      // PDF sayfa sayısını hesapla
      console.log('PDF sayfa sayısı hesaplanıyor...');
      const pageCount = await getPdfPageCount(formData.file);
      console.log(`PDF sayfa sayısı: ${pageCount}`);
      
      setUploadProgress(85);
      
      // Not verilerini Firestore'a kaydet
      console.log('Firestore\'a kaydediliyor...');
      const noteData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        department: formData.department,
        university: formData.university,
        fileUrl: base64Data, // Base64 verisini doğrudan sakla
        fileName: formData.file.name,
        uploader: formData.uploader,
        uploaderEmail: formData.uploaderEmail,
        fileSize: formatFileSize(formData.file.size),
        pageCount: pageCount, // Gerçek PDF sayfa sayısı
        downloadCount: 0,
        createdAt: Timestamp.now(),
        uploadedBy: user.uid,
        isApproved: false // Notlar onay gerektirir
      };

      await addDoc(collection(db, 'notes'), noteData);
      
      console.log('Not başarıyla Firestore\'a kaydedildi');
      
      setUploadProgress(100);
      
      // Formu sıfırla
      setFormData({
        title: '',
        description: '',
        subject: '',
        department: '',
        university: '',
        uploader: user?.displayName || user?.email || '',
        uploaderEmail: user?.email || '',
        file: null
      });
      
      setShowUpload(false);
      alert('PDF başarıyla yüklendi! Onay sürecinden sonra yayınlanacak.');
      
      // Notları yenile
      await loadNotes();
      
    } catch (error: any) {
      console.error('Yükleme hatası:', error);
      alert('Yükleme hatası: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };



  const filteredNotes = notes.filter(note => {
    const matchesSubject =
      selectedSubject === 'Tüm Dersler' || note.subject === selectedSubject;
    const matchesDepartment =
      selectedDepartment === 'Tüm Bölümler' || note.department === selectedDepartment;
    const matchesUniversity =
      selectedUniversity === 'Tümü' || note.university === selectedUniversity;
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.description.toLowerCase().includes(search.toLowerCase()) ||
      note.uploader.toLowerCase().includes(search.toLowerCase());
    return matchesSubject && matchesDepartment && matchesUniversity && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'downloads':
        return b.downloadCount - a.downloadCount;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handlePdfView = (note: Note) => {
    setSelectedNote(note);
    setShowPdfViewer(true);
  };

  const handlePdfDownload = async (note: Note) => {
    try {
      // İndirme sayısını artır
      const noteRef = doc(db, 'notes', note.id);
      await updateDoc(noteRef, {
        downloadCount: (note.downloadCount || 0) + 1,
        lastDownloadedAt: Timestamp.now()
      });

      // Local state'i güncelle
      setNotes(prevNotes => 
        prevNotes.map(n => 
          n.id === note.id 
            ? { ...n, downloadCount: (n.downloadCount || 0) + 1 }
            : n
        )
      );

      // PDF'i indir
      const link = document.createElement('a');
      link.href = note.fileUrl; // Base64 data
      link.download = note.fileName || `${note.title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`PDF indirildi: ${note.title}, Yeni indirme sayısı: ${(note.downloadCount || 0) + 1}`);
    } catch (error) {
      console.error('Download error:', error);
      alert('PDF indirme hatası oluştu');
    }
  };

  const handleDeleteNote = async (note: Note) => {
    if (!user) {
      alert('Not silmek için giriş yapmalısınız');
      return;
    }

    // Kullanıcının kendi notunu silip silmediğini kontrol et
    if (note.uploadedBy !== user.uid) {
      alert('Sadece kendi notlarınızı silebilirsiniz');
      return;
    }

    if (!window.confirm('Bu notu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'notes', note.id));
      alert('Not başarıyla silindi');
      // Notları yenile
      await loadNotes();
    } catch (error) {
      console.error('Not silme hatası:', error);
      alert('Not silinirken bir hata oluştu');
    }
  };

  const handleReportNote = async (note: Note, reason: string) => {
    if (!user) {
      alert('Raporlama yapmak için giriş yapmalısınız');
      return;
    }

    try {
      const reportData = {
        contentType: 'not',
        contentId: note.id,
        contentTitle: note.title,
        reporterId: user.uid,
        reporterEmail: user.email,
        reason: reason,
        createdAt: Timestamp.now(),
        status: 'pending'
      };

      await addDoc(collection(db, 'reports'), reportData);
      alert('Rapor başarıyla gönderildi. Teşekkürler!');
    } catch (error) {
      console.error('Report error:', error);
      alert('Rapor gönderme hatası oluştu');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedSubject('Tüm Dersler');
    setSelectedDepartment('Tüm Bölümler');
    setSelectedUniversity('Tümü');
    setSortBy('date');
  };

  // Security rules test removed - using base64 approach now

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1c0f3f] to-[#2e0f5f] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Kıbrıs Üniversite Notları</h1>
          <p className="text-lg text-gray-200 mb-8">
            Kıbrıs'taki üniversiteler için ders notları, PDF kaynaklar ve paylaşımlar. 
            Not ekle, indir, paylaş! Öğrenciler için ücretsiz not platformu.
          </p>
          


          {/* Not Yükle Button */}
          <div className="mt-4">
            <button
              onClick={() => setShowUpload(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-12 py-4 rounded-full text-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto"
            >
              <FaUpload /> Not Yükle
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Not başlığı, açıklama veya yükleyen kişi ara..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="date">Tarihe Göre</option>
                  <option value="downloads">İndirme Sayısına Göre</option>
                  <option value="title">Alfabetik</option>
                </select>
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>

          {/* Filtreleme Seçenekleri */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtreleme Seçenekleri</h3>
            
            {/* Ders Kategorileri */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Ders Kategorileri</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedSubject('Tüm Dersler')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'Tüm Dersler' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📚 Tüm Dersler
                </button>
                <button
                  onClick={() => setSelectedSubject('Matematik')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'Matematik' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📐 Matematik
                </button>
                <button
                  onClick={() => setSelectedSubject('Fizik')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'Fizik' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⚡ Fizik
                </button>
                <button
                  onClick={() => setSelectedSubject('Kimya')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'Kimya' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🧪 Kimya
                </button>
                <button
                  onClick={() => setSelectedSubject('Biyoloji')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'Biyoloji' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🧬 Biyoloji
                </button>
                <button
                  onClick={() => setSelectedSubject('Bilgisayar')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'Bilgisayar' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💻 Bilgisayar
                </button>
                <button
                  onClick={() => setSelectedSubject('İngilizce')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'İngilizce' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🇬🇧 İngilizce
                </button>
                <button
                  onClick={() => setSelectedSubject('Tıp')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'Tıp' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🏥 Tıp
                </button>
                <button
                  onClick={() => setSelectedSubject('Hukuk')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'Hukuk' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⚖️ Hukuk
                </button>
                <button
                  onClick={() => setSelectedSubject('İktisat')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'İktisat' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📊 İktisat
                </button>
                <button
                  onClick={() => setSelectedSubject('Mühendislik')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'Mühendislik' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔧 Mühendislik
                </button>
                <button
                  onClick={() => setSelectedSubject('Diğer')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === 'Diğer' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📚 Diğer
                </button>
              </div>
            </div>

            {/* Dropdown Filtreler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ders Seçin</label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bölüm Seçin</label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedDepartment}
                  onChange={e => setSelectedDepartment(e.target.value)}
                >
                  {departments.map(department => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Üniversite Seçin</label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedUniversity}
                  onChange={e => setSelectedUniversity(e.target.value)}
                >
                  {universities.map(university => (
                    <option key={university} value={university}>{university}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>



          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600 font-medium">
              {loading ? 'Yükleniyor...' : `${filteredNotes.length} not bulundu`}
            </p>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Notlar yükleniyor...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="mx-auto text-6xl text-gray-300 mb-4">
                  <FaFilePdf size={64} />
                </div>
                <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun not bulunamadı.</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
                >
                  {/* Favorite, Share, Report Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      onClick={() => toggleFavorite(note)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        favorites.includes(note.id)
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                      title={`${favorites.includes(note.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'} (ID: ${note.id}, Favorites: ${favorites.join(', ')})`}
                    >
                      {favorites.includes(note.id) ? (
                        <FaHeart size={16} />
                      ) : (
                        <FaRegHeart size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => handleShare(note)}
                      className="p-2 rounded-full bg-white/90 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg"
                    >
                      <FaShare size={16} />
                    </button>
                    <button
                      onClick={() => {
                        const reportModal = document.createElement('div');
                        reportModal.innerHTML = `
                          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                              <h2 class="text-xl font-bold text-gray-900 mb-4">Notu Şikayet Et</h2>
                              <p class="text-gray-600 text-sm mb-4">Bu not neden uygunsuz olduğunu açıklayın.</p>
                              <textarea id="report-reason" class="w-full border border-gray-300 rounded-lg p-3 mb-4 resize-none" placeholder="Şikayet sebebinizi yazın..." rows="4"></textarea>
                              <div class="flex justify-end gap-3">
                                <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 text-gray-600 hover:text-gray-800">İptal</button>
                                <button id="submit-report" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Gönder</button>
                              </div>
                            </div>
                          </div>
                        `;
                        document.body.appendChild(reportModal);
                        
                        // Submit butonuna event listener ekle
                        const submitBtn = reportModal.querySelector('#submit-report');
                        const reasonTextarea = reportModal.querySelector('#report-reason') as HTMLTextAreaElement;
                        
                        submitBtn?.addEventListener('click', () => {
                          const reason = reasonTextarea?.value?.trim();
                          if (!reason) {
                            alert('Lütfen şikayet sebebinizi yazın');
                            return;
                          }
                          
                          // Raporu gönder
                          handleReportNote(note, reason);
                          reportModal.remove();
                        });
                      }}
                      className="p-2 rounded-full bg-white/90 text-gray-600 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"
                    >
                      <FaFlag size={16} />
                    </button>
                    {/* Silme butonu - sadece not sahibi için görünür */}
                    {user && note.uploadedBy === user.uid && (
                      <button
                        onClick={() => handleDeleteNote(note)}
                        className="p-2 rounded-full bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
                        title="Notu Sil"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                  </div>

                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-red-500 text-xl">
                            <FaFilePdf size={20} />
                          </div>
                          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                            {note.subject}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{note.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">{note.description}</p>
                      </div>
                    </div>

                    {/* Note Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="mr-2 text-blue-500">
                          <FaUniversity size={14} />
                        </div>
                        <span className="truncate">{note.university}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="mr-2 text-green-500">
                          <FaUser size={14} />
                        </div>
                        <span>Yükleyen: {note.uploader}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="mr-2 text-purple-500">
                          <FaCalendar size={14} />
                        </div>
                        <span>{new Date(note.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>

                    {/* File Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg p-3">
                      <span>{note.fileSize}</span>
                      <span>{note.pageCount} sayfa</span>
                      <span>{note.downloadCount} indirme</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePdfView(note)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        <FaEye />
                        Görüntüle
                      </button>
                      <button
                        onClick={() => handlePdfDownload(note)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        <FaDownload />
                        İndir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 truncate">{selectedNote.title}</h3>
                <p className="text-sm text-gray-600">{selectedNote.uploader} - {selectedNote.university}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePdfDownload(selectedNote)}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FaDownload />
                  İndir
                </button>
                <button
                  onClick={() => setShowPdfViewer(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-[calc(90vh-120px)]">
              <iframe
                src={selectedNote.fileUrl}
                className="w-full h-full"
                title={selectedNote.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Not Yükle</h2>
              <button
                className="text-gray-400 hover:text-gray-600 p-2"
                onClick={() => setShowUpload(false)}
                disabled={uploading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
                          <form onSubmit={handleRealUpload} className="p-6 space-y-6">
                {/* User Authentication Status */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${user ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {user ? `Giriş yapıldı: ${user.email}` : 'Giriş yapılmadı'}
                      </span>
                    </div>
                    {!user && (
                      <span className="text-xs text-red-600">PDF yüklemek için giriş yapın</span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    ✅ PDF dosyaları base64 formatında güvenli şekilde yükleniyor
                  </div>
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Not Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Örn: Matematik 1 - Vize Notları"
                  disabled={uploading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ders *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={uploading}
                  >
                    <option value="">Ders Seçin</option>
                    {subjects.slice(1).map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bölüm
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={uploading}
                  >
                    <option value="">Bölüm Seçin</option>
                    {departments.slice(1).map(department => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Üniversite *
                  </label>
                  <select
                    required
                    value={formData.university}
                    onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={uploading}
                  >
                    <option value="">Üniversite Seçin</option>
                    {universities.slice(1).map(university => (
                      <option key={university} value={university}>{university}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notlar hakkında detaylı açıklama yazın..."
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF Dosyası *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <div className="mx-auto text-4xl text-gray-400 mb-4">
                    <FaFilePdf size={48} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        PDF dosyasını seçin
                      </span>
                      <span className="text-gray-600"> veya sürükleyip bırakın</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        accept=".pdf" 
                        className="sr-only" 
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-sm text-gray-500">
                      Maksimum dosya boyutu: 10MB
                    </p>
                    {formData.file && (
                      <p className="text-sm text-green-600 font-medium">
                        Seçilen dosya: {formData.file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yükleyen Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.uploader}
                    onChange={(e) => setFormData(prev => ({ ...prev, uploader: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adınız Soyadınız"
                    disabled={uploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.uploaderEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, uploaderEmail: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                    disabled={uploading}
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Yükleniyor...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={uploading}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={uploading}
                >
                                     {uploading ? (
                     <>
                       <div className="animate-spin">
                         <FaSpinner />
                       </div>
                       Yükleniyor...
                     </>
                   ) : (
                    <>
                      <FaUpload />
                      Yükle
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default NotlarClient; 