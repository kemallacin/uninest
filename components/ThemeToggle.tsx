'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  console.log('🎨 ThemeToggle - Render:', { theme, mounted });

  // Hydration sırasında henüz mounted değilse loading göster
  if (!mounted) {
    console.log('🎨 ThemeToggle - Henüz mounted değil, loading gösteriliyor');
    return (
      <button 
        className="relative p-2 text-gray-400 dark:text-gray-300 focus:outline-none transition-colors duration-200"
        disabled
      >
        <div className="h-6 w-6 animate-pulse bg-gray-300 dark:bg-gray-600 rounded"></div>
      </button>
    );
  }

  console.log('🎨 ThemeToggle - Mounted, tema butonu gösteriliyor:', theme);

  return (
    <button
      onClick={() => {
        console.log('🎨 ThemeToggle - Butona tıklandı');
        toggleTheme();
      }}
      className="relative p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none focus:text-gray-600 dark:focus:text-gray-100 transition-colors duration-200"
      title={theme === 'light' ? 'Karanlık temaya geç' : 'Açık temaya geç'}
      aria-label={theme === 'light' ? 'Karanlık temaya geç' : 'Açık temaya geç'}
    >
      {theme === 'light' ? (
        <MoonIcon className="h-6 w-6" />
      ) : (
        <SunIcon className="h-6 w-6" />
      )}
    </button>
  );
}; 