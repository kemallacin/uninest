"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, where, deleteDoc, doc, getDoc } from "firebase/firestore";
import { HeartIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const Profil = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Array<{
    id: string;
    itemId?: string;
    contentType?: string;
    title?: string;
    price?: number;
    description?: string;
    image?: string;
    category?: string;
    [key: string]: any;
  }>>([]);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Profil sayfası yükleniyor...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state değişti:', user ? 'Kullanıcı giriş yapmış' : 'Kullanıcı giriş yapmamış');
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Favorilerimi çek
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const fetchFavorites = async () => {
      try {
        console.log('Profil sayfasında favoriler yükleniyor...');
        const favRef = collection(db, "users", user.uid, "favorites");
        const favSnap = await getDocs(favRef);
        const favoritesData = favSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<{
          id: string;
          itemId?: string;
          contentType?: string;
          title?: string;
          price?: number;
          description?: string;
          image?: string;
          category?: string;
          [key: string]: any;
        }>;
        
        console.log('Profil sayfasında ham favori verileri:', favoritesData);
        
        // Silinen ilanları kontrol et ve favorilerden temizle
        const validFavorites = [];
        
        for (const fav of favoritesData) {
          console.log('Favori kontrol ediliyor:', fav);
          
          if (fav.contentType === 'roommate' && fav.itemId) {
            // Ev arkadaşı ilanının hala mevcut olup olmadığını kontrol et
            try {
              const roommateRef = doc(db, 'roommates', fav.itemId);
              const roommateSnap = await getDoc(roommateRef);
              
              if (roommateSnap.exists()) {
                validFavorites.push(fav);
                console.log('Geçerli ev arkadaşı favorisi bulundu:', fav.itemId);
              } else {
                // İlan silinmiş, favoriden de sil
                await deleteDoc(doc(db, "users", user.uid, "favorites", fav.id));
                console.log('Silinen ev arkadaşı ilanı favorilerden kaldırıldı:', fav.itemId);
              }
            } catch (error) {
              console.error('Favori kontrol hatası:', error);
              // Hata durumunda favoriyi koru
              validFavorites.push(fav);
            }
          } else if (fav.contentType === 'secondhand' && fav.itemId) {
            // İkinci el ilanının kontrolü
            try {
              const secondhandRef = doc(db, 'secondhand', fav.itemId);
              const secondhandSnap = await getDoc(secondhandRef);
              
              if (secondhandSnap.exists()) {
                validFavorites.push(fav);
                console.log('Geçerli ikinci el favorisi bulundu:', fav.itemId);
              } else {
                await deleteDoc(doc(db, "users", user.uid, "favorites", fav.id));
                console.log('Silinen ikinci el ilanı favorilerden kaldırıldı:', fav.itemId);
              }
            } catch (error) {
              console.error('Favori kontrol hatası:', error);
              validFavorites.push(fav);
            }
          } else if (fav.contentType === 'event' && fav.itemId) {
            // Etkinlik kontrolü
            try {
              const eventRef = doc(db, 'events', fav.itemId);
              const eventSnap = await getDoc(eventRef);
              
              if (eventSnap.exists()) {
                validFavorites.push(fav);
                console.log('Geçerli etkinlik favorisi bulundu:', fav.itemId);
              } else {
                await deleteDoc(doc(db, "users", user.uid, "favorites", fav.id));
                console.log('Silinen etkinlik favorilerden kaldırıldı:', fav.itemId);
              }
            } catch (error) {
              console.error('Favori kontrol hatası:', error);
              validFavorites.push(fav);
            }
          } else if (fav.contentType === 'tutor' && fav.itemId) {
            // Özel ders kontrolü
            try {
              const tutorRef = doc(db, 'tutors', fav.itemId);
              const tutorSnap = await getDoc(tutorRef);
              
              if (tutorSnap.exists()) {
                validFavorites.push(fav);
                console.log('Geçerli özel ders favorisi bulundu:', fav.itemId);
              } else {
                // Tutors koleksiyonunda yoksa students'ta kontrol et
                const studentRef = doc(db, 'students', fav.itemId);
                const studentSnap = await getDoc(studentRef);
                
                if (studentSnap.exists()) {
                  validFavorites.push(fav);
                  console.log('Geçerli öğrenci favorisi bulundu:', fav.itemId);
                } else {
                  await deleteDoc(doc(db, "users", user.uid, "favorites", fav.id));
                  console.log('Silinen özel ders favorilerden kaldırıldı:', fav.itemId);
                }
              }
            } catch (error) {
              console.error('Favori kontrol hatası:', error);
              validFavorites.push(fav);
            }
          } else if (fav.contentType === 'note' && fav.itemId) {
            // Not kontrolü
            try {
              const noteRef = doc(db, 'notes', fav.itemId);
              const noteSnap = await getDoc(noteRef);
              
              if (noteSnap.exists()) {
                validFavorites.push(fav);
                console.log('Geçerli not favorisi bulundu:', fav.itemId);
              } else {
                await deleteDoc(doc(db, "users", user.uid, "favorites", fav.id));
                console.log('Silinen not favorilerden kaldırıldı:', fav.itemId);
              }
            } catch (error) {
              console.error('Favori kontrol hatası:', error);
              validFavorites.push(fav);
            }
          } else if (fav.contentType && fav.contentType !== 'roommate' && fav.contentType !== 'secondhand' && fav.contentType !== 'event' && fav.contentType !== 'tutor' && fav.contentType !== 'note') {
            // Diğer içerik türleri için normal işlem
            validFavorites.push(fav);
            console.log('Diğer içerik türü favorisi:', fav.contentType);
          } else {
            console.log('ContentType olmayan veya geçersiz favori atlandı:', fav);
          }
        }
        
        console.log('Profil sayfasında geçerli favoriler:', validFavorites);
        setFavorites(validFavorites);
      } catch (error) {
        console.error('Favoriler yüklenirken hata:', error);
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [user]);

  // Kendi ilanlarımı çek
  useEffect(() => {
    if (!user) {
      setMyItems([]);
      return;
    }
    const fetchMyItems = async () => {
      try {
        console.log('Kendi ilanlarım yükleniyor...');
        const allMyItems = [];
        
        // İkinci el ilanları
        const secondhandRef = collection(db, "secondhand");
        const secondhandQuery = query(secondhandRef, where("userId", "==", user.uid));
        const secondhandSnap = await getDocs(secondhandQuery);
        const secondhandItems = secondhandSnap.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(),
          contentType: 'secondhand',
          displayTitle: doc.data().urun_adi || doc.data().title || 'İkinci El İlanı',
          displayPrice: doc.data().satis_fiyati || doc.data().price || 0,
          displayCategory: 'İkinci El'
        }));
        allMyItems.push(...secondhandItems);
        console.log('İkinci el ilanları:', secondhandItems.length);
        
        // Etkinlikler
        const eventsRef = collection(db, "events");
        const eventsQuery = query(eventsRef, where("createdBy", "==", user.uid));
        const eventsSnap = await getDocs(eventsQuery);
        const eventItems = eventsSnap.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(),
          contentType: 'event',
          displayTitle: doc.data().title || 'Etkinlik',
          displayPrice: doc.data().price || 0,
          displayCategory: 'Etkinlik',
          displayDescription: doc.data().description || 'Açıklama yok'
        }));
        allMyItems.push(...eventItems);
        console.log('Etkinlikler:', eventItems.length);
        
        // Ev arkadaşı ilanları
        const roommatesRef = collection(db, "roommates");
        const roommatesQuery = query(roommatesRef, where("userId", "==", user.uid));
        const roommatesSnap = await getDocs(roommatesQuery);
        const roommateItems = roommatesSnap.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(),
          contentType: 'roommate',
          displayTitle: doc.data().title || doc.data().baslik || 'Ev Arkadaşı İlanı',
          displayPrice: doc.data().kira || doc.data().price || 0,
          displayCategory: 'Ev Arkadaşı'
        }));
        allMyItems.push(...roommateItems);
        console.log('Ev arkadaşı ilanları:', roommateItems.length);
        
        // Özel ders ilanları
        const tutorsRef = collection(db, "tutors");
        const tutorsQuery = query(tutorsRef, where("userId", "==", user.uid));
        const tutorsSnap = await getDocs(tutorsQuery);
        const tutorItems = tutorsSnap.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(),
          contentType: 'tutor',
          displayTitle: doc.data().ders_adi || doc.data().title || 'Özel Ders',
          displayPrice: doc.data().ucret || doc.data().price || 0,
          displayCategory: 'Özel Ders'
        }));
        allMyItems.push(...tutorItems);
        console.log('Özel ders ilanları:', tutorItems.length);
        
        // Notlar
        const notesRef = collection(db, "notes");
        const notesQuery = query(notesRef, where("userId", "==", user.uid));
        const notesSnap = await getDocs(notesQuery);
        const noteItems = notesSnap.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(),
          contentType: 'note',
          displayTitle: doc.data().title || doc.data().baslik || 'Not',
          displayPrice: doc.data().fiyat || doc.data().price || 0,
          displayCategory: 'Not'
        }));
        allMyItems.push(...noteItems);
        console.log('Notlar:', noteItems.length);
        
        console.log('Toplam ilan sayısı:', allMyItems.length);
        setMyItems(allMyItems);
      } catch (error) {
        console.error('İlanlar yüklenirken hata:', error);
        setMyItems([]);
      }
    };
    fetchMyItems();
  }, [user]);

  const removeFromFavorites = async (itemId: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, "users", user.uid, "favorites", itemId));
      setFavorites(favorites.filter(fav => fav.id !== itemId));
    } catch (error) {
      console.error("Favoriden çıkarılırken hata:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Giriş Gerekli</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Profil sayfasını görmek için giriş yapmanız gerekiyor.</p>
            <a
              href="/giris"
              className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Giriş Yap
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Kullanıcı Bilgileri */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{user.displayName || 'Kullanıcı'}</h1>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Üye olma tarihi: {user.metadata.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString('tr-TR')
                    : 'Bilinmiyor'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Favorilerim */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <HeartIcon className="w-5 h-5 mr-2 text-red-500" />
                Favorilerim ({favorites.length})
              </h2>
              
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <HeartIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Henüz favori ürününüz yok.</p>
                  <a
                    href="/ikinci-el"
                    className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  >
                    Ürünlere Göz At
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center gap-4">
                        <img 
                          src={fav.image || '/placeholder-image.jpg'} 
                          alt={fav.title} 
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-white">{fav.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{fav.description}</p>
                          <p className="text-purple-600 dark:text-purple-400 font-bold">
                            {fav.contentType === 'event' ? `${fav.price} TL` :
                             fav.contentType === 'note' ? `${fav.price}` :
                             fav.contentType === 'roommate' ? `${fav.price} TL` :
                             fav.contentType === 'tutor' ? `${fav.price} TL` :
                             `${fav.price?.toLocaleString()} TL`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {fav.contentType === 'event' ? 'Etkinlik' :
                             fav.contentType === 'note' ? 'Not' :
                             fav.contentType === 'roommate' ? 'Ev Arkadaşı' :
                             fav.contentType === 'tutor' ? 'Özel Ders' :
                             fav.category || 'İkinci El'}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => removeFromFavorites(fav.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Favoriden çıkar"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          <a
                            href={fav.contentType === 'event' ? `/etkinlikler/${fav.id}` :
                                  fav.contentType === 'note' ? `/notlar/${fav.id}` :
                                  fav.contentType === 'roommate' ? `/ev-arkadasi/${fav.id}` :
                                  fav.contentType === 'tutor' ? `/ozel-dersler/${fav.id}` :
                                  `/ikinci-el/${fav.id}`}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="İçeriği görüntüle"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* İlanlarım */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                İlanlarım ({myItems.length})
              </h2>
              
              {myItems.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Henüz ilanınız yok.</p>
                  <a
                    href="/ikinci-el"
                    className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300"
                  >
                    İlan Ver
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {myItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.imageUrl || item.urun_fotograf || item.image || '/placeholder-image.jpg'} 
                          alt={item.displayTitle} 
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-white">{item.displayTitle}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{item.displayDescription || item.description || item.aciklama || 'Açıklama yok'}</p>
                          <p className="text-green-600 dark:text-green-400 font-bold">
                            {item.displayPrice?.toLocaleString()} TL
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.displayCategory}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {item.createdAt?.toDate ? 
                              item.createdAt.toDate().toLocaleDateString('tr-TR') : 
                              item.createdAt ? 
                                new Date(item.createdAt).toLocaleDateString('tr-TR') :
                                'Tarih bilgisi yok'
                            }
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <a
                            href={item.contentType === 'event' ? `/etkinlikler/${item.id}` :
                                  item.contentType === 'note' ? `/notlar/${item.id}` :
                                  item.contentType === 'roommate' ? `/ev-arkadasi/${item.id}` :
                                  item.contentType === 'tutor' ? `/ozel-dersler/${item.id}` :
                                  `/ikinci-el/${item.id}`}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="İlanı düzenle"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </a>
                          <a
                            href={item.contentType === 'event' ? `/etkinlikler/${item.id}` :
                                  item.contentType === 'note' ? `/notlar/${item.id}` :
                                  item.contentType === 'roommate' ? `/ev-arkadasi/${item.id}` :
                                  item.contentType === 'tutor' ? `/ozel-dersler/${item.id}` :
                                  `/ikinci-el/${item.id}`}
                            className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="İlanı görüntüle"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profil; 