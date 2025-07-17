import GirisClient from './GirisClient';

export const metadata = {
  title: 'Giriş Yap | UniNestcy',
  description: 'Kıbrıs öğrenci platformuna güvenli giriş yap, fırsatları kaçırma! Hızlı ve kolay giriş, öğrenci dostu ekosistem.',
  openGraph: {
    title: 'Giriş Yap | UniNestcy',
    description: 'Kıbrıs öğrenci platformuna güvenli giriş yap, fırsatları kaçırma! Hızlı ve kolay giriş, öğrenci dostu ekosistem.',
    url: 'https://uninestcy.com/giris',
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
    title: 'Giriş Yap | UniNestcy',
    description: 'Kıbrıs öğrenci platformuna güvenli giriş yap, fırsatları kaçırma!',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://uninestcy.com/giris',
  },
};

export default function GirisPage() {
  return <GirisClient />;
} 