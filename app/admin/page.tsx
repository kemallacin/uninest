export const metadata = {
  title: 'Admin Paneli | UniNestcy',
  description: 'UniNestcy admin paneli. Kullanıcıları, ilanları ve platform içeriklerini yönetin.',
  keywords: 'admin, yönetim paneli, UniNestcy, yönetici',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Admin Paneli | UniNestcy',
    description: 'UniNestcy admin paneli. Kullanıcıları, ilanları ve platform içeriklerini yönetin.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'UniNestcy',
  },
};

import AdminClient from './AdminClient';

export default function AdminPage() {
  return <AdminClient />;
} 