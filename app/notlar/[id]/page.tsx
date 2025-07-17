"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function NoteDetailPage() {
  const { id } = useParams();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    subject: '',
    description: '',
    university: '',
    downloadUrl: ''
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
    const fetchNote = async () => {
      const ref = doc(db, "notes", id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const noteData = { id: snap.id, ...snap.data() } as any;
        setNote(noteData);
        setEditForm({
          title: noteData.title || '',
          subject: noteData.subject || '',
          description: noteData.description || '',
          university: noteData.university || '',
          downloadUrl: noteData.downloadUrl || ''
        });
        
        // Kullanıcının not sahibi olup olmadığını kontrol et
        if (user && noteData.uploadedBy === user.uid) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      }
      setLoading(false);
    };
    fetchNote();
  }, [id, user]);

  const handleDelete = async () => {
    if (!user) {
      alert("Not silmek için giriş yapmalısınız.");
      return;
    }
    
    if (!isOwner && !isAdmin) {
      alert("Sadece kendi notlarınızı silebilirsiniz.");
      return;
    }
    
    if (!window.confirm("Bu notu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    
    try {
      await deleteDoc(doc(db, "notes", id as string));
      alert("Not silindi.");
      window.location.href = "/notlar";
    } catch (error) {
      console.error("Not silme hatası:", error);
      alert("Not silinirken bir hata oluştu.");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDoc(doc(db, "notes", id as string), {
      ...editForm,
      updatedAt: new Date(),
    });
    setShowEditModal(false);
    // Refresh the note data
    const ref = doc(db, "notes", id as string);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setNote({ id: snap.id, ...snap.data() });
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (!note) return <div>Not bulunamadı.</div>;

  return (
    <div>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Not Detayı</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
          <p className="text-gray-700 mb-4">{note.description}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Ders: {note.subject}</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Üniversite: {note.university}</span>
            {note.fileName && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Dosya: {note.fileName}</span>
            )}
          </div>
          <div className="text-sm text-gray-500 mb-2">Yükleyen: {note.userName || note.userId}</div>
          <div className="text-sm text-gray-500 mb-4">Oluşturulma: {note.createdAt?.seconds ? new Date(note.createdAt.seconds * 1000).toLocaleString() : "-"}</div>

          {note.downloadUrl && (
            <div className="mb-4">
              <a
                href={note.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow inline-block"
              >
                Notu İndir
              </a>
            </div>
          )}

          {(isAdmin || isOwner) && (
            <div className="flex gap-4 mt-4">
              {isAdmin && (
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
                  onClick={() => setShowEditModal(true)}
                >
                  Düzenle
                </button>
              )}
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
              <h3 className="text-xl font-bold mb-4">Not Düzenle</h3>
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
                    <option value="engineering">Mühendislik</option>
                    <option value="business">İşletme</option>
                    <option value="economics">Ekonomi</option>
                    <option value="law">Hukuk</option>
                    <option value="medicine">Tıp</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">İndirme URL</label>
                  <input
                    type="url"
                    value={editForm.downloadUrl}
                    onChange={(e) => setEditForm({...editForm, downloadUrl: e.target.value})}
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