"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { collection, getDocs } from "firebase/firestore";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    price: '',
    maxAttendees: '',
    description: '',
    organizer: '',
    organizerEmail: '',
    image: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      console.log('🔍 Etkinlik detay - ID ile aranıyor:', id);
      const ref = doc(db, "events", id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const eventData = { id: snap.id, ...snap.data() } as any;
        console.log('✅ Etkinlik bulundu:', eventData);
        setEvent(eventData);
        setEditForm({
          title: eventData.title || '',
          category: eventData.category || '',
          date: eventData.date || '',
          time: eventData.time || '',
          location: eventData.location || '',
          price: eventData.price || '',
          maxAttendees: eventData.maxAttendees || '',
          description: eventData.description || '',
          organizer: eventData.organizer || '',
          organizerEmail: eventData.organizerEmail || '',
          image: eventData.image || ''
        });
      } else {
        console.error('❌ Etkinlik bulunamadı! ID:', id);
        console.log('🔍 Kontrol edilecek şeyler:');
        console.log('- ID doğru mu?', id);
        console.log('- Firebase bağlantısı çalışıyor mu?');
        console.log('- Etkinlik gerçekten bu ID ile var mı?');
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
    
    try {
      // First delete the event
      await deleteDoc(doc(db, "events", id as string));
      
      // Then find and delete all favorite entries for this event
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const deleteFavoritePromises = usersSnapshot.docs.map(async (userDoc) => {
        const favoriteRef = doc(db, 'users', userDoc.id, 'favorites', id as string);
        try {
          await deleteDoc(favoriteRef);
        } catch (error) {
          // Ignore if favorite doesn't exist
          console.log(`No favorite found for user ${userDoc.id} and event ${id}`);
        }
      });

      await Promise.all(deleteFavoritePromises);
      
      alert("Etkinlik silindi.");
      window.location.href = "/etkinlikler";
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Etkinlik silinirken bir hata oluştu.");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDoc(doc(db, "events", id as string), {
      ...editForm,
      updatedAt: new Date(),
    });
    setShowEditModal(false);
    // Refresh the event data
    const ref = doc(db, "events", id as string);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setEvent({ id: snap.id, ...snap.data() });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Etkinlik yükleniyor...</p>
      </div>
    </div>
  );
  
  if (!event) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Etkinlik bulunamadı!</h2>
        <p className="text-gray-600 mb-4">ID: {id}</p>
        <p className="text-gray-500 mb-6">Bu etkinlik silinmiş olabilir.</p>
        <a 
          href="/etkinlikler" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Etkinliklere Geri Dön
        </a>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Etkinlik Detayı</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          {event.image && (
            <Image 
              src={event.image} 
              alt={event.title} 
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded mb-6"
              priority={true}
              quality={85}
            />
          )}
          <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
          <p className="text-gray-700 mb-4">{event.description}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Kategori: {event.category}</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Tarih: {event.date}</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Saat: {event.time}</span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">Konum: {event.location}</span>
            {event.price && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded">Fiyat: {event.price} TL</span>
            )}
            {event.maxAttendees && (
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded">Maksimum Katılımcı: {event.maxAttendees}</span>
            )}
          </div>
          <div className="text-sm text-gray-500 mb-2">Organizatör: {event.organizer}</div>
          <div className="text-sm text-gray-500 mb-4">Oluşturulma: {event.createdAt?.seconds ? new Date(event.createdAt.seconds * 1000).toLocaleString() : "-"}</div>

          {isAdmin && (
            <div className="flex gap-4 mt-4">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
                onClick={() => setShowEditModal(true)}
              >
                Düzenle
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                onClick={handleDelete}
              >
                Sil
              </button>
            </div>
          )}
        </div>

        {isAdmin && showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4">Etkinlik Düzenle</h3>
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    <option value="academic">Akademik</option>
                    <option value="social">Sosyal</option>
                    <option value="sports">Spor</option>
                    <option value="cultural">Kültürel</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
                    <input
                      type="time"
                      value={editForm.time}
                      onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL)</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maksimum Katılımcı</label>
                    <input
                      type="number"
                      value={editForm.maxAttendees}
                      onChange={(e) => setEditForm({...editForm, maxAttendees: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizatör</label>
                  <input
                    type="text"
                    value={editForm.organizer}
                    onChange={(e) => setEditForm({...editForm, organizer: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizatör Email</label>
                  <input
                    type="email"
                    value={editForm.organizerEmail}
                    onChange={(e) => setEditForm({...editForm, organizerEmail: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resim URL</label>
                  <input
                    type="url"
                    value={editForm.image}
                    onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                  >
                    Güncelle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 