"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, User, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";

import { useAuth } from "../../lib/auth/AuthContext";
import { useTheme } from "../../components/ThemeProvider";
import { ShieldCheckIcon, UserIcon, KeyIcon, EyeIcon, EyeSlashIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Ayarlar = () => {
  const { user } = useAuth();
  const { theme, setTheme, mounted } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnlineStatus: true
  });

  useEffect(() => {
    console.log('Ayarlar sayfası yükleniyor...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state değişti:', user ? 'Kullanıcı giriş yapmış' : 'Kullanıcı giriş yapmamış');
      if (user) {
        setDisplayName(user.displayName || "");
        loadUserSettings(user.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserSettings = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data?.privacySettings) {
          setPrivacySettings(data.privacySettings);
        }
      }
    } catch (error) {
      console.error('Kullanıcı ayarları yüklenirken hata:', error);
    }
  };

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

  const handlePrivacyUpdate = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        privacySettings: privacySettings,
        updatedAt: new Date()
      });

      setMessage({ type: 'success', text: 'Gizlilik ayarları başarıyla güncellendi!' });
    } catch (error) {
      console.error('Gizlilik ayarları güncellenirken hata:', error);
      setMessage({ type: 'error', text: 'Gizlilik ayarları güncellenirken bir hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Yükleniyor...</p>
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
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Giriş Gerekli</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Ayarlar sayfasına erişmek için giriş yapmanız gerekiyor.</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Hesap Ayarları</h1>
            <p className="text-gray-600 dark:text-gray-300">Profil bilgilerinizi, güvenlik ayarlarınızı ve tercihlerinizi yönetin</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 dark:bg-green-900/20 border border-green-400 text-green-700 dark:text-green-300' 
                : 'bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profil Bilgileri */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-purple-500" />
                Profil Bilgileri
              </h2>
              
              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">E-posta adresi değiştirilemez</p>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <KeyIcon className="w-5 h-5 mr-2 text-purple-500" />
                Şifre Değiştir
              </h2>
              
              <form onSubmit={handlePasswordUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mevcut Şifre
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Mevcut şifrenizi girin"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Yeni Şifre
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Yeni şifrenizi girin"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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



            {/* Gizlilik Ayarları */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-purple-500" />
                Gizlilik Ayarları
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.profileVisible}
                    onChange={(e) => setPrivacySettings({...privacySettings, profileVisible: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Profilimi herkese açık göster</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.showEmail}
                    onChange={(e) => setPrivacySettings({...privacySettings, showEmail: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">E-posta adresimi göster</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.showPhone}
                    onChange={(e) => setPrivacySettings({...privacySettings, showPhone: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Telefon numaramı göster</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.allowMessages}
                    onChange={(e) => setPrivacySettings({...privacySettings, allowMessages: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Mesaj almaya izin ver</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.showOnlineStatus}
                    onChange={(e) => setPrivacySettings({...privacySettings, showOnlineStatus: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Çevrimiçi durumumu göster</span>
                </label>
                
                <button
                  onClick={handlePrivacyUpdate}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Kaydediliyor...' : 'Gizlilik Ayarlarını Kaydet'}
                </button>
              </div>
            </div>

            {/* Tema Ayarları */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <SunIcon className="w-5 h-5 mr-2 text-yellow-500" />
                Tema Ayarları
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Uygulama temasını değiştirerek görünümünüzü kişiselleştirin.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      disabled={!mounted}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                        theme === 'light' 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                      }`}
                    >
                      <SunIcon className={`w-8 h-8 ${theme === 'light' ? 'text-purple-600' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${theme === 'light' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        Açık Tema
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setTheme('dark')}
                      disabled={!mounted}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                        theme === 'dark' 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                      }`}
                    >
                      <MoonIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-600' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        Koyu Tema
                      </span>
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Mevcut Tema</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {theme === 'light' ? 'Açık tema aktif' : 'Koyu tema aktif'}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${theme === 'light' ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                  </div>
                </div>
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