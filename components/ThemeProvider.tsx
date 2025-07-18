'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Hydration sırasında hata fırlatmak yerine default değer döndür
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
      mounted: false
    };
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // İlk yükleme
  useEffect(() => {
    console.log('🎨 ThemeProvider - Component başlatılıyor...');
    setMounted(true);
  }, []);

  // Tema yükleme
  useEffect(() => {
    if (!mounted) return;
    
    console.log('🎨 ThemeProvider - Tema yükleniyor...');
    
    try {
      // localStorage'dan tema tercihini al
      const savedTheme = localStorage.getItem('theme') as Theme;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      let initialTheme: Theme = 'light';
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        initialTheme = savedTheme;
        console.log('🎨 ThemeProvider - localStorage\'dan tema yüklendi:', savedTheme);
      } else if (prefersDark) {
        initialTheme = 'dark';
        console.log('🎨 ThemeProvider - Sistem tercihi karanlık tema');
      }
      
      setThemeState(initialTheme);
    } catch (error) {
      console.log('🎨 ThemeProvider - Tema yükleme hatası:', error);
    }
  }, [mounted]);

  // Tema değişikliği
  useEffect(() => {
    if (!mounted) return;
    
    console.log('🎨 ThemeProvider - Tema değişiyor:', theme);
    
    try {
      // HTML elementine tema class'ını ekle/çıkar
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      // localStorage'a kaydet
      localStorage.setItem('theme', theme);
      console.log('🎨 ThemeProvider - Tema güncellendi:', theme);
    } catch (error) {
      console.log('🎨 ThemeProvider - Tema güncelleme hatası:', error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log('🎨 ThemeProvider - Tema toggle ediliyor');
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    console.log('🎨 ThemeProvider - Tema ayarlanıyor:', newTheme);
    setThemeState(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
    mounted
  };

  console.log('🎨 ThemeProvider - Render:', { theme, mounted });

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 