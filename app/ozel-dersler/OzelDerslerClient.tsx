'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useToast } from '../../components/ToastProvider';
import TouchButton from '../../components/TouchButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useMobileOptimization } from '../../hooks/useMobileOptimization';
import { Search, Filter, MapPin, Star, MessageCircle, Heart, Share2, X, Plus, Trash2, Edit, Eye, Clock, BookOpen, Users, DollarSign } from 'lucide-react';

const OzelDerslerClient = () => {
  const [activeTab, setActiveTab] = useState('veren');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [editItem, setEditItem] = useState<any>(null);
  const [customSubject, setCustomSubject] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [userRatings, setUserRatings] = useState<{[key: string]: number}>({});
  const { showToast } = useToast();
  const { isMobile } = useMobileOptimization();

  const subjects = [
    'Tümü', 'Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'İngilizce', 
    'Türkçe', 'Tarih', 'Coğrafya', 'Felsefe', 'Ekonomi', 'Bilgisayar', 'Diğer'
  ];

  const locations = [
    'Tümü', 'Gazimağusa', 'Girne', 'Lefkoşa', 'Lefke', 'İskele', 'Güzelyurt'
  ];

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data loading
  useEffect(() => {
    // Load only real Firebase data - no mock data
    const loadTutors = async () => {
      try {
        const tutorsRef = collection(db, 'tutors');
        const tutorsSnapshot = await getDocs(tutorsRef);
        const tutorsData = tutorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTutors(tutorsData);
      } catch (error) {
        console.error('Tutors loading error:', error);
        setTutors([]);
      }
    };

    const loadStudents = async () => {
      try {
        const studentsRef = collection(db, 'students');
        const studentsSnapshot = await getDocs(studentsRef);
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error('Students loading error:', error);
        setStudents([]);
      }
    };

    loadTutors();
    loadStudents();
  }, []);

  // Kullanıcının favorilerini Firestore'dan çek
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const loadFavorites = async () => {
      try {
        const favRef = collection(db, 'users', user.uid, 'favorites');
        unsubscribe = onSnapshot(favRef, async (snapshot) => {
          // Get all current tutors and students from Firebase only
          const tutorsRef = collection(db, 'tutors');
          const studentsRef = collection(db, 'students');
          const [tutorsSnapshot, studentsSnapshot] = await Promise.all([
            getDocs(tutorsRef),
            getDocs(studentsRef)
          ]);
          
          const validTutorIds = new Set(tutorsSnapshot.docs.map(doc => doc.id));
          const validStudentIds = new Set(studentsSnapshot.docs.map(doc => doc.id));
          const allValidIds = new Set([...Array.from(validTutorIds), ...Array.from(validStudentIds)]);

          // Filter favorites to only include existing items with contentType 'tutor'
          const validFavorites = snapshot.docs
            .filter(doc => {
              const data = doc.data();
              return data.contentType === 'tutor' && allValidIds.has(doc.id);
            })
            .map(doc => doc.id);

          setFavorites(validFavorites);

          // Clean up any invalid favorites
          const cleanupPromises = snapshot.docs
            .filter(doc => {
              const data = doc.data();
              return data.contentType === 'tutor' && !allValidIds.has(doc.id);
            })
            .map(doc => deleteDoc(doc.ref));

          if (cleanupPromises.length > 0) {
            await Promise.all(cleanupPromises);
            console.log(`Cleaned up ${cleanupPromises.length} invalid tutor favorites`);
          }
        });
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      }
    };

    loadFavorites();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // Kullanıcının değerlendirmelerini yükle
  useEffect(() => {
    if (!user) {
      setUserRatings({});
      return;
    }

    const loadUserRatings = async () => {
      try {
        const ratingsRef = collection(db, 'users', user.uid, 'ratings');
        const ratingsSnapshot = await getDocs(ratingsRef);
        const ratings: {[key: string]: number} = {};
        
        ratingsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.itemId && data.rating) {
            ratings[data.itemId] = data.rating;
          }
        });
        
        setUserRatings(ratings);
      } catch (error) {
        console.error('Error loading user ratings:', error);
        setUserRatings({});
      }
    };

    loadUserRatings();
  }, [user]);

  // Filter function
  const getFilteredItems = () => {
    const items = activeTab === 'veren' ? tutors : students;
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = !selectedSubject || selectedSubject === 'Tümü' || item.subject === selectedSubject;
      const matchesLocation = !selectedLocation || selectedLocation === 'Tümü' || item.location === selectedLocation;
      const matchesPrice = !priceRange || (activeTab === 'veren' ? 
        checkPriceRange(item.price, priceRange) : 
        checkBudgetRange(item.budget, priceRange));
      
      return matchesSearch && matchesSubject && matchesLocation && matchesPrice;
    });
  };

  const checkPriceRange = (price: number, range: string) => {
    switch (range) {
      case '0-100': return price <= 100;
      case '100-200': return price >= 100 && price <= 200;
      case '200-300': return price >= 200 && price <= 300;
      case '300+': return price >= 300;
      default: return true;
    }
  };

  const checkBudgetRange = (budget: string, range: string) => {
    const budgetMax = parseInt(budget.split('-')[1]);
    switch (range) {
      case '0-100': return budgetMax <= 100;
      case '100-200': return budgetMax >= 100 && budgetMax <= 200;
      case '200-300': return budgetMax >= 200 && budgetMax <= 300;
      case '300+': return budgetMax >= 300;
      default: return true;
    }
  };

  const renderStars = (rating: number, itemId?: string, interactive: boolean = false) => {
    const currentRating = itemId && userRatings[itemId] ? userRatings[itemId] : (rating || 0);
    const displayRating = interactive && hoveredRating > 0 ? hoveredRating : currentRating;
    
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`text-sm cursor-pointer transition-colors ${
          i < Math.floor(displayRating) ? 'text-yellow-400' : 'text-gray-300'
        } ${interactive ? 'hover:text-yellow-400' : ''}`}
        onMouseEnter={() => interactive && setHoveredRating(i + 1)}
        onMouseLeave={() => interactive && setHoveredRating(0)}
        onClick={() => {
          if (interactive && itemId) {
            handleRatingClick(itemId, i + 1);
          }
        }}
      >
        ★
      </span>
    ));
  };

  const handleContactClick = (item: any) => {
    if (!user) {
      showToast('İletişim kurmak için giriş yapmalısınız!', 'error');
      return;
    }
    setSelectedItem(item);
    setShowContactModal(true);
  };

  const handleRatingClick = async (itemId: string, rating: number) => {
    if (!user) {
      showToast('Değerlendirme yapmak için giriş yapmalısınız!', 'error');
      return;
    }

    try {
      // Kullanıcının önceki değerlendirmesini kontrol et
      const ratingRef = doc(db, 'users', user.uid, 'ratings', itemId);
      const existingRatingDoc = await getDocs(collection(db, 'users', user.uid, 'ratings'));
      const existingRating = existingRatingDoc.docs.find(doc => doc.data().itemId === itemId);
      const isNewRating = !existingRating;

      // Kullanıcının değerlendirmesini kaydet
      await setDoc(ratingRef, {
        itemId: itemId,
        rating: rating,
        createdAt: serverTimestamp(),
      });

      // Local state'i güncelle
      setUserRatings(prev => ({
        ...prev,
        [itemId]: rating
      }));

      // Mevcut tutor/student dokümanını al
      const collection_name = activeTab === 'veren' ? 'tutors' : 'students';
      const itemRef = doc(db, collection_name, itemId);
      const itemDoc = await getDocs(collection(db, collection_name));
      const currentItem = itemDoc.docs.find(doc => doc.id === itemId);
      
      if (currentItem) {
        const currentData = currentItem.data();
        const currentRating = currentData.rating || 0;
        const currentCount = currentData.reviews_count || 0;
        
        let newRating, newCount;
        
        if (isNewRating) {
          // Yeni değerlendirme: sayıyı artır, ortalamayı güncelle
          newCount = currentCount + 1;
          newRating = ((currentRating * currentCount) + rating) / newCount;
        } else {
          // Mevcut değerlendirmeyi güncelle: sayı aynı kalır, ortalamayı güncelle
          const oldRating = existingRating?.data().rating || 0;
          newCount = currentCount;
          newRating = ((currentRating * currentCount) - oldRating + rating) / currentCount;
        }

        // Tutor/Student dokümanını güncelle
        await updateDoc(itemRef, {
          rating: Math.round(newRating * 10) / 10, // 1 ondalık basamağa yuvarla
          reviews_count: newCount
        });

        // Local state'i güncelle
        if (activeTab === 'veren') {
          setTutors(prev => prev.map(item => 
            item.id === itemId 
              ? { ...item, rating: Math.round(newRating * 10) / 10, reviews_count: newCount }
              : item
          ));
        } else {
          setStudents(prev => prev.map(item => 
            item.id === itemId 
              ? { ...item, rating: Math.round(newRating * 10) / 10, reviews_count: newCount }
              : item
          ));
        }
      }

      showToast(`Değerlendirmeniz kaydedildi: ${rating} yıldız`, 'success');
    } catch (error) {
      console.error('Rating error:', error);
      showToast('Değerlendirme kaydedilirken bir hata oluştu.', 'error');
    }
  };

  const handleDetailsClick = (item: any) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleAddClick = () => {
    if (!user) {
      showToast('İlan vermek için giriş yapmalısınız!', 'error');
      return;
    }
    setShowAddModal(true);
  };

  const toggleFavorite = async (item: any) => {
    if (!user) {
      showToast('Favorilere eklemek için giriş yapmalısınız!', 'error');
      return;
    }
    
    try {
      const favRef = doc(db, 'users', user.uid, 'favorites', item.id.toString());
      
      if (favorites.includes(item.id.toString())) {
        await deleteDoc(favRef);
        showToast('Favorilerden çıkarıldı.', 'info');
      } else {
        await setDoc(favRef, {
          itemId: item.id,
          contentType: 'tutor',
          title: item.name,
          description: item.subject,
          category: item.subject,
          price: item.price || item.budget,
          addedAt: serverTimestamp(),
        });
        showToast('Favorilere eklendi!', 'success');
      }
    } catch (error) {
      console.error('Favori işlemi hatası:', error);
      showToast('Favori işlemi sırasında bir hata oluştu.', 'error');
    }
  };

  const handleShare = async (item: any) => {
    const shareData = {
      title: item.name,
      text: `${item.name} - ${item.subject} dersi`,
      url: `${window.location.origin}/ozel-dersler/${item.id}`
    };

    try {
      if (navigator.share && isMobile) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link kopyalandı', 'success');
      }
    } catch (error) {
      console.error('Paylaşım hatası:', error);
      showToast('Paylaşım başarısız', 'error');
    }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setShowAddModal(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!user) {
      showToast('Silme işlemi için giriş yapmalısınız!', 'error');
      return;
    }

    if (!confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const collection_name = activeTab === 'veren' ? 'tutors' : 'students';
      await deleteDoc(doc(db, collection_name, itemId));
      
      if (activeTab === 'veren') {
        setTutors(prev => prev.filter(item => item.id !== itemId));
      } else {
        setStudents(prev => prev.filter(item => item.id !== itemId));
      }
      
      showToast('İlan başarıyla silindi!', 'success');
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast('Silme işlemi sırasında bir hata oluştu.', 'error');
    }
  };

  const handleModalClose = () => {
    setShowContactModal(false);
    setShowDetailsModal(false);
    setShowAddModal(false);
    setSelectedItem(null);
    setEditItem(null);
    setSelectedSubject('');
    setCustomSubject('');
    setHoveredRating(0);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Mesajınız gönderildi!', 'success');
    setShowContactModal(false);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('İlan vermek için giriş yapmalısınız!', 'error');
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const subject = selectedSubject === 'Diğer' ? customSubject : (formData.get('subject') as string);
      
      const newListing = {
        name: formData.get('name') as string,
        university: formData.get('university') as string,
        subject: subject,
        location: formData.get('location') as string,
        description: formData.get('description') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        type: formData.get('type') as string,
        price: parseFloat(formData.get('price') as string) || 0,
        currency: formData.get('currency') as string || 'TL',
        experience: formData.get('experience') as string,
        online: formData.get('online') === 'on',
        budget: formData.get('budget') as string,
        deadline: formData.get('deadline') as string,
        urgency: formData.get('urgency') as string,
        rating: 0,
        reviews_count: 0,
        successRate: 0,
        userId: user.uid,
        createdAt: serverTimestamp()
      };

      const collection_name = newListing.type === 'tutor' ? 'tutors' : 'students';
      const docRef = await addDoc(collection(db, collection_name), newListing);
      const listingWithId = { ...newListing, id: docRef.id };
      
      if (newListing.type === 'tutor') {
        setTutors(prev => [listingWithId, ...prev]);
      } else {
        setStudents(prev => [listingWithId, ...prev]);
      }
      
      setShowAddModal(false);
      showToast('İlanınız başarıyla eklendi!', 'success');
    } catch (error) {
      console.error('Error adding listing:', error);
      showToast('İlan eklenirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
  };

  // ESC tuşu ile modal'ları kapatma
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleModalClose();
      }
    };
    if (showContactModal || showDetailsModal || showAddModal) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showContactModal, showDetailsModal, showAddModal]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />;
  }

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1c0f3f] to-[#2e0f5f] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Özel Ders Platformu</h1>
          <p className="text-lg text-gray-200 mb-8">
            Öğrenciler için kaliteli öğretmenler, öğretmenler için ideal öğrenciler.
            Kıbrıs'ta özel ders almak ve vermek için güvenilir platform.
          </p>
          
          {/* Filter Type Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <TouchButton
              onClick={() => setActiveTab('veren')}
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                activeTab === 'veren' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <BookOpen className="mr-2" /> Ders Verenler
            </TouchButton>
            <TouchButton
              onClick={() => setActiveTab('alan')}
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                activeTab === 'alan' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Users className="mr-2" /> Ders Alanlar
            </TouchButton>
          </div>

          {/* İlan Ver Button */}
          <div className="mt-4">
            <TouchButton
              onClick={handleAddClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-12 py-4 rounded-full text-xl font-bold transition-colors shadow-lg"
            >
              <Plus className="mr-2" /> İlan Ver
            </TouchButton>
          </div>
        </div>
      </div>



      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Ana filtreleme bölümü */}
        <div className="bg-white rounded-xl shadow-sm p-6 mx-4 mb-6">
          {/* Arama çubuğu */}
          <div className="relative flex-1 mb-6">
            <input
              type="text"
              placeholder={`${activeTab === 'veren' ? 'Öğretmen' : 'Öğrenci'} veya ders ara...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Filtre seçenekleri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ders filtresi */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Ders Seçin</option>
              {subjects.slice(1).map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            {/* Konum filtresi */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Konum Seçin</option>
              {locations.slice(1).map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            {/* Fiyat filtresi */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Fiyat Seçin</option>
              <option value="0-100">0-100 TL</option>
              <option value="100-200">100-200 TL</option>
              <option value="200-300">200-300 TL</option>
              <option value="300+">300+ TL</option>
            </select>
          </div>

          {/* Filtreleme butonları */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('');
                setSelectedLocation('');
                setPriceRange('');
              }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Filtreleri Temizle
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Uygula
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredItems.length} sonuç bulundu
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'veren' ? 'Öğretmen bulunamadı' : 'Öğrenci bulunamadı'}
            </h3>
            <p className="text-gray-600 mb-4">
              Arama kriterlerinize uygun {activeTab === 'veren' ? 'öğretmen' : 'öğrenci'} bulunamadı.
            </p>
            <TouchButton
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('');
                setSelectedLocation('');
                setPriceRange('');
              }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Filtreleri Temizle
            </TouchButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Profile Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.university}</p>
                      <p className="text-xs text-gray-500">{item.department}</p>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  {item.isVerified && (
                    <div className="mb-3">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Doğrulanmış
                      </span>
                    </div>
                  )}

                  {/* Type and Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      {item.subject}
                    </span>
                    <div className="flex items-center text-blue-600 font-bold">
                      <DollarSign size={16} className="mr-1" />
                      {activeTab === 'veren' ? `${item.price} TL/saat` : `${item.budget} TL/saat`}
                    </div>
                  </div>

                  {/* Location and Additional Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2" />
                      <span>{item.location}</span>
                    </div>
                    {activeTab === 'veren' ? (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock size={14} className="mr-2" />
                          <span>Deneyim: {item.experience}</span>
                        </div>

                      </>
                    ) : (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={14} className="mr-2" />
                        <span>Son Tarih: {item.deadline}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                  {/* Additional Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {activeTab === 'veren' && item.online && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Online Ders Uygun
                      </span>
                    )}
                    {activeTab === 'alan' && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.urgency === 'Acil' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.urgency}
                      </span>
                    )}
                  </div>

                  {/* Rating for tutors */}
                  {activeTab === 'veren' && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {renderStars(item.rating, item.id, true)}
                        <span className="ml-1 text-sm font-medium">
                          {userRatings[item.id] || item.rating || 0}
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">({item.reviews_count || 0} değerlendirme)</span>
                      <span className="text-xs text-blue-600">(Tıklayarak değerlendirin)</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleDetailsClick(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition"
                    >
                      <Eye size={16} />
                      Detay
                    </button>
                    <button
                      onClick={() => handleContactClick(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-medium transition"
                    >
                      <MessageCircle size={16} />
                      {activeTab === 'veren' ? 'İletişim' : 'Teklif Ver'}
                    </button>
                  </div>

                  {/* Favorite and Share */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(item)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition ${
                        favorites.includes(item.id.toString())
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart size={16} fill={favorites.includes(item.id.toString()) ? 'currentColor' : 'none'} />
                      {favorites.includes(item.id.toString()) ? 'Favoride' : 'Favorile'}
                    </button>
                    <button
                      onClick={() => handleShare(item)}
                      className="flex items-center justify-center gap-2 bg-blue-100 text-blue-600 hover:bg-blue-200 py-2 px-4 rounded-lg font-medium transition"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>

                  {/* Edit and Delete buttons for own listings */}
                  {user && item.userId === user.uid && (
                    <div className="mt-2 flex gap-2">
                      <TouchButton
                        onClick={() => handleEdit(item)}
                        className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 py-2 text-sm"
                      >
                        <Edit size={16} />
                        İlanı Düzenle
                      </TouchButton>
                      <TouchButton
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-800 py-2 text-sm"
                      >
                        <Trash2 size={16} />
                        İlanı Sil
                      </TouchButton>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">
                  {activeTab === 'veren' ? 'İletişime Geç' : 'Teklif Ver'}
                </h3>
                <button
                  onClick={handleModalClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{selectedItem.name}</h4>
                <p className="text-sm text-gray-600">{selectedItem.subject} - {selectedItem.location}</p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={activeTab === 'veren' ? 'Merhaba, dersleriniz hakkında bilgi almak istiyorum...' : 'Merhaba, size özel ders vermek istiyorum...'}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition"
                  >
                    Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Detaylı Bilgiler</h3>
                <button
                  onClick={handleModalClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {selectedItem.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold">{selectedItem.name}</h4>
                    <p className="text-gray-600">{selectedItem.university}</p>
                    <p className="text-gray-500">{selectedItem.department} - {selectedItem.year}</p>
                  </div>
                </div>

                {/* Subject and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">Ders</h5>
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      {selectedItem.subject}
                    </span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">Konum</h5>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-1" />
                      {selectedItem.location}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Açıklama</h5>
                  <p className="text-gray-600">{selectedItem.description}</p>
                </div>

                {activeTab === 'veren' ? (
                  <>
                    {/* Rating and Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Değerlendirme</h5>
                        <div className="flex items-center">
                          {renderStars(selectedItem.rating)}
                          <span className="ml-2 text-gray-600">({selectedItem.reviews_count || 0} değerlendirme)</span>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Fiyat</h5>
                        <span className="text-green-600 font-bold text-lg">{selectedItem.price} TL/saat</span>
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Müsaitlik</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.availability.map((day: string, index: number) => (
                          <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Diller</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.languages.map((lang: string, index: number) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">İletişim</h5>
                      <div className="space-y-2">
                        <p className="text-gray-600">📞 {selectedItem.phone}</p>
                        <p className="text-gray-600">📧 {selectedItem.email}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Budget and Deadline */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Bütçe</h5>
                        <span className="text-green-600 font-bold">{selectedItem.budget} TL/saat</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Son Tarih</h5>
                        <span className="text-gray-600">{selectedItem.deadline}</span>
                      </div>
                    </div>

                    {/* Urgency */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Aciliyet</h5>
                      <span className={`inline-block px-3 py-1 rounded-full ${
                        selectedItem.urgency === 'Acil' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {selectedItem.urgency}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowContactModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition"
                >
                  {activeTab === 'veren' ? 'İletişime Geç' : 'Teklif Ver'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">İlan Ver</h3>
                <button
                  onClick={handleModalClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* İlan Türü Seçimi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  İlan Türü *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('veren')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      activeTab === 'veren'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen size={20} />
                      <span className="font-medium">Ders Veriyorum</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Öğretmen olarak ilan ver</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('alan')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      activeTab === 'alan'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Users size={20} />
                      <span className="font-medium">Ders Arıyorum</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Öğrenci olarak ilan ver</p>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <input type="hidden" name="type" value={activeTab === 'veren' ? 'tutor' : 'student'} />
                
                {/* Seçilen İlan Türü Bilgisi */}
                <div className={`p-4 rounded-lg border-l-4 ${
                  activeTab === 'veren' 
                    ? 'bg-purple-50 border-purple-500 text-purple-700' 
                    : 'bg-blue-50 border-blue-500 text-blue-700'
                }`}>
                  <div className="flex items-center gap-2">
                    {activeTab === 'veren' ? <BookOpen size={20} /> : <Users size={20} />}
                    <span className="font-medium">
                      {activeTab === 'veren' ? 'Ders Verme İlanı' : 'Ders Alma İlanı'} Oluşturuyorsunuz
                    </span>
                  </div>
                  <p className="text-sm mt-1 opacity-80">
                    {activeTab === 'veren' 
                      ? 'Öğretmen olarak ilanınızı yayınlayın ve öğrencilerle buluşun.' 
                      : 'Öğrenci olarak ihtiyacınızı belirtin ve öğretmenlerden teklif alın.'
                    }
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adınız
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ders
                    </label>
                    <select
                      name="subject"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Ders Seçin</option>
                      {subjects.slice(1).map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    
                    {/* Diğer ders seçildiğinde özel input */}
                    {selectedSubject === 'Diğer' && (
                      <div className="mt-2">
                        <input
                          type="text"
                          name="customSubject"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          placeholder="Ders adını yazın (örn: Müzik, Resim, Spor...)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Üniversite
                    </label>
                    <input
                      type="text"
                      name="university"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Üniversite Adı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konum
                    </label>
                    <select
                      name="location"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Konum Seçin</option>
                      {locations.slice(1).map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {activeTab === 'veren' ? 'Saatlik Ücret' : 'Bütçe'}
                    </label>
                    <input
                      type="number"
                      name={activeTab === 'veren' ? 'price' : 'budget'}
                      required
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={activeTab === 'veren' ? '150' : '100'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Para Birimi
                    </label>
                    <select
                      name="currency"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="TL">TL</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                  {activeTab === 'alan' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aciliyet
                      </label>
                      <select
                        name="urgency"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Acil">Acil</option>
                      </select>
                    </div>
                  )}
                </div>

                {activeTab === 'veren' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deneyim
                    </label>
                    <input
                      type="text"
                      name="experience"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Örn: 3 yıl"
                    />
                  </div>
                )}

                {activeTab === 'alan' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Son Tarih
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deneyiminiz, özel alanlarınız veya ihtiyaçlarınız hakkında bilgi verin..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+90 533 123 45 67"
                    />
                  </div>
                </div>

                {activeTab === 'veren' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="online"
                      id="online"
                      className="rounded"
                    />
                    <label htmlFor="online" className="text-sm text-gray-700">
                      Online ders verebilirim
                    </label>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition"
                  >
                    İlan Ver
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OzelDerslerClient; 