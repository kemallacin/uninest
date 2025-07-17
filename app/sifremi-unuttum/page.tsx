export const metadata = {
  title: 'Şifremi Unuttum | UniNestcy',
  description: 'UniNestcy şifrenizi mi unuttunuz? E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.',
  keywords: 'şifre sıfırlama, şifremi unuttum, parola sıfırlama, UniNestcy, giriş',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Şifremi Unuttum | UniNestcy',
    description: 'UniNestcy şifrenizi mi unuttunuz? E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'UniNestcy',
  },
};

import SifremiUnuttumClient from './SifremiUnuttumClient';

export default function SifremiUnuttum() {
  return <SifremiUnuttumClient />;
} 