export const metadata = {
  title: 'Kullanım Şartları | UniNestcy',
  description: 'UniNestcy kullanım şartları ve koşulları. Platform kullanımı, kurallar ve yükümlülükler hakkında bilgi alın.',
  keywords: 'kullanım şartları, şartlar ve koşullar, kurallar, UniNestcy, platform',
  openGraph: {
    title: 'Kullanım Şartları | UniNestcy',
    description: 'UniNestcy kullanım şartları ve koşulları. Platform kullanımı, kurallar ve yükümlülükler hakkında bilgi alın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'UniNestcy',
  },
  alternates: {
    canonical: 'https://uninestcy.com/kullanim-sartlari',
  },
};

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function KullanimSartlari() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kullanım Şartları</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            UniNestcy platformunu kullanarak aşağıdaki şart ve koşulları kabul etmiş olursunuz. 
            Güvenli ve adil bir platform için bu kuralları birlikte uygulayalım.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Last Updated */}
          <div className="mb-8 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-green-700">
              <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Genel Hükümler
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-800 mb-4">
                Bu kullanım şartları, UniNestcy platformunu kullanan tüm kullanıcılar için geçerlidir. 
                Platform üzerinde hesap oluşturarak veya hizmetlerden yararlanarak bu şartları kabul etmiş sayılırsınız.
              </p>
              <p className="text-green-800">
                Bu şartlar, platformun güvenli, adil ve etkili bir şekilde kullanılmasını sağlamak amacıyla oluşturulmuştur.
              </p>
            </div>
          </div>

          {/* Platform Rules */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Platform Kullanım Kuralları
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">✅ İzin Verilen Kullanımlar</h3>
                <ul className="text-blue-800 space-y-2">
                  <li>• Yasal amaçlarla platform kullanımı</li>
                  <li>• Doğru ve güncel bilgi paylaşımı</li>
                  <li>• Saygılı ve nazik iletişim</li>
                  <li>• Gerçek kimlik bilgileri kullanımı</li>
                  <li>• Üniversite öğrencisi olma koşulu</li>
                  <li>• Kişisel kullanım amaçlı işlemler</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">❌ Yasaklanan Davranışlar</h3>
                <ul className="text-red-800 space-y-2">
                  <li>• Sahte veya yanıltıcı bilgi paylaşımı</li>
                  <li>• Spam ve gereksiz mesajlar</li>
                  <li>• Hakaret ve tehdit içerikli mesajlar</li>
                  <li>• Telif hakkı ihlali</li>
                  <li>• Yasa dışı içerik paylaşımı</li>
                  <li>• Ticari amaçlı kötüye kullanım</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Account Responsibilities */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Hesap Sorumlulukları
            </h2>
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Hesap Güvenliği</h3>
                <ul className="text-purple-800 space-y-2">
                  <li>• Şifrenizi güvenli tutmak ve kimseyle paylaşmamak</li>
                  <li>• Hesap bilgilerinizi güncel tutmak</li>
                  <li>• Şüpheli aktiviteleri derhal bildirmek</li>
                  <li>• Hesabınızdan yapılan tüm işlemlerden sorumlu olmak</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">İçerik Sorumluluğu</h3>
                <ul className="text-purple-800 space-y-2">
                  <li>• Paylaştığınız tüm içeriklerden sorumlu olmak</li>
                  <li>• Telif hakkı ve fikri mülkiyet haklarına saygı göstermek</li>
                  <li>• Doğru ve eksiksiz bilgi vermek</li>
                  <li>• Fotoğraf ve görsel paylaşımında izin almak</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transaction Rules */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Alışveriş ve İşlem Kuralları
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Satıcı Sorumlulukları</h3>
                  <ul className="text-yellow-800 space-y-2">
                    <li>• Ürün açıklamalarının doğru olması</li>
                    <li>• Ürün fotoğraflarının gerçek olması</li>
                    <li>• Teslim koşullarına uygun davranış</li>
                    <li>• Müşteri sorularını yanıtlama</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Alıcı Sorumlulukları</h3>
                  <ul className="text-yellow-800 space-y-2">
                    <li>• Ödeme taahhütlerini yerine getirme</li>
                    <li>• Buluşma randevularına uyma</li>
                    <li>• Ürünü kontrol etme hakkı</li>
                    <li>• Nezaket kurallarına uyma</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Rights */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Platform Yönetimi Hakları
            </h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <p className="text-indigo-800 mb-4">
                UniNestcy yönetimi, platform güvenliği ve kullanıcı deneyimini korumak amacıyla aşağıdaki haklara sahiptir:
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-indigo-800">İçerikleri inceleme ve onaylama</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-indigo-800">Kurallara uymayan hesapları askıya alma veya silme</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-indigo-800">Hizmet koşullarını güncelleme</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-indigo-800">Yasal makamlarla işbirliği yapma</span>
                </div>
              </div>
            </div>
          </div>

          {/* Liability */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Sorumluluk Sınırlamaları
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Önemli Uyarılar</h3>
              <ul className="text-red-800 space-y-3">
                <li>• UniNestcy, kullanıcılar arasındaki işlemlerde aracı rolü üstlenir</li>
                <li>• Platform, kullanıcılar arasındaki anlaşmazlıklardan sorumlu değildir</li>
                <li>• Alışveriş öncesi ürünleri mutlaka kontrol edin</li>
                <li>• Şüpheli durumları derhal platform yönetimine bildirin</li>
                <li>• Kişisel güvenliğinizi her zaman ön planda tutun</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              İletişim ve Destek
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                Kullanım şartları ile ilgili sorularınız veya platform desteği için:
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-blue-800 font-medium">E-posta:</span>
                  <span className="text-blue-800 ml-2">info@uninest.app</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-blue-800 font-medium">Adres:</span>
                  <span className="text-blue-800 ml-2">Kıbrıs, Lefkoşa, Marmara Bölgesi, 19. Sokak, 4. Bina, Kat 2</span>
                </div>
              </div>
              <p className="text-blue-800 mt-4 text-sm">
                Çalışma saatleri: Pazartesi - Cumartesi, 09:00 - 18:00
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 