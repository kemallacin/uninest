'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';

export const ThemeDebug: React.FC = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return null; // SSR'da hiçbir şey render etme

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-50">
      <h3 className="text-sm font-bold mb-2 dark:text-white">🎨 Tema Debug</h3>
      <div className="text-xs space-y-1 dark:text-gray-300">
        <div><strong>Mounted:</strong> ✅ Evet</div>
        <div><strong>Tema:</strong> {theme}</div>
        <div><strong>HTML Class:</strong> {typeof document !== 'undefined' ? document.documentElement.className : ''}</div>
        <div><strong>LocalStorage:</strong> {typeof window !== 'undefined' ? localStorage.getItem('theme') || 'null' : ''}</div>
      </div>
      <button 
        onClick={toggleTheme}
        className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
      >
        Toggle Tema
      </button>
    </div>
  );
}; 