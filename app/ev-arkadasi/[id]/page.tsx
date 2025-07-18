"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function RoommateDetailPage() {
  const { id } = useParams();
  const [roommate, setRoommate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    age: '',
    university: '',
    department: '',
    location: '',
    price: '',
    roomType: '',
    availableFrom: '',
    description: '',
    gender: '',
    smoking: false,
    pets: false,
    interests: [] as string[],
    type: 'seeking'
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
    const fetchRoommate = async () => {
      const ref = doc(db, "roommates", id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const roommateData = { id: snap.id, ...snap.data() } as any;
        setRoommate(roommateData);
        setEditForm({
          name: roommateData.name || '',
          age: roommateData.age || '',
          university: roommateData.university || '',
          department: roommateData.department || '',
          location: roommateData.location || '',
          price: roommateData.price || '',
          roomType: roommateData.roomType || '',
          availableFrom: roommateData.availableFrom || '',
          description: roommateData.description || '',
          gender: roommateData.gender || '',
          smoking: roommateData.smoking || false,
          pets: roommateData.pets || false,
          interests: roommateData.interests || [],
          type: roommateData.type || 'seeking'
        });
      }
      setLoading(false);
    };
    fetchRoommate();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "roommates", id as string));
    alert("İlan silindi.");
    window.location.href = "/ev-arkadasi";
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDoc(doc(db, "roommates", id as string), {
      ...editForm,
      updatedAt: new Date(),
    });
    setShowEditModal(false);
    // Refresh the roommate data
    const ref = doc(db, "roommates", id as string);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setRoommate({ id: snap.id, ...snap.data() });
    }
  };

  const handleInterestChange = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (!roommate) return <div>İlan bulunamadı.</div>;

  return (
    <div>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Ev Arkadaşı İlan Detayı</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          {roommate.image && (
            <Image 
              src={roommate.image} 
              alt={roommate.name} 
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded mb-6"
              priority={true}
              quality={85}
            />
          )}
          <h2 className="text-xl font-semibold mb-2">{roommate.name}</h2>
          <p className="text-gray-700 mb-4">{roommate.description}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Yaş: {roommate.age}</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Üniversite: {roommate.university}</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Bölüm: {roommate.department}</span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">Konum: {roommate.location}</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded">Fiyat: {roommate.price} TL</span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded">Oda Tipi: {roommate.roomType}</span>
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded">Cinsiyet: {roommate.gender}</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded">Müsaitlik: {roommate.availableFrom}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded ${roommate.smoking ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {roommate.smoking ? 'Sigara İçiyor' : 'Sigara İçmiyor'}
            </span>
            <span className={`px-3 py-1 rounded ${roommate.pets ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {roommate.pets ? 'Evcil Hayvan Var' : 'Evcil Hayvan Yok'}
            </span>
          </div>

          {roommate.interests && roommate.interests.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">İlgi Alanları:</h3>
              <div className="flex flex-wrap gap-2">
                {roommate.interests.map((interest: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 mb-2">İlan Sahibi: {roommate.userName || roommate.userId}</div>
          <div className="text-sm text-gray-500 mb-4">Oluşturulma: {roommate.createdAt?.seconds ? new Date(roommate.createdAt.seconds * 1000).toLocaleString() : "-"}</div>

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
              <h3 className="text-xl font-bold mb-4">Ev Arkadaşı İlanı Düzenle</h3>
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İsim</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yaş</label>
                    <input
                      type="number"
                      value={editForm.age}
                      onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet</label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Seçin</option>
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Üniversite</label>
                  <input
                    type="text"
                    value={editForm.university}
                    onChange={(e) => setEditForm({...editForm, university: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bölüm</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
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
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Oda Tipi</label>
                    <select
                      value={editForm.roomType}
                      onChange={(e) => setEditForm({...editForm, roomType: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Seçin</option>
                      <option value="Tek kişilik oda">Tek kişilik oda</option>
                      <option value="Paylaşımlı oda">Paylaşımlı oda</option>
                      <option value="Stüdyo daire">Stüdyo daire</option>
                      <option value="2+1 daire">2+1 daire</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Müsaitlik Tarihi</label>
                  <input
                    type="date"
                    value={editForm.availableFrom}
                    onChange={(e) => setEditForm({...editForm, availableFrom: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
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
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.smoking}
                      onChange={(e) => setEditForm({...editForm, smoking: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Sigara İçiyor</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.pets}
                      onChange={(e) => setEditForm({...editForm, pets: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Evcil Hayvan Var</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İlgi Alanları</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Teknoloji', 'Spor', 'Müzik', 'Kitap okuma', 'Yoga', 'Seyahat', 'Fitness', 'Sanat'].map((interest) => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                          className="mr-2"
                        />
                        <span className="text-sm">{interest}</span>
                      </label>
                    ))}
                  </div>
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