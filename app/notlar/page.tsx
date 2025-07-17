export const metadata = {
  title: 'Kıbrıs Üniversite Notları ve Ders Kaynakları | UniNestcy',
  description: 'Kıbrıs’taki üniversiteler için ders notları, PDF kaynaklar ve paylaşımlar. Not ekle, indir, paylaş! Öğrenciler için ücretsiz not platformu.',
  openGraph: {
    title: 'Kıbrıs Üniversite Notları ve Ders Kaynakları | UniNestcy',
    description: 'Kıbrıs’taki üniversiteler için ders notları, PDF kaynaklar ve paylaşımlar. Not ekle, indir, paylaş!',
    url: 'https://uninestcy.com/notlar',
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
    title: 'Kıbrıs Üniversite Notları ve Ders Kaynakları | UniNestcy',
    description: 'Kıbrıs’taki üniversiteler için ders notları, PDF kaynaklar ve paylaşımlar.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://uninestcy.com/notlar',
  },
};

import NotlarClient from './NotlarClient';

export default function Page() {
  return <NotlarClient />;
} 