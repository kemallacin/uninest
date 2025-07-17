import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export default function Toast({ message, type = 'info', show, onClose }: {
  message: string;
  type?: ToastType;
  show: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  let bg = 'bg-gray-800';
  if (type === 'success') bg = 'bg-green-600';
  if (type === 'error') bg = 'bg-red-600';

  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg text-white font-semibold text-lg transition-all duration-300 ${bg} animate-fade-in`}
      role="alert"
    >
      {message}
    </div>
  );
}

// Tailwind animasyonunu eklemek için globals.css'e şunu ekleyebilirsin:
// @keyframes fade-in { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
// .animate-fade-in { animation: fade-in 0.3s ease; } 