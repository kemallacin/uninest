import RehberClient from './RehberClient';

export const metadata = {
  title: "Kıbrıs Öğrenci Yaşam Rehberi | UniNestcy",
  description: "Kıbrıs'ta öğrenci yaşamı, ulaşım, eğitim, sağlık, eğlence ve güvenlik rehberi. Ada hayatı hakkında pratik bilgiler ve ipuçları.",
  keywords: "Kıbrıs, öğrenci rehberi, KKTC, yaşam rehberi, üniversite, eğitim, ulaşım, sağlık, eğlence, güvenlik",
  openGraph: {
    title: "Kıbrıs Öğrenci Yaşam Rehberi | UniNestcy",
    description: "Kıbrıs'ta öğrenci yaşamı, ulaşım, eğitim, sağlık, eğlence ve güvenlik rehberi. Ada hayatı hakkında pratik bilgiler ve ipuçları.",
    type: "website",
    locale: "tr_TR",
    siteName: "UniNestcy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kıbrıs Öğrenci Yaşam Rehberi | UniNestcy",
    description: "Kıbrıs'ta öğrenci yaşamı, ulaşım, eğitim, sağlık, eğlence ve güvenlik rehberi. Ada hayatı hakkında pratik bilgiler ve ipuçları.",
  },
  alternates: {
    canonical: "/rehber"
  }
};

export default function RehberPage() {
  return <RehberClient />;
} 