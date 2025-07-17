export const metadata = {
  title: 'Kıbrıs Özel Ders İlanları | UniNestcy',
  description: 'Kıbrıs\'ta özel ders veren ve alan öğrenciler için platform. Matematik, fizik, kimya, İngilizce ve daha fazlası. Özel ders ver, al, öğren!',
  keywords: 'Kıbrıs, özel ders, matematik, fizik, kimya, İngilizce, öğretmen, öğrenci, eğitim, ders',
  openGraph: {
    title: 'Kıbrıs Özel Ders İlanları | UniNestcy',
    description: 'Kıbrıs\'ta özel ders veren ve alan öğrenciler için platform. Matematik, fizik, kimya, İngilizce ve daha fazlası. Özel ders ver, al, öğren!',
    url: 'https://uninestcy.com/ozel-dersler',
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
    title: 'Kıbrıs Özel Ders İlanları | UniNestcy',
    description: 'Kıbrıs\'ta özel ders veren ve alan öğrenciler için platform. Matematik, fizik, kimya, İngilizce ve daha fazlası.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://uninestcy.com/ozel-dersler',
  },
};

import OzelDerslerClient from './OzelDerslerClient';

export default function Page() {
  return <OzelDerslerClient />;
} 