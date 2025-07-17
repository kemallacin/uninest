export const metadata = {
  title: 'Kıbrıs Öğrenci Etkinlikleri | UniNestcy',
  description: 'Kıbrıs\'ta öğrenciler için etkinlikler, partiler, konserler, spor turnuvaları ve sosyal aktiviteler. Etkinlik oluştur, katıl, yeni arkadaşlar edin!',
  keywords: 'Kıbrıs, öğrenci etkinlikleri, parti, konser, spor, sosyal aktivite, üniversite, eğlence, etkinlik',
  openGraph: {
    title: 'Kıbrıs Öğrenci Etkinlikleri | UniNestcy',
    description: 'Kıbrıs\'ta öğrenciler için etkinlikler, partiler, konserler, spor turnuvaları ve sosyal aktiviteler. Etkinlik oluştur, katıl, yeni arkadaşlar edin!',
    url: 'https://uninestcy.com/etkinlikler',
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
    title: 'Kıbrıs Öğrenci Etkinlikleri | UniNestcy',
    description: 'Kıbrıs\'ta öğrenciler için etkinlikler, partiler, konserler, spor turnuvaları ve sosyal aktiviteler.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://uninestcy.com/etkinlikler',
  },
};

import EtkinliklerClient from './EtkinliklerClient';

export default function Page() {
  return <EtkinliklerClient />;
}