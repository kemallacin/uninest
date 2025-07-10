import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UniNestcy - Kıbrıs Öğrenci Platformu',
  description: 'Kıbrıs üniversite öğrencileri için dijital platform - ev arkadaşı, 2.el eşya, dolmuş saatleri, etkinlikler ve daha fazlası',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 