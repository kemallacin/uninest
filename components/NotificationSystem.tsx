'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDoc, writeBatch, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BellIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Bildirim türleri
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

// Bildirim arayüzü
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: any;
  actionUrl?: string;
  actionText?: string;
  expiresAt?: any;
}

// Kullanıcı bildirim tercihleri
interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  eventReminders: boolean;
  marketplaceUpdates: boolean;
  roomateMessages: boolean;
}

// Context
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  sendNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<any>;
  preferences: NotificationPreferences;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Provider Component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    inApp: true,
    eventReminders: true,
    marketplaceUpdates: true,
    roomateMessages: true
  });

  console.log('🚀 NotificationProvider - Component başlatılıyor...');

  // Firebase Auth dinle - Basitleştirilmiş
  useEffect(() => {
    console.log('🔥 NotificationSystem - Firebase Auth listener başlatılıyor...');
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔥 NotificationSystem - Firebase Auth değişti:', currentUser ? 'Giriş yapıldı' : 'Çıkış yapıldı');
      if (currentUser) {
        console.log('🔥 NotificationSystem - User ID:', currentUser.uid);
        console.log('🔥 NotificationSystem - Email:', currentUser.email);
      }
      setFirebaseUser(currentUser);
    });

    return unsubscribe;
  }, []);

  // Bildirimleri dinle - Basitleştirilmiş
  useEffect(() => {
    if (!firebaseUser?.uid) {
      console.log('🔕 NotificationSystem - Kullanıcı giriş yapmamış, bildirimler temizleniyor');
      setNotifications([]);
      return;
    }

    console.log('🔔 NotificationSystem - Bildirimler dinleniyor, kullanıcı ID:', firebaseUser.uid);
    
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', firebaseUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('📨 NotificationSystem - Yeni bildirimler alındı, sayı:', snapshot.docs.length);
      
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
      
      console.log('📮 İşlenmiş bildirimler:', notifs.length, 'adet');
      console.log('📮 Okunmamış bildirimler:', notifs.filter(n => !n.read).length, 'adet');
      setNotifications(notifs);
    }, (error) => {
      console.error('❌ NotificationSystem - Bildirim dinleme hatası:', error);
    });

    return unsubscribe;
  }, [firebaseUser]);

  // Kullanıcı tercihlerini yükle
  useEffect(() => {
    if (!firebaseUser?.uid) return;

    const loadPreferences = async () => {
      try {
        const userDoc = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists() && userSnap.data()?.notificationPreferences) {
          setPreferences(userSnap.data()?.notificationPreferences);
        }
      } catch (error) {
        console.error('Bildirim tercihleri yüklenirken hata:', error);
      }
    };

    loadPreferences();
  }, [firebaseUser?.uid]);

  // Okundu olarak işaretle
  const markAsRead = async (id: string) => {
    if (!firebaseUser?.uid) return;

    try {
      await updateDoc(doc(db, 'notifications', id), {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Bildirim okundu işaretlenirken hata:', error);
    }
  };

  // Tümünü okundu olarak işaretle
  const markAllAsRead = async () => {
    if (!firebaseUser?.uid) return;

    try {
      const batch = writeBatch(db);
      notifications
        .filter(n => !n.read)
        .forEach(notification => {
          const ref = doc(db, 'notifications', notification.id);
          batch.update(ref, { read: true, readAt: serverTimestamp() });
        });
      await batch.commit();
    } catch (error) {
      console.error('Tüm bildirimler okundu işaretlenirken hata:', error);
    }
  };

  // Bildirimi sil
  const deleteNotification = async (id: string) => {
    if (!firebaseUser?.uid) return;

    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error('Bildirim silinirken hata:', error);
    }
  };

  // Bildirim gönder
  const sendNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
      console.log('📨 NotificationSystem - Bildirim gönderiliyor:', notification);
      console.log('🔥 Firebase db objesi:', typeof db);
      console.log('👤 Mevcut kullanıcı:', firebaseUser?.uid);
      console.log('📚 Collection referansı oluşturuluyor...');
      
      const notificationsRef = collection(db, 'notifications');
      console.log('📚 Collection referansı oluşturuldu:', notificationsRef);
      
      const notificationData = {
        ...notification,
        createdAt: serverTimestamp(),
        read: false
      };
      
      console.log('📋 Firestore\'a gönderilecek veri:', notificationData);
      console.log('📋 userId kontrolü:', notificationData.userId);
      console.log('📋 title kontrolü:', notificationData.title);
      console.log('📋 message kontrolü:', notificationData.message);
      
      const docRef = await addDoc(notificationsRef, notificationData);
      console.log('✅ Bildirim başarıyla gönderildi, doc ID:', docRef.id);
      
      // Bildirimi hemen kontrol et
      console.log('🔍 Gönderilen bildirimi kontrol ediyoruz...');
      const sentDoc = await getDoc(docRef);
      if (sentDoc.exists()) {
        console.log('✅ Bildirim Firestore\'da mevcut:', sentDoc.data());
      } else {
        console.log('❌ Bildirim Firestore\'da bulunamadı!');
      }
      
      return docRef;
    } catch (error) {
      console.error('❌ Bildirim gönderilirken hata:', error);
      console.error('❌ Hata detayları:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  };

  // Tercihleri güncelle
  const updatePreferences = async (newPrefs: Partial<NotificationPreferences>) => {
    if (!firebaseUser?.uid) return;

    try {
      const updatedPrefs = { ...preferences, ...newPrefs };
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        notificationPreferences: updatedPrefs
      });
      setPreferences(updatedPrefs);
    } catch (error) {
      console.error('Bildirim tercihleri güncellenirken hata:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    preferences,
    updatePreferences
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Bildirim Bell Component
export const NotificationBell: React.FC = () => {
  const { unreadCount, notifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  console.log('🔔 NotificationBell - Render:', { unreadCount, notificationsCount: notifications.length });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Az önce';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} dk önce`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} saat önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BellIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Henüz bildiriminiz yok</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={() => setIsOpen(false)}
                />
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div className="p-4 border-t border-gray-200">
              <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm">
                Tüm bildirimleri görüntüle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Tekil Bildirim Component
const NotificationItem: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    onClose();
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Az önce';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} dk önce`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} saat önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div
      className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
        notification.read ? 'bg-gray-50' : 'bg-blue-50'
      } hover:bg-gray-100`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {getNotificationIcon(notification.type)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {formatTime(notification.createdAt)}
            </span>
            {!notification.read && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNotification(notification.id);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}; 