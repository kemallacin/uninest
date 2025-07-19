'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, MapPin, Users, Calendar, Star, MessageCircle, Heart, Share2, X, Plus, Home, UserPlus, Trash2, DollarSign, Eye, PoundSterling, Edit, ChevronLeft, ChevronRight, CheckCircle, Clock, Phone, Mail } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ReportButton from '../../components/ReportButton';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, setDoc, getDoc, updateDoc, where, onSnapshot } from 'firebase/firestore';
import { useToast } from '../../components/ToastProvider';
import LoadingSpinner, { InlineLoading, PageLoading } from '../../components/LoadingSpinner';
import TouchButton from '../../components/TouchButton';
import SwipeableCard from '../../components/SwipeableCard';
import PullToRefresh from '../../components/PullToRefresh';
import { useMobileOptimization } from '../../hooks/useMobileOptimization';
import { useRouter } from 'next/navigation';

interface RoommateItem {
  id: string;
  name: string;
  age: string;
  university: string;
  department: string;
  location: string;
  price: string;
  currency: string;
  roomType: string;
  availableFrom: string;
  description: string;
  gender: string;
  type: string;
  smoking: boolean;
  pets: boolean;
  phone: string;
  email: string;
  urgency?: string;
  deposit?: string;
  contactPreferences: {
    whatsapp: boolean;
    telefon: boolean;
    eposta: boolean;
  };
  interests: string[];
  images?: string[];
  image?: string; // For backward compatibility
  createdAt: any;
  createdBy: string;
  isApproved: boolean;
  isPremium?: boolean;
  premiumAt?: any;
  premiumBy?: string;
  approvedAt?: any;
  approvedBy?: string;
  status: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  rating?: number;
  reviews?: number;
  isVerified?: boolean;
  views?: number;
  favorites?: number;
  contactCount?: number;
}

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
  }
];

export default function EvArkadasiClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoommate, setSelectedRoommate] = useState<RoommateItem | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roommates, setRoommates] = useState<RoommateItem[]>([]);
  const [editItem, setEditItem] = useState<RoommateItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const router = useRouter();
  const [showImageLightbox, setShowImageLightbox] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedType, setSelectedType] = useState('all');

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
    urgency: '',
    deposit: '',
    contactPreferences: {
      whatsapp: true,
      telefon: true,
      eposta: true,
    },
    interests: [] as string[],
    images: [] as File[],
  });

  const { isMobile } = useMobileOptimization();

  // Memoized filtered roommates
  const filteredRoommates = useMemo(() => {
    let filtered = roommates;

    // Only show approved listings (unless admin or owner)
    if (!isAdmin) {
      filtered = filtered.filter(roommate => 
        roommate.isApproved !== false || 
        (user && roommate.userId === user.uid)
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(roommate =>
        roommate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roommate.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roommate.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roommate.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(roommate => roommate.location === selectedLocation);
    }

    // Gender filter
    if (selectedGender) {
      filtered = filtered.filter(roommate => roommate.gender === selectedGender);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(roommate => roommate.type === selectedType);
    }

    // Premium sıralama
    return filtered.sort((a, b) => {
      // Premium ilanları öne çıkar
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      
      // Sonra tarihe göre sırala (en yeni önce)
      const dateA = a.createdAt?.getTime?.() || 0;
      const dateB = b.createdAt?.getTime?.() || 0;
      return dateB - dateA;
    });
  }, [roommates, searchTerm, selectedLocation, selectedGender, selectedType, isAdmin, user]);

  // Firebase auth state listener ve admin kontrolü
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Admin kontrolü
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const isUserAdmin = userDoc.exists() && userDoc.data().isAdmin === true;
          console.log('Admin kontrolü:', currentUser.uid, isUserAdmin);
          setIsAdmin(isUserAdmin);
        } catch (error) {
          console.error('Admin kontrolü hatası:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // İlanları yükle
  useEffect(() => {
    if (!user) {
      setRoommates([]);
      return;
    }

    console.log('Ev arkadaşı ilanları yükleniyor... Admin:', isAdmin);

    const q = query(
      collection(db, 'roommates'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const roommatesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as RoommateItem[];

        console.log('Toplam ev arkadaşı ilan sayısı:', roommatesData.length);
        console.log('Onay bekleyen ilan sayısı:', roommatesData.filter(item => !item.isApproved).length);

        setRoommates(roommatesData);
      } catch (error) {
        console.error('Ev arkadaşı ilanlarını yükleme hatası:', error);
        setRoommates([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

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
          // Get all current roommate listings
          const roommatesRef = collection(db, 'roommates');
          const roommatesSnapshot = await getDocs(roommatesRef);
          const validListingIds = new Set(roommatesSnapshot.docs.map(doc => doc.id));

          // Filter favorites to only include existing listings with contentType 'roommate'
          const validFavorites = snapshot.docs
            .filter(doc => {
              const data = doc.data();
              return data.contentType === 'roommate' && validListingIds.has(doc.id);
            })
            .map(doc => doc.id);

          setFavorites(validFavorites);

          // Clean up any invalid favorites
          const cleanupPromises = snapshot.docs
            .filter(doc => {
              const data = doc.data();
              return data.contentType === 'roommate' && !validListingIds.has(doc.id);
            })
            .map(doc => deleteDoc(doc.ref));

          if (cleanupPromises.length > 0) {
            await Promise.all(cleanupPromises);
            console.log(`Cleaned up ${cleanupPromises.length} invalid favorites`);
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

  const { showToast } = useToast();

  const handleRefresh = useCallback(async () => {
    // Refresh logic will be handled by the onSnapshot listener
    showToast('Sayfa yenilendi', 'success');
  }, [showToast]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedGender('');
    setSelectedType('all');
  };

  const toggleFavorite = useCallback(async (roommate: RoommateItem) => {
    if (!user) {
      showToast('Favorilere eklemek için giriş yapmalısınız!', 'error');
      return;
    }
    
    try {
      const favRef = doc(db, 'users', user.uid, 'favorites', roommate.id);
      
      if (favorites.includes(roommate.id)) {
        // Favoriden çıkar
        await deleteDoc(favRef);
        showToast('Favorilerden çıkarıldı.', 'info');
      } else {
        // Favoriye ekle
        await setDoc(favRef, {
          itemId: roommate.id,
          contentType: 'roommate',
          title: roommate.name,
          price: roommate.price,
          currency: roommate.currency,
          createdAt: serverTimestamp(),
        });
        showToast('Favorilere eklendi!', 'success');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
  }, [user, favorites, showToast]);

  const handleShare = useCallback(async (roommate: RoommateItem) => {
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
      navigator.clipboard.writeText(window.location.href);
      showToast('Link kopyalandı!', 'success');
    }
  }, [showToast]);

  // Admin onay/red fonksiyonu
  const handleApprove = useCallback(async (id: string, approved: boolean) => {
    if (!user || !isAdmin) {
      showToast('Bu işlem için admin yetkisi gerekiyor!', 'error');
      return;
    }

    try {
      if (approved) {
        // İlanı onayla
        await updateDoc(doc(db, 'roommates', id), {
          isApproved: true,
          approvedAt: serverTimestamp(),
          approvedBy: user.uid,
        });
        showToast('İlan onaylandı ve yayınlandı.', 'success');
      } else {
        // İlanı reddet ve sil
        await deleteDoc(doc(db, 'roommates', id));
        showToast('İlan reddedildi ve silindi.', 'success');
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
      showToast('İşlem sırasında bir hata oluştu.', 'error');
    }
  }, [user, isAdmin, showToast]);

  // Düzenleme fonksiyonu
  const handleEdit = useCallback((roommate: RoommateItem) => {
    if (!user || roommate.userId !== user.uid) {
      showToast('Bu ilanı düzenleme yetkiniz yok!', 'error');
      return;
    }

    setAddForm({
      name: roommate.name || '',
      age: roommate.age?.toString() || '',
      university: roommate.university || '',
      department: roommate.department || '',
      location: roommate.location || '',
      price: roommate.price?.toString() || '',
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
      urgency: roommate.urgency || '',
      deposit: roommate.deposit || '',
      contactPreferences: roommate.contactPreferences || {
        whatsapp: true,
        telefon: true,
        eposta: true,
      },
      interests: roommate.interests || [],
      images: [],
    });

    setEditItem(roommate);
    setShowListingModal(true);
  }, [user, showToast]);

  // Silme fonksiyonu
  const handleDelete = useCallback(async (id: string) => {
    if (!user) {
      showToast('Silme işlemi için giriş yapmalısınız!', 'error');
      return;
    }

    if (!confirm('Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      // İlanı sil
      await deleteDoc(doc(db, 'roommates', id));
      
      // Favorilerden de sil
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const deleteFavoritePromises = usersSnapshot.docs.map(async (userDoc) => {
        const favoriteRef = doc(db, 'users', userDoc.id, 'favorites', id);
        try {
          await deleteDoc(favoriteRef);
        } catch (error) {
          // Ignore if favorite doesn't exist
          console.log(`No favorite found for user ${userDoc.id} and listing ${id}`);
        }
      });

      await Promise.all(deleteFavoritePromises);
      
      showToast('İlan başarıyla silindi.', 'success');
    } catch (error) {
      console.error('Error deleting roommate listing:', error);
      showToast('İlan silinirken bir hata oluştu.', 'error');
    }
  }, [user, showToast]);

  const resetModalState = useCallback(() => {
    setShowListingModal(false);
    setEditItem(null);
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
      urgency: '',
      deposit: '',
      contactPreferences: {
        whatsapp: true,
        telefon: true,
        eposta: true,
      },
      interests: [],
      images: [],
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast('İlan vermek için giriş yapmalısınız!', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Resimleri base64'e çevir
      let imageUrls: string[] = [];
      
      if (addForm.images && Array.isArray(addForm.images) && addForm.images.length > 0) {
        // Fotoğraf limitini kontrol et
        if (addForm.images.length > 2) {
          showToast('Maksimum 2 fotoğraf yükleyebilirsiniz!', 'error');
          setLoading(false);
          return;
        }
        
        console.log('Resimler işleniyor:', addForm.images.length, 'adet');
        
        // Her resmi kontrol et ve base64'e çevir
        for (let i = 0; i < addForm.images.length; i++) {
          const file = addForm.images[i];
          
          // File kontrolü
          if (!file || !(file instanceof File)) {
            console.warn(`Resim ${i + 1} geçersiz, atlanıyor`);
            continue;
          }
          
          // Dosya boyutu kontrolü (5MB)
          if (file.size > 5 * 1024 * 1024) {
            showToast(`Resim ${i + 1} çok büyük (max 5MB)`, 'error');
            setLoading(false);
            return;
          }
          
          // Dosya tipi kontrolü
          if (!file.type.startsWith('image/')) {
            showToast(`Dosya ${i + 1} resim formatında değil`, 'error');
            setLoading(false);
            return;
          }
          
          try {
            console.log(`Resim ${i + 1} işleniyor...`);
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                  resolve(result);
                } else {
                  reject(new Error('Resim okunamadı'));
                }
              };
              reader.onerror = () => reject(new Error('Dosya okuma hatası'));
              reader.readAsDataURL(file);
            });
            
            imageUrls.push(base64);
            console.log(`Resim ${i + 1} başarıyla işlendi`);
            
          } catch (error) {
            console.error(`Resim ${i + 1} işleme hatası:`, error);
            showToast(`Resim ${i + 1} işlenirken hata oluştu`, 'error');
            setLoading(false);
            return;
          }
        }
        
        console.log(`Toplam ${imageUrls.length} resim başarıyla işlendi`);
      }


      
      const roommateData = {
        name: addForm.name,
        age: addForm.age,
        university: addForm.university,
        department: addForm.department,
        location: addForm.location,
        price: addForm.price,
        currency: addForm.currency,
        roomType: addForm.roomType,
        availableFrom: addForm.availableFrom,
        description: addForm.description,
        gender: addForm.gender,
        type: addForm.type,
        smoking: addForm.smoking,
        pets: addForm.pets,
        phone: addForm.phone,
        email: addForm.email,
        contactPreferences: addForm.contactPreferences,
        interests: addForm.interests,
        images: imageUrls,
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isApproved: false,
        isActive: true,
        views: 0,
        favorites: 0,
        contactCount: 0,
      };

      if (editItem) {
        // Update existing listing - preserve approval status
        const docRef = doc(db, 'roommates', editItem.id);
        

        
        // Only update the form fields, preserve other fields
        await updateDoc(docRef, {
          name: addForm.name,
          age: addForm.age,
          university: addForm.university,
          department: addForm.department,
          location: addForm.location,
          price: addForm.price,
          currency: addForm.currency,
          roomType: addForm.roomType,
          availableFrom: addForm.availableFrom,
          description: addForm.description,
          gender: addForm.gender,
          type: addForm.type,
          smoking: addForm.smoking,
          pets: addForm.pets,
          phone: addForm.phone,
          email: addForm.email,
          contactPreferences: addForm.contactPreferences,
          interests: addForm.interests,
          images: imageUrls,
          updatedAt: serverTimestamp(),
        });
        showToast('İlan başarıyla güncellendi!', 'success');
      } else {
        // Create new listing
        const docRef = await addDoc(collection(db, 'roommates'), roommateData);
        showToast('İlan başarıyla oluşturuldu! Admin onayından sonra yayınlanacak.', 'success');
      }

      resetModalState();
    } catch (error) {
      console.error('Error submitting roommate listing:', error);
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addForm, user, editItem, showToast, resetModalState]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1c0f3f] to-[#2e0f5f] text-white py-16 mb-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ev Arkadaşı Bul
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Kıbrıs'ta öğrenci ev arkadaşı arayanlar ve evini paylaşmak isteyenler için güvenli platform
            </p>
          </div>
          
          {/* Type Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <TouchButton
              onClick={() => setSelectedType('seeking')}
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                selectedType === 'seeking' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Ev Arkadaşı Arıyorum
            </TouchButton>
            <TouchButton
              onClick={() => setSelectedType('offering')}
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                selectedType === 'offering' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Home className="w-5 h-5 mr-2" />
              Ev Arkadaşı Oluyorum
            </TouchButton>
          </div>

          {/* Add Listing Button */}
          <div className="flex justify-center">
            {user && (
              <TouchButton
                onClick={() => {
                  console.log('İlan Ver butonuna tıklandı');
                  setEditItem(null);
                  setShowListingModal(true);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-12 py-4 rounded-full text-xl font-bold transition-colors shadow-lg"
              >
                <Plus className="w-6 h-6 mr-2" />
                İlan Ver
              </TouchButton>
            )}

            {/* Add Listing Button for non-logged in users */}
            {!user && (
              <TouchButton
                onClick={() => {
                  console.log('Giriş yapmadan İlan Ver butonuna tıklandı');
                  // Redirect to login or show auth modal
                  window.location.href = '/giris';
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-12 py-4 rounded-full text-xl font-bold transition-colors shadow-lg"
              >
                <Plus className="w-6 h-6 mr-2" />
                İlan Ver
              </TouchButton>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="İsim, üniversite, bölüm veya konum ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Konum
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Tüm Konumlar</option>
                  <option value="Lefkoşa">Lefkoşa</option>
                  <option value="Gazimağusa">Gazimağusa</option>
                  <option value="Girne">Girne</option>
                  <option value="Lefke">Lefke</option>
                  <option value="Güzelyurt">Güzelyurt</option>
                  <option value="İskele">İskele</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cinsiyet
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Tüm Cinsiyetler</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İlan Tipi
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Tüm İlanlar</option>
                  <option value="seeking">Ev Arkadaşı Arıyor</option>
                  <option value="offering">Ev Arıyor</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-6">
              <TouchButton
                onClick={clearFilters}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
              >
                Filtreleri Temizle
              </TouchButton>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredRoommates.length} sonuç bulundu
              </div>
            </div>
          </div>

          {/* Roommate Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoommates.map((roommate) => (
              <div key={roommate.id} className={`rounded-2xl transition-all duration-300 overflow-hidden relative ${
                roommate.isPremium 
                  ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/30 dark:via-purple-900/20 dark:to-indigo-900/30 border-2 border-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105' 
                  : 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl'
              }`}>
                {/* Premium Glow Effect */}
                {roommate.isPremium && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-indigo-400/10 rounded-2xl pointer-events-none"></div>
                )}

                {/* Image Gallery */}
                {roommate.images && roommate.images.length > 0 && (
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={roommate.images[0]}
                      alt={`${roommate.name} - ${roommate.university}`}
                      className="w-full h-full object-cover"
                    />
                    {roommate.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        +{roommate.images.length - 1} fotoğraf
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setSelectedRoommate(roommate);
                        setCurrentImageIndex(0);
                        setShowImageLightbox(true);
                      }}
                      className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                )}

                <div className={`p-6 relative ${roommate.isPremium ? 'bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-indigo-50/50 dark:from-pink-900/20 dark:via-purple-900/10 dark:to-indigo-900/20' : ''}`}>
                  {/* Premium Corner Decoration */}
                  {roommate.isPremium && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-400/20 to-transparent rounded-bl-full"></div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{roommate.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{roommate.university}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{roommate.department}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                                          {/* Premium Badge */}
                    {roommate.isPremium && (
                      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl border border-white/20 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-white drop-shadow-sm">👑 PREMIUM</span>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                      {/* Onay Bekliyor Badge */}
                      {roommate.isApproved === false && (
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Clock size={12} />
                          Onay Bekliyor
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Badge */}
                  {roommate.isVerified && (
                    <div className="mb-3">
                      <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Doğrulanmış
                      </span>
                    </div>
                  )}

                  {/* Onay durumu (sadece ilan sahibi veya admin görsün) */}
                  {(user?.uid === roommate.userId || isAdmin) && (
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        roommate.isApproved 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                      }`}>
                        {roommate.isApproved ? (
                          <>
                            <CheckCircle size={12} />
                            Onaylandı
                          </>
                        ) : (
                          <>
                            <Clock size={12} />
                            Onay Bekliyor
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Type and Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      roommate.type === 'seeking' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }`}>
                      {roommate.type === 'seeking' ? 'Ev Arkadaşı Arıyor' : 'Ev Arıyor'}
                    </span>
                    <div className={`flex items-center font-bold ${roommate.isPremium ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {roommate.isPremium && <span className="text-pink-500 mr-1">💎</span>}
                      {(() => {
                        const currency = roommate.currency || 'TL';
                        if (currency === 'GBP') {
                          return <><PoundSterling size={16} className="mr-1" />{roommate.price} {currency}</>;
                        } else if (currency === 'TL') {
                          return <><span className="mr-1 text-sm font-bold">₺</span>{roommate.price} {currency}</>;
                        } else if (currency === 'USD') {
                          return <><DollarSign size={16} className="mr-1" />{roommate.price} {currency}</>;
                        } else {
                          return <><span className="mr-1 text-sm font-bold">₺</span>{roommate.price} TL</>;
                        }
                      })()}
                      {roommate.isPremium && <span className="text-pink-500 ml-1">💎</span>}
                    </div>
                  </div>

                  {/* Location and Date */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin size={14} className="mr-2" />
                      <span>{roommate.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Calendar size={14} className="mr-2" />
                      <span>Müsait: {roommate.availableFrom}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Home size={14} className="mr-2" />
                      <span>{roommate.roomType}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{roommate.description}</p>

                  {/* Actions */}
                  <div className="flex gap-2 mb-3">
                    <TouchButton
                      onClick={() => {
                        setSelectedRoommate(roommate);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition"
                    >
                      <Eye size={16} />
                      Detay
                    </TouchButton>
                    {user && roommate.userId !== user.uid && (
                      <TouchButton
                        onClick={() => {
                          setSelectedRoommate(roommate);
                          setShowContactModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-medium transition"
                      >
                        <MessageCircle size={16} />
                        İletişim
                      </TouchButton>
                    )}
                  </div>

                  {/* Favorite, Share and Report */}
                  <div className="flex gap-2 mb-3">
                    {user && roommate.userId !== user.uid && (
                      <TouchButton
                        onClick={() => {
                          toggleFavorite(roommate);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition ${
                          favorites.includes(roommate.id)
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Heart size={16} fill={favorites.includes(roommate.id) ? 'currentColor' : 'none'} />
                        {favorites.includes(roommate.id) ? 'Favoride' : 'Favorile'}
                      </TouchButton>
                    )}
                    {user && roommate.userId !== user.uid && (
                      <button
                        onClick={() => handleShare(roommate)}
                        className="flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 py-2 px-4 rounded-lg font-medium transition"
                      >
                        <Share2 size={16} />
                      </button>
                    )}
                    {user && roommate.userId !== user.uid && (
                      <ReportButton contentType="roommate" contentId={roommate.id} />
                    )}
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && roommate.isApproved === false && (
                    <div className="mt-3 flex gap-2">
                      <TouchButton
                        onClick={() => handleApprove(roommate.id, true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition"
                      >
                        <CheckCircle size={16} />
                        Onayla
                      </TouchButton>
                      <TouchButton
                        onClick={() => handleApprove(roommate.id, false)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition"
                      >
                        <X size={16} />
                        Reddet
                      </TouchButton>
                    </div>
                  )}

                  {/* Owner Actions */}
                  {user && roommate.userId === user.uid && (
                    <div className="mt-3 flex gap-2">
                      <TouchButton
                        onClick={() => handleEdit(roommate)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition"
                      >
                        <Edit size={16} />
                        Düzenle
                      </TouchButton>
                      <TouchButton
                        onClick={() => handleDelete(roommate.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition"
                      >
                        <Trash2 size={16} />
                        Sil
                      </TouchButton>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredRoommates.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Henüz ilan yok</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">İlk ilanı siz verin!</p>
              {user && (
                <TouchButton
                  onClick={() => {
                    setEditItem(null);
                    setShowListingModal(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  İlan Ver
                </TouchButton>
              )}
            </div>
          )}
        </div>
      </PullToRefresh>

      {/* Add/Edit Modal */}
      {showListingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {editItem ? 'İlanı Düzenle' : 'Yeni İlan Ver'}
              </h3>
              <TouchButton
                onClick={resetModalState}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </TouchButton>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* İlan Türü Seçimi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  İlan Türü *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAddForm(prev => ({ ...prev, type: 'seeking' }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      addForm.type === 'seeking'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Home size={20} />
                      <span className="font-medium">Ev Arkadaşı Arıyorum</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ev sahibiyim, evime arkadaş arıyorum</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddForm(prev => ({ ...prev, type: 'offering' }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      addForm.type === 'offering'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus size={20} />
                      <span className="font-medium">Oda Arıyorum</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ev arıyorum, oda arkadaşı olabilirim</p>
                  </button>
                </div>
              </div>

              {/* Seçilen İlan Türü Bilgisi */}
              <div className={`p-4 rounded-lg border-l-4 ${
                addForm.type === 'seeking' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300' 
                  : 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300'
              }`}>
                <div className="flex items-center gap-2">
                  {addForm.type === 'seeking' ? <Home size={20} /> : <UserPlus size={20} />}
                  <span className="font-medium">
                    {addForm.type === 'seeking' ? 'Ev Arkadaşı Arama' : 'Oda Arama'} İlanı Oluşturuyorsunuz
                  </span>
                </div>
                <p className="text-sm mt-1 opacity-80">
                  {addForm.type === 'seeking' 
                    ? 'Ev sahibi olarak evinize arkadaş arıyorsunuz.' 
                    : 'Ev arıyorsunuz, oda arkadaşı olabilirsiniz.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    İsim *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Adınız"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yaş *
                  </label>
                  <input
                    type="number"
                    required
                    min="16"
                    max="100"
                    value={addForm.age}
                    onChange={(e) => setAddForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Yaşınız"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Üniversite *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.university}
                    onChange={(e) => setAddForm(prev => ({ ...prev, university: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Üniversite adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bölüm *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.department}
                    onChange={(e) => setAddForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Bölüm adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Konum *
                  </label>
                  <select
                    required
                    value={addForm.location}
                    onChange={(e) => setAddForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {addForm.type === 'seeking' ? 'Sunduğunuz Oda Tipi *' : 'Aradığınız Oda Tipi *'}
                  </label>
                  <select
                    required
                    value={addForm.roomType}
                    onChange={(e) => setAddForm(prev => ({ ...prev, roomType: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Oda Tipi Seçin</option>
                    <option value="Tek Kişilik Oda">Tek Kişilik Oda</option>
                    <option value="Paylaşımlı Oda">Paylaşımlı Oda</option>
                    <option value="Stüdyo Daire">Stüdyo Daire</option>
                    <option value="1+1 Daire">1+1 Daire</option>
                    <option value="2+1 Daire">2+1 Daire</option>
                    <option value="Yurt Odası">Yurt Odası</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Müsait Tarih *
                  </label>
                  <input
                    type="date"
                    required
                    value={addForm.availableFrom}
                    onChange={(e) => setAddForm(prev => ({ ...prev, availableFrom: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cinsiyet *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Erkek"
                        checked={addForm.gender === 'Erkek'}
                        onChange={(e) => setAddForm(prev => ({ ...prev, gender: e.target.value }))}
                        className="mr-2"
                        required
                      />
                      <span className="text-gray-700 dark:text-gray-300">Erkek</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Kadın"
                        checked={addForm.gender === 'Kadın'}
                        onChange={(e) => setAddForm(prev => ({ ...prev, gender: e.target.value }))}
                        className="mr-2"
                        required
                      />
                      <span className="text-gray-700 dark:text-gray-300">Kadın</span>
                    </label>
                  </div>
                </div>


              </div>

              {/* Kategori Özel Alanları */}
              {addForm.type === 'seeking' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Aylık Kira *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        min="0"
                        value={addForm.price}
                        onChange={(e) => setAddForm(prev => ({ ...prev, price: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Aylık kira tutarı"
                      />
                      <select
                        value={addForm.currency}
                        onChange={(e) => setAddForm(prev => ({ ...prev, currency: e.target.value }))}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="TL">TL</option>
                        <option value="GBP">GBP</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Depozito Gerekiyor mu?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deposit"
                          value="yes"
                          checked={addForm.deposit === 'yes'}
                          onChange={(e) => setAddForm(prev => ({ ...prev, deposit: e.target.value }))}
                          className="mr-2"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Evet</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deposit"
                          value="no"
                          checked={addForm.deposit === 'no'}
                          onChange={(e) => setAddForm(prev => ({ ...prev, deposit: e.target.value }))}
                          className="mr-2"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Hayır</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {addForm.type === 'offering' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maksimum Bütçe *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        min="0"
                        value={addForm.price}
                        onChange={(e) => setAddForm(prev => ({ ...prev, price: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Maksimum ödeyebileceğiniz"
                      />
                      <select
                        value={addForm.currency}
                        onChange={(e) => setAddForm(prev => ({ ...prev, currency: e.target.value }))}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="TL">TL</option>
                        <option value="GBP">GBP</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Aciliyet Durumu
                    </label>
                    <select
                      value={addForm.urgency || ''}
                      onChange={(e) => setAddForm(prev => ({ ...prev, urgency: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Aciliyet Seçin</option>
                      <option value="Normal">Normal</option>
                      <option value="Acil">Acil (1 hafta içinde)</option>
                      <option value="Çok Acil">Çok Acil (3 gün içinde)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {addForm.type === 'seeking' ? 'Ev Hakkında Bilgi ve Beklentilerinizi Belirtin *' : 'Kendinizi Tanıtın ve Beklentilerinizi Belirtin *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={addForm.description}
                  onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={addForm.type === 'seeking' 
                    ? "Ev hakkında bilgi verin, hangi özelliklerde ev arkadaşı arıyorsunuz, ev kuralları neler..." 
                    : "Kendinizi tanıtın, hangi özelliklerde ev arıyorsunuz, yaşam tarzınız nasıl..."
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={addForm.phone}
                    onChange={(e) => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="05551234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={addForm.smoking}
                    onChange={(e) => setAddForm(prev => ({ ...prev, smoking: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Sigara içiyorum</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={addForm.pets}
                    onChange={(e) => setAddForm(prev => ({ ...prev, pets: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Evcil hayvanım var</span>
                </label>
              </div>

              {/* Fotoğraf Yükleme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fotoğraflar (İsteğe bağlı - Maksimum 2 adet)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 2) {
                        showToast('Maksimum 2 fotoğraf yükleyebilirsiniz!', 'error');
                        return;
                      }
                      setAddForm(prev => ({ ...prev, images: files }));
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Fotoğraf yüklemek için tıklayın
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, JPEG (max 5MB her dosya, maksimum 2 adet)
                      </p>
                    </div>
                  </label>
                </div>
                
                {/* Seçilen fotoğrafları göster */}
                {addForm.images && addForm.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Seçilen fotoğraflar ({addForm.images.length}/2)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {addForm.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setAddForm(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <TouchButton
                  type="button"
                  onClick={resetModalState}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  İptal
                </TouchButton>
                <TouchButton
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                >
                  {editItem ? 'Güncelle' : 'İlan Ver'}
                </TouchButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailsModal && selectedRoommate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">İlan Detayları</h3>
              <TouchButton
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRoommate(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </TouchButton>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{selectedRoommate.name}</h4>
                <p className="text-gray-600 dark:text-gray-300">{selectedRoommate.university}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedRoommate.department}</p>
              </div>

              {selectedRoommate.isVerified && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={20} />
                  <span className="font-medium">Doğrulanmış Kullanıcı</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin size={16} />
                  <span>{selectedRoommate.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar size={16} />
                  <span>Müsait: {selectedRoommate.availableFrom}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Home size={16} />
                  <span>{selectedRoommate.roomType}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  {(() => {
                    const currency = selectedRoommate.currency || 'TL';
                    if (currency === 'GBP') {
                      return <><PoundSterling size={16} /><span>{selectedRoommate.price} {currency}</span></>;
                    } else if (currency === 'TL') {
                      return <><span className="text-sm font-bold">₺</span><span>{selectedRoommate.price} {currency}</span></>;
                    } else if (currency === 'USD') {
                      return <><DollarSign size={16} /><span>{selectedRoommate.price} {currency}</span></>;
                    } else {
                      return <><span className="text-sm font-bold">₺</span><span>{selectedRoommate.price} TL</span></>;
                    }
                  })()}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 dark:text-white mb-2">Açıklama</h5>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{selectedRoommate.description}</p>
              </div>

              <div className="flex gap-2">
                <TouchButton
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowContactModal(true);
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium"
                >
                  İletişime Geç
                </TouchButton>
                <TouchButton
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedRoommate(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl font-medium"
                >
                  Kapat
                </TouchButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedRoommate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">İletişime Geç</h3>
              <TouchButton
                onClick={() => {
                  setShowContactModal(false);
                  setSelectedRoommate(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </TouchButton>
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">{selectedRoommate.name}</h4>
              <p className="text-xl font-bold text-green-600 mt-2">{selectedRoommate.price} {selectedRoommate.currency}</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <MapPin size={18} className="text-gray-500" />
                <span className="font-medium">{selectedRoommate.location}</span>
              </div>
              
              {/* İletişim Seçenekleri */}
              <div className="space-y-3">
                {selectedRoommate.phone && (
                  <a
                    href={`https://wa.me/${selectedRoommate.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="font-medium text-lg group-hover:scale-105 transition-transform">WhatsApp ile İletişime Geç</span>
                  </a>
                )}
                
                {selectedRoommate.phone && (
                  <a
                    href={`tel:${selectedRoommate.phone}`}
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    <Phone size={24} className="group-hover:rotate-12 transition-transform" />
                    <span className="font-medium text-lg group-hover:scale-105 transition-transform">Telefon ile Ara</span>
                  </a>
                )}
                
                {selectedRoommate.email && (
                  <a
                    href={`mailto:${selectedRoommate.email}`}
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    <Mail size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-lg group-hover:scale-105 transition-transform">E-posta Gönder</span>
                  </a>
                )}
              </div>
            </div>
            <div className="mt-6">
              <TouchButton
                onClick={() => {
                  setShowContactModal(false);
                  setSelectedRoommate(null);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 px-4 rounded-xl font-medium transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Kapat
              </TouchButton>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {showImageLightbox && selectedRoommate && selectedRoommate.images && selectedRoommate.images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowImageLightbox(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            {selectedRoommate.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : selectedRoommate.images.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev < selectedRoommate.images.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedRoommate.images[currentImageIndex]}
              alt={`${selectedRoommate.name} - ${currentImageIndex + 1}`}
              className="w-full h-full object-contain max-h-[80vh]"
            />

            {/* Image Counter */}
            {selectedRoommate.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {selectedRoommate.images.length}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
} 