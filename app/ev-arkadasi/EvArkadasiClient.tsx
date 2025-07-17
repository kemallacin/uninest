'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Users, Calendar, Star, MessageCircle, Heart, Share2, X, Plus, Home, UserPlus, Trash2, DollarSign, Eye, PoundSterling, Edit, ChevronLeft, ChevronRight, CheckCircle, Clock, Phone, Mail } from 'lucide-react';
import { Range, getTrackBackground } from 'react-range';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ReportButton from '../../components/ReportButton';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, setDoc, getDoc, updateDoc, where } from 'firebase/firestore';
import { useToast } from '../../components/ToastProvider';
import LoadingSpinner from '../../components/LoadingSpinner';
import TouchButton from '../../components/TouchButton';
import SwipeableCard from '../../components/SwipeableCard';
import PullToRefresh from '../../components/PullToRefresh';
import { useMobileOptimization } from '../../hooks/useMobileOptimization';

// Mock data for roommates
const mockRoommates = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    age: 22,
    university: "Doğu Akdeniz Üniversitesi",
    department: "Bilgisayar Mühendisliği",
    location: "Gazimağusa",
    price: 800,
    currency: "TL",
    roomType: "Tek kişilik oda",
    availableFrom: "2024-02-01",
    description: "Sakin ve çalışkan bir öğrenci arıyorum. Ev düzenli ve temiz tutulmalı.",
    rating: 4.8,
    reviews: 12,
    isVerified: true,
    interests: ["Teknoloji", "Spor", "Müzik"],
    smoking: false,
    pets: false,
    gender: "Erkek",
    type: "seeking",
    contactPreferences: {
      whatsapp: true,
      telefon: true,
      eposta: true,
    },
    phone: "05551234567",
    email: "ahmet@example.com",
  },
  {
    id: 2,
    name: "Ayşe Demir",
    age: 20,
    university: "Girne Amerikan Üniversitesi",
    department: "Psikoloji",
    location: "Girne",
    price: 650,
    currency: "TL",
    roomType: "Paylaşımlı oda",
    availableFrom: "2024-01-15",
    description: "Sosyal ve aktif bir ev arkadaşı arıyorum. Birlikte etkinliklere katılabiliriz.",
    rating: 4.6,
    reviews: 8,
    isVerified: true,
    interests: ["Psikoloji", "Yoga", "Kitap okuma"],
    smoking: false,
    pets: true,
    gender: "Kadın",
    type: "seeking",
    contactPreferences: {
      whatsapp: true,
      telefon: true,
      eposta: true,
    },
    phone: "05557654321",
    email: "ayse@example.com",
  },
  {
    id: 3,
    name: "Mehmet Kaya",
    age: 24,
    university: "Lefke Avrupa Üniversitesi",
    department: "İşletme",
    location: "Lefke",
    price: 750,
    currency: "TL",
    roomType: "Stüdyo daire",
    availableFrom: "2024-02-15",
    description: "Çalışkan ve düzenli bir öğrenci arıyorum. Sessiz bir ortam tercih ediyorum.",
    rating: 4.9,
    reviews: 15,
    isVerified: true,
    interests: ["İşletme", "Fitness", "Seyahat"],
    smoking: true,
    pets: false,
    gender: "Erkek",
    type: "offering",
    contactPreferences: {
      whatsapp: true,
      telefon: true,
      eposta: true,
    },
    phone: "05559876543",
    email: "mehmet@example.com",
  },
  {
    id: 4,
    name: "Zeynep Özkan",
    age: 21,
    university: "Yakın Doğu Üniversitesi",
    department: "Tıp",
    location: "Lefkoşa",
    price: 450,
    currency: "GBP",
    roomType: "Tek kişilik oda",
    availableFrom: "2024-01-20",
    description: "Tıp öğrencisi olduğum için çok çalışıyorum. Anlayışlı bir ev arkadaşı arıyorum.",
    rating: 4.7,
    reviews: 10,
    isVerified: true,
    interests: ["Tıp", "Müzik", "Spor"],
    smoking: false,
    pets: false,
    gender: "Kadın",
    type: "offering",
    contactPreferences: {
      whatsapp: true,
      telefon: true,
      eposta: true,
    },
    phone: "05551122334",
    email: "zeynep@example.com",
  },
  {
    id: 5,
    name: "Can Arslan",
    age: 23,
    university: "Uluslararası Kıbrıs Üniversitesi",
    department: "Mimarlık",
    location: "Girne",
    price: 350,
    currency: "GBP",
    roomType: "Paylaşımlı oda",
    availableFrom: "2024-02-10",
    description: "Yaratıcı ve sanatsal bir ev arkadaşı arıyorum. Birlikte projeler yapabiliriz.",
    rating: 4.5,
    reviews: 6,
    isVerified: false,
    interests: ["Mimarlık", "Sanat", "Fotoğrafçılık"],
    smoking: false,
    pets: true,
    gender: "Erkek",
    type: "seeking",
    contactPreferences: {
      whatsapp: true,
      telefon: true,
      eposta: true,
    },
    phone: "05555555555",
    email: "can@example.com",
  }
];

export default function EvArkadasiClient() {
  const [roommates, setRoommates] = useState<any[]>([]);
  const [filteredRoommates, setFilteredRoommates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Add form state
  const [addForm, setAddForm] = useState({
    name: '',
    age: '',
    university: '',
    department: '',
    location: '',
    price: '',
    currency: 'TL',
    roomType: '',
    availableFrom: '',
    description: '',
    gender: '',
    type: 'seeking',
    smoking: false,
    pets: false,
    phone: '',
    email: '',
    contactPreferences: {
      whatsapp: true,
      telefon: true,
      eposta: true
    }
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();
  const [priceRange, setPriceRange] = useState([0, 10000]); // TL cinsinden
  const [selectedUniversity, setSelectedUniversity] = useState('');
  

  
  // Üniversite listesi
  const universities = [
    "Doğu Akdeniz Üniversitesi",
    "Girne Amerikan Üniversitesi",
    "Lefke Avrupa Üniversitesi",
    "Uluslararası Kıbrıs Üniversitesi",
    "Yakın Doğu Üniversitesi",
    "Ada Kent Üniversitesi",
    "Akdeniz Karpaz Üniversitesi",
    "Bahçeşehir Kıbrıs Üniversitesi",
    "Final Uluslararası Üniversitesi",
    "İTÜ-KKTC",
    "ODTÜ Kuzey Kıbrıs",
    "Rauf Denktaş Üniversitesi"
  ];

  // Mobile optimization hook
  const { isMobile, isTouchDevice, isLowBandwidth } = useMobileOptimization();

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadFavorites(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load favorites from Firestore
  const loadFavorites = async (userId: string) => {
    try {
      const favoritesQuery = query(collection(db, 'users', userId, 'favorites'));
      const favoritesSnapshot = await getDocs(favoritesQuery);
      const favoritesData = favoritesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Array<{
        id: string;
        itemId?: string;
        contentType?: string;
        [key: string]: any;
      }>;
      
      // Sadece ev arkadaşı favorilerini al ve mevcut ilanları kontrol et
      const validFavoriteIds = [];
      
      for (const fav of favoritesData) {
        if (fav.contentType === 'roommate' && fav.itemId) {
          // Ev arkadaşı ilanının hala mevcut olup olmadığını kontrol et
          try {
            const roommateRef = doc(db, 'roommates', fav.itemId);
            const roommateSnap = await getDoc(roommateRef);
            
            if (roommateSnap.exists()) {
              validFavoriteIds.push(fav.itemId);
            } else {
              // İlan silinmiş, favoriden de sil
              await deleteDoc(doc(db, 'users', userId, 'favorites', fav.id));
            }
          } catch (error) {
            console.error('Favori kontrol hatası:', error);
            // Hata durumunda favoriyi koru
            validFavoriteIds.push(fav.itemId);
          }
        }
      }
      
      setFavorites(validFavoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Load roommates from Firestore
  const loadRoommates = async (retryCount = 0) => {
    try {
      const q = query(collection(db, 'roommates'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const allRoommates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const roommatesData = allRoommates
        .filter((roommate: any) => roommate.isApproved === true); // Sadece onaylanmış ilanları göster
      
      setRoommates(roommatesData);
    } catch (error: any) {
      console.error('Error loading roommates:', error);
      
      // If offline error and haven't retried too many times, try again
      if (error?.code === 'failed-precondition' || error?.message?.includes('offline') || error?.message?.includes('client is offline')) {
        if (retryCount < 3) {
          setTimeout(() => loadRoommates(retryCount + 1), 2000 * (retryCount + 1)); // Exponential backoff
          return;
        }
      }
      
      // If we have existing data, keep it, otherwise show mock data
      if (roommates.length === 0) {
        setRoommates(mockRoommates);
      }
    }
  };

  useEffect(() => {
    loadRoommates();
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      loadRoommates();
    };

    const handleOffline = () => {
      showToast('İnternet bağlantısı kesildi. Mevcut veriler gösteriliyor.', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Refresh function for pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadRoommates();
      if (user) {
        await loadFavorites(user.uid);
      }
      showToast('Liste yenilendi', 'success');
    } catch (error) {
      showToast('Yenileme sırasında hata oluştu', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  // Filter locations
  const locations = Array.from(new Set(roommates.map(r => r.location)));

  // Filtreleme fonksiyonu
  useEffect(() => {
    let filtered = [...roommates];

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(roommate =>
        roommate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roommate.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roommate.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roommate.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Üniversite filtresi
    if (selectedUniversity) {
      filtered = filtered.filter(roommate => roommate.university === selectedUniversity);
    }

    // Lokasyon filtresi
    if (selectedLocation) {
      filtered = filtered.filter(roommate => roommate.location === selectedLocation);
    }

    // Cinsiyet filtresi
    if (selectedGender) {
      filtered = filtered.filter(roommate => roommate.gender === selectedGender);
    }

    // İlan tipi filtresi
    if (selectedType !== 'all') {
      filtered = filtered.filter(roommate => roommate.type === selectedType);
    }

    // Fiyat aralığı filtresi
    filtered = filtered.filter(roommate => {
      const price = roommate.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    setFilteredRoommates(filtered);
  }, [roommates, searchTerm, selectedUniversity, selectedLocation, selectedGender, selectedType, priceRange]);

  // Filtreleri sıfırla
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedUniversity('');
    setSelectedGender('');
    setSelectedType('all');
    setPriceRange([0, 10000]);
  };

  // Toggle favorite
  const toggleFavorite = async (roommate: any) => {
    if (!user) {
      showToast('Favorilere eklemek için giriş yapmalısınız!', 'error');
      return;
    }
    
    try {
      const favRef = doc(db, 'users', user.uid, 'favorites', roommate.id.toString());
      const favDoc = await getDoc(favRef);
      
      if (favDoc.exists()) {
        await deleteDoc(favRef);
        setFavorites(prev => {
          const newFavorites = prev.filter(id => id !== roommate.id);
          return newFavorites;
        });
        showToast('Favorilerden çıkarıldı.', 'info');
      } else {
        const favoriteData = {
          itemId: roommate.id,
          title: roommate.name,
          price: roommate.price,
          currency: roommate.currency,
          createdAt: serverTimestamp(),
          contentType: 'roommate',
        };
        
        await setDoc(favRef, favoriteData);
        
        setFavorites(prev => {
          const newFavorites = [...prev, roommate.id];
          return newFavorites;
        });
        showToast('Favorilere eklendi!', 'success');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
  };

  // Share function
  const handleShare = async (roommate: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${roommate.name} - Ev Arkadaşı`,
          text: `${roommate.name} - ${roommate.university} - ${roommate.price} ${roommate.currency}`,
          url: window.location.href
        });
      } catch (error) {
        // Silent fail for share errors
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      showToast('Link kopyalandı!', 'success');
    }
  };

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Auto-fill form when user is logged in
  useEffect(() => {
    if (user && user.displayName) {
      setAddForm(prev => ({
        ...prev,
        name: user.displayName
      }));
    }
  }, [user]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      showToast('İletişim kurmak için giriş yapmalısınız!', 'error');
      return;
    }
    showToast('Mesajınız gönderildi! En kısa sürede size dönüş yapılacak.', 'success');
    setShowContactModal(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('İlan vermek için giriş yapmalısınız!', 'error');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'roommates'), {
        ...addForm,
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        isApproved: false
      });

      showToast('İlanınız başarıyla eklendi ve onay için gönderildi', 'success');
      resetModalState();
      await loadRoommates();
    } catch (error: any) {
      console.error('Error adding document: ', error);
      if (error?.message?.includes('offline') || error?.message?.includes('client is offline')) {
        showToast('İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.', 'error');
      } else {
        showToast('İlan eklenirken bir hata oluştu', 'error');
      }
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('İlan güncellemek için giriş yapmalısınız!', 'error');
      return;
    }

    if (!editingId) {
      showToast('Güncelleme hatası: İlan ID bulunamadı!', 'error');
      return;
    }



    try {
      const docRef = doc(db, 'roommates', editingId);
      
      // Check if document exists first
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        showToast('İlan bulunamadı. Sayfa yenileniyor...', 'error');
        await loadRoommates();
        resetModalState();
        return;
      }

      // Check if user owns this listing
      const docData = docSnap.data();
      if (docData?.userId !== user.uid) {
        showToast('Bu ilanı sadece sahibi düzenleyebilir.', 'error');
        resetModalState();
        return;
      }

      // Prepare update data
      const updateData = {
        name: addForm.name,
        age: addForm.age,
        university: addForm.university,
        department: addForm.department,
        location: addForm.location,
        price: addForm.price, // Keep as string for consistency
        currency: addForm.currency,
        roomType: addForm.roomType,
        availableFrom: addForm.availableFrom,
        description: addForm.description,
        gender: addForm.gender,
        type: addForm.type,
        smoking: Boolean(addForm.smoking),
        pets: Boolean(addForm.pets),
        phone: addForm.phone,
        email: addForm.email,
        contactPreferences: addForm.contactPreferences,
        updatedAt: serverTimestamp(),
      };



      await updateDoc(docRef, updateData);

      showToast('İlanınız başarıyla güncellendi', 'success');
      resetModalState();
      await loadRoommates();
    } catch (error: any) {
      console.error('Error updating document: ', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      
      if (error?.code === 'permission-denied') {
        showToast('Bu ilanı güncelleme yetkiniz yok.', 'error');
      } else if (error?.code === 'not-found') {
        showToast('İlan bulunamadı. Sayfa yenileniyor...', 'error');
        await loadRoommates();
        resetModalState();
      } else if (error?.message?.includes('offline') || error?.message?.includes('client is offline')) {
        showToast('İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.', 'error');
      } else {
        showToast('İlan güncellenirken bir hata oluştu: ' + (error?.message || 'Bilinmeyen hata'), 'error');
      }
    }
  };

  const handleEdit = (roommate: any) => {
    
    setAddForm({
      name: roommate.name || '',
      age: roommate.age || '',
      university: roommate.university || '',
      department: roommate.department || '',
      location: roommate.location || '',
      price: roommate.price || '',
      currency: roommate.currency || 'TL',
      roomType: roommate.roomType || '',
      availableFrom: roommate.availableFrom || '',
      description: roommate.description || '',
      gender: roommate.gender || '',
      type: roommate.type || 'seeking',
      smoking: roommate.smoking || false,
      pets: roommate.pets || false,
      phone: roommate.phone || '',
      email: roommate.email || '',
      contactPreferences: roommate.contactPreferences || {
        whatsapp: true,
        telefon: true,
        eposta: true
      }
    });
    
    setEditingId(roommate.id);
    setIsEditing(true);
    setShowAddModal(true);
    
    console.log('Edit state set - ID:', roommate.id, 'isEditing:', true);
  };

  const resetModalState = () => {
    setShowAddModal(false);
    setIsEditing(false);
    setEditingId(null);
    setAddForm({
      name: '',
      age: '',
      university: '',
      department: '',
      location: '',
      price: '',
      currency: 'TL',
      roomType: '',
      availableFrom: '',
      description: '',
      gender: '',
      type: 'seeking',
      smoking: false,
      pets: false,
      phone: '',
      email: '',
      contactPreferences: {
        whatsapp: true,
        telefon: true,
        eposta: true
      }
    });
  };

  // handleDelete fonksiyonu
  const handleDelete = async (id: string) => {
    if (!user) {
      showToast('Lütfen önce giriş yapın', 'error');
      return;
    }

    try {
      // İlanı sil
      await deleteDoc(doc(db, 'roommates', id));
      
      // Tüm kullanıcıların favorilerinden bu ilanı sil
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const deletePromises = [];
      
      for (const userDoc of usersSnapshot.docs) {
        const favoritesRef = collection(db, 'users', userDoc.id, 'favorites');
        const favoritesQuery = query(favoritesRef, where('itemId', '==', id), where('contentType', '==', 'roommate'));
        const favoritesSnapshot = await getDocs(favoritesQuery);
        
        favoritesSnapshot.docs.forEach(favDoc => {
          deletePromises.push(deleteDoc(doc(db, 'users', userDoc.id, 'favorites', favDoc.id)));
        });
      }
      
      // Tüm favori silme işlemlerini bekle
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }
      
      showToast('İlan başarıyla silindi', 'success');
      loadRoommates();
      
      // Eğer kullanıcı giriş yapmışsa favorilerini yenile
      if (user) {
        await loadFavorites(user.uid);
      }
    } catch (error) {
      console.error('Error deleting roommate:', error);
      showToast('İlan silinirken bir hata oluştu', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1c0f3f] to-[#2e0f5f] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Ev Arkadaşı Bul</h1>
            <p className="text-lg text-gray-200 mb-8">
              İhtiyacınıza uygun ev arkadaşını bulmak için buraya gelebilirsiniz.
              Siz ev arkadaşı arıyorsanız, biz sizin için ev arıyoruz.
            </p>
            
            {/* Filter Type Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <TouchButton
                onClick={() => setSelectedType('seeking')}
                className={`px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                  selectedType === 'seeking' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Users className="mr-2" /> Ev Arkadaşı Arıyor
              </TouchButton>
              <TouchButton
                onClick={() => setSelectedType('offering')}
                className={`px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                  selectedType === 'offering' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Home className="mr-2" /> Ev Arıyor
              </TouchButton>
            </div>

            {/* İlan Ver Button */}
            <div className="mt-4">
              <TouchButton
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setShowAddModal(true);
                }}
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
                placeholder="İsim, üniversite, bölüm veya konum ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Fiyat Slider'ı */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fiyat Aralığı: {priceRange[0]} TL - {priceRange[1]} TL
              </label>
              <Range
                values={priceRange}
                step={100}
                min={0}
                max={10000}
                onChange={(values) => setPriceRange(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-2 w-full bg-gray-200 rounded-lg"
                    style={{
                      background: getTrackBackground({
                        values: priceRange,
                        colors: ["#e5e7eb", "#3b82f6", "#e5e7eb"],
                        min: 0,
                        max: 10000
                      })
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-5 w-5 bg-blue-500 rounded-full focus:outline-none shadow-md hover:shadow-lg transition-shadow"
                  />
                )}
              />
            </div>

            {/* Filtre seçenekleri */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Üniversite filtresi */}
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Üniversite Seçin</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>

              {/* Lokasyon filtresi */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Konum Seçin</option>
                <option value="Lefkoşa">Lefkoşa</option>
                <option value="Gazimağusa">Gazimağusa</option>
                <option value="Girne">Girne</option>
                <option value="Lefke">Lefke</option>
                <option value="Güzelyurt">Güzelyurt</option>
                <option value="İskele">İskele</option>
              </select>

              {/* Cinsiyet filtresi */}
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Cinsiyet Seçin</option>
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
              </select>

              {/* İlan tipi filtresi */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Tüm İlanlar</option>
                <option value="seeking">Ev Arkadaşı Arıyor</option>
                <option value="offering">Ev Arkadaşı Oluyor</option>
              </select>
            </div>

            {/* Filtreleme butonları */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={clearFilters}
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
              {filteredRoommates.length} sonuç bulundu
            </p>
          </div>

          {/* Roommate Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoommates.map((roommate) => (
              <div key={roommate.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Profile Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{roommate.name}</h3>
                      <p className="text-sm text-gray-600">{roommate.university}</p>
                      <p className="text-xs text-gray-500">{roommate.department}</p>
                    </div>
                    {/* Yıldız ve rating kaldırıldı */}
                  </div>

                  {/* Verification Badge */}
                  {roommate.isVerified && (
                    <div className="mb-3">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Doğrulanmış
                      </span>
                    </div>
                  )}

                  {/* Type and Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      roommate.type === 'seeking' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {roommate.type === 'seeking' ? 'Ev Arkadaşı Arıyor' : 'Ev Arıyor'}
                    </span>
                    <div className="flex items-center text-blue-600 font-bold">
                      {roommate.currency === 'GBP' ? (
                        <PoundSterling size={16} className="mr-1" />
                      ) : (
                        <DollarSign size={16} className="mr-1" />
                      )}
                      {roommate.price} {roommate.currency}
                    </div>
                  </div>

                  {/* Location and Date */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2" />
                      <span>{roommate.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2" />
                      <span>Müsait: {roommate.availableFrom}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Home size={14} className="mr-2" />
                      <span>{roommate.roomType}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{roommate.description}</p>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(roommate.interests || []).slice(0, 3).map((interest, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>

                  {/* Preferences */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <span className={roommate.smoking ? 'text-orange-600' : 'text-green-600'}>
                      {roommate.smoking ? '🚬 Sigara' : '🚭 Sigara İçmez'}
                    </span>
                    <span className={roommate.pets ? 'text-blue-600' : 'text-gray-500'}>
                      {roommate.pets ? '🐕 Evcil Hayvan' : '🚫 Evcil Hayvan Yok'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => {
                        setSelectedRoommate(roommate);
                        setShowDetailModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition"
                    >
                      <Eye size={16} />
                      Detay
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRoommate(roommate);
                        setShowContactModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-medium transition"
                    >
                      <MessageCircle size={16} />
                      İletişim
                    </button>
                  </div>

                  {/* Favorite and Share */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(roommate)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition ${
                        favorites.includes(roommate.id)
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart size={16} fill={favorites.includes(roommate.id) ? 'currentColor' : 'none'} />
                      {favorites.includes(roommate.id) ? 'Favoride' : 'Favorile'}
                    </button>
                    <button
                      onClick={() => handleShare(roommate)}
                      className="flex items-center justify-center gap-2 bg-blue-100 text-blue-600 hover:bg-blue-200 py-2 px-4 rounded-lg font-medium transition"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>

                  {/* Delete button for own listings */}
                  {user && roommate.userId === user.uid && (
                    <div className="mt-2 flex gap-2">
                      <TouchButton
                        onClick={() => handleEdit(roommate)}
                        className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 py-2 text-sm"
                      >
                        <Edit size={16} />
                        İlanı Düzenle
                      </TouchButton>
                      <TouchButton
                        onClick={() => handleDelete(roommate.id)}
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

          {/* Empty State */}
          {filteredRoommates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                Arama kriterlerinize uygun ev arkadaşı ilanı bulunamadı.
              </p>
              <TouchButton
                onClick={clearFilters}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Filtreleri Temizle
              </TouchButton>
            </div>
          )}
        </div>
      </PullToRefresh>
      <Footer />

      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Ev Arkadaşı İlanı Güncelle' : 'Ev Arkadaşı İlanı Ver'}</h2>
                <button
                  onClick={resetModalState}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={isEditing ? handleUpdateSubmit : handleAddSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yaş *</label>
                  <input
                    type="number"
                    required
                    value={addForm.age}
                    onChange={(e) => setAddForm({...addForm, age: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Yaşınız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Üniversite *</label>
                  <select
                    required
                    value={addForm.university}
                    onChange={(e) => setAddForm({...addForm, university: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Üniversite Seçin</option>
                    {universities.map((uni) => (
                      <option key={uni} value={uni}>{uni}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bölüm *</label>
                  <input
                    type="text"
                    required
                    value={addForm.department}
                    onChange={(e) => setAddForm({...addForm, department: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Bölümünüz"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konum *</label>
                  <select
                    required
                    value={addForm.location}
                    onChange={(e) => setAddForm({...addForm, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Konum Seçin</option>
                    <option value="Lefkoşa">Lefkoşa</option>
                    <option value="Gazimağusa">Gazimağusa</option>
                    <option value="Girne">Girne</option>
                    <option value="Lefke">Lefke</option>
                    <option value="Güzelyurt">Güzelyurt</option>
                    <option value="İskele">İskele</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat *</label>
                  <input
                    type="number"
                    required
                    value={addForm.price}
                    onChange={(e) => setAddForm({...addForm, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Fiyat"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
                  <select
                    value={addForm.currency}
                    onChange={(e) => setAddForm({...addForm, currency: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TL">TL</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Oda Tipi *</label>
                  <input
                    type="text"
                    required
                    value={addForm.roomType}
                    onChange={(e) => setAddForm({...addForm, roomType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Tek kişilik oda, paylaşımlı oda, vb."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Müsait Tarih *</label>
                  <input
                    type="date"
                    required
                    value={addForm.availableFrom}
                    onChange={(e) => setAddForm({...addForm, availableFrom: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cinsiyet *</label>
                  <select
                    required
                    value={addForm.gender}
                    onChange={(e) => setAddForm({...addForm, gender: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Cinsiyet Seçin</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İlan Tipi *</label>
                  <select
                    required
                    value={addForm.type}
                    onChange={(e) => setAddForm({...addForm, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="seeking">Ev Arkadaşı Arıyor</option>
                    <option value="offering">Ev Arıyor</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama *</label>
                <textarea
                  required
                  value={addForm.description}
                  onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Kendinizi tanıtın ve aradığınız ev arkadaşı özelliklerini belirtin..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({...addForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Telefon numaranız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="E-posta adresiniz"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={addForm.smoking}
                    onChange={(e) => setAddForm({...addForm, smoking: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Sigara içiyorum</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={addForm.pets}
                    onChange={(e) => setAddForm({...addForm, pets: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Evcil hayvanım var</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetModalState}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-medium transition-colors"
                >
                  {isEditing ? 'İlanı Güncelle' : 'İlanı Yayınla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRoommate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRoommate.name}</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Yaş</span>
                  <p className="font-medium">{selectedRoommate.age}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Üniversite</span>
                  <p className="font-medium">{selectedRoommate.university}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Bölüm</span>
                  <p className="font-medium">{selectedRoommate.department}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Konum</span>
                  <p className="font-medium">{selectedRoommate.location}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Fiyat</span>
                  <p className="font-medium">{selectedRoommate.price} {selectedRoommate.currency}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Oda Tipi</span>
                  <p className="font-medium">{selectedRoommate.roomType}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Açıklama</span>
                <p className="mt-1">{selectedRoommate.description}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowContactModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  İletişime Geç
                </button>
                <ReportButton
                  contentType="roommate"
                  contentId={selectedRoommate.id}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedRoommate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">İletişim Bilgileri</h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-400" />
                <span className="font-medium">{selectedRoommate.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <span className="font-medium">{selectedRoommate.email}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 