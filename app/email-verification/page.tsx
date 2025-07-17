import EmailVerificationClient from './EmailVerificationClient';

export const metadata = {
  title: 'E-posta Doğrulama | UniNestcy',
  description: 'UniNestcy hesabınızı aktifleştirmek için e-posta adresinizi doğrulayın. Güvenli ve hızlı doğrulama süreci.',
  keywords: 'e-posta doğrulama, hesap aktivasyonu, UniNestcy, güvenlik, doğrulama',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'E-posta Doğrulama | UniNestcy',
    description: 'UniNestcy hesabınızı aktifleştirmek için e-posta adresinizi doğrulayın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'UniNestcy',
  },
};

export default function EmailVerificationPage() {
  return <EmailVerificationClient />;
} 