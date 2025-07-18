'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Users, Calendar, Star, MessageCircle, Heart, Share2, X, Plus, Clock, DollarSign, Eye, Edit, Trash2, CheckCircle, Phone, Mail, Upload, Image } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ReportButton from '../../components/ReportButton';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, setDoc, getDoc, where } from 'firebase/firestore';
import { useToast } from '../../components/ToastProvider';
import LoadingSpinner from '../../components/LoadingSpinner';
import TouchButton from '../../components/TouchButton';
import SwipeableCard from '../../components/SwipeableCard';
import PullToRefresh from '../../components/PullToRefresh';
import { useMobileOptimization } from '../../hooks/useMobileOptimization';

// Mock data for events
const mockEvents = [
  {
    id: '1',
    title: 'Kıbrıs Üniversite Partisi',
    description: 'Büyük kampüs partisi! Müzik, dans ve eğlence dolu bir gece. DJ performansı, kokteyl bar ve sürpriz etkinlikler.',
    date: '2024-02-15',
    time: '20:00',
    location: 'Kampüs Merkezi',
    organizer: 'Öğrenci Kulübü',
    organizerContact: 'kulup@example.com',
    category: 'Parti',
    attendees: 45,
    maxAttendees: 100,
    price: 0,
    currency: 'TL',
    rating: 4.8,
    reviews: 12,
    isVerified: true,
    tags: ['Müzik', 'Dans', 'Sosyal'],
    imageUrl: '/event-party.jpg',
    createdAt: '2024-01-20',
    createdBy: 'user123',
    status: 'active'
  },
  {
    id: '2',
    title: 'Akademik Çalışma Grubu',
    description: 'Birlikte ders çalışalım! Matematik ve fizik odaklı grup çalışması. Sınavlara hazırlık.',
    date: '2024-02-10',
    time: '14:00',
    location: 'Kütüphane',
    organizer: 'Akademik Destek',
    organizerContact: 'akademik@example.com',
    category: 'Eğitim',
    attendees: 12,
    maxAttendees: 20,
    price: 0,
    currency: 'TL',
    rating: 4.6,
    reviews: 8,
    isVerified: true,
    tags: ['Matematik', 'Fizik', 'Çalışma'],
    imageUrl: '/event-study.jpg',
    createdAt: '2024-01-15',
    createdBy: 'user456',
    status: 'active'
  },
  {
    id: '3',
    title: 'Spor Turnuvası',
    description: 'Basketbol turnuvası! Üniversiteler arası rekabet. Ödüller ve sürprizler.',
    date: '2024-02-20',
    time: '16:00',
    location: 'Spor Salonu',
    organizer: 'Spor Kulübü',
    organizerContact: 'spor@example.com',
    category: 'Spor',
    attendees: 30,
    maxAttendees: 80,
    price: 25,
    currency: 'TL',
    rating: 4.9,
    reviews: 15,
    isVerified: true,
    tags: ['Basketbol', 'Turnuva', 'Rekabet'],
    imageUrl: '/event-sport.jpg',
    createdAt: '2024-01-18',
    createdBy: 'user789',
    status: 'active'
  },
  {
    id: '4',
    title: 'Konser Gecesi',
    description: 'Yerel müzisyenlerle unutulmaz bir konser gecesi. Akustik performanslar.',
    date: '2024-02-25',
    time: '19:30',
    location: 'Amfi Tiyatro',
    organizer: 'Müzik Kulübü',
    organizerContact: 'muzik@example.com',
    category: 'Müzik',
    attendees: 60,
    maxAttendees: 150,
    price: 50,
    currency: 'TL',
    rating: 4.7,
    reviews: 20,
    isVerified: true,
    tags: ['Konser', 'Müzik', 'Akustik'],
    imageUrl: '/event-concert.jpg',
    createdAt: '2024-01-22',
    createdBy: 'user101',
    status: 'active'
  }
];

const categories = ['Tümü', 'Parti', 'Eğitim', 'Spor', 'Müzik', 'Konser', 'Kültür', 'Teknoloji', 'Sanat'];

export default function EtkinliklerClient() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [participations, setParticipations] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Konser',
    maxAttendees: '',
    price: '',
    currency: 'TL',
    organizerContact: '',
    tags: ''
  });
  
  // Photo upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { showToast } = useToast();
  const { isMobile } = useMobileOptimization();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadFavorites();
        loadParticipations();
      } else {
        // User logged out, clear participations
        setParticipations([]);
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const setupEventsListener = async () => {
      try {
        unsubscribe = await loadEvents();
      } catch (error) {
        console.error('Etkinlik listener kurma hatası:', error);
      }
    };
    
    setupEventsListener();
    
    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log('🧹 Etkinlik real-time listener temizlendi');
      }
    };
  }, []);

  // Sayfa her odaklandığında favorileri ve katılımları yeniden yükle
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        loadFavorites();
        loadParticipations();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadFavorites();
        loadParticipations();
      }
    };

    const handlePopState = () => {
      if (user) {
        loadFavorites();
        loadParticipations();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [events, searchTerm, selectedCategory, selectedLocation]);

  // Debug: Log participations whenever they change
  useEffect(() => {
    console.log('🎯 Participations state changed:', participations);
  }, [participations]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const favoritesSnapshot = await getDocs(collection(db, 'users', user.uid, 'favorites'));
      const favoritesData = favoritesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<{
        id: string;
        itemId: string;
        contentType: string;
        title?: string;
        description?: string;
        image?: string;
        category?: string;
        createdAt?: any;
        [key: string]: any;
      }>;
      
              // Sadece etkinlik favorilerini al
        const validFavorites = [];
        
        for (const fav of favoritesData) {
          // Önce veri yapısını kontrol et
          if (!fav.itemId) {
            continue;
          }
          
          if (!fav.contentType) {
            // Eski favoriler için varsayılan olarak event kabul et
            fav.contentType = 'event';
          }
          
          // Etkinlik favorilerini kabul et
          const isEventFavorite = fav.contentType === 'event' || 
                                 fav.contentType === 'mathematics' || 
                                 (!fav.contentType) ||
                                 (fav.contentType !== 'secondhand' && fav.contentType !== 'note' && fav.contentType !== 'roommate' && fav.contentType !== 'tutor');
          
          if (isEventFavorite) {
            // Check if the event actually exists in Firebase
            try {
              const eventRef = doc(db, 'events', fav.itemId);
              const eventSnap = await getDoc(eventRef);
              
              if (eventSnap.exists()) {
                validFavorites.push(fav.itemId);
              } else {
                // Remove invalid favorite from user's favorites
                const favoriteDocRef = doc(db, 'users', user.uid, 'favorites', fav.id);
                await deleteDoc(favoriteDocRef);
              }
            } catch (error) {
              console.error('Error checking event existence:', error);
            }
          }
        }
        
        setFavorites(validFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadParticipations = async () => {
    if (!user) {
      console.log('🎯 No user, clearing participations');
      setParticipations([]);
      return;
    }
    
    try {
      console.log('🎯 Loading participations for user:', user.uid);
      const participationsSnapshot = await getDocs(collection(db, 'users', user.uid, 'participations'));
      const participationsData = participationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<{
        id: string;
        eventId: string;
        eventTitle?: string;
        eventDate?: string;
        eventTime?: string;
        eventLocation?: string;
        createdAt?: any;
        [key: string]: any;
      }>;
      
      console.log('🎯 Raw participations data:', participationsData);
      
      const validParticipations = [];
      
      for (const participation of participationsData) {
        if (!participation.eventId) {
          console.log('🎯 Skipping participation without eventId:', participation);
          continue;
        }
        
        // Check if the event actually exists in Firebase
        try {
          const eventRef = doc(db, 'events', participation.eventId);
          const eventSnap = await getDoc(eventRef);
          
          if (eventSnap.exists()) {
            validParticipations.push(participation.eventId);
            console.log('🎯 Valid participation found for event:', participation.eventId);
          } else {
            console.log('🎯 Removing invalid participation for non-existent event:', participation.eventId);
            // Remove invalid participation from user's participations
            const participationDocRef = doc(db, 'users', user.uid, 'participations', participation.id);
            await deleteDoc(participationDocRef);
          }
        } catch (error) {
          console.error('Error checking event existence for participation:', error);
        }
      }
      
      console.log('🎯 Final valid participations:', validParticipations);
      setParticipations(validParticipations);
    } catch (error) {
      console.error('Error loading participations:', error);
      setParticipations([]);
    }
  };

  const toggleParticipation = async (event: any) => {
    if (!user) {
      showToast('Katılmak için giriş yapmalısınız', 'error');
      return;
    }

    try {
      console.log('🎯 Participation toggle started for event:', event.id);
      console.log('🎯 Current participations:', participations);
      
      const participationRef = doc(db, 'users', user.uid, 'participations', event.id);
      const participationDoc = await getDoc(participationRef);
      
      if (participationDoc.exists()) {
        console.log('🎯 Removing participation for event:', event.id);
        
        // Remove participation
        await deleteDoc(participationRef);
        setParticipations(prev => {
          const newParticipations = prev.filter(id => id !== event.id);
          console.log('🎯 Updated participations (removed):', newParticipations);
          return newParticipations;
        });
        
        // Decrease attendee count in event document
        const eventRef = doc(db, 'events', event.id);
        const currentAttendees = event.attendees || 0;
        await setDoc(eventRef, { attendees: Math.max(0, currentAttendees - 1) }, { merge: true });
        
        showToast('Katılım iptal edildi', 'info');
      } else {
        console.log('🎯 Adding participation for event:', event.id);
        
        // Add participation
        const participationData = {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location,
          createdAt: serverTimestamp(),
        };
        
        console.log('🎯 Saving participation data:', participationData);
        await setDoc(participationRef, participationData);
        
        setParticipations(prev => {
          const newParticipations = [...prev, event.id];
          console.log('🎯 Updated participations (added):', newParticipations);
          return newParticipations;
        });
        
        // Increase attendee count in event document
        const eventRef = doc(db, 'events', event.id);
        const currentAttendees = event.attendees || 0;
        await setDoc(eventRef, { attendees: currentAttendees + 1 }, { merge: true });
        
        showToast('Etkinliğe katılım onaylandı!', 'success');
      }
    } catch (error) {
      console.error('Error toggling participation:', error);
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
  };

  const loadEvents = async (retryCount = 0) => {
    try {
      setLoading(true);
      
      // Load only approved events from Firebase with REAL-TIME updates
      const eventsQuery = query(
        collection(db, 'events'),
        where('isApproved', '==', true)
        // orderBy'ı JavaScript tarafında yapacağız çünkü mevcut veriler karışık tipte
      );
      
      // Real-time listener ile güncel verileri al
      const { onSnapshot } = await import('firebase/firestore');
      const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
        try {
          const firebaseEvents = snapshot.docs.map(doc => {
            const data = doc.data();
            // SADECE document ID kullan, data.id'yi hiç dahil etme
            const { id: dataId, ...cleanData } = data; // data.id'yi çıkar
            return { 
              id: doc.id,  // Firebase document ID (tek doğru ID)
              ...cleanData  // data.id olmadan diğer tüm veriler
            };
          });
          
          // JavaScript tarafında tarih sıralaması yap
          const sortedEvents = firebaseEvents.sort((a: any, b: any) => {
            // createdAt alanını tarihe çevir
            const getTimestamp = (createdAt: any) => {
              if (!createdAt) return 0;
              if (createdAt.seconds) {
                // Firestore timestamp ise
                return createdAt.seconds * 1000;
              }
              if (typeof createdAt === 'string') {
                // String ise Date'e çevir
                return new Date(createdAt).getTime();
              }
              return 0;
            };
            
            return getTimestamp(b.createdAt) - getTimestamp(a.createdAt); // Yeniden eskiye
          });
          
          console.log('🔥 Real-time etkinlik güncellemesi:', sortedEvents.length, 'onaylanmış etkinlik');
          setEvents(sortedEvents);
          setLoading(false);
        } catch (error) {
          console.error('Snapshot işleme hatası:', error);
          setEvents([]);
          setLoading(false);
        }
      }, (error) => {
        console.error('Real-time listener hatası:', error);
        if (retryCount < 3) {
          setTimeout(() => loadEvents(retryCount + 1), 1000);
        } else {
          setEvents([]);
          setLoading(false);
          showToast('Etkinlikler yüklenirken sorun yaşandı.', 'error');
        }
      });

      // Cleanup function for real-time listener
      return unsubscribe;
      
    } catch (error) {
      console.error('Etkinlikler yüklenirken hata:', error);
      if (retryCount < 3) {
        setTimeout(() => loadEvents(retryCount + 1), 1000);
      } else {
        setEvents([]);
        setLoading(false);
        showToast('Etkinlikler yüklenirken sorun yaşandı.', 'error');
      }
    }
  };

  const applyFilters = () => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Tümü' || event.category === selectedCategory;
      
      const matchesLocation = !selectedLocation || event.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesLocation;
    });
    
    // Premium etkinlikleri öne çıkar
    filtered.sort((a, b) => {
      // Önce premium durumuna göre sırala
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      
      // Sonra tarihe göre sırala (en yeni önce)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Tümü');
    setSelectedLocation('');
    setShowFilters(false);
  };

  const toggleFavorite = async (event: any) => {
    if (!user) {
      showToast('Favorilere eklemek için giriş yapmalısınız', 'error');
      return;
    }

    try {
      const favRef = doc(db, 'users', user.uid, 'favorites', event.id);
      const favDoc = await getDoc(favRef);
      
              if (favDoc.exists()) {
          await deleteDoc(favRef);
          setFavorites(prev => prev.filter(id => id !== event.id));
          showToast('Favorilerden çıkarıldı', 'info');
        } else {
          const favoriteData = {
            itemId: event.id,
            title: event.title,
            description: event.description,
            image: event.imageUrl || null,
            category: event.category,
            createdAt: serverTimestamp(),
            contentType: 'event',
          };
          
          await setDoc(favRef, favoriteData);
          setFavorites(prev => [...prev, event.id]);
          showToast('Favorilere eklendi!', 'success');
        }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
  };

  const handleShare = async (event: any) => {
    const shareData = {
      title: event.title,
      text: `${event.title} - ${event.description}`,
      url: `${window.location.origin}/etkinlikler/${event.id}`
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

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      category: event.category || 'Parti',
      maxAttendees: event.maxAttendees?.toString() || '',
      price: event.price?.toString() || '',
      currency: event.currency || 'TL',
      organizerContact: event.organizerContact || '',
      tags: event.tags ? event.tags.join(', ') : ''
    });
    setImagePreview(event.imageUrl || null);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedEvent) {
      showToast('Düzenleme için giriş yapmalısınız', 'error');
      return;
    }

    try {
      console.log('Etkinlik düzenleme başladı...');
      setUploadingImage(true);
      
      let imageUrl = selectedEvent.imageUrl || '';
      
      // Upload new image if selected
      if (selectedImage) {
        console.log('Yeni fotoğraf yükleniyor...');
        imageUrl = await uploadImage(selectedImage, selectedEvent.id);
        console.log('Yeni fotoğraf yüklendi');
      }

      console.log('Güncellenmiş etkinlik verisi hazırlanıyor...');
      const updatedEvent = {
        ...selectedEvent,
        ...formData,
        maxAttendees: parseInt(formData.maxAttendees),
        price: parseFloat(formData.price) || 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        imageUrl: imageUrl,
        updatedAt: serverTimestamp()
      };

      console.log('Firebase\'e güncelleniyor...', updatedEvent);
      
      // Update in Firebase
      const eventRef = doc(db, 'events', selectedEvent.id);
      await setDoc(eventRef, updatedEvent, { merge: true });
      
      console.log('✅ Etkinlik başarıyla güncellendi!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Parti',
        maxAttendees: '',
        price: '',
        currency: 'TL',
        organizerContact: '',
        tags: ''
      });
      
      setSelectedImage(null);
      setImagePreview(null);
      setShowEditModal(false);
      setSelectedEvent(null);
      setUploadingImage(false);
      
      showToast('Etkinlik başarıyla güncellendi!', 'success');
      
      // Reload events
      await loadEvents();
      
    } catch (error) {
      console.error('Etkinlik güncelleme hatası:', error);
      let errorMessage = 'Etkinlik güncellenirken hata oluştu';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Yetki hatası. Giriş yapmayı tekrar deneyin.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
      } else if (error.message) {
        errorMessage = `Hata: ${error.message}`;
      }
      
      showToast(errorMessage, 'error');
      setUploadingImage(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) {
      showToast('Silme işlemi için giriş yapmalısınız', 'error');
      return;
    }

    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      console.log('Etkinlik silme başladı...', eventId);
      
      // Delete from Firebase
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
      
      console.log('✅ Etkinlik başarıyla silindi!');
      
      showToast('Etkinlik başarıyla silindi!', 'success');
      
      // Reload events
      await loadEvents();
      
    } catch (error) {
      console.error('Etkinlik silme hatası:', error);
      let errorMessage = 'Etkinlik silinirken hata oluştu';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Yetki hatası. Giriş yapmayı tekrar deneyin.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
      } else if (error.message) {
        errorMessage = `Hata: ${error.message}`;
      }
      
      showToast(errorMessage, 'error');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Sadece resim dosyaları yükleyebilirsiniz', 'error');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Resim boyutu 5MB\'dan küçük olmalıdır', 'error');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, eventId: string): Promise<string> => {
    try {
      console.log('Base64\'e çevriliyor...', file.name, file.size);
      
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Resim boyutu 5MB\'dan küçük olmalıdır');
      }
      
      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        throw new Error('Sadece resim dosyaları yükleyebilirsiniz');
      }
      
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
      
      console.log('Base64 dönüşümü tamamlandı');
      return base64;
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      throw error;
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast('Etkinlik eklemek için giriş yapmalısınız', 'error');
      return;
    }

    try {
      console.log('Etkinlik oluşturma başladı...');
      setUploadingImage(true);
      
      const eventId = Date.now().toString();
      let imageUrl = '';
      
      // Upload image if selected
      if (selectedImage) {
        console.log('Fotoğraf yükleniyor...');
        imageUrl = await uploadImage(selectedImage, eventId);
        console.log('Fotoğraf yüklendi (base64)');
      }

      console.log('Etkinlik verisi hazırlanıyor...');
      const newEvent = {
        ...formData,
        id: eventId,
        organizer: user.displayName || user.email,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        attendees: 0,
        maxAttendees: parseInt(formData.maxAttendees),
        price: parseFloat(formData.price) || 0,
        rating: 0,
        reviews: 0,
        isVerified: false,
        isApproved: true, // Otomatik onay
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        status: 'pending',
        imageUrl: imageUrl || ''
      };

      console.log('Firebase\'e ekleniyor...', newEvent);
      
      // Add to Firebase
      try {
        console.log('🔥 Firebase addDoc çağrılıyor...');
        const docRef = await addDoc(collection(db, 'events'), newEvent);
        console.log('✅ Etkinlik başarıyla Firebase\'e eklendi!');
        console.log('📄 Doküman ID:', docRef.id);
        console.log('📄 Doküman Path:', docRef.path);
        
        // Dokümanın gerçekten yazıldığını kontrol et
        const savedDoc = await getDoc(docRef);
        if (savedDoc.exists()) {
          console.log('✅ Doküman doğrulandı, Firebase\'de mevcut!');
          console.log('📊 Kaydedilen veri:', savedDoc.data());
        } else {
          console.error('❌ HATA: Doküman Firebase\'e yazılamadı!');
        }
        
      } catch (firebaseError) {
        console.error('❌ Firebase yazma hatası:', firebaseError);
        throw firebaseError;
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Parti',
        maxAttendees: '',
        price: '',
        currency: 'TL',
        organizerContact: '',
        tags: ''
      });
      
      setSelectedImage(null);
      setImagePreview(null);
      setShowAddModal(false);
      setUploadingImage(false);
      
      showToast('Etkinlik başarıyla eklendi! Onay bekliyor.', 'success');
      
      // Reload events
      console.log('Etkinlikler yeniden yükleniyor...');
      await loadEvents();
      console.log('İşlem tamamlandı!');
      
    } catch (error) {
      console.error('Etkinlik ekleme hatası:', error);
      let errorMessage = 'Etkinlik eklenirken hata oluştu';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Yetki hatası. Giriş yapmayı tekrar deneyin.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
      } else if (error.message) {
        errorMessage = `Hata: ${error.message}`;
      }
      
      showToast(errorMessage, 'error');
      setUploadingImage(false);
    }
  };

  const handleRefresh = async () => {
    await loadEvents();
    if (user) {
      await loadFavorites();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1c0f3f] to-[#2e0f5f] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">🎉 Kıbrıs Öğrenci Etkinlikleri</h1>
            <p className="text-lg text-gray-200 mb-8">
              Partiler, konserler, spor turnuvaları ve sosyal aktiviteler. 
              Etkinlik oluştur, katıl, yeni arkadaşlar edin!
            </p>
              
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <TouchButton
                onClick={() => setShowAddModal(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-2xl text-lg shadow-lg transition-all duration-300 flex items-center gap-3"
              >
                <Plus size={24} />
                Etkinlik Oluştur
              </TouchButton>
              
              <TouchButton
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg transition-all duration-300 flex items-center gap-3"
              >
                <Filter size={24} />
                Filtrele
              </TouchButton>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-400">{events.length}</div>
                <div className="text-sm text-white/80">Aktif Etkinlik</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-400">{categories.length - 1}</div>
                <div className="text-sm text-white/80">Kategori</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-400">{events.reduce((sum, event) => sum + event.attendees, 0)}</div>
                <div className="text-sm text-white/80">Katılımcı</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-400">{events.filter(e => e.price === 0).length}</div>
                <div className="text-sm text-white/80">Ücretsiz</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="container mx-auto px-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Filtreler</h3>
                <TouchButton
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </TouchButton>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ara
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Etkinlik ara..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Konum
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      type="text"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      placeholder="Konum ara..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <TouchButton
                  onClick={clearFilters}
                  className="px-6 py-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                >
                  Filtreleri Temizle
                </TouchButton>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="container mx-auto px-4 pb-12">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Etkinlik Bulunamadı</h3>
              <p className="text-gray-600 dark:text-gray-400">Arama kriterlerinizi değiştirmeyi deneyin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className={`rounded-2xl transition-all duration-300 overflow-hidden relative ${
                  event.isPremium 
                    ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/30 dark:via-purple-900/20 dark:to-indigo-900/30 border-2 border-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105' 
                    : 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl'
                }`}>
                  {/* Premium Glow Effect */}
                  {event.isPremium && (
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-indigo-400/10 rounded-2xl pointer-events-none"></div>
                  )}
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center overflow-hidden">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-6xl">
                        {event.category === 'Parti' && '🎉'}
                        {event.category === 'Eğitim' && '📚'}
                        {event.category === 'Spor' && '⚽'}
                        {event.category === 'Müzik' && '🎵'}
                        {event.category === 'Konser' && '🎤'}
                        {event.category === 'Kültür' && '🎭'}
                        {event.category === 'Teknoloji' && '💻'}
                        {event.category === 'Sanat' && '🎨'}
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-white/90 dark:bg-gray-800/90 text-purple-700 dark:text-purple-300 text-xs px-3 py-1 rounded-full font-medium">
                        {event.category}
                      </span>
                    </div>
                    
                    {/* Premium Badge */}
                    {event.isPremium && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-xs px-4 py-2 rounded-full font-bold shadow-xl border border-white/20 backdrop-blur-sm">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="text-white drop-shadow-sm">👑 PREMIUM</span>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </span>
                      </div>
                    )}
                    
                    {/* Verified Badge */}
                    {event.isVerified && !event.isPremium && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          <CheckCircle size={12} />
                          Doğrulanmış
                        </span>
                      </div>
                    )}
                    
                    {/* Verified Badge for Premium */}
                    {event.isVerified && event.isPremium && (
                      <div className="absolute top-12 right-4">
                        <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          <CheckCircle size={12} />
                          Doğrulanmış
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Event Content */}
                  <div className={`p-6 relative ${event.isPremium ? 'bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-indigo-50/50 dark:from-pink-900/20 dark:via-purple-900/10 dark:to-indigo-900/20' : ''}`}>
                    {/* Premium Corner Decoration */}
                    {event.isPremium && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-400/20 to-transparent rounded-bl-full"></div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 line-clamp-2">{event.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Düzenleyen: {event.organizer}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                      <div className={`flex items-center font-bold ${event.isPremium ? 'text-purple-600 dark:text-purple-400' : 'text-green-600 dark:text-green-400'}`}>
                        {event.isPremium && <span className="text-pink-500 mr-1">💎</span>}
                        <DollarSign size={16} className="mr-1" />
                        {event.price === 0 ? 'Ücretsiz' : `${event.price} ${event.currency}`}
                        {event.isPremium && <span className="text-pink-500 ml-1">💎</span>}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar size={14} className="mr-2" />
                        <span>{event.date} - {event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={14} className="mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users size={14} className="mr-2" />
                        <span>{event.attendees}/{event.maxAttendees} katılımcı</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(event.tags || []).slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-800 dark:text-white">{event.rating}</span>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500 text-sm">({event.reviews} değerlendirme)</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowDetailModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition"
                      >
                        <Eye size={16} />
                        Detay
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowContactModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-medium transition"
                      >
                        <MessageCircle size={16} />
                        İletişim
                      </button>
                    </div>

                    {/* Participation Button */}
                    <div className="mb-3">
                      <button
                        onClick={() => toggleParticipation(event)}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition ${
                          participations.includes(event.id)
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 border-2 border-green-300 dark:border-green-600'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                        }`}
                      >
                        <Users size={16} />
                        {participations.includes(event.id) ? 'Katılım Onaylandı' : 'Katıl'}
                      </button>

                    </div>

                    {/* Favorite and Share */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavorite(event)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition ${
                          favorites.includes(event.id)
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill={favorites.includes(event.id) ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        {favorites.includes(event.id) ? 'Favoride' : 'Favorile'}
                      </button>
                      <button
                        onClick={() => handleShare(event)}
                        className="flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 py-2 px-4 rounded-lg font-medium transition"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>

                    {/* Edit and Delete buttons for own events */}
                    {user && event.createdBy === user.uid && (
                      <div className="mt-2 flex gap-2">
                        <TouchButton
                          onClick={() => handleEditEvent(event)}
                          className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 py-2 text-sm"
                        >
                          <Edit size={16} />
                          İlanı Düzenle
                        </TouchButton>
                        <TouchButton
                          onClick={() => handleDeleteEvent(event.id)}
                          className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 py-2 text-sm"
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

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Etkinlik Oluştur</h3>
                  <TouchButton
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={24} />
                  </TouchButton>
                </div>
                
                <form onSubmit={handleAddSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Etkinlik Adı *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kategori *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        {categories.slice(1).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Açıklama *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tarih *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Saat *
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Konum *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Maksimum Katılımcı *
                      </label>
                      <input
                        type="number"
                        value={formData.maxAttendees}
                        onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fiyat
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="0"
                        step="0.01"
                        placeholder="0 (Ücretsiz)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Para Birimi
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="TL">TL</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      İletişim Bilgisi *
                    </label>
                    <input
                      type="text"
                      value={formData.organizerContact}
                      onChange={(e) => setFormData({...formData, organizerContact: e.target.value})}
                      placeholder="E-posta veya telefon"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Etiketler
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="Virgülle ayırın (örn: müzik, dans, eğlence)"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Etkinlik Fotoğrafı
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors relative">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Önizleme"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <TouchButton
                            type="button"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={16} />
                          </TouchButton>
                        </div>
                      ) : (
                        <div>
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-2">Fotoğraf yüklemek için tıklayın</p>
                          <p className="text-sm text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <TouchButton
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800"
                    >
                      İptal
                    </TouchButton>
                    <TouchButton
                      type="submit"
                      disabled={uploadingImage}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Yükleniyor...
                        </>
                      ) : (
                        'Etkinlik Oluştur'
                      )}
                    </TouchButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {showEditModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Etkinlik Düzenle</h3>
                  <TouchButton
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </TouchButton>
                </div>
                
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Etkinlik Adı *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        {categories.slice(1).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tarih *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saat *
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konum *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maksimum Katılımcı *
                      </label>
                      <input
                        type="number"
                        value={formData.maxAttendees}
                        onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fiyat
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                        placeholder="0 (Ücretsiz)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Para Birimi
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="TL">TL</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İletişim Bilgisi *
                    </label>
                    <input
                      type="text"
                      value={formData.organizerContact}
                      onChange={(e) => setFormData({...formData, organizerContact: e.target.value})}
                      placeholder="E-posta veya telefon"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etiketler
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="Virgülle ayırın (örn: müzik, dans, eğlence)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etkinlik Fotoğrafı
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors relative">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Önizleme"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <TouchButton
                            type="button"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={16} />
                          </TouchButton>
                        </div>
                      ) : (
                        <div>
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-2">Fotoğraf yüklemek için tıklayın</p>
                          <p className="text-sm text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <TouchButton
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800"
                    >
                      İptal
                    </TouchButton>
                    <TouchButton
                      type="submit"
                      disabled={uploadingImage}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Güncelleniyor...
                        </>
                      ) : (
                        'Etkinliği Güncelle'
                      )}
                    </TouchButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Event Detail Modal */}
        {showDetailModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Event Image */}
                <div className="h-64 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center overflow-hidden">
                  {selectedEvent.imageUrl ? (
                    <img
                      src={selectedEvent.imageUrl}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-8xl">
                      {selectedEvent.category === 'Parti' && '🎉'}
                      {selectedEvent.category === 'Eğitim' && '📚'}
                      {selectedEvent.category === 'Spor' && '⚽'}
                      {selectedEvent.category === 'Müzik' && '🎵'}
                      {selectedEvent.category === 'Kültür' && '🎭'}
                      {selectedEvent.category === 'Teknoloji' && '💻'}
                      {selectedEvent.category === 'Sanat' && '🎨'}
                    </div>
                  )}
                </div>
                
                {/* Close Button */}
                <TouchButton
                  onClick={() => setShowDetailModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
                >
                  <X size={24} />
                </TouchButton>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-white/90 dark:bg-gray-800/90 text-purple-700 dark:text-purple-300 text-sm px-3 py-1 rounded-full font-medium">
                    {selectedEvent.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Düzenleyen: {selectedEvent.organizer}</span>
                    {selectedEvent.isVerified && (
                      <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                        <CheckCircle size={12} />
                        Doğrulanmış
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Etkinlik Detayları</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-purple-500" size={20} />
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">{selectedEvent.date}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{selectedEvent.time}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="text-purple-500" size={20} />
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">{selectedEvent.location}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Users className="text-purple-500" size={20} />
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">{selectedEvent.attendees}/{selectedEvent.maxAttendees} Katılımcı</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedEvent.maxAttendees - selectedEvent.attendees} kişi daha katılabilir
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <DollarSign className="text-purple-500" size={20} />
                        <div>
                          <div className="font-medium text-green-600 dark:text-green-400">
                            {selectedEvent.price === 0 ? 'Ücretsiz' : `${selectedEvent.price} ${selectedEvent.currency}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Star className="text-yellow-500" size={20} />
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">{selectedEvent.rating}/5.0</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{selectedEvent.reviews} değerlendirme</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Açıklama</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{selectedEvent.description}</p>
                    
                    {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white mb-3">Etiketler</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.tags.map((tag, index) => (
                            <span key={index} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm px-3 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <TouchButton
                    onClick={() => {
                      setSelectedEvent(selectedEvent);
                      setShowContactModal(true);
                    }}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Katıl / İletişim
                  </TouchButton>
                  
                  <ReportButton
                    contentId={selectedEvent.id}
                    contentType="event"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Modal */}
        {showContactModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">İletişim Bilgileri</h3>
                  <TouchButton
                    onClick={() => setShowContactModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={24} />
                  </TouchButton>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">{selectedEvent.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Düzenleyen: {selectedEvent.organizer}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Mail className="text-purple-500" size={20} />
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">E-posta</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{selectedEvent.organizerContact}</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <TouchButton
                        onClick={() => {
                          window.open(`mailto:${selectedEvent.organizerContact}?subject=${encodeURIComponent(`${selectedEvent.title} - Katılım`)}`);
                        }}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                      >
                        E-posta Gönder
                      </TouchButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </PullToRefresh>
      
      <Footer />
    </div>
  );
} 