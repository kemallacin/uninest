import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import About from '../components/About'
import AppPreview from '../components/AppPreview'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export const metadata = {
  title: 'UniNestcy | Kıbrıs Öğrenci Platformu',
  description: 'Kıbrıs’ta öğrenciler için ikinci el eşya, not, etkinlik ve ev arkadaşı bulma platformu. Güvenli, hızlı, öğrenci dostu.',
  openGraph: {
    title: 'UniNestcy | Kıbrıs Öğrenci Platformu',
    description: 'Kıbrıs’ta öğrenciler için ikinci el eşya, not, etkinlik ve ev arkadaşı bulma platformu. Güvenli, hızlı, öğrenci dostu.',
    url: 'https://uninestcy.com',
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
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Hero />
      <Features />
      <About />
      <AppPreview />
      <Contact />
      {/* Güvenlik ve Gizlilik Duyurusu */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-gray-700 text-center">
            <div className="mb-3">
              <svg className="w-10 h-10 text-primary-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3V7a3 3 0 10-6 0v1c0 1.657 1.343 3 3 3zm6 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5a2 2 0 012-2h8a2 2 0 012 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Gizliliğiniz ve Güvenliğiniz Bizim İçin Önemli</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              UniNestcy'de verileriniz ve kişisel bilgileriniz en üst düzeyde korunur. Güvenliğiniz ve gizliliğiniz için gelişmiş teknolojiler ve şeffaf politikalar kullanıyoruz.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/gizlilik" className="text-primary-400 hover:text-primary-300 hover:underline font-medium">Gizlilik Politikası</a>
              <a href="/kullanim-sartlari" className="text-primary-400 hover:text-primary-300 hover:underline font-medium">Kullanım Koşulları</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 