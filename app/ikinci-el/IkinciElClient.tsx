'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SecondHandForm from '../../components/SecondHandForm';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, setDoc, getDoc, deleteField, onSnapshot, where } from 'firebase/firestore';
import ReportButton from '../../components/ReportButton';
import { useToast } from '../../components/ToastProvider';
import TouchButton from '../../components/TouchButton';
import PullToRefresh from '../../components/PullToRefresh';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useMobileOptimization } from '../../hooks/useMobileOptimization';
import { Search, Filter, MapPin, Star, MessageCircle, Heart, Share2, X, Plus, Trash2, Edit, Eye, ChevronLeft, ChevronRight, CheckCircle, Clock, Calendar, Phone, Mail, Grid3X3, List, ArrowUp, ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SecondHandItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
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
  previousPrice?: number;
  originalPrice?: number;
  location?: string;
  phone?: string;
  email?: string;
  contactPreferences?: string[];
  userName?: string;
  userEmail?: string;
}

const IkinciElClient = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedItem, setSelectedItem] = useState<SecondHandItem | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SecondHandItem[]>([]);
  const [editItem, setEditItem] = useState<SecondHandItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const [showImageLightbox, setShowImageLightbox] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [priceRangeValue, setPriceRangeValue] = useState(10000); // slider için max değer
  const [activeCondition, setActiveCondition] = useState(''); // durum filtresi
  const [viewMode, setViewMode] = useState<'grid' | 'scroll'>('grid'); // görünüm modu
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPosition, setModalPosition] = useState<{top: number} | null>(null);

  const categories = [
    { id: 'all', name: 'Tümü', icon: '🏠' },
    { id: 'electronics', name: 'Elektronik', icon: '💻' },
    { id: 'furniture', name: 'Mobilya', icon: '🪑' },
    { id: 'books', name: 'Kitap', icon: '📚' },
    { id: 'clothing', name: 'Giyim', icon: '👕' },
    { id: 'sports', name: 'Spor', icon: '⚽' },
    { id: 'other', name: 'Diğer', icon: '📦' }
  ];

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
      setItems([]);
      return;
    }

    console.log('İlanlar yükleniyor... Admin:', isAdmin);

    const q = query(
      collection(db, 'secondhand'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const itemsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SecondHandItem[];

        console.log('Toplam ilan sayısı:', itemsData.length);
        console.log('Onay bekleyen ilan sayısı:', itemsData.filter(item => !item.isApproved).length);

        setItems(itemsData);
      } catch (error) {
        console.error('İlanları yükleme hatası:', error);
        setItems([]);
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
          // Get all current second-hand listings
          const secondHandRef = collection(db, 'secondhand');
          const secondHandSnapshot = await getDocs(secondHandRef);
          const validListingIds = new Set(secondHandSnapshot.docs.map(doc => doc.id));

          // Filter favorites to only include existing listings with contentType 'secondhand'
          const validFavorites = snapshot.docs
            .filter(doc => {
              const data = doc.data();
              return data.contentType === 'secondhand' && validListingIds.has(doc.id);
            })
            .map(doc => doc.id);

          setFavorites(validFavorites);

          // Clean up any invalid favorites
          const cleanupPromises = snapshot.docs
            .filter(doc => {
              const data = doc.data();
              return data.contentType === 'secondhand' && !validListingIds.has(doc.id);
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

  // Filtreleri temizle
  const handleClearFilters = () => {
    setSearchTerm('');
    setPriceRangeValue(10000);
    setActiveCategory('all');
    setActiveCondition('');
  };

  // Filtreleri uygula (aslında filtreler anlık çalışıyor, bu buton sadece UX için var)
  const handleApplyFilters = () => {
    // Bu fonksiyon opsiyonel, UX için toast veya animasyon eklenebilir
  };

  const { isMobile } = useMobileOptimization();

  // Filtrelenmiş ilanlar
  const filteredItems = items.filter((item) => {
    // Onay bekleyen filtresi (admin için)
    if (showPendingOnly && item.isApproved) return false;
    if (!showPendingOnly && !item.isApproved && !isAdmin) return false; // Normal kullanıcılar onaylanmamış ilanları görmesin
    
    // Arama
    const searchMatch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    // Fiyat
    const priceMatch = Number(item.price) <= priceRangeValue;
    // Kategori (id ile karşılaştır)
    const categoryMatch = activeCategory === 'all' || (item.category && item.category.toLowerCase() === activeCategory.toLowerCase());
    // Durum (id ile karşılaştır)
    const conditionMatch = !activeCondition || (item.condition && item.condition.toLowerCase() === activeCondition.toLowerCase());
    return searchMatch && priceMatch && categoryMatch && conditionMatch;
  }).sort((a, b) => {
    // Premium ilanları öne çıkar
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    
    // Sonra tarihe göre sırala (en yeni önce)
    const dateA = a.createdAt?.seconds || 0;
    const dateB = b.createdAt?.seconds || 0;
    return dateB - dateA;
  });

  // Pagination logic
  const itemsPerPage = isMobile ? (viewMode === 'scroll' ? 6 : 9) : 12;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, activeCondition, priceRangeValue, showPendingOnly]);

  // Onay bekleyen ilan sayısı
  const pendingCount = items.filter(item => !item.isApproved).length;
  console.log('Filtrelenmiş onay bekleyen ilan sayısı:', pendingCount);

  // Admin onay/red fonksiyonu
  const handleApprove = async (id: string, approved: boolean) => {
    try {
      if (approved) {
        // İlanı onayla
        await updateDoc(doc(db, 'secondhand', id), {
          isApproved: true,
          approvedAt: serverTimestamp(),
          approvedBy: user?.uid,
          status: 'active'
        });
        
        showToast('İlan onaylandı ve yayınlandı.', 'success');
      } else {
        // İlanı reddet ve sil
        await deleteDoc(doc(db, 'secondhand', id));
        showToast('İlan reddedildi ve silindi.', 'success');
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
      showToast('İşlem sırasında bir hata oluştu.', 'error');
    }
  };

  // Admin panelindeki onay bekleyen ilanlar sayısını hesapla
  const pendingItemsCount = items.filter(item => !item.isApproved).length;

  const handleModalClose = () => {
    setShowContactModal(false);
    setShowDetailsModal(false);
    setShowListingModal(false);
    setSelectedItem(null);
    setEditItem(null);
    setCurrentImageIndex(0);
    setModalPosition(null); // Modal konumunu sıfırla
  };

  const handleİlanVer = () => {
    if (!user) {
      showToast('İlan vermek için giriş yapmanız gerekiyor!', 'error');
      return;
    }
    setShowListingModal(true);
  };

  // Silme fonksiyonu
  const handleDelete = async (id: string) => {
    if (!window.confirm('İlanı silmek istediğine emin misin?')) return;
    
    try {
      // First delete the listing
      await deleteDoc(doc(db, 'secondhand', id));

      // Then find and delete all favorite entries for this listing
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
      
      setItems(prev => prev.filter(r => r.id !== id));
      showToast('İlan silindi.', 'success');
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast('İlan silinirken bir hata oluştu.', 'error');
    }
  };

  // ESC tuşu ile modal'ları kapatma
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleModalClose();
      }
    };
    if (showContactModal || showDetailsModal || showListingModal) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showContactModal, showDetailsModal, showListingModal]);

  // İlan ekleme fonksiyonu
  const handleAddItem = async (formData: any) => {
    if (!user) {
      showToast('İlan vermek için giriş yapmalısınız!', 'error');
      return;
    }
    
    try {
      setLoading(true);
      console.log('İlan ekleme başladı:', { 
        title: formData.title, 
        imageCount: formData.images?.length || 0 
      });
      
      // Resimleri base64'e çevir
      let imageUrls: string[] = [];
      
      if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
        console.log('Resimler işleniyor:', formData.images.length, 'adet');
        
        // Her resmi kontrol et ve base64'e çevir
        for (let i = 0; i < formData.images.length; i++) {
          const file = formData.images[i];
          
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

      // Firestore'a eklenecek veriyi hazırla
      const itemData = {
        title: formData.title || '',
        description: formData.description || '',
        price: parseFloat(formData.price) || 0,
        category: formData.category || 'other',
        condition: formData.condition || 'good',
        images: imageUrls,
        userId: user.uid,
        userEmail: user.email || '',
        createdAt: serverTimestamp(),
        isApproved: false,
        approvedAt: null,
        approvedBy: null,
        status: 'pending',
        phone: formData.phone || '',
        email: formData.email || '',
        location: formData.location || '',
        contactPreferences: formData.contactPreferences || {},
      };

      console.log('Firestore\'a kaydedilecek veri:', { 
        ...itemData, 
        images: `${imageUrls.length} adet resim`,
        createdAt: 'serverTimestamp()' 
      });

      // Firestore'a kaydet
      const docRef = await addDoc(collection(db, 'secondhand'), itemData);
      console.log('İlan başarıyla kaydedildi, ID:', docRef.id);

      showToast('İlanınız başarıyla eklendi ve admin onayı bekliyor!', 'success');
      handleModalClose();
      
    } catch (error: any) {
      console.error('İlan ekleme genel hatası:', error);
      
      let errorMessage = 'İlan eklenirken bir hata oluştu';
      if (error.code) {
        switch (error.code) {
          case 'permission-denied':
            errorMessage = 'Bu işlem için yetkiniz yok';
            break;
          case 'resource-exhausted':
            errorMessage = 'Çok fazla istek gönderildi, lütfen bekleyin';
            break;
          case 'invalid-argument':
            errorMessage = 'Geçersiz veri gönderildi';
            break;
          default:
            errorMessage = `Hata: ${error.message || error.code}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // İlan düzenleme fonksiyonu
  const handleEditItem = async (id: string, formData: any) => {
    if (!user) {
      showToast('İlan düzenlemek için giriş yapmalısınız!', 'error');
      return;
    }
    
    console.log('Editing item with ID:', id);
    console.log('Form data received:', formData);
    
    try {
      // Mevcut ilanı bul
      const currentItem = items.find(item => item.id === id);
      if (!currentItem) {
        showToast('İlan bulunamadı!', 'error');
        return;
      }

      console.log('Current item:', currentItem);

      // Check if user owns this item
      if (currentItem.userId !== user.uid) {
        showToast('Bu ilanı sadece sahibi düzenleyebilir.', 'error');
        return;
      }

      // Resimleri base64'e çevir (eğer yeni resimler varsa)
      let imageUrls = currentItem.images || [];
      if (formData.images && formData.images.length > 0) {
        const fileImages = formData.images.filter((file: File) => file instanceof File);
        if (fileImages.length > 0) {
          const imagePromises = fileImages.map(async (file: File) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                resolve(e.target?.result as string);
              };
              reader.onerror = () => {
                reject(new Error('Resim yüklenemedi'));
              };
              reader.readAsDataURL(file);
            });
          });
          imageUrls = await Promise.all(imagePromises);
        }
      }

      const newPrice = parseFloat(formData.satis_fiyati) || parseFloat(formData.price) || currentItem.price;
      const currentPrice = currentItem.price;
      
      const updatedItem = {
        title: formData.urun_adi || formData.title || currentItem.title,
        description: formData.aciklama || formData.description || currentItem.description,
        price: newPrice,
        // Fiyat değişikliği varsa eski fiyatı kaydet
        previousPrice: newPrice !== currentPrice ? currentPrice : currentItem.previousPrice,
        category: formData.kategori || formData.category || currentItem.category,
        condition: formData.urun_durumu || formData.condition || currentItem.condition,
        location: formData.konum || formData.location || currentItem.location,
        phone: formData.telefon || formData.phone || currentItem.phone,
        email: formData.eposta || formData.email || currentItem.email,
        contactPreferences: formData.iletisim_tercihleri || formData.contactPreferences || currentItem.contactPreferences || {
          whatsapp: true,
          telefon: true,
          eposta: true
        },
        images: imageUrls,
        updatedAt: serverTimestamp(),
        // Onay durumunu koru, sadece admin değiştirebilir
        isApproved: currentItem.isApproved || false,
        approvedAt: currentItem.approvedAt || null,
        approvedBy: currentItem.approvedBy || null
      };

      // Remove undefined values from the object
      const cleanedItem = Object.fromEntries(
        Object.entries(updatedItem).filter(([_, value]) => value !== undefined)
      );

      console.log('Updated item data:', cleanedItem);

      // Check if document exists
      const docRef = doc(db, 'secondhand', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        showToast('İlan bulunamadı. Sayfa yenileniyor...', 'error');
        return;
      }

      await updateDoc(docRef, cleanedItem);
      
      showToast('İlan başarıyla güncellendi!', 'success');
      setShowListingModal(false);
      setEditItem(null);
      
    } catch (error: any) {
      console.error('Error updating item:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      
      if (error?.code === 'permission-denied') {
        showToast('Bu ilanı güncelleme yetkiniz yok.', 'error');
      } else if (error?.code === 'not-found') {
        showToast('İlan bulunamadı. Sayfa yenileniyor...', 'error');
      } else if (error?.message?.includes('offline') || error?.message?.includes('client is offline')) {
        showToast('İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.', 'error');
      } else {
        showToast('İlan güncellenirken bir hata oluştu: ' + (error?.message || 'Bilinmeyen hata'), 'error');
      }
    }
  };

  // Favori ekle/çıkar fonksiyonu
  const toggleFavorite = async (item: SecondHandItem) => {
    if (!user) {
      showToast('Favorilere eklemek için giriş yapmalısınız!', 'error');
      return;
    }
    
    try {
      const favRef = doc(db, 'users', user.uid, 'favorites', item.id);
      
      if (favorites.includes(item.id)) {
        // Favoriden çıkar
        await deleteDoc(favRef);
        showToast('Favorilerden çıkarıldı.', 'info');
      } else {
        // Favoriye ekle
        await setDoc(favRef, {
          itemId: item.id,
          contentType: 'secondhand',
          title: item.title,
          price: item.price,
          image: item.images?.[0] || null,
          category: item.category,
          addedAt: serverTimestamp(),
        });
        showToast('Favorilere eklendi!', 'success');
      }
    } catch (error) {
      console.error('Favori işlemi hatası:', error);
      showToast('Favori işlemi sırasında bir hata oluştu.', 'error');
    }
  };

  // Paylaşım fonksiyonu
  const handleShare = async (item: SecondHandItem) => {
    const shareData = {
      title: item.title,
      text: `${item.title} - ${item.price} TL`,
      url: `${window.location.origin}/ikinci-el/${item.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: URL'yi panoya kopyala
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link panoya kopyalandı!', 'success');
      }
    } catch (error) {
      console.error('Share error:', error);
      showToast('Paylaşım sırasında bir hata oluştu.', 'error');
    }
  };

  // Fotoğraf galerisi navigasyonu
  const nextImage = () => {
    const images = selectedItem?.images || [selectedItem?.image];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = selectedItem?.images || [selectedItem?.image];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // İndirim yüzdesi hesaplama
  const calculateDiscount = (previousPrice: number, currentPrice: number) => {
    if (!previousPrice || previousPrice <= currentPrice) return 0;
    return Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
  };

  const handleRefresh = async () => {
    // Real-time listener zaten aktif olduğu için sadece toast göster
    showToast('Liste yenilendi', 'success');
  };

  // Modal konumlandırma fonksiyonları
  const calculateModalPosition = (cardElement: HTMLElement) => {
    if (!isMobile) return null; // Desktop'ta ortalanmış modal
    
    const rect = cardElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const cardTop = rect.top;
    const cardHeight = rect.height;
    
    // Kart görünür alanda mı kontrol et
    if (cardTop < 0 || cardTop > viewportHeight) {
      // Kart görünür alanda değilse, viewport ortasına yerleştir
      return { top: viewportHeight * 0.1 };
    }
    
    // Modal yüksekliği tahmini (viewport'un %80'i)
    const modalHeight = viewportHeight * 0.8;
    let modalTop = cardTop - 50; // Kartın biraz üstünde başlat
    
    // Alt sınır kontrolü
    if (modalTop + modalHeight > viewportHeight - 50) {
      modalTop = viewportHeight - modalHeight - 50;
    }
    
    // Üst sınır kontrolü
    if (modalTop < 50) {
      modalTop = 50;
    }
    
    return { top: modalTop };
  };

  const handleDetailClick = (item: SecondHandItem, event: React.MouseEvent) => {
    const cardElement = event.currentTarget.closest('.item-card') as HTMLElement;
    if (cardElement) {
      const position = calculateModalPosition(cardElement);
      setModalPosition(position);
    }
    
    setSelectedItem(item);
    setShowDetailsModal(true);
    setCurrentImageIndex(0);
  };

  const handleContactClick = (item: SecondHandItem, event: React.MouseEvent) => {
    const cardElement = event.currentTarget.closest('.item-card') as HTMLElement;
    if (cardElement) {
      const position = calculateModalPosition(cardElement);
      setModalPosition(position);
    }
    
    setSelectedItem(item);
    setShowContactModal(true);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${isMobile ? 'mobile-smooth-scroll' : ''}`}>
      <Header />
      <PullToRefresh onRefresh={handleRefresh} className={`min-h-screen ${isMobile ? 'mobile-scroll-container' : ''}`}>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1c0f3f] to-[#2e0f5f] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">2. El Eşya Pazarı</h1>
            <p className="text-lg text-gray-200 mb-8">
              İkinci el eşyalarını sat veya ihtiyacın olan eşyaları uygun fiyata bul. 
              Öğrenciler için güvenli alışveriş platformu.
            </p>
            
            {/* Category Type Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <TouchButton
                onClick={() => setActiveCategory('electronics')}
                className={`px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                  activeCategory === 'electronics' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                💻 Elektronik
              </TouchButton>
              <TouchButton
                onClick={() => setActiveCategory('furniture')}
                className={`px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                  activeCategory === 'furniture' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                🪑 Mobilya
              </TouchButton>
              <TouchButton
                onClick={() => setActiveCategory('books')}
                className={`px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                  activeCategory === 'books' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                📚 Kitap
              </TouchButton>
              <TouchButton
                onClick={() => setActiveCategory('clothing')}
                className={`px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                  activeCategory === 'clothing' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                👕 Giyim
              </TouchButton>
            </div>

            {/* İlan Ver Button */}
            <div className="mt-4">
              <TouchButton
                onClick={handleİlanVer}
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mx-4 mb-6">
            {/* Kategori filtreleri */}
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => (
                <TouchButton
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </TouchButton>
              ))}
            </div>
            
            {/* Admin Onay Bekleyen İlanlar Butonu */}
            {isAdmin && (
              <div className="mb-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <TouchButton
                  onClick={() => setShowPendingOnly(!showPendingOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    showPendingOnly
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                  }`}
                >
                  <Clock size={16} />
                  {showPendingOnly ? 'Tüm İlanları Göster' : 'Onay Bekleyen İlanlar'}
                  {!showPendingOnly && pendingCount > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-2">
                      {pendingCount}
                    </span>
                  )}
                </TouchButton>
              </div>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Ürün adı, açıklama veya kategori ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Fiyat Aralığı Slider */}
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fiyat Aralığı</label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="10"
                    value={priceRangeValue}
                    onChange={(e) => setPriceRangeValue(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>0 TL</span>
                    <span>10.000 TL</span>
                  </div>
                </div>
                {/* Kategori Dropdown */}
                <div className="w-full md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                {/* Durum Dropdown */}
                <div className="w-full md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durum</label>
                  <select
                    value={activeCondition}
                    onChange={(e) => setActiveCondition(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Tüm Durumlar</option>
                    <option value="new">Sıfır</option>
                    <option value="like-new">Sıfır Gibi</option>
                    <option value="good">İyi</option>
                    <option value="fair">Orta</option>
                    <option value="old">Eski</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-row gap-4 justify-end">
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Filtreleri Temizle
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold flex items-center gap-2 transition"
                >
                  <Filter size={18} />
                  Uygula
                </button>
              </div>
            </div>
          </div>

          {/* Results Count and View Controls */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredItems.length} sonuç bulundu
            </p>
            
            {/* View Mode Toggle - Mobile Only */}
            {isMobile && (
              <div className="flex items-center gap-2">
                <TouchButton
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Grid3X3 size={16} />
                  Grid
                </TouchButton>
                <TouchButton
                  onClick={() => setViewMode('scroll')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'scroll'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <List size={16} />
                  Kaydır
                </TouchButton>
              </div>
            )}
          </div>

          {/* Items Grid/Scroll */}
          <div className={`${
            isMobile && viewMode === 'scroll' 
              ? 'flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide' 
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }`}>
            {paginatedItems.map((item, index) => {
              const isOwner = user && item.userId === user.uid;
              const images = item.images || [item.image];
              const discount = item.originalPrice ? calculateDiscount(item.originalPrice, item.price) : 0;
              
              return (
                <div key={item.id} className={`item-card rounded-2xl transition-all duration-300 overflow-hidden relative ${
                  isMobile && viewMode === 'scroll' ? 'min-w-[280px] snap-center mobile-card-touch' : ''
                } ${
                  item.isPremium 
                    ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/30 dark:via-purple-900/20 dark:to-indigo-900/30 border-2 border-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105' 
                    : 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl'
                }`}>
                  {/* Premium Glow Effect */}
                  {item.isPremium && (
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-indigo-400/10 rounded-2xl pointer-events-none"></div>
                  )}
                  {/* Image Section */}
                  <div className="relative h-48">
                    <img
                      src={images[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlJlc2ltIFlvazwvdGV4dD4KPC9zdmc+'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkVGMkYyIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iI0Y1NjU2NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiPlJlc2ltIFnDvGtsZW5lbWVkaTwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                    
                    {/* Premium Badge */}
                    {item.isPremium && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl border border-white/20 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-white drop-shadow-sm">👑 PREMIUM</span>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                    
                    {/* Onay durumu badge */}
                    {!item.isApproved && !item.isPremium && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock size={12} />
                        Onay Bekliyor
                      </div>
                    )}
                    
                    {/* Onay durumu badge for Premium */}
                    {!item.isApproved && item.isPremium && (
                      <div className="absolute top-12 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock size={12} />
                        Onay Bekliyor
                      </div>
                    )}
                    
                    {/* İndirim etiketi */}
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        %{discount} İndirim
                      </div>
                    )}
                    
                    {/* Çoklu fotoğraf göstergesi */}
                    {images.length > 1 && (
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                        {images.length} Fotoğraf
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className={`p-6 relative ${item.isPremium ? 'bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-indigo-50/50 dark:from-pink-900/20 dark:via-purple-900/10 dark:to-indigo-900/20' : ''}`}>
                    {/* Premium Corner Decoration */}
                    {item.isPremium && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-400/20 to-transparent rounded-bl-full"></div>
                    )}
                    {/* Title and Price */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        {/* İndirim varsa önceki fiyatı göster */}
                        {item.previousPrice && item.previousPrice > item.price && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-400 dark:text-gray-500 line-through">{item.previousPrice} TL</span>
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              %{calculateDiscount(item.previousPrice, item.price)} İndirim
                            </span>
                          </div>
                        )}
                        <div className={`flex items-center font-bold text-lg ${item.isPremium ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>
                          {item.isPremium && <span className="text-pink-500 mr-1">💎</span>}
                          <span>{item.price} TL</span>
                          {item.isPremium && <span className="text-pink-500 ml-1">💎</span>}
                        </div>
                      </div>
                    </div>

                    {/* Condition Badge */}
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        item.condition === 'new' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
                        item.condition === 'like-new' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        item.condition === 'good' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {item.condition === 'new' ? 'Sıfır' :
                         item.condition === 'like-new' ? 'Sıfır Gibi' :
                         item.condition === 'good' ? 'İyi' :
                         item.condition === 'fair' ? 'Orta' : 'Eski'}
                      </span>
                    </div>

                    {/* Location and Date */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={14} className="mr-2" />
                        <span>{item.location || 'Konum belirtilmemiş'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar size={14} className="mr-2" />
                        <span>
                          {item.createdAt?.toDate ? 
                            item.createdAt.toDate().toLocaleDateString('tr-TR') : 
                            new Date(item.createdAt).toLocaleDateString('tr-TR')
                          }
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 whitespace-pre-line">{item.description}</p>

                    {/* Onay durumu (sadece ilan sahibi veya admin görsün) */}
                    {(isOwner || isAdmin) && (
                      <div className="mb-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          item.isApproved 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                        }`}>
                          {item.isApproved ? (
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

                    {/* Actions */}
                    <div className="flex gap-2 mb-3">
                      {/* Owner buttons: Edit, Delete, Share */}
                      {isOwner ? (
                        <>
                          <button
                            onClick={(e) => handleDetailClick(item, e)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition"
                          >
                            <Eye size={16} />
                            Detay
                          </button>
                          <button
                            onClick={() => handleShare(item)}
                            className="flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 py-2 px-4 rounded-lg font-medium transition"
                          >
                            <Share2 size={16} />
                          </button>
                        </>
                      ) : (
                        /* Non-owner buttons: Detail, Contact */
                        <>
                          <button
                            onClick={(e) => handleDetailClick(item, e)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition"
                          >
                            <Eye size={16} />
                            Detay
                          </button>
                          <button
                            onClick={(e) => handleContactClick(item, e)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-medium transition"
                          >
                            <MessageCircle size={16} />
                            İletişim
                          </button>
                        </>
                      )}
                    </div>

                    {/* Favorite, Share and Report */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => toggleFavorite(item)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition ${
                          favorites.includes(item.id)
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Heart size={16} fill={favorites.includes(item.id) ? 'currentColor' : 'none'} />
                        {favorites.includes(item.id) ? 'Favoride' : 'Favorile'}
                      </button>
                      <button
                        onClick={() => handleShare(item)}
                        className="flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 py-2 px-4 rounded-lg font-medium transition"
                      >
                        <Share2 size={16} />
                      </button>
                      {/* Report Button - sadece ilan sahibi değilse göster */}
                      {!isOwner && (
                        <ReportButton contentType="secondhand" contentId={item.id} />
                      )}
                    </div>

                    {/* Owner Actions */}
                    {isOwner && (
                      <div className="flex gap-2 mb-3">
                        <TouchButton
                          onClick={() => {
                            setEditItem(item);
                            setShowListingModal(true);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit size={14} />
                          Düzenle
                        </TouchButton>
                        <TouchButton
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 size={14} />
                          Sil
                        </TouchButton>
                      </div>
                    )}

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex gap-2">
                        {!item.isApproved ? (
                          <>
                            <TouchButton
                              onClick={() => handleApprove(item.id, true)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                              title="Onayla"
                            >
                              <CheckCircle size={14} />
                              Onayla
                            </TouchButton>
                            <TouchButton
                              onClick={() => handleApprove(item.id, false)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                              title="Reddet"
                            >
                              <X size={14} />
                              Reddet
                            </TouchButton>
                          </>
                        ) : (
                          <div className="flex-1 text-center text-green-600 text-sm flex items-center justify-center gap-1">
                            <CheckCircle size={14} />
                            Onaylandı
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row Indicators for Scroll Mode - Mobile Only */}
          {isMobile && viewMode === 'scroll' && paginatedItems.length > 3 && (
            <div className="flex justify-center mt-4 gap-1">
              {Array.from({ length: Math.ceil(paginatedItems.length / 3) }, (_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"
                />
              ))}
            </div>
          )}

          {/* Pagination Controls - Grid Mode */}
          {viewMode === 'grid' && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <TouchButton
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <ArrowUp size={16} />
                Önceki
              </TouchButton>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <TouchButton
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </TouchButton>
                ))}
              </div>

              <TouchButton
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Sonraki
                <ArrowDown size={16} />
              </TouchButton>
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sonuç Bulunamadı</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Arama kriterlerinize uygun ürün bulunamadı.
              </p>
              <TouchButton
                onClick={() => {
                  setActiveCategory('all');
                  setSearchTerm('');
                  setPriceRange('');
                }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Filtreleri Temizle
              </TouchButton>
            </div>
          )}
        </div>

        {/* Contact Modal */}
        {showContactModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl"
              style={modalPosition && isMobile ? { 
                position: 'fixed',
                top: `${modalPosition.top}px`,
                left: '1rem',
                right: '1rem',
                width: 'calc(100% - 2rem)',
                maxWidth: '28rem',
                transform: 'none'
              } : {}}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">İletişime Geç</h3>
                <TouchButton
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={24} />
                </TouchButton>
              </div>
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white text-lg">{selectedItem.title}</h4>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-2">{selectedItem.price} TL</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <MapPin size={18} className="text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">{selectedItem.location}</span>
                </div>
                
                {/* İletişim Seçenekleri */}
                <div className="space-y-3">
                  {selectedItem.phone && (
                    <a
                      href={`https://wa.me/${selectedItem.phone.replace(/[^0-9]/g, '')}`}
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
                  
                  {selectedItem.phone && (
                    <a
                      href={`tel:${selectedItem.phone}`}
                      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                    >
                      <Phone size={24} className="group-hover:rotate-12 transition-transform" />
                      <span className="font-medium text-lg group-hover:scale-105 transition-transform">Telefon ile Ara</span>
                    </a>
                  )}
                  
                  {selectedItem.email && (
                    <a
                      href={`mailto:${selectedItem.email}`}
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
                  onClick={() => setShowContactModal(false)}
                  className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  Kapat
                </TouchButton>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal with Image Gallery */}
        {showDetailsModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              style={modalPosition && isMobile ? { 
                position: 'fixed',
                top: `${modalPosition.top}px`,
                left: '1rem',
                right: '1rem',
                width: 'calc(100% - 2rem)',
                maxWidth: '56rem',
                maxHeight: '80vh',
                transform: 'none'
              } : {}}
            >
              <div className="relative">
                {(() => {
                  const images = selectedItem.images || [selectedItem.image];
                  const currentImage = images[currentImageIndex] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiPlJlc2ltIFlvazwvdGV4dD4KPC9zdmc+';
                  
                  return (
                    <div className="relative">
                      <img
                        src={currentImage}
                        alt={selectedItem.title}
                        className="w-full h-64 md:h-96 object-cover cursor-zoom-in"
                        onClick={() => { setShowImageLightbox(true); setLightboxImageIndex(currentImageIndex); }}
                      />
                      
                      {/* Fotoğraf navigasyon butonları */}
                      {images.length > 1 && (
                        <>
                          <TouchButton
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                          >
                            <ChevronLeft size={24} />
                          </TouchButton>
                          <TouchButton
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                          >
                            <ChevronRight size={24} />
                          </TouchButton>
                          
                          {/* Fotoğraf sayacı */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}
                
                <TouchButton
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/80 hover:bg-black text-white rounded-full shadow-lg border-2 border-white z-20 transition-colors"
                >
                  <X size={28} />
                </TouchButton>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedItem.title}</h2>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedItem.price} TL</span>
                  {selectedItem.originalPrice && (
                    <span className="text-lg text-gray-400 dark:text-gray-500 line-through">{selectedItem.originalPrice} TL</span>
                  )}
                  {/* İndirim oranı */}
                  {selectedItem.originalPrice && selectedItem.price < selectedItem.originalPrice && (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-semibold">
                      %{calculateDiscount(selectedItem.originalPrice, selectedItem.price)} indirim
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {selectedItem.condition}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{selectedItem.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📅</span>
                    <span>{new Date(selectedItem.createdAt?.toDate?.() || selectedItem.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  {/* Paylaşan kullanıcı ve saat */}
                  {(selectedItem.userName || selectedItem.userEmail) && (
                    <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Paylaşan:</span>
                      <span className="text-gray-800 dark:text-gray-200">{selectedItem.userName || '-'}</span>
                      <span className="text-gray-400 dark:text-gray-500">/</span>
                      <span className="text-gray-600 dark:text-gray-400">{selectedItem.userEmail || '-'}</span>
                      {selectedItem.createdAt && (
                        <span className="ml-2 text-gray-500 dark:text-gray-400">{new Date(selectedItem.createdAt?.toDate?.() || selectedItem.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-line">{selectedItem.description}</p>
                
                {/* Aksiyon butonları */}
                <div className="flex gap-2">
                  <TouchButton
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowContactModal(true);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium"
                  >
                    İletişime Geç
                  </TouchButton>
                  <TouchButton
                    onClick={() => handleShare(selectedItem)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Share2 size={16} />
                    Paylaş
                  </TouchButton>
                  <TouchButton
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium"
                  >
                    Kapat
                  </TouchButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Listing Modal */}
        {showListingModal && (
          <SecondHandForm
            onClose={handleModalClose}
            onSubmit={editItem ? (data) => handleEditItem(editItem.id, data) : handleAddItem}
            initialValues={editItem}
          />
        )}
      </PullToRefresh>
      <Footer />

      {showImageLightbox && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] p-4">
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold z-10"
            onClick={() => setShowImageLightbox(false)}
            aria-label="Kapat"
          >
            ×
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl z-10"
            onClick={() => setLightboxImageIndex((lightboxImageIndex - 1 + (selectedItem.images?.length || 1)) % (selectedItem.images?.length || 1))}
            aria-label="Önceki"
          >
            ‹
          </button>
          <img
            src={selectedItem.images?.[lightboxImageIndex] || selectedItem.image}
            alt={selectedItem.title}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl z-10"
            onClick={() => setLightboxImageIndex((lightboxImageIndex + 1) % (selectedItem.images?.length || 1))}
            aria-label="Sonraki"
          >
            ›
          </button>
          {/* Küçük görsel önizlemeleri */}
          {selectedItem.images?.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {selectedItem.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Önizleme"
                  className={`h-14 w-20 object-cover rounded border-2 ${idx === lightboxImageIndex ? 'border-blue-500' : 'border-transparent'} cursor-pointer`}
                  onClick={() => setLightboxImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IkinciElClient; 