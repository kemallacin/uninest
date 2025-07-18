'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BellIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

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
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  sendNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  sendNotification: async () => {},
  deleteNotification: async () => {},
  markAsRead: async () => {}
});

export const useNotifications = () => useContext(NotificationContext);

export const SimpleNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Firebase Auth listener - Optimized
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Bildirim listener - Optimized
  useEffect(() => {
    if (!currentUser?.uid) {
      setNotifications([]);
      return;
    }

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date()
          } as Notification;
        });

        // Manuel sıralama
        notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(notifs);
      }, (error) => {
        console.error('Bildirim dinleme hatası:', error);
        setNotifications([]);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Query oluşturma hatası:', error);
      setNotifications([]);
    }
  }, [currentUser]);

  const sendNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: serverTimestamp(),
        read: false
      });
    } catch (error) {
      console.error('Gönderme hatası:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      console.log('Bildirim silindi:', notificationId);
    } catch (error) {
      console.error('Bildirim silme hatası:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      });
      console.log('Bildirim okundu olarak işaretlendi:', notificationId);
    } catch (error) {
      console.error('Bildirim güncelleme hatası:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      sendNotification, 
      deleteNotification, 
      markAsRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const SimpleNotificationBell: React.FC = () => {
  const { unreadCount, notifications, deleteNotification, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleMarkAsRead = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none focus:text-gray-600 dark:focus:text-gray-100 transition-colors duration-200"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Bildirimler</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Henüz bildirim yok</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border relative group ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                    {/* Silme ve Okundu butonları */}
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(e, notification.id)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30 rounded"
                          title="Okundu olarak işaretle"
                        >
                          <CheckIcon className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(e, notification.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 rounded"
                        title="Bildirimi sil"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white pr-8">{notification.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {notification.createdAt?.toDate?.()?.toLocaleString() || 'Biraz önce'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 