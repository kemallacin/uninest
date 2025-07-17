"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc, writeBatch } from "firebase/firestore";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AdminClient() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [listingActionLoading, setListingActionLoading] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [eventActionLoading, setEventActionLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [noteActionLoading, setNoteActionLoading] = useState<string | null>(null);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [roommateActionLoading, setRoommateActionLoading] = useState<string | null>(null);
  const [earlyAccessRegistrations, setEarlyAccessRegistrations] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [earlyAccessActionLoading, setEarlyAccessActionLoading] = useState<string | null>(null);
  const [contactActionLoading, setContactActionLoading] = useState<string | null>(null);

  // Arama state'leri
  const [userSearch, setUserSearch] = useState("");
  const [listingSearch, setListingSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [roommateSearch, setRoommateSearch] = useState("");
  const [earlyAccessSearch, setEarlyAccessSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");

  // Toplu seçim state'leri
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedRoommates, setSelectedRoommates] = useState<string[]>([]);
  const [selectedEarlyAccess, setSelectedEarlyAccess] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Admin kontrolü
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        console.log('🔐 Admin kontrol - User ID:', user.uid);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === "admin") {
          console.log('✅ Admin yetkisi onaylandı!');
          setIsAdmin(true);
        } else {
          console.log('❌ Admin yetkisi yok:', userSnap.exists() ? userSnap.data() : 'User doc yok');
        }
      } else {
        console.log('❌ Kullanıcı giriş yapmamış');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Kullanıcıları çek
  useEffect(() => {
    // GEÇICI: Admin kontrolünü bypass et
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const snap = await getDocs(usersRef);
        setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('❌ Firebase kullanıcı çekme hatası:', error);
      }
    };
    fetchUsers();
  }, [actionLoading]);

  // İlanları çek
  useEffect(() => {
    // GEÇICI: Admin kontrolünü bypass et
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "secondhand");
        const snap = await getDocs(listingsRef);
        setListings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('❌ Firebase ilan çekme hatası:', error);
      }
    };
    fetchListings();
  }, [listingActionLoading]);

  // Etkinlikleri çek
  useEffect(() => {
    // GEÇICI: Admin kontrolünü bypass et
    const fetchEvents = async () => {
      console.log('🔍 Admin paneli - Firebase etkinlikleri çekiliyor...');
      try {
        // Cache'i temizlemek için force refresh
        const eventsRef = collection(db, "events");
        const snap = await getDocs(eventsRef);
        const fetchedEvents = snap.docs.map(doc => {
          const data = doc.data();
          
          // SADECE document ID kullan, data.id'yi hiç dahil etme
          const { id: dataId, ...cleanData } = data; // data.id'yi çıkar
          return { 
            id: doc.id,  // Firebase document ID (tek doğru ID)
            ...cleanData  // data.id olmadan diğer tüm veriler
          };
        });
        
        // JavaScript tarafında tarih sıralaması yap
        const sortedEvents = fetchedEvents.sort((a: any, b: any) => {
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
        
        console.log('📊 Admin paneli - Etkinlik sayısı:', sortedEvents.length);
        
        // Sadece geçerli etkinlikleri filtrele
        const validEvents = sortedEvents.filter((event: any) => event.id && event.title);
        
        setEvents(validEvents);
      } catch (error) {
        console.error('❌ Firebase etkinlik çekme hatası:', error);
      }
    };
    fetchEvents();
  }, [eventActionLoading]);

  // Notları çek
  useEffect(() => {
    if (!isAdmin) return;
    const fetchNotes = async () => {
      const notesRef = collection(db, "notes");
      const snap = await getDocs(notesRef);
      setNotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNotes();
  }, [isAdmin, noteActionLoading]);

  // Ev arkadaşı ilanlarını çek
  useEffect(() => {
    // GEÇICI: Admin kontrolünü bypass et
    const fetchRoommates = async () => {
      try {
        console.log('🔍 Admin paneli - Firebase ev arkadaşı ilanları çekiliyor...');
        
        // Cache'i temizlemek için force refresh
        const roommatesRef = collection(db, "roommates");
        const snap = await getDocs(roommatesRef);
        
        // Sadece gerçekten var olan dokümanları al
        const fetchedRoommates = snap.docs
          .filter(doc => doc.exists()) // Sadece var olan dokümanlar
          .map(doc => ({ id: doc.id, ...doc.data() }));
        
        console.log('📊 Admin paneli - Ev arkadaşı ilan sayısı:', fetchedRoommates.length);
        console.log('📋 Ev arkadaşı ilanları:', fetchedRoommates.map((r: any) => ({
          id: r.id,
          name: r.name,
          isApproved: r.isApproved,
          isPremium: r.isPremium,
          createdAt: r.createdAt,
          isDeleted: r.isDeleted
        })));
        
        // Detaylı durum analizi
        const approvedCount = fetchedRoommates.filter((r: any) => r.isApproved === true).length;
        const pendingCount = fetchedRoommates.filter((r: any) => r.isApproved === false).length;
        const undefinedCount = fetchedRoommates.filter((r: any) => r.isApproved === undefined || r.isApproved === null).length;
        
        console.log('🔍 Durum Analizi:');
        console.log('  - Onaylanmış:', approvedCount);
        console.log('  - Onay bekleyen:', pendingCount);
        console.log('  - Durum belirsiz:', undefinedCount);
        console.log('  - Toplam:', fetchedRoommates.length);
        
        setRoommates(fetchedRoommates);
      } catch (error) {
        console.error('❌ Firebase ev arkadaşı çekme hatası:', error);
      }
    };
    fetchRoommates();
  }, [roommateActionLoading]);

  // Erken erişim kayıtlarını çek
  useEffect(() => {
    if (!isAdmin) return;
    const fetchEarlyAccess = async () => {
      const earlyAccessRef = collection(db, "early_access_registrations");
      const snap = await getDocs(earlyAccessRef);
      setEarlyAccessRegistrations(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchEarlyAccess();
  }, [isAdmin, earlyAccessActionLoading]);

  // İletişim mesajlarını çek
  useEffect(() => {
    if (!isAdmin) return;
    const fetchContactMessages = async () => {
      const contactRef = collection(db, "contact_messages");
      const snap = await getDocs(contactRef);
      setContactMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchContactMessages();
  }, [isAdmin, contactActionLoading]);

  // Filtreleme fonksiyonları
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredListings = listings.filter(listing => 
    listing.title?.toLowerCase().includes(listingSearch.toLowerCase()) ||
    listing.description?.toLowerCase().includes(listingSearch.toLowerCase()) ||
    listing.category?.toLowerCase().includes(listingSearch.toLowerCase()) ||
    listing.price?.toString().includes(listingSearch)
  );

  const filteredEvents = events.filter(event => 
    event.title?.toLowerCase().includes(eventSearch.toLowerCase()) ||
    event.description?.toLowerCase().includes(eventSearch.toLowerCase()) ||
    event.location?.toLowerCase().includes(eventSearch.toLowerCase()) ||
    event.date?.toLowerCase().includes(eventSearch.toLowerCase())
  );

  // Onaylı ve onaysız etkinlikleri ayır
  const approvedEvents = filteredEvents.filter(event => event.isApproved === true);
  const pendingEventsForApproval = filteredEvents.filter(event => 
    event.isApproved === false || event.isApproved === undefined || event.isApproved === null
  );

  const filteredNotes = notes.filter(note => 
    note.title?.toLowerCase().includes(noteSearch.toLowerCase()) ||
    note.description?.toLowerCase().includes(noteSearch.toLowerCase()) ||
    note.subject?.toLowerCase().includes(noteSearch.toLowerCase()) ||
    note.university?.toLowerCase().includes(noteSearch.toLowerCase())
  );

  const filteredRoommates = roommates.filter(roommate => 
    !roommate.isDeleted && (
      roommate.name?.toLowerCase().includes(roommateSearch.toLowerCase()) ||
      roommate.university?.toLowerCase().includes(roommateSearch.toLowerCase()) ||
      roommate.department?.toLowerCase().includes(roommateSearch.toLowerCase()) ||
      roommate.location?.toLowerCase().includes(roommateSearch.toLowerCase()) ||
      roommate.type?.toLowerCase().includes(roommateSearch.toLowerCase())
    )
  );

  // İstatistik hesaplamaları
  const totalUsers = users.length;
  const totalAdmins = users.filter(user => user.role === "admin").length;
  const totalListings = listings.length;
  const totalEvents = events.length;
  const totalNotes = notes.length;
  const pendingNotes = notes.filter(note => !note.isApproved).length;
  
  // Ev arkadaşı istatistikleri - silinmiş olanları hariç tut
  const activeRoommates = roommates.filter(roommate => !roommate.isDeleted);
  const totalRoommates = activeRoommates.length;
  const pendingRoommates = activeRoommates.filter(roommate => roommate.isApproved !== true).length;
  
  const pendingListings = listings.filter(listing => !listing.isApproved).length;
  const pendingEvents = events.filter(event => !event.isApproved).length;
  const recentUsers = users.filter(user => {
    if (!user.createdAt) return false;
    const userDate = new Date(user.createdAt.seconds * 1000);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return userDate > weekAgo;
  }).length;

  // DEBUG: Ev arkadaşı istatistikleri
  console.log('📊 Admin Panel İstatistikleri - Ev Arkadaşı:');
  console.log('  - Toplam aktif ilan:', totalRoommates);
  console.log('  - Onay bekleyen:', pendingRoommates);
  console.log('  - Onaylanmış:', activeRoommates.filter(roommate => roommate.isApproved === true).length);
  console.log('  - Onaysız:', activeRoommates.filter(roommate => roommate.isApproved === false).length);
  console.log('  - Durum belirsiz:', activeRoommates.filter(roommate => roommate.isApproved === undefined || roommate.isApproved === null).length);
  console.log('  - Silinmiş ilanlar:', roommates.filter(roommate => roommate.isDeleted).length);
  console.log('  - Tüm aktif ilanlar:', activeRoommates.map((r: any) => ({
    id: r.id,
    name: r.name,
    isApproved: r.isApproved,
    isDeleted: r.isDeleted
  })));

  // Toplu seçim fonksiyonları
  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectAllListings = (checked: boolean) => {
    if (checked) {
      setSelectedListings(filteredListings.map(listing => listing.id));
    } else {
      setSelectedListings([]);
    }
  };

  const handleSelectAllEvents = (checked: boolean) => {
    if (checked) {
      setSelectedEvents(filteredEvents.map(event => event.id));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectAllNotes = (checked: boolean) => {
    if (checked) {
      setSelectedNotes(filteredNotes.map(note => note.id));
    } else {
      setSelectedNotes([]);
    }
  };

  const handleSelectAllRoommates = (checked: boolean) => {
    if (checked) {
      setSelectedRoommates(filteredRoommates.map(roommate => roommate.id));
    } else {
      setSelectedRoommates([]);
    }
  };

  // Toplu işlem fonksiyonları
  const handleBulkDeleteUsers = async () => {
    if (!window.confirm(`${selectedUsers.length} kullanıcıyı silmek istediğinize emin misiniz?`)) return;
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedUsers.forEach(userId => {
        if (userId !== userId) { // Kendini silmeye çalışmasın
          batch.delete(doc(db, "users", userId));
        }
      });
      await batch.commit();
      setSelectedUsers([]);
    } catch (e) {
      alert("Toplu silme işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
  };

  const handleBulkDeleteListings = async () => {
    if (!window.confirm(`${selectedListings.length} ilanı silmek istediğinize emin misiniz?`)) return;
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedListings.forEach(listingId => {
        batch.delete(doc(db, "secondhand", listingId));
      });
      await batch.commit();
      setSelectedListings([]);
    } catch (e) {
      alert("Toplu silme işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
  };

  const handleBulkDeleteEvents = async () => {
    if (!window.confirm(`${selectedEvents.length} etkinliği silmek istediğinize emin misiniz?`)) return;
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedEvents.forEach(eventId => {
        batch.delete(doc(db, "events", eventId));
      });
      await batch.commit();
      setSelectedEvents([]);
    } catch (e) {
      alert("Toplu silme işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
  };

  const handleBulkDeleteNotes = async () => {
    if (!window.confirm(`${selectedNotes.length} notu silmek istediğinize emin misiniz?`)) return;
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedNotes.forEach(noteId => {
        batch.delete(doc(db, "notes", noteId));
      });
      await batch.commit();
      setSelectedNotes([]);
    } catch (e) {
      alert("Toplu silme işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
  };

  const handleBulkApproveNotes = async () => {
    if (!window.confirm(`${selectedNotes.length} notu onaylamak istediğinize emin misiniz?`)) return;
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedNotes.forEach(noteId => {
        batch.update(doc(db, "notes", noteId), {
          isApproved: true,
          approvedAt: new Date(),
          approvedBy: userId
        });
      });
      await batch.commit();
      setSelectedNotes([]);
      alert("Seçili notlar başarıyla onaylandı!");
    } catch (e) {
      alert("Toplu onaylama işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
  };

  const handleBulkMakeAdmin = async () => {
    if (!window.confirm(`${selectedUsers.length} kullanıcıyı admin yapmak istediğinize emin misiniz?`)) return;
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedUsers.forEach(userId => {
        batch.update(doc(db, "users", userId), { role: "admin" });
      });
      await batch.commit();
      setSelectedUsers([]);
    } catch (e) {
      alert("Toplu admin yapma işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
  };

  const handleBulkApproveRoommates = async () => {
    if (!window.confirm(`${selectedRoommates.length} ev arkadaşı ilanını onaylamak istediğinize emin misiniz?`)) return;
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedRoommates.forEach(roommateId => {
        batch.update(doc(db, "roommates", roommateId), { isApproved: true });
      });
      await batch.commit();
      setSelectedRoommates([]);
    } catch (e) {
      alert("Toplu onaylama işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
  };

  const handleBulkDeleteRoommates = async () => {
    if (!window.confirm(`${selectedRoommates.length} ev arkadaşı ilanını silmek istediğinize emin misiniz?`)) return;
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedRoommates.forEach(roommateId => {
        batch.delete(doc(db, "roommates", roommateId));
      });
      await batch.commit();
      setSelectedRoommates([]);
    } catch (e) {
      alert("Toplu silme işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
  };

  const handleBulkApproveListings = async () => {
    if (!window.confirm(`${selectedListings.length} ikinci el ilanını onaylamak istediğinize emin misiniz?`)) return;
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedListings.forEach(listingId => {
        batch.update(doc(db, "secondhand", listingId), { 
          isApproved: true,
          approvedAt: new Date(),
          approvedBy: userId
        });
      });
      await batch.commit();
      setSelectedListings([]);
    } catch (e) {
      alert("Toplu onaylama işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    setActionLoading(id);
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (e) {
      alert("Silme işlemi başarısız: " + e);
    }
    setActionLoading(null);
  };

  const handleToggleAdmin = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setActionLoading(id);
    try {
      await updateDoc(doc(db, "users", id), { role: newRole });
    } catch (e) {
      alert("Güncelleme başarısız: " + e);
    }
    setActionLoading(null);
  };

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    setListingActionLoading(id);
    try {
      await deleteDoc(doc(db, "secondhand", id));
    } catch (e) {
      alert("Silme işlemi başarısız: " + e);
    }
    setListingActionLoading(null);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
    
    console.log('🗑️ ETKİNLİK SİLİNİYOR - ID:', id);
    console.log('🔍 Event ID tipi:', typeof id, 'Uzunluk:', id.length);
    
    // ID format kontrolü
    if (!id || id.length < 5) {
      console.error('❌ Geçersiz ID formatı:', id);
      alert(`Geçersiz etkinlik ID formatı: "${id}"`);
      return;
    }
    
    const cleanId = String(id).trim();
    const eventToDelete = events.find(e => e.id === cleanId);
    
    if (!eventToDelete) {
      console.error('❌ Silinecek etkinlik bulunamadı! ID:', cleanId);
      alert(`Etkinlik bulunamadı! ID: ${cleanId}`);
      return;
    }
    
    setEventActionLoading(cleanId);
    try {
      // Firebase'den sil
      await deleteDoc(doc(db, "events", cleanId));
      console.log('✅ Firebase\'den başarıyla silindi');
      
      // STATE'den hemen sil (optimistic update)
      setEvents(prevEvents => prevEvents.filter(event => event.id !== cleanId));
      
      alert(`Etkinlik başarıyla silindi: ${eventToDelete.title}`);
      
    } catch (e: any) {
      console.error('❌ Silme hatası:', e);
      alert(`Silme işlemi başarısız:\n${e.message || e}`);
      
      // Hata durumunda liste yenile
      try {
        const eventsRef = collection(db, "events");
        const snap = await getDocs(eventsRef);
        const fetchedEvents = snap.docs.map(doc => {
          const data = doc.data();
          const { id: dataId, ...cleanData } = data; // data.id'yi çıkar
          return { 
            id: doc.id,  // Firebase document ID (tek doğru ID)
            ...cleanData  // data.id olmadan diğer tüm veriler
          };
        });
        
        // Sıralama yap
        const sortedEvents = fetchedEvents.sort((a: any, b: any) => {
          const getTimestamp = (createdAt: any) => {
            if (!createdAt) return 0;
            if (createdAt.seconds) return createdAt.seconds * 1000;
            if (typeof createdAt === 'string') return new Date(createdAt).getTime();
            return 0;
          };
          return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
        });
        
        setEvents(sortedEvents);
      } catch (refreshError) {
        console.error('Liste yenileme hatası:', refreshError);
      }
    }
    setEventActionLoading(null);
  };

    const handleApproveEvent = async (id: string) => {
    console.log('🔍 Etkinlik onaylanıyor - ID:', id);
    
    // ID format kontrolü
    if (!id || id.length < 5) {
      console.error('❌ Geçersiz ID formatı:', id);
      alert(`Geçersiz etkinlik ID formatı: "${id}"`);
      return;
    }
    
    setEventActionLoading(id);
    try {
      // String'e çevir ve trimle
      const cleanId = String(id).trim();
      console.log('🧹 Temizlenmiş ID:', cleanId);
      
      // Önce local state'de var mı kontrol et
      const localEvent = events.find(e => e.id === cleanId);
      if (!localEvent) {
        console.error('❌ Event local state\'de bulunamadı! ID:', cleanId);
        console.log('📊 Mevcut events:', events.length);
        
        // Firebase'den tüm etkinlikleri tekrar çek
        console.log('🔄 Firebase\'den etkinlikler yeniden çekiliyor...');
        const eventsRef = collection(db, "events");
        const snap = await getDocs(eventsRef);
        const fetchedEvents = snap.docs.map(doc => {
          const data = doc.data();
          const { id: dataId, ...cleanData } = data; // data.id'yi çıkar
          return { 
            id: doc.id,  // Firebase document ID (tek doğru ID)
            ...cleanData  // data.id olmadan diğer tüm veriler
          };
        });
        
        // Sıralama yap
        const sortedEvents = fetchedEvents.sort((a: any, b: any) => {
          const getTimestamp = (createdAt: any) => {
            if (!createdAt) return 0;
            if (createdAt.seconds) return createdAt.seconds * 1000;
            if (typeof createdAt === 'string') return new Date(createdAt).getTime();
            return 0;
          };
          return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
        });
        
        setEvents(sortedEvents);
        
        // Tekrar kontrol et
        const refreshedEvent = sortedEvents.find(e => e.id === cleanId);
        if (!refreshedEvent) {
          alert(`Etkinlik bulunamadı! ID: ${cleanId}\n\nFirebase'de ${sortedEvents.length} etkinlik var ama bu ID bulunamıyor.`);
          setEventActionLoading(null);
          return;
        }
        console.log('✅ Firebase refresh sonrası etkinlik bulundu');
      }
      
      // Firebase dokümanını kontrol et
      const eventRef = doc(db, "events", cleanId);
      const eventSnap = await getDoc(eventRef);
      
      if (!eventSnap.exists()) {
        console.error('❌ Firebase\'de event bulunamadı! ID:', cleanId);
        
        // Tüm etkinlik ID'lerini Firebase'den çek ve karşılaştır
        console.log('🔍 Firebase\'deki tüm etkinlik ID\'leri kontrol ediliyor...');
        const allEventsRef = collection(db, "events");
        const allEventsSnap = await getDocs(allEventsRef);
        const allFirebaseIds = allEventsSnap.docs.map(doc => doc.id);
        
        console.log('📋 Firebase\'deki tüm ID\'ler:', allFirebaseIds);
        console.log('🔍 Aranan ID:', cleanId);
        console.log('🔍 Aranan ID Firebase\'de var mı?', allFirebaseIds.includes(cleanId));
        
        // En yakın ID'leri bul
        const similarIds = allFirebaseIds.filter(id => 
          id.includes(cleanId.substring(0, 10)) || cleanId.includes(id.substring(0, 10))
        );
        console.log('🔍 Benzer ID\'ler:', similarIds);
        
        alert(`Firebase\'de etkinlik bulunamadı! 
        
Aranan ID: ${cleanId}
Firebase\'deki etkinlik sayısı: ${allFirebaseIds.length}
Benzer ID\'ler: ${similarIds.join(', ') || 'Yok'}`);
        setEventActionLoading(null);
        return;
      }
      
      const eventData = eventSnap.data();
      
      // Onaylama işlemi
      await updateDoc(eventRef, { 
        isApproved: true,
        isVerified: true,
        approvedAt: new Date(),
        approvedBy: userId || 'admin-bypass'
      });
      
      // STATE'de güncelle
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === cleanId 
          ? { ...event, isApproved: true, approvedAt: new Date(), approvedBy: userId || 'admin-bypass' }
          : event
      ));
      
      alert(`✅ Etkinlik başarıyla onaylandı: ${eventData.title}`);
      
    } catch (e: any) {
      console.error('❌ Onaylama hatası:', e);
      alert(`Onaylama işlemi başarısız:\n${e.message || e}`);
    }
    setEventActionLoading(null);
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm("Bu notu silmek istediğinize emin misiniz?")) return;
    setNoteActionLoading(id);
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (e) {
      alert("Silme işlemi başarısız: " + e);
    }
    setNoteActionLoading(null);
  };

  const handleApproveNote = async (id: string) => {
    setNoteActionLoading(id);
    try {
      console.log('🔍 Not onaylanıyor:', id);
      await updateDoc(doc(db, "notes", id), { 
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: userId
      });
      console.log('✅ Not başarıyla onaylandı:', id);
      alert("Not başarıyla onaylandı!");
    } catch (e) {
      console.error('❌ Not onaylama hatası:', e);
      alert("Onaylama işlemi başarısız: " + e);
    }
    setNoteActionLoading(null);
  };

  const handleApproveRoommate = async (id: string) => {
    setRoommateActionLoading(id);
    try {
      console.log('🔍 Ev arkadaşı ilanı onaylanıyor:', id);
      await updateDoc(doc(db, "roommates", id), { 
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: userId
      });
      console.log('✅ Ev arkadaşı ilanı başarıyla onaylandı:', id);
      alert("Ev arkadaşı ilanı başarıyla onaylandı!");
    } catch (e) {
      console.error('❌ Ev arkadaşı onaylama hatası:', e);
      alert("Onaylama işlemi başarısız: " + e);
    }
    setRoommateActionLoading(null);
  };

  const handleDeleteRoommate = async (id: string) => {
    if (!window.confirm("Bu ev arkadaşı ilanını silmek istediğinize emin misiniz?")) return;
    setRoommateActionLoading(id);
    try {
      console.log('🗑️ Ev arkadaşı ilanı siliniyor:', id);
      await deleteDoc(doc(db, "roommates", id));
      console.log('✅ Ev arkadaşı ilanı başarıyla silindi:', id);
      alert("Ev arkadaşı ilanı başarıyla silindi!");
    } catch (e) {
      console.error('❌ Ev arkadaşı silme hatası:', e);
      alert("Silme işlemi başarısız: " + e);
    }
    setRoommateActionLoading(null);
  };

  // İkinci el ilan onaylama fonksiyonu
  const handleApproveListing = async (id: string) => {
    setListingActionLoading(id);
    try {
      await updateDoc(doc(db, "secondhand", id), { 
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: userId
      });
    } catch (e) {
      alert("Onaylama işlemi başarısız: " + e);
    }
    setListingActionLoading(null);
  };

  // İkinci el ilan premium yapma fonksiyonu
  const handleTogglePremiumListing = async (id: string, currentPremiumStatus: boolean) => {
    setListingActionLoading(id);
    try {
      await updateDoc(doc(db, "secondhand", id), { 
        isPremium: !currentPremiumStatus,
        premiumAt: !currentPremiumStatus ? new Date() : null,
        premiumBy: !currentPremiumStatus ? userId : null
      });
      
      // Başarı mesajı göster
      alert(!currentPremiumStatus ? "İlan premium yapıldı!" : "İlan premium durumdan çıkarıldı!");
      
      // Listings state'ini güncelle
      setListings(prev => prev.map(listing => 
        listing.id === id 
          ? { ...listing, isPremium: !currentPremiumStatus }
          : listing
      ));
    } catch (e) {
      alert("Premium işlemi başarısız: " + e);
    }
    setListingActionLoading(null);
  };

  // Ev arkadaşı ilan premium yapma fonksiyonu
  const handleTogglePremiumRoommate = async (id: string, currentPremiumStatus: boolean) => {
    setRoommateActionLoading(id);
    try {
      await updateDoc(doc(db, "roommates", id), { 
        isPremium: !currentPremiumStatus,
        premiumAt: !currentPremiumStatus ? new Date() : null,
        premiumBy: !currentPremiumStatus ? userId : null
      });
      
      // Başarı mesajı göster
      alert(!currentPremiumStatus ? "İlan premium yapıldı!" : "İlan premium durumdan çıkarıldı!");
      
      // Roommates state'ini güncelle
      setRoommates(prev => prev.map(roommate => 
        roommate.id === id 
          ? { ...roommate, isPremium: !currentPremiumStatus }
          : roommate
      ));
    } catch (e) {
      alert("Premium işlemi başarısız: " + e);
    }
    setRoommateActionLoading(null);
  };



  // DEBUG LOG
  console.log('🚀 Admin Panel Render:', {
    loading,
    isAdmin,
    events: events.length,
    eventsData: events.slice(0, 2),
    userId
  });

  if (loading) return <div>Yükleniyor...</div>;
  // GEÇICI: Admin kontrolünü bypass et
  // if (!isAdmin) return <div>Erişim yok</div>;

  return (
    <div>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>
        
        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Kullanıcılar</h2>
            <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
            <p className="text-sm text-gray-500">Admin: {totalAdmins}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">İlanlar</h2>
            <p className="text-3xl font-bold text-green-600">{totalListings}</p>
            <p className="text-sm text-gray-500">Onay Bekleyen: {pendingListings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Etkinlikler</h2>
            <p className="text-3xl font-bold text-purple-600">{totalEvents}</p>
            <p className="text-sm text-gray-500">Onay Bekleyen: {pendingEvents}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Notlar</h2>
            <p className="text-3xl font-bold text-yellow-600">{totalNotes}</p>
            <p className="text-sm text-gray-500">Onay Bekleyen: {pendingNotes}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Ev Arkadaşı İlanları</h2>
            <p className="text-3xl font-bold text-indigo-600">{totalRoommates}</p>
            <p className="text-sm text-gray-500">Onay Bekleyen: {pendingRoommates}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Yeni Kullanıcılar</h2>
            <p className="text-3xl font-bold text-red-600">{recentUsers}</p>
            <p className="text-sm text-gray-500">Son 7 gün</p>
          </div>
        </div>

        {/* Kullanıcılar Tablosu */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Kullanıcılar</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kullanıcı ara..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="border rounded px-3 py-1"
                />
                <button
                  onClick={() => handleBulkMakeAdmin()}
                  disabled={selectedUsers.length === 0 || bulkActionLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Admin Yap ({selectedUsers.length})
                </button>
                <button
                  onClick={() => handleBulkDeleteUsers()}
                  disabled={selectedUsers.length === 0 || bulkActionLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Sil ({selectedUsers.length})
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={(e) => handleSelectAllUsers(e.target.checked)}
                      />
                    </th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">İsim</th>
                    <th className="py-2 px-4 text-left">Rol</th>
                    <th className="py-2 px-4 text-left">Kayıt Tarihi</th>
                    <th className="py-2 px-4 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">{user.displayName || "-"}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          onClick={() => handleToggleAdmin(user.id, user.role)}
                          disabled={actionLoading === user.id}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          {user.role === "admin" ? "User Yap" : "Admin Yap"}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={actionLoading === user.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* İlanlar Tablosu */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">İkinci El İlanları</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="İlan ara..."
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  className="border rounded px-3 py-1"
                />
                <button
                  onClick={() => handleBulkApproveListings()}
                  disabled={selectedListings.length === 0 || bulkActionLoading}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Onayla ({selectedListings.length})
                </button>
                <button
                  onClick={() => handleBulkDeleteListings()}
                  disabled={selectedListings.length === 0 || bulkActionLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Sil ({selectedListings.length})
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                        onChange={(e) => handleSelectAllListings(e.target.checked)}
                      />
                    </th>
                    <th className="py-2 px-4 text-left">Başlık</th>
                    <th className="py-2 px-4 text-left">Kategori</th>
                    <th className="py-2 px-4 text-left">Fiyat</th>
                    <th className="py-2 px-4 text-left">Tarih</th>
                    <th className="py-2 px-4 text-left">Onay Durumu</th>
                    <th className="py-2 px-4 text-left">Premium</th>
                    <th className="py-2 px-4 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(listing.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedListings([...selectedListings, listing.id]);
                            } else {
                              setSelectedListings(selectedListings.filter(id => id !== listing.id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-2 px-4">{listing.title}</td>
                      <td className="py-2 px-4">{listing.category}</td>
                      <td className="py-2 px-4">{listing.price} TL</td>
                      <td className="py-2 px-4">
                        {listing.createdAt ? new Date(listing.createdAt.seconds * 1000).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${listing.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {listing.isApproved ? 'Onaylı' : 'Onay Bekliyor'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${listing.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {listing.isPremium ? '👑 Premium' : 'Normal'}
                        </span>
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          onClick={() => {
                            // Resim önizleme modalı aç
                            const images = listing.images || [listing.image];
                            if (images.length > 0) {
                              alert(`İlan: ${listing.title}\nFiyat: ${listing.price} TL\nResim sayısı: ${images.length}`);
                            }
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Önizle
                        </button>
                        <a href={`/ikinci-el/${listing.id}`} target="_blank" className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">Görüntüle</a>
                        {!listing.isApproved && (
                          <button
                            onClick={() => handleApproveListing(listing.id)}
                            disabled={listingActionLoading === listing.id}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                          >
                            Onayla
                          </button>
                        )}
                        <button
                          onClick={() => handleTogglePremiumListing(listing.id, listing.isPremium)}
                          disabled={listingActionLoading === listing.id}
                          className={`${listing.isPremium ? 'bg-gray-500 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-2 py-1 rounded text-xs disabled:opacity-50`}
                        >
                          {listing.isPremium ? '👑 Premium İptal' : '👑 Premium Yap'}
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          disabled={listingActionLoading === listing.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Etkinlikler Tablosu */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Etkinlikler ({events.length})</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Etkinlik ara..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="border rounded px-3 py-1"
                />
                <button
                  onClick={async () => {
                    console.log('🔄 Manuel yenileme başlatılıyor...');
                    try {
                      const eventsRef = collection(db, "events");
                      const snap = await getDocs(eventsRef);
                      const fetchedEvents = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                      setEvents(fetchedEvents);
                      console.log('✅ Manuel yenileme tamamlandı, etkinlik sayısı:', fetchedEvents.length);
                      alert(`Liste yenilendi! ${fetchedEvents.length} etkinlik bulundu.`);
                    } catch (error) {
                      console.error('❌ Yenileme hatası:', error);
                      alert('Yenileme sırasında hata oluştu: ' + error);
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  🔄 Yenile
                </button>
                <button
                  onClick={() => handleBulkDeleteEvents()}
                  disabled={selectedEvents.length === 0 || bulkActionLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Sil ({selectedEvents.length})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                        onChange={(e) => handleSelectAllEvents(e.target.checked)}
                      />
                    </th>
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Başlık</th>
                    <th className="py-2 px-4 text-left">Kategori</th>
                    <th className="py-2 px-4 text-left">Tarih</th>
                    <th className="py-2 px-4 text-left">Konum</th>
                    <th className="py-2 px-4 text-left">Durum</th>
                    <th className="py-2 px-4 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEvents([...selectedEvents, event.id]);
                            } else {
                              setSelectedEvents(selectedEvents.filter(id => id !== event.id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-2 px-4">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{event.id}</span>
                      </td>
                      <td className="py-2 px-4">{event.title}</td>
                      <td className="py-2 px-4">{event.category}</td>
                      <td className="py-2 px-4">{event.date}</td>
                      <td className="py-2 px-4">{event.location}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.isApproved === true ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.isApproved === true ? 'Onaylı' : 'Onay Bekliyor'}
                        </span>
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <a href={`/etkinlikler/${event.id}?admin=true`} target="_blank" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">Görüntüle</a>
                        {(event.isApproved !== true) && (
                          <button
                            onClick={() => handleApproveEvent(event.id)}
                            disabled={eventActionLoading === event.id}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                          >
                            Onayla
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={eventActionLoading === event.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notlar Tablosu */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Notlar</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Not ara..."
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="border rounded px-3 py-1"
                />
                <button
                  onClick={() => handleBulkApproveNotes()}
                  disabled={selectedNotes.length === 0 || bulkActionLoading}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Onayla ({selectedNotes.length})
                </button>
                <button
                  onClick={() => handleBulkDeleteNotes()}
                  disabled={selectedNotes.length === 0 || bulkActionLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Sil ({selectedNotes.length})
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedNotes.length === filteredNotes.length && filteredNotes.length > 0}
                        onChange={(e) => handleSelectAllNotes(e.target.checked)}
                      />
                    </th>
                    <th className="py-2 px-4 text-left">Başlık</th>
                    <th className="py-2 px-4 text-left">Ders</th>
                    <th className="py-2 px-4 text-left">Üniversite</th>
                    <th className="py-2 px-4 text-left">Sayfa</th>
                    <th className="py-2 px-4 text-left">İndirme</th>
                    <th className="py-2 px-4 text-left">Durum</th>
                    <th className="py-2 px-4 text-left">Tarih</th>
                    <th className="py-2 px-4 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotes.map((note) => (
                    <tr key={note.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <input
                          type="checkbox"
                          checked={selectedNotes.includes(note.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNotes([...selectedNotes, note.id]);
                            } else {
                              setSelectedNotes(selectedNotes.filter(id => id !== note.id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-2 px-4">{note.title}</td>
                      <td className="py-2 px-4">{note.subject}</td>
                      <td className="py-2 px-4">{note.university}</td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                          {note.pageCount || 0} sayfa
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          {note.downloadCount || 0} indirme
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          note.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {note.isApproved ? 'Onaylandı' : 'Onay Bekliyor'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {note.createdAt ? new Date(note.createdAt.seconds * 1000).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <a href={`/notlar/${note.id}`} target="_blank" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">Görüntüle</a>
                        {!note.isApproved && (
                          <button
                            onClick={() => handleApproveNote(note.id)}
                            disabled={noteActionLoading === note.id}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                          >
                            Onayla
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={noteActionLoading === note.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ev Arkadaşı İlanları Tablosu */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ev Arkadaşı İlanları</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="İlan ara..."
                  value={roommateSearch}
                  onChange={(e) => setRoommateSearch(e.target.value)}
                  className="border rounded px-3 py-1"
                />
                <button
                  onClick={() => {
                    console.log('🔍 DEBUG: Tüm ev arkadaşı ilanları:', roommates);
                    console.log('🔍 DEBUG: Filtrelenmiş ilanlar:', filteredRoommates);
                    alert(`Toplam: ${roommates.length}, Filtrelenmiş: ${filteredRoommates.length}, Onay bekleyen: ${pendingRoommates}`);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  Debug
                </button>
                <button
                  onClick={() => {
                    console.log('🔄 Ev arkadaşı verileri yenileniyor...');
                    setRoommateActionLoading('refresh');
                    setTimeout(() => setRoommateActionLoading(null), 1000);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Yenile
                </button>
                <button
                  onClick={() => handleBulkApproveRoommates()}
                  disabled={selectedRoommates.length === 0 || bulkActionLoading}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Onayla ({selectedRoommates.length})
                </button>
                <button
                  onClick={() => handleBulkDeleteRoommates()}
                  disabled={selectedRoommates.length === 0 || bulkActionLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Sil ({selectedRoommates.length})
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRoommates.length === filteredRoommates.length && filteredRoommates.length > 0}
                        onChange={(e) => handleSelectAllRoommates(e.target.checked)}
                      />
                    </th>
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">İsim</th>
                    <th className="py-2 px-4 text-left">Üniversite</th>
                    <th className="py-2 px-4 text-left">Konum</th>
                    <th className="py-2 px-4 text-left">Fiyat</th>
                    <th className="py-2 px-4 text-left">Tip</th>
                    <th className="py-2 px-4 text-left">Durum</th>
                    <th className="py-2 px-4 text-left">Premium</th>
                    <th className="py-2 px-4 text-left">Tarih</th>
                    <th className="py-2 px-4 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoommates.map((roommate) => (
                    <tr key={roommate.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <input
                          type="checkbox"
                          checked={selectedRoommates.includes(roommate.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRoommates([...selectedRoommates, roommate.id]);
                            } else {
                              setSelectedRoommates(selectedRoommates.filter(id => id !== roommate.id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-2 px-4 text-xs font-mono">{roommate.id}</td>
                      <td className="py-2 px-4">{roommate.name}</td>
                      <td className="py-2 px-4">{roommate.university}</td>
                      <td className="py-2 px-4">{roommate.location}</td>
                      <td className="py-2 px-4">{roommate.price} {roommate.currency}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          roommate.type === 'seeking' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {roommate.type === 'seeking' ? 'Ev Arkadaşı Arıyor' : 'Ev Arıyor'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          roommate.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {roommate.isApproved ? 'Onaylandı' : 'Onay Bekliyor'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${roommate.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {roommate.isPremium ? '👑 Premium' : 'Normal'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {roommate.createdAt ? new Date(roommate.createdAt.seconds * 1000).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <a href={`/ev-arkadasi/${roommate.id}`} target="_blank" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">Görüntüle</a>
                        {!roommate.isApproved && (
                          <button
                            onClick={() => handleApproveRoommate(roommate.id)}
                            disabled={roommateActionLoading === roommate.id}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                          >
                            Onayla
                          </button>
                        )}
                        <button
                          onClick={() => handleTogglePremiumRoommate(roommate.id, roommate.isPremium)}
                          disabled={roommateActionLoading === roommate.id}
                          className={`${roommate.isPremium ? 'bg-gray-500 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-2 py-1 rounded text-xs disabled:opacity-50`}
                        >
                          {roommate.isPremium ? '👑 Premium İptal' : '👑 Premium Yap'}
                        </button>
                        <button
                          onClick={() => handleDeleteRoommate(roommate.id)}
                          disabled={roommateActionLoading === roommate.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Boş durum mesajı */}
              {filteredRoommates.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <div className="text-4xl mb-2">🏠</div>
                  <p>Henüz ev arkadaşı ilanı bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Erken Erişim Kayıtları Tablosu */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Erken Erişim Kayıtları</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="E-posta ara..."
                  value={earlyAccessSearch}
                  onChange={(e) => setEarlyAccessSearch(e.target.value)}
                  className="border rounded px-3 py-1"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left">E-posta</th>
                    <th className="py-2 px-4 text-left">Kayıt Tarihi</th>
                    <th className="py-2 px-4 text-left">Durum</th>
                    <th className="py-2 px-4 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {earlyAccessRegistrations
                    .filter(reg => reg.email.toLowerCase().includes(earlyAccessSearch.toLowerCase()))
                    .map((registration) => (
                    <tr key={registration.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{registration.email}</td>
                      <td className="py-2 px-4">
                        {registration.timestamp ? new Date(registration.timestamp.seconds * 1000).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {registration.status === 'pending' ? 'Bekliyor' : 'Bilgilendirildi'}
                        </span>
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await updateDoc(doc(db, "early_access_registrations", registration.id), {
                                status: registration.status === 'pending' ? 'notified' : 'pending'
                              });
                              setEarlyAccessActionLoading(registration.id);
                              setTimeout(() => setEarlyAccessActionLoading(null), 1000);
                            } catch (error) {
                              console.error('Durum güncelleme hatası:', error);
                            }
                          }}
                          disabled={earlyAccessActionLoading === registration.id}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          {registration.status === 'pending' ? 'Bilgilendir' : 'Bekliyor Yap'}
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await deleteDoc(doc(db, "early_access_registrations", registration.id));
                              setEarlyAccessActionLoading(registration.id);
                              setTimeout(() => setEarlyAccessActionLoading(null), 1000);
                            } catch (error) {
                              console.error('Silme hatası:', error);
                            }
                          }}
                          disabled={earlyAccessActionLoading === registration.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* İletişim Mesajları Tablosu */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">İletişim Mesajları</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Mesaj ara..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="border rounded px-3 py-1"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left">İsim</th>
                    <th className="py-2 px-4 text-left">E-posta</th>
                    <th className="py-2 px-4 text-left">Konu</th>
                    <th className="py-2 px-4 text-left">Mesaj</th>
                    <th className="py-2 px-4 text-left">Tarih</th>
                    <th className="py-2 px-4 text-left">Durum</th>
                    <th className="py-2 px-4 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages
                    .filter(msg => 
                      msg.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                      msg.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
                      msg.subject.toLowerCase().includes(contactSearch.toLowerCase()) ||
                      msg.message.toLowerCase().includes(contactSearch.toLowerCase())
                    )
                    .map((message) => (
                    <tr key={message.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{message.name}</td>
                      <td className="py-2 px-4">{message.email}</td>
                      <td className="py-2 px-4">{message.subject}</td>
                      <td className="py-2 px-4">
                        <div className="max-w-xs truncate" title={message.message}>
                          {message.message}
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        {message.timestamp ? new Date(message.timestamp.seconds * 1000).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${message.status === 'unread' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {message.status === 'unread' ? 'Okunmadı' : 'Okundu'}
                        </span>
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await updateDoc(doc(db, "contact_messages", message.id), {
                                status: message.status === 'unread' ? 'read' : 'unread'
                              });
                              setContactActionLoading(message.id);
                              setTimeout(() => setContactActionLoading(null), 1000);
                            } catch (error) {
                              console.error('Durum güncelleme hatası:', error);
                            }
                          }}
                          disabled={contactActionLoading === message.id}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          {message.status === 'unread' ? 'Okundu İşaretle' : 'Okunmadı İşaretle'}
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await deleteDoc(doc(db, "contact_messages", message.id));
                              setContactActionLoading(message.id);
                              setTimeout(() => setContactActionLoading(null), 1000);
                            } catch (error) {
                              console.error('Silme hatası:', error);
                            }
                          }}
                          disabled={contactActionLoading === message.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 