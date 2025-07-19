"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc, writeBatch, addDoc } from "firebase/firestore";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from '../../lib/auth/AuthContext';
import { useNotifications } from '../../components/SimpleNotificationSystem';

export default function AdminClient() {
  const { user, profile } = useAuth();
  const { sendNotification } = useNotifications();
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
    // GEÇICI: Admin kontrolünü bypass et
    const fetchNotes = async () => {
      try {
        console.log('🔍 Admin paneli - Firebase notları çekiliyor...');
        const notesRef = collection(db, "notes");
        const snap = await getDocs(notesRef);
        const fetchedNotes = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📊 Admin paneli - Not sayısı:', fetchedNotes.length);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('❌ Firebase notları çekme hatası:', error);
      }
    };
    fetchNotes();
  }, [noteActionLoading]);

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
    // GEÇICI: Admin kontrolünü bypass et
    const fetchEarlyAccess = async () => {
      try {
        console.log('🔍 Admin paneli - Firebase erken erişim kayıtları çekiliyor...');
        const earlyAccessRef = collection(db, "early_access_registrations");
        const snap = await getDocs(earlyAccessRef);
        const fetchedEarlyAccess = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📊 Admin paneli - Erken erişim kayıt sayısı:', fetchedEarlyAccess.length);
        console.log('📋 Erken erişim kayıtları:', fetchedEarlyAccess);
        setEarlyAccessRegistrations(fetchedEarlyAccess);
      } catch (error) {
        console.error('❌ Firebase erken erişim kayıtları çekme hatası:', error);
      }
    };
    fetchEarlyAccess();
  }, [earlyAccessActionLoading]);

  // İletişim mesajlarını çek
  useEffect(() => {
    // GEÇICI: Admin kontrolünü bypass et
    const fetchContactMessages = async () => {
      try {
        console.log('🔍 Admin paneli - Firebase iletişim mesajları çekiliyor...');
        const contactRef = collection(db, "contact_messages");
        const snap = await getDocs(contactRef);
        const fetchedContactMessages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📊 Admin paneli - İletişim mesaj sayısı:', fetchedContactMessages.length);
        setContactMessages(fetchedContactMessages);
      } catch (error) {
        console.error('❌ Firebase iletişim mesajları çekme hatası:', error);
      }
    };
    fetchContactMessages();
  }, [contactActionLoading]);

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
      const noteData: any[] = [];
      
      selectedNotes.forEach(noteId => {
        const note = notes.find(n => n.id === noteId);
        if (note) {
          noteData.push(note);
        }
        batch.update(doc(db, "notes", noteId), {
          isApproved: true,
          approvedAt: new Date(),
          approvedBy: userId
        });
      });
      
      await batch.commit();
      
      // İçerik sahiplerine bildirim gönder
      for (const note of noteData) {
        if (note.userId) {
          try {
            await sendNotification({
              userId: note.userId,
              title: `Notunuz Onaylandı`,
              message: `"${note.title}" başlıklı notunuz onaylandı ve yayınlandı.`,
              type: 'success',
              actionUrl: '/notlar',
              actionText: 'Notlarımı Görüntüle'
            });
          } catch (notifError) {
            console.error('Bildirim gönderme hatası:', notifError);
          }
        }
      }
      
      setSelectedNotes([]);
      alert(`${selectedNotes.length} not başarıyla onaylandı!`);
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
      
      // Seçili kullanıcılara bildirim gönder
      for (const userId of selectedUsers) {
        try {
          await sendNotification({
            userId: userId,
            title: `Admin Yetkisi Verildi`,
            message: 'Hesabınıza admin yetkisi verildi. Artık admin paneline erişebilirsiniz.',
            type: 'success',
            actionUrl: '/admin',
            actionText: 'Admin Paneli'
          });
        } catch (notifError) {
          console.error('Bildirim gönderme hatası:', notifError);
        }
      }
      
      setSelectedUsers([]);
      alert(`${selectedUsers.length} kullanıcı başarıyla admin yapıldı!`);
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
      const roommateData: any[] = [];
      
      selectedRoommates.forEach(roommateId => {
        const roommate = roommates.find(r => r.id === roommateId);
        if (roommate) {
          roommateData.push(roommate);
        }
        batch.update(doc(db, "roommates", roommateId), { isApproved: true });
      });
      
      await batch.commit();
      
      // İçerik sahiplerine bildirim gönder
      for (const roommate of roommateData) {
        if (roommate.userId) {
          try {
            await sendNotification({
              userId: roommate.userId,
              title: `Ev Arkadaşı İlanınız Onaylandı`,
              message: `"${roommate.name}" başlıklı ev arkadaşı ilanınız onaylandı ve yayınlandı.`,
              type: 'success',
              actionUrl: '/ev-arkadasi',
              actionText: 'İlanlarımı Görüntüle'
            });
          } catch (notifError) {
            console.error('Bildirim gönderme hatası:', notifError);
          }
        }
      }
      
      setSelectedRoommates([]);
      alert(`${selectedRoommates.length} ev arkadaşı ilanı başarıyla onaylandı!`);
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
      const listingData: any[] = [];
      
      selectedListings.forEach(listingId => {
        const listing = listings.find(l => l.id === listingId);
        if (listing) {
          listingData.push(listing);
        }
        batch.update(doc(db, "secondhand", listingId), { 
          isApproved: true,
          approvedAt: new Date(),
          approvedBy: userId
        });
      });
      
      await batch.commit();
      
      // İçerik sahiplerine bildirim gönder
      for (const listing of listingData) {
        if (listing.userId) {
          try {
            await sendNotification({
              userId: listing.userId,
              title: `İlanınız Onaylandı`,
              message: `"${listing.title}" başlıklı ilanınız onaylandı ve yayınlandı.`,
              type: 'success',
              actionUrl: '/ikinci-el',
              actionText: 'İlanlarımı Görüntüle'
            });
          } catch (notifError) {
            console.error('Bildirim gönderme hatası:', notifError);
          }
        }
      }
      
      setSelectedListings([]);
      alert(`${selectedListings.length} ilan başarıyla onaylandı!`);
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

  // Kullanıcı banlama/ban kaldırma
  const handleToggleBan = async (id: string, currentBanStatus: boolean) => {
    const action = currentBanStatus ? "ban kaldırmak" : "yasaklamak";
    if (!window.confirm(`Bu kullanıcıyı ${action} istediğinize emin misiniz?`)) return;
    
    setActionLoading(id);
    try {
      const banReason = currentBanStatus ? null : prompt("Yasaklama sebebi (opsiyonel):");
      await updateDoc(doc(db, "users", id), { 
        isBanned: !currentBanStatus,
        banReason: banReason || null,
        bannedAt: !currentBanStatus ? new Date() : null,
        bannedBy: !currentBanStatus ? (userId || 'admin') : null
      });
      
      // Kullanıcıya bildirim gönder
      try {
        if (!currentBanStatus) {
          // Banlama bildirimi
          await sendNotification({
            userId: id,
            title: `Hesabınız Yasaklandı`,
            message: banReason ? `Hesabınız yasaklandı. Sebep: ${banReason}` : 'Hesabınız yasaklandı.',
            type: 'error',
            actionUrl: '/banned',
            actionText: 'Detayları Görüntüle'
          });
        } else {
          // Ban kaldırma bildirimi
          await sendNotification({
            userId: id,
            title: `Hesap Yasaklaması Kaldırıldı`,
            message: 'Hesabınızın yasaklaması kaldırıldı. Artık giriş yapabilirsiniz.',
            type: 'success',
            actionUrl: '/',
            actionText: 'Ana Sayfaya Git'
          });
        }
      } catch (notifError) {
        console.error('Bildirim gönderme hatası:', notifError);
      }
      
      alert(`Kullanıcı başarıyla ${currentBanStatus ? 'ban kaldırıldı' : 'yasaklandı'}!`);
    } catch (e) {
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} işlemi başarısız: ` + e);
    }
    setActionLoading(null);
  };

  // Kullanıcı rol değiştirme (moderator, admin, user)
  const handleChangeRole = async (id: string, newRole: string) => {
    if (!window.confirm(`Bu kullanıcının rolünü "${newRole}" yapmak istediğinize emin misiniz?`)) return;
    
    setActionLoading(id);
    try {
      // Kullanıcı bilgilerini al
      const userToUpdate = users.find(u => u.id === id);
      const userEmail = userToUpdate?.email || 'Bilinmeyen kullanıcı';
      
      await updateDoc(doc(db, "users", id), { 
        role: newRole,
        roleChangedAt: new Date(),
        roleChangedBy: userId || 'admin'
      });
      
      // Kullanıcıya bildirim gönder
      try {
        console.log('🔔 Admin paneli - Bildirim gönderiliyor:', {
          userId: id,
          title: `Rol Değişikliği`,
          message: `Hesabınızın rolü "${newRole}" olarak güncellendi.`,
          type: 'info'
        });
        
        await sendNotification({
          userId: id,
          title: `Rol Değişikliği`,
          message: `Hesabınızın rolü "${newRole}" olarak güncellendi.`,
          type: 'info',
          actionUrl: '/ayarlar',
          actionText: 'Ayarları Görüntüle'
        });
        
        console.log('✅ Admin paneli - Bildirim başarıyla gönderildi');
      } catch (notifError) {
        console.error('❌ Admin paneli - Bildirim gönderme hatası:', notifError);
      }
      
      alert(`Kullanıcı rolü başarıyla "${newRole}" olarak değiştirildi!`);
    } catch (e) {
      alert("Rol değiştirme işlemi başarısız: " + e);
    }
    setActionLoading(null);
  };

  // İçerik moderasyonu - onaylama/reddetme
  const handleModerateContent = async (collectionName: string, id: string, action: 'approve' | 'reject', reason?: string) => {
    const actionText = action === 'approve' ? 'onaylamak' : 'reddetmek';
    if (!window.confirm(`Bu içeriği ${actionText} istediğinize emin misiniz?`)) return;
    
    setActionLoading(id);
    try {
      // İçerik bilgilerini al
      let contentData: any = {};
      let contentTitle = '';
      let contentUserId = '';
      
      if (collectionName === 'secondhand') {
        contentData = listings.find(l => l.id === id);
        contentTitle = contentData?.title || 'İlan';
        contentUserId = contentData?.userId || '';
      } else if (collectionName === 'events') {
        contentData = events.find(e => e.id === id);
        contentTitle = contentData?.title || 'Etkinlik';
        contentUserId = contentData?.userId || '';
      } else if (collectionName === 'notes') {
        contentData = notes.find(n => n.id === id);
        contentTitle = contentData?.title || 'Not';
        contentUserId = contentData?.userId || '';
      } else if (collectionName === 'roommates') {
        contentData = roommates.find(r => r.id === id);
        contentTitle = contentData?.name || 'Ev Arkadaşı İlanı';
        contentUserId = contentData?.userId || '';
      }
      
      const updateData: any = {
        isApproved: action === 'approve',
        moderatedAt: new Date(),
        moderatedBy: userId || 'admin'
      };
      
      if (action === 'reject' && reason) {
        updateData.rejectionReason = reason;
      }
      
      await updateDoc(doc(db, collectionName, id), updateData);
      
      // İçerik sahibine bildirim gönder
      if (contentUserId) {
        try {
          const contentType = collectionName === 'secondhand' ? 'İlanınız' : 
                             collectionName === 'events' ? 'Etkinliğiniz' :
                             collectionName === 'notes' ? 'Notunuz' :
                             collectionName === 'roommates' ? 'Ev arkadaşı ilanınız' : 'İçeriğiniz';
          
          await sendNotification({
            userId: contentUserId,
            title: action === 'approve' ? `${contentType} Onaylandı` : `${contentType} Reddedildi`,
            message: action === 'approve' 
              ? `"${contentTitle}" başlıklı ${contentType.toLowerCase()} onaylandı ve yayınlandı.`
              : `"${contentTitle}" başlıklı ${contentType.toLowerCase()} reddedildi.${reason ? ` Sebep: ${reason}` : ''}`,
            type: action === 'approve' ? 'success' : 'warning',
            actionUrl: `/${collectionName === 'secondhand' ? 'ikinci-el' : 
                         collectionName === 'events' ? 'etkinlikler' :
                         collectionName === 'notes' ? 'notlar' :
                         collectionName === 'roommates' ? 'ev-arkadasi' : ''}`,
            actionText: 'İçeriklerimi Görüntüle'
          });
        } catch (notifError) {
          console.error('Bildirim gönderme hatası:', notifError);
        }
      }
      
      alert(`İçerik başarıyla ${action === 'approve' ? 'onaylandı' : 'reddedildi'}!`);
    } catch (e) {
      alert(`Moderasyon işlemi başarısız: ` + e);
    }
    setActionLoading(null);
  };

  // Toplu kullanıcı banlama
  const handleBulkBanUsers = async () => {
    if (selectedUsers.length === 0) {
      alert("Lütfen banlanacak kullanıcıları seçin!");
      return;
    }
    
    const reason = prompt("Toplu yasaklama sebebi:");
    if (!window.confirm(`${selectedUsers.length} kullanıcıyı yasaklamak istediğinize emin misiniz?`)) return;
    
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedUsers.forEach(userId => {
        const userRef = doc(db, "users", userId);
        batch.update(userRef, {
          isBanned: true,
          banReason: reason || 'Toplu yasaklama',
          bannedAt: new Date(),
          bannedBy: userId || 'admin'
        });
      });
      await batch.commit();
      
      // Seçili kullanıcılara bildirim gönder
      for (const userId of selectedUsers) {
        try {
          await sendNotification({
            userId: userId,
            title: `Hesabınız Yasaklandı`,
            message: reason ? `Hesabınız yasaklandı. Sebep: ${reason}` : 'Hesabınız yasaklandı.',
            type: 'error',
            actionUrl: '/banned',
            actionText: 'Detayları Görüntüle'
          });
        } catch (notifError) {
          console.error('Bildirim gönderme hatası:', notifError);
        }
      }
      
      setSelectedUsers([]);
      alert(`${selectedUsers.length} kullanıcı başarıyla yasaklandı!`);
    } catch (e) {
      alert("Toplu yasaklama işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
  };

  // Toplu kullanıcı ban kaldırma
  const handleBulkUnbanUsers = async () => {
    if (selectedUsers.length === 0) {
      alert("Lütfen ban kaldırılacak kullanıcıları seçin!");
      return;
    }
    
    if (!window.confirm(`${selectedUsers.length} kullanıcının banını kaldırmak istediğinize emin misiniz?`)) return;
    
    setBulkActionLoading(true);
    try {
      const batch = writeBatch(db);
      selectedUsers.forEach(userId => {
        const userRef = doc(db, "users", userId);
        batch.update(userRef, {
          isBanned: false,
          banReason: null,
          bannedAt: null,
          bannedBy: null
        });
      });
      await batch.commit();
      
      // Seçili kullanıcılara bildirim gönder
      for (const userId of selectedUsers) {
        try {
          await sendNotification({
            userId: userId,
            title: `Hesap Yasaklaması Kaldırıldı`,
            message: 'Hesabınızın yasaklaması kaldırıldı. Artık giriş yapabilirsiniz.',
            type: 'success',
            actionUrl: '/',
            actionText: 'Ana Sayfaya Git'
          });
        } catch (notifError) {
          console.error('Bildirim gönderme hatası:', notifError);
        }
      }
      
      setSelectedUsers([]);
      alert(`${selectedUsers.length} kullanıcının banı başarıyla kaldırıldı!`);
    } catch (e) {
      alert("Toplu ban kaldırma işlemi başarısız: " + e);
    }
    setBulkActionLoading(false);
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
      
      // Etkinlik sahibine bildirim gönder
      if (eventData.userId) {
        try {
          await sendNotification({
            userId: eventData.userId,
            title: `Etkinliğiniz Onaylandı`,
            message: `"${eventData.title}" başlıklı etkinliğiniz onaylandı ve yayınlandı.`,
            type: 'success',
            actionUrl: '/etkinlikler',
            actionText: 'Etkinliklerimi Görüntüle'
          });
        } catch (notifError) {
          console.error('Bildirim gönderme hatası:', notifError);
        }
      }
      
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
      
      // Not bilgilerini al
      const note = notes.find(n => n.id === id);
      const noteTitle = note?.title || 'Not';
      
      await updateDoc(doc(db, "notes", id), { 
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: userId
      });
      
      // Not sahibine bildirim gönder
      if (note?.userId) {
        try {
          await sendNotification({
            userId: note.userId,
            title: `Notunuz Onaylandı`,
            message: `"${noteTitle}" başlıklı notunuz onaylandı ve yayınlandı.`,
            type: 'success',
            actionUrl: '/notlar',
            actionText: 'Notlarımı Görüntüle'
          });
        } catch (notifError) {
          console.error('Bildirim gönderme hatası:', notifError);
        }
      }
      
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
      
      // Ev arkadaşı ilanı bilgilerini al
      const roommate = roommates.find(r => r.id === id);
      const roommateName = roommate?.name || 'Ev Arkadaşı İlanı';
      
      await updateDoc(doc(db, "roommates", id), { 
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: userId
      });
      
      // İlan sahibine bildirim gönder
      if (roommate?.userId) {
        try {
          await sendNotification({
            userId: roommate.userId,
            title: `Ev Arkadaşı İlanınız Onaylandı`,
            message: `"${roommateName}" başlıklı ev arkadaşı ilanınız onaylandı ve yayınlandı.`,
            type: 'success',
            actionUrl: '/ev-arkadasi',
            actionText: 'İlanlarımı Görüntüle'
          });
        } catch (notifError) {
          console.error('Bildirim gönderme hatası:', notifError);
        }
      }
      
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
      // İlan bilgilerini al
      const listing = listings.find(l => l.id === id);
      const listingTitle = listing?.title || 'İlan';
      
      await updateDoc(doc(db, "secondhand", id), { 
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: userId
      });
      
      // İlan sahibine bildirim gönder
      if (listing?.userId) {
        try {
          await sendNotification({
            userId: listing.userId,
            title: `İlanınız Onaylandı`,
            message: `"${listingTitle}" başlıklı ilanınız onaylandı ve yayınlandı.`,
            type: 'success',
            actionUrl: '/ikinci-el',
            actionText: 'İlanlarımı Görüntüle'
          });
        } catch (notifError) {
          console.error('Bildirim gönderme hatası:', notifError);
        }
      }
      
      alert("İlan başarıyla onaylandı!");
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

  // Etkinlik premium yapma fonksiyonu
  const handleTogglePremiumEvent = async (id: string, currentPremiumStatus: boolean) => {
    setEventActionLoading(id);
    try {
      await updateDoc(doc(db, "events", id), { 
        isPremium: !currentPremiumStatus,
        premiumAt: !currentPremiumStatus ? new Date() : null,
        premiumBy: !currentPremiumStatus ? userId : null
      });
      
      // Başarı mesajı göster
      alert(!currentPremiumStatus ? "Etkinlik premium yapıldı!" : "Etkinlik premium durumdan çıkarıldı!");
      
      // Events state'ini güncelle
      setEvents(prev => prev.map(event => 
        event.id === id 
          ? { ...event, isPremium: !currentPremiumStatus }
          : event
      ));
    } catch (e) {
      alert("Premium işlemi başarısız: " + e);
    }
    setEventActionLoading(null);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      <div className="container mx-auto px-4 py-8">
      {/* Süper Admin Kontrol Paneli */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-2xl font-bold mb-4">🔐 Süper Admin Kontrol Paneli</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">👤 Mevcut Kullanıcı</h3>
            <p className="text-sm">Email: {user?.email || 'Yükleniyor...'}</p>
            <p className="text-sm">Rol: {profile?.role || 'user'}</p>
            <p className="text-sm">UID: {user?.uid || 'Yükleniyor...'}</p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">⚡ Hızlı İşlemler</h3>
            <button
              onClick={async () => {
                if (!user?.uid) {
                  alert('Kullanıcı bilgisi bulunamadı!');
                  return;
                }
                try {
                  await updateDoc(doc(db, "users", user.uid), {
                    role: 'super_admin',
                    isSuperAdmin: true,
                    permissions: ['all'],
                    roleChangedAt: new Date(),
                    roleChangedBy: 'self'
                  });
                  alert('✅ Süper Admin yetkileri verildi! Sayfayı yenileyin.');
                } catch (e) {
                  alert('❌ Hata: ' + e);
                }
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-semibold"
            >
              🚀 Süper Admin Yap
            </button>
            <button
              onClick={async () => {
                if (!user?.uid) {
                  alert('Kullanıcı bilgisi bulunamadı!');
                  return;
                }
                try {
                  console.log('🧪 Test bildirimi başlatılıyor...');
                  console.log('👤 Mevcut kullanıcı:', user.uid);
                  console.log('🔧 sendNotification fonksiyonu:', typeof sendNotification);
                  
                  // Firebase bağlantısını test et
                  console.log('🔥 Firebase bağlantısı test ediliyor...');
                  const testDoc = await addDoc(collection(db, 'test'), {
                    test: true,
                    timestamp: new Date()
                  });
                  console.log('✅ Firebase bağlantısı başarılı, test doc ID:', testDoc.id);
                  
                  // Test dokümanını sil
                  await deleteDoc(testDoc);
                  console.log('🗑️ Test dokümanı silindi');
                  
                  // Bildirim gönder
                  console.log('📨 Bildirim gönderiliyor...');
                  const notificationData = {
                    userId: user.uid,
                    title: 'Test Bildirimi',
                    message: 'Bu bir test bildirimidir. Bildirim sistemi çalışıyor!',
                    type: 'success' as const,
                    actionUrl: '/admin',
                    actionText: 'Admin Paneli'
                  };
                  
                  console.log('📋 Bildirim verisi:', notificationData);
                  
                  await sendNotification(notificationData);
                  
                  console.log('✅ Test bildirimi tamamlandı!');
                  alert('✅ Test bildirimi gönderildi! Console\'u kontrol edin ve zil ikonuna bakın.');
                } catch (e) {
                  console.error('❌ Test bildirimi hatası:', e);
                  alert('❌ Test bildirimi hatası: ' + e);
                }
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-semibold mt-2"
            >
              🧪 Test Bildirimi Gönder
            </button>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🔧 Sistem Durumu</h3>
            <p className="text-sm">Toplam Kullanıcı: {totalUsers}</p>
            <p className="text-sm">Banlı Kullanıcı: {users.filter(u => u.isBanned).length}</p>
            <p className="text-sm">Admin Sayısı: {totalAdmins}</p>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Kullanıcılar</h2>
          <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Admin: {totalAdmins} | Banlı: {users.filter(u => u.isBanned).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">İlanlar</h2>
          <p className="text-3xl font-bold text-green-600">{totalListings}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Onay Bekleyen: {pendingListings}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Etkinlikler</h2>
          <p className="text-3xl font-bold text-purple-600">{totalEvents}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Onay Bekleyen: {pendingEvents}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Notlar</h2>
          <p className="text-3xl font-bold text-yellow-600">{totalNotes}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Onay Bekleyen: {pendingNotes}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Ev Arkadaşı İlanları</h2>
          <p className="text-3xl font-bold text-indigo-600">{totalRoommates}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Onay Bekleyen: {pendingRoommates}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Yeni Kullanıcılar</h2>
          <p className="text-3xl font-bold text-red-600">{recentUsers}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Son 7 gün</p>
        </div>
      </div>

              {/* Kullanıcılar Tablosu */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">👥 Kullanıcı Yönetimi</h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">İşlem Farkları:</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p><strong>🚫 Banla:</strong> Kullanıcıyı geçici olarak yasaklar, hesap silinmez, sadece giriş yapamaz</p>
                      <p><strong>💀 Kalıcı Sil:</strong> Kullanıcıyı tamamen siler, tüm verileri kaybolur, geri alınamaz!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="border rounded px-3 py-1"
              />
                              <button
                  onClick={() => handleBulkBanUsers()}
                  disabled={selectedUsers.length === 0 || bulkActionLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  title="Seçili kullanıcıları geçici olarak yasakla"
                >
                  🚫 Toplu Banla ({selectedUsers.length})
                </button>
                <button
                  onClick={() => handleBulkUnbanUsers()}
                  disabled={selectedUsers.length === 0 || bulkActionLoading}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  title="Seçili kullanıcıların banını kaldır"
                >
                  🔓 Ban Kaldır ({selectedUsers.length})
                </button>
                <button
                  onClick={() => handleBulkMakeAdmin()}
                  disabled={selectedUsers.length === 0 || bulkActionLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  title="Seçili kullanıcıları admin yap"
                >
                  👑 Admin Yap ({selectedUsers.length})
                </button>
                <button
                  onClick={() => {
                    const confirm = window.confirm(
                      `⚠️ DİKKAT! Bu işlem geri alınamaz!\n\n` +
                      `${selectedUsers.length} kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?\n\n` +
                      `Bu işlem:\n` +
                      `• Tüm kullanıcı hesaplarını tamamen siler\n` +
                      `• Tüm verilerini (ilanlar, notlar, vb.) siler\n` +
                      `• Geri alınamaz!\n\n` +
                      `Banlama yerine silme yapmak istediğinizden emin misiniz?`
                    );
                    if (confirm) {
                      handleBulkDeleteUsers();
                    }
                  }}
                  disabled={selectedUsers.length === 0 || bulkActionLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 font-bold"
                  title="⚠️ KALICI SİLME - Tüm veriler kaybolur!"
                >
                  💀 Kalıcı Sil ({selectedUsers.length})
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
                  <th className="py-2 px-4 text-left">Durum</th>
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
                      <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-800' : user.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {user.isBanned ? (
                        <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                          YASAKLI
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          AKTİF
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-2 px-4 flex gap-2 flex-wrap">
                      {/* Rol Değiştirme */}
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        disabled={actionLoading === user.id}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs disabled:opacity-50 border"
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="moderator">Moderatör</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                                              {/* Ban/Unban - Geçici yasaklama */}
                        <button
                          onClick={() => handleToggleBan(user.id, user.isBanned || false)}
                          disabled={actionLoading === user.id}
                          className={`px-2 py-1 rounded text-xs disabled:opacity-50 ${
                            user.isBanned 
                              ? 'bg-green-500 hover:bg-green-600 text-white' 
                              : 'bg-orange-500 hover:bg-orange-600 text-white'
                          }`}
                          title={user.isBanned ? "Ban kaldır - Kullanıcı tekrar giriş yapabilir" : "Banla - Kullanıcı geçici olarak yasaklanır"}
                        >
                          {user.isBanned ? "🔓 Ban Kaldır" : "🚫 Banla"}
                        </button>
                        
                        {/* Rol Değiştirme */}
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => handleChangeRole(user.id, e.target.value)}
                          disabled={actionLoading === user.id}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs disabled:opacity-50 border"
                          title="Kullanıcı rolünü değiştir"
                        >
                          <option value="user">👤 Kullanıcı</option>
                          <option value="moderator">🛡️ Moderatör</option>
                          <option value="admin">👑 Admin</option>
                          <option value="super_admin">🚀 Süper Admin</option>
                        </select>
                        
                        {/* Kalıcı Silme - DİKKAT! */}
                        <button
                          onClick={() => {
                            const confirm = window.confirm(
                              `⚠️ DİKKAT! Bu işlem geri alınamaz!\n\n` +
                              `"${user.email}" kullanıcısını kalıcı olarak silmek istediğinize emin misiniz?\n\n` +
                              `Bu işlem:\n` +
                              `• Kullanıcı hesabını tamamen siler\n` +
                              `• Tüm verilerini (ilanlar, notlar, vb.) siler\n` +
                              `• Geri alınamaz!\n\n` +
                              `Banlama yerine silme yapmak istediğinizden emin misiniz?`
                            );
                            if (confirm) {
                              handleDelete(user.id);
                            }
                          }}
                          disabled={actionLoading === user.id}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs disabled:opacity-50 font-bold"
                          title="⚠️ KALICI SİLME - Tüm veriler kaybolur!"
                        >
                          💀 Kalıcı Sil
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
                          onClick={() => handleModerateContent('secondhand', listing.id, 'approve')}
                          disabled={listingActionLoading === listing.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Onayla
                        </button>
                      )}
                      {listing.isApproved && (
                        <button
                          onClick={() => {
                            const reason = prompt("Reddetme sebebi:");
                            if (reason !== null) {
                              handleModerateContent('secondhand', listing.id, 'reject', reason);
                            }
                          }}
                          disabled={listingActionLoading === listing.id}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Reddet
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
                  <th className="py-2 px-4 text-left">Premium</th>
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
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${event.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {event.isPremium ? '👑 Premium' : 'Normal'}
                      </span>
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <a href={`/etkinlikler/${event.id}?admin=true`} target="_blank" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">Görüntüle</a>
                      {(event.isApproved !== true) && (
                        <button
                          onClick={() => handleModerateContent('events', event.id, 'approve')}
                          disabled={eventActionLoading === event.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Onayla
                        </button>
                      )}
                      {(event.isApproved === true) && (
                        <button
                          onClick={() => {
                            const reason = prompt("Reddetme sebebi:");
                            if (reason !== null) {
                              handleModerateContent('events', event.id, 'reject', reason);
                            }
                          }}
                          disabled={eventActionLoading === event.id}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Reddet
                        </button>
                      )}
                      <button
                        onClick={() => handleTogglePremiumEvent(event.id, event.isPremium)}
                        disabled={eventActionLoading === event.id}
                        className={`${event.isPremium ? 'bg-gray-500 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-2 py-1 rounded text-xs disabled:opacity-50`}
                      >
                        {event.isPremium ? '👑 Premium İptal' : '👑 Premium Yap'}
                      </button>
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
                          onClick={() => handleModerateContent('notes', note.id, 'approve')}
                          disabled={noteActionLoading === note.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Onayla
                        </button>
                      )}
                      {note.isApproved && (
                        <button
                          onClick={() => {
                            const reason = prompt("Reddetme sebebi:");
                            if (reason !== null) {
                              handleModerateContent('notes', note.id, 'reject', reason);
                            }
                          }}
                          disabled={noteActionLoading === note.id}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Reddet
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
                          onClick={() => handleModerateContent('roommates', roommate.id, 'approve')}
                          disabled={roommateActionLoading === roommate.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Onayla
                        </button>
                      )}
                      {roommate.isApproved && (
                        <button
                          onClick={() => {
                            const reason = prompt("Reddetme sebebi:");
                            if (reason !== null) {
                              handleModerateContent('roommates', roommate.id, 'reject', reason);
                            }
                          }}
                          disabled={roommateActionLoading === roommate.id}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Reddet
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
                  .map((registration) => {
                    console.log('🔍 Admin paneli - Erken erişim kaydı render ediliyor:', registration);
                    return (
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
                );
                })}
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
      </div>
      <Footer />
    </div>
  );
} 