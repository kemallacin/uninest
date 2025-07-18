import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './mobile-optimizations.css'
import { AuthProvider } from '../lib/auth/AuthContext'
import ToastProvider from '../components/ToastProvider'
import { SimpleNotificationProvider } from '../components/SimpleNotificationSystem'
import { ThemeProvider } from '../components/ThemeProvider'
import PerformanceMonitor from '../components/PerformanceMonitor'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://uninestcy.com'),
  title: 'UniNestcy | Kibris Ogrenci Platformu',
  description: 'Kibris\'ta ogrenciler icin ikinci el esya, not, etkinlik ve ev arkadasi bulma platformu. Guvenli, hizli, ogrenci dostu.',
  openGraph: {
    title: 'UniNestcy | Kibris Ogrenci Platformu',
    description: 'Kibris\'ta ogrenciler icin ikinci el esya, not, etkinlik ve ev arkadasi bulma platformu. Guvenli, hizli, ogrenci dostu.',
    url: 'https://uninestcy.com',
    siteName: 'UniNestcy',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'UniNestcy Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniNestcy | Kibris Ogrenci Platformu',
    description: 'Kibris\'ta ogrenciler icin ikinci el esya, not, etkinlik ve ev arkadasi bulma platformu.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://uninestcy.com',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'UniNestcy',
    'application-name': 'UniNestcy',
    'msapplication-TileColor': '#3b82f6',
    'theme-color': '#3b82f6',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "UniNestcy",
              "description": "Kıbrıs'ta öğrenciler için ikinci el eşya, not, etkinlik ve ev arkadaşı bulma platformu",
              "url": "https://uninestcy.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://uninestcy.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "UniNestcy",
                "url": "https://uninestcy.com"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen antialiased transition-colors duration-200`}>
        <ThemeProvider>
          <AuthProvider>
            <SimpleNotificationProvider>
              <ToastProvider>
                {children}
                <PerformanceMonitor />
              </ToastProvider>
            </SimpleNotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 