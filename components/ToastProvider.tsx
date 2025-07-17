'use client'

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType } from './Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType; show: boolean }>({
    message: '',
    type: 'info',
    show: false,
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type, show: true });
  }, []);

  const handleClose = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={handleClose} />
    </ToastContext.Provider>
  );
};

export default ToastProvider; 