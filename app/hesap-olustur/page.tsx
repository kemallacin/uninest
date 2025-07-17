export const metadata = {
  title: 'Hesap Oluştur | UniNestcy',
  description: 'Kıbrıs öğrenci platformuna ücretsiz üye ol, avantajlardan yararlan! Hızlı kayıt, güvenli giriş, öğrenci dostu ekosistem.',
  openGraph: {
    title: 'Hesap Oluştur | UniNestcy',
    description: 'Kıbrıs öğrenci platformuna ücretsiz üye ol, avantajlardan yararlan! Hızlı kayıt, güvenli giriş, öğrenci dostu ekosistem.',
    url: 'https://uninestcy.com/hesap-olustur',
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
    title: 'Hesap Oluştur | UniNestcy',
    description: 'Kıbrıs öğrenci platformuna ücretsiz üye ol, avantajlardan yararlan!',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://uninestcy.com/hesap-olustur',
  },
};

import HesapOlusturClient from './HesapOlusturClient';

export default function HesapOlusturPage() {
  return <HesapOlusturClient />;
} 