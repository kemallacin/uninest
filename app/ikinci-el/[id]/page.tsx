"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import SecondHandForm from "../../../components/SecondHandForm";
import { updateDoc, deleteDoc } from "firebase/firestore";

export default function SecondHandDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
    const fetchItem = async () => {
      const ref = doc(db, "secondhand", id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setItem({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };
    fetchItem();
  }, [id, showEditModal]);

  const handleDelete = async () => {
    if (!window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "secondhand", id as string));
    alert("İlan silindi.");
    window.location.href = "/ikinci-el";
  };

  const handleEdit = async (formData: any) => {
    await updateDoc(doc(db, "secondhand", id as string), {
      ...formData,
      updatedAt: new Date(),
    });
    setShowEditModal(false);
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (!item) return <div>İlan bulunamadı.</div>;

  return (
    <div>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">İlan Detayı</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          {/* Resim Galerisi */}
          <div className="mb-6">
            {item.images && item.images.length > 0 ? (
              <div className="relative">
                <img 
                  src={item.images[0]} 
                  alt={item.title} 
                  className="w-full h-64 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkVGMkYyIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iI0Y1NjU2NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlJlc2ltIFnDvGtsZW5lbWVkaTwvdGV4dD4KPC9zdmc+';
                  }}
                />
                {item.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {item.images.length} Fotoğraf
                  </div>
                )}
              </div>
            ) : item.image ? (
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-64 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkVGMkYyIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iI0Y1NjU2NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlJlc2ltIFnDvGtsZW5lbWVkaTwvdGV4dD4KPC9zdmc+';
                }}
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">Resim Yok</span>
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
          <p className="text-gray-700 mb-4">{item.description}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Fiyat: {item.price} TL</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Kategori: {item.category}</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">Durum: {item.condition}</span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">Konum: {item.location}</span>
          </div>
          <div className="text-sm text-gray-500 mb-2">İlan Sahibi: {item.userName || item.userId}</div>
          <div className="text-sm text-gray-500 mb-4">Oluşturulma: {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleString() : "-"}</div>

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
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
              <SecondHandForm
                initialValues={item}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEdit}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 