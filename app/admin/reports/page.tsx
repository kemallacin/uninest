export const metadata = {
  title: 'Admin Raporlar | UniNestcy',
  description: 'UniNestcy admin raporlar sayfası. Kullanıcı raporlarını görüntüleyin ve yönetin.',
  keywords: 'admin raporlar, şikayetler, UniNestcy, yönetim',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Admin Raporlar | UniNestcy',
    description: 'UniNestcy admin raporlar sayfası. Kullanıcı raporlarını görüntüleyin ve yönetin.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'UniNestcy',
  },
};

import AdminReportsClient from './AdminReportsClient';

export default function AdminReportsPage() {
  return <AdminReportsClient />;
} 