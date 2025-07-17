export const metadata = {
  title: 'Kıbrıs Ev Arkadaşı İlanları | UniNestcy',
  description: 'Kıbrıs’ta öğrenci ev arkadaşı arayanlar ve evini paylaşmak isteyenler için ilanlar. Güvenli, hızlı, öğrenci dostu platform.',
  openGraph: {
    title: 'Kıbrıs Ev Arkadaşı İlanları | UniNestcy',
    description: 'Kıbrıs’ta öğrenci ev arkadaşı arayanlar ve evini paylaşmak isteyenler için ilanlar. Güvenli, hızlı, öğrenci dostu platform.',
    url: 'https://uninestcy.com/ev-arkadasi',
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
    title: 'Kıbrıs Ev Arkadaşı İlanları | UniNestcy',
    description: 'Kıbrıs’ta öğrenci ev arkadaşı arayanlar ve evini paylaşmak isteyenler için ilanlar.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://uninestcy.com/ev-arkadasi',
  },
};

import EvArkadasiClient from './EvArkadasiClient';

export default function Page() {
  return <EvArkadasiClient />;
}