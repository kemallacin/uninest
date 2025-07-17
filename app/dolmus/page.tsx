export const metadata = {
  title: 'Kıbrıs Dolmuş Saatleri ve Güzergahları | UniNestcy',
  description: 'Kıbrıs\'ta şehirler arası dolmuş saatleri, güzergahlar ve ulaşım rehberi. Öğrenciler için güncel toplu taşıma bilgileri.',
  openGraph: {
    title: 'Kıbrıs Dolmuş Saatleri ve Güzergahları | UniNestcy',
    description: 'Kıbrıs\'ta şehirler arası dolmuş saatleri, güzergahlar ve ulaşım rehberi. Öğrenciler için güncel toplu taşıma bilgileri.',
    url: 'https://uninestcy.com/dolmus',
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
    title: 'Kıbrıs Dolmuş Saatleri ve Güzergahları | UniNestcy',
    description: 'Kıbrıs\'ta şehirler arası dolmuş saatleri, güzergahlar ve ulaşım rehberi.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://uninestcy.com/dolmus',
  },
};

import DolmusClient from './DolmusClient';

export default function Page() {
  return <DolmusClient />;
} 