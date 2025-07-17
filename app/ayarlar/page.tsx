"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, User, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const Ayarlar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    console.log('Ayarlar sayfası yükleniyor...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state değişti:', user ? 'Kullanıcı giriş yapmış' : 'Kullanıcı giriş yapmamış');
      setUser(user);
      if (user) {
        setDisplayName(user.displayName || "");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      await updateProfile(user, {
        displayName: displayName
      });

      // Firestore'da da kullanıcı bilgilerini güncelle
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: displayName,
        updatedAt: new Date()
      });

      setMessage({ type: 'success', text: 'Profil bilgileri başarıyla güncellendi!' });
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      setMessage({ type: 'error', text: 'Profil güncellenirken bir hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      // Önce mevcut şifre ile yeniden doğrulama yap
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Şifreyi güncelle
      await updatePassword(user, newPassword);

      setMessage({ type: 'success', text: 'Şifre başarıyla güncellendi!' });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error('Şifre güncellenirken hata:', error);
      setMessage({ type: 'error', text: 'Şifre güncellenirken bir hata oluştu. Mevcut şifrenizi kontrol edin.' });
    } finally {
      setSaving(false);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Giriş Gerekli</h2>
            <p className="text-gray-600 mb-6">Ayarlar sayfasına erişmek için giriş yapmanız gerekiyor.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hesap Ayarları</h1>
            <p className="text-gray-600">Profil bilgilerinizi ve hesap güvenliğinizi yönetin</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Profil Bilgileri */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil Bilgileri
              </h2>
              
              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Kaydediliyor...' : 'Profili Güncelle'}
                  </button>
                </div>
              </form>
            </div>

            {/* Şifre Değiştirme */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Şifre Değiştir
              </h2>
              
              <form onSubmit={handlePasswordUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mevcut Şifre
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Mevcut şifrenizi girin"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Yeni şifrenizi girin"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Yeni şifrenizi tekrar girin"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Hesap Bilgileri */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hesap Bilgileri
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700">Hesap Oluşturulma Tarihi</p>
                <p className="text-gray-600">
                  {user.metadata.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString('tr-TR')
                    : 'Bilinmiyor'
                  }
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Son Giriş</p>
                <p className="text-gray-600">
                  {user.metadata.lastSignInTime 
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('tr-TR')
                    : 'Bilinmiyor'
                  }
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">E-posta Doğrulama</p>
                <p className={`${user.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {user.emailVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Kullanıcı ID</p>
                <p className="text-gray-600 text-xs font-mono">{user.uid}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Ayarlar; 