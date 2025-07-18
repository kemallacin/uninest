export const metadata = {
  title: 'Test Sayfası | UniNestcy',
  description: 'UniNestcy test sayfası. Geliştirme ve test amaçlı sayfa.',
  keywords: 'test, geliştirme, UniNestcy',
  robots: 'noindex, nofollow',
};

import TestClient from './TestClient';
import { ThemeDebug } from '../../components/ThemeDebug';

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <TestClient />
      <ThemeDebug />
    </div>
  );
}
