export const metadata = {
  title: 'Test Sayfası | UniNestcy',
  description: 'UniNestcy test sayfası. Geliştirme ve test amaçlı sayfa.',
  keywords: 'test, geliştirme, UniNestcy',
  robots: 'noindex, nofollow',
};

import TestClient from './TestClient';

export default function Page() {
  return <TestClient />;
}
