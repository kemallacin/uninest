export const metadata = {
  title: 'Kıbrıs İkinci El Eşya İlanları | UniNestcy',
  description: 'Kıbrıs’ta öğrenciler için ikinci el eşya alım-satım ilanları. Güvenli, hızlı, öğrenci dostu ikinci el platformu. Ücretsiz ilan ver, fırsatları kaçırma!',
  openGraph: {
    title: 'Kıbrıs İkinci El Eşya İlanları | UniNestcy',
    description: 'Kıbrıs’ta öğrenciler için ikinci el eşya alım-satım ilanları. Güvenli, hızlı, öğrenci dostu ikinci el platformu.',
    url: 'https://uninestcy.com/ikinci-el',
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
    title: 'Kıbrıs İkinci El Eşya İlanları | UniNestcy',
    description: 'Kıbrıs’ta öğrenciler için ikinci el eşya alım-satım ilanları.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://uninestcy.com/ikinci-el',
  },
};

import IkinciElClient from './IkinciElClient';

export default function Page() {
  return <IkinciElClient />;
} 