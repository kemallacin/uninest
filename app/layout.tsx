import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ToastProvider from '../components/ToastProvider'
import ErrorBoundary from '../components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
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
      <body className={`${inter.className} bg-white text-black min-h-screen antialiased`}>
        <ErrorBoundary>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 