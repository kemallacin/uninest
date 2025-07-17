"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function TutorDetailPage() {
  const { id } = useParams();
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    university: '',
    department: '',
    year: '',
    location: '',
    price: '',
    description: '',
    availability: [] as string[]
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
    const fetchTutor = async () => {
      const ref = doc(db, "tutors", id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const tutorData = { id: snap.id, ...snap.data() } as any;
        setTutor(tutorData);
        setEditForm({
          name: tutorData.name || '',
          email: tutorData.email || '',
          phone: tutorData.phone || '',
          subject: tutorData.subject || '',
          university: tutorData.university || '',
          department: tutorData.department || '',
          year: tutorData.year || '',
          location: tutorData.location || '',
          price: tutorData.price || '',
          description: tutorData.description || '',
          availability: tutorData.availability || []
        });
      }
      setLoading(false);
    };
    fetchTutor();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "tutors", id as string));
    alert("İlan silindi.");
    window.location.href = "/ozel-dersler";
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDoc(doc(db, "tutors", id as string), {
      ...editForm,
      updatedAt: new Date(),
    });
    setShowEditModal(false);
    // Refresh the tutor data
    const ref = doc(db, "tutors", id as string);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setTutor({ id: snap.id, ...snap.data() });
    }
  };

  const handleAvailabilityChange = (day: string) => {
    setEditForm(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (!tutor) return <div>İlan bulunamadı.</div>;

  return (
    <div>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Özel Ders İlan Detayı</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">{tutor.name}</h2>
          <p className="text-gray-700 mb-4">{tutor.description}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Ders: {tutor.subject}</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Üniversite: {tutor.university}</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Bölüm: {tutor.department}</span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">Sınıf: {tutor.year}</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded">Fiyat: {tutor.price} TL</span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded">Konum: {tutor.location}</span>
          </div>

          {tutor.availability && tutor.availability.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Müsait Günler:</h3>
              <div className="flex flex-wrap gap-2">
                {tutor.availability.map((day: string, index: number) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 mb-2">İlan Sahibi: {tutor.userName || tutor.userId}</div>
          <div className="text-sm text-gray-500 mb-4">Oluşturulma: {tutor.createdAt?.seconds ? new Date(tutor.createdAt.seconds * 1000).toLocaleString() : "-"}</div>

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
              <h3 className="text-xl font-bold mb-4">Özel Ders İlanı Düzenle</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ders</label>
                  <select
                    value={editForm.subject}
                    onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Ders Seçin</option>
                    <option value="mathematics">Matematik</option>
                    <option value="physics">Fizik</option>
                    <option value="chemistry">Kimya</option>
                    <option value="biology">Biyoloji</option>
                    <option value="computer">Bilgisayar</option>
                    <option value="english">İngilizce</option>
                    <option value="turkish">Türkçe</option>
                    <option value="history">Tarih</option>
                    <option value="geography">Coğrafya</option>
                    <option value="other">Diğer</option>
                  </select>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf</label>
                    <input
                      type="text"
                      value={editForm.year}
                      onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Müsait Günler</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.availability.includes(day)}
                          onChange={() => handleAvailabilityChange(day)}
                          className="mr-2"
                        />
                        <span className="text-sm">{day}</span>
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