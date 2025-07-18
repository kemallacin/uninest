'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { useNotifications } from '../../components/SimpleNotificationSystem';
import { SimpleNotificationBell } from '../../components/SimpleNotificationSystem';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../components/ThemeProvider';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function TestClient() {
  const { user, profile, loading } = useAuth();
  const { notifications, sendNotification, deleteNotification, markAsRead } = useNotifications();
  const { theme, toggleTheme, mounted } = useTheme();
  const [testResult, setTestResult] = useState<string>('');
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [manualNotifications, setManualNotifications] = useState<any[]>([]);

  // Firebase Auth'u direkt dinle
  useEffect(() => {
    console.log('🔥 Test sayfası - Firebase Auth dinleniyor...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Test sayfası - Firebase Auth değişti:', user ? `Giriş yapıldı (${user.uid})` : 'Çıkış yapıldı');
      setFirebaseUser(user);
    });
    return unsubscribe();
  }, []);

  // Manuel bildirim sorgusu
  useEffect(() => {
    if (!firebaseUser?.uid) return;

    console.log('🔍 Manual bildirim sorgusu başlatılıyor, user ID:', firebaseUser.uid);
    
    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', firebaseUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        console.log('📊 Manual sorgu sonucu:', querySnapshot.docs.length, 'bildirim bulundu');
        
        const notifs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        notifs.forEach((notif: any, index) => {
          console.log(`📋 Manual bildirim ${index + 1}:`, {
            id: notif.id,
            title: notif.title,
            message: notif.message,
            userId: notif.userId,
            createdAt: notif.createdAt,
            read: notif.read
          });
        });
        
        setManualNotifications(notifs);
      } catch (error) {
        console.error('❌ Manual sorgu hatası:', error);
      }
    };
    
    fetchNotifications();
  }, [firebaseUser]);

  const runTest = async () => {
    setTestResult('Test başlatılıyor...');
    
    try {
      console.log('🧪 Test başlatılıyor...');
      
      if (!firebaseUser) {
        setTestResult('❌ Kullanıcı giriş yapmamış!');
        return;
      }

      console.log('📤 Test bildirimi gönderiliyor...');
      
      await sendNotification({
        userId: firebaseUser.uid,
        title: 'Test Bildirimi',
        message: `Bu bir test bildirimidir - ${new Date().toLocaleTimeString()}`,
        type: 'success'
      });
      
      setTestResult('✅ Test bildirimi gönderildi!');
    } catch (error) {
      console.error('❌ Test hatası:', error);
      setTestResult('❌ Test hatası: ' + error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setTestResult('✅ Bildirim silindi!');
    } catch (error) {
      setTestResult('❌ Bildirim silme hatası: ' + error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setTestResult('✅ Bildirim okundu olarak işaretlendi!');
    } catch (error) {
      setTestResult('❌ Bildirim güncelleme hatası: ' + error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <h1 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Test Sayfası</h1>
        
        <div className="space-y-2 text-sm">
          <div><strong>Mevcut Tema:</strong> {mounted ? (theme === 'light' ? '🌞 Açık Tema' : '🌙 Karanlık Tema') : '🔄 Yükleniyor...'}</div>
          <div><strong>SimpleNotificationProvider Bildirimleri:</strong></div>
          <div>Toplam Bildirim: {notifications.length}</div>
          <div>Okunmamış: {notifications.filter(n => !n.read).length}</div>
          
          <div className="mt-4"><strong>Manuel Sorgu:</strong></div>
          <div>Manuel Bildirim: {manualNotifications.length}</div>
          
          {manualNotifications.length > 0 && (
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              🔄 Manuel Yenile
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">🎨 Tema Testi</h2>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {mounted && (
            <button 
              onClick={toggleTheme}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              {theme === 'light' ? '🌙 Karanlık Temaya Geç' : '🌞 Açık Temaya Geç'}
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">🧪 Test İşlemleri</h2>
        <div className="space-x-2">
          <button 
            onClick={runTest}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            📨 Test Bildirimi Gönder
          </button>
          
          {notifications.length > 0 && (
            <>
              <button 
                onClick={() => handleMarkAsRead(notifications[0].id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ✅ İlk Bildirimi Okundu İşaretle
              </button>
              
              <button 
                onClick={() => handleDeleteNotification(notifications[0].id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                🗑️ İlk Bildirimi Sil
              </button>
            </>
          )}
        </div>
        
        <div className="mt-2 dark:text-gray-300">
          <strong>Test Sonucu:</strong> {testResult || 'Test henüz çalıştırılmadı'}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">📱 SimpleNotificationProvider Bildirimleri</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Henüz bildirim yok</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif, index) => (
              <div key={notif.id} className={`p-3 border rounded ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="dark:text-white"><strong>#{index + 1}</strong> - {notif.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{notif.message}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Read: {notif.read ? 'Okundu' : 'Okunmadı'} | 
                      ID: {notif.id}
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                        title="Okundu olarak işaretle"
                      >
                        ✅
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      title="Bildirimi sil"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">📋 Manuel Sorgu Bildirimleri</h2>
        {manualNotifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Henüz bildirim yok</p>
        ) : (
          <div className="space-y-2">
            {manualNotifications.map((notif, index) => (
              <div key={notif.id} className="p-3 border rounded bg-green-50 dark:bg-green-900/20">
                <div className="dark:text-white"><strong>#{index + 1}</strong> - {notif.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{notif.message}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Read: {notif.read ? 'Okundu' : 'Okunmadı'} | 
                  ID: {notif.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">🔔 Bildirim Zili:</h2>
        <SimpleNotificationBell />
      </div>
    </div>
  );
} 