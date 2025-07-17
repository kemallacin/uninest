export const metadata = {
  title: 'Gizlilik Politikası | UniNestcy',
  description: 'UniNestcy gizlilik politikası. Kişisel verilerinizin korunması, işlenmesi ve haklarınız hakkında detaylı bilgi.',
  keywords: 'gizlilik politikası, kişisel veriler, KVKK, veri koruma, UniNestcy',
  openGraph: {
    title: 'Gizlilik Politikası | UniNestcy',
    description: 'UniNestcy gizlilik politikası. Kişisel verilerinizin korunması, işlenmesi ve haklarınız hakkında detaylı bilgi.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'UniNestcy',
  },
  alternates: {
    canonical: 'https://uninestcy.com/gizlilik-politikasi',
  },
};

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function GizlilikPolitikasi() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Kişisel verilerinizin korunması ve gizliliğiniz bizim için en önemli önceliktir. 
            Bu politika, verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında şeffaf bilgi sağlar.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Last Updated */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-700">
              <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Giriş
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              UniNestcy olarak, kullanıcılarımızın gizliliğini korumak ve kişisel verilerini güvenli bir şekilde işlemek en önemli önceliğimizdir. 
              Bu Gizlilik Politikası, platformumuzda toplanan, kullanılan, saklanan ve korunan kişisel bilgiler hakkında detaylı bilgi vermektedir.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat hükümleri çerçevesinde hazırlanmıştır.
            </p>
          </div>

          {/* Data Collection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Hangi Bilgileri Topluyoruz?
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Hesap Bilgileri</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Ad ve soyad</li>
                  <li>E-posta adresi</li>
                  <li>Telefon numarası (isteğe bağlı)</li>
                  <li>Üniversite bilgisi</li>
                  <li>Profil fotoğrafı (isteğe bağlı)</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Kullanım Bilgileri</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>İlan ve mesaj içerikleri</li>
                  <li>Arama geçmişi</li>
                  <li>Favori listesi</li>
                  <li>Platform içi aktiviteler</li>
                  <li>IP adresi ve cihaz bilgileri</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Bilgileriniz Nasıl Kullanılır?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Platform Hizmetleri</h3>
                <ul className="text-blue-800 space-y-2">
                  <li>• Hesap oluşturma ve yönetimi</li>
                  <li>• İlan yayınlama ve görüntüleme</li>
                  <li>• Mesajlaşma sistemi</li>
                  <li>• Arama ve filtreleme</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Güvenlik ve İyileştirme</h3>
                <ul className="text-green-800 space-y-2">
                  <li>• Güvenlik önlemleri</li>
                  <li>• Dolandırıcılık tespiti</li>
                  <li>• Platform iyileştirmeleri</li>
                  <li>• Müşteri desteği</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Bilgilerinizin Paylaşımı
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Önemli Bilgilendirme</h3>
              <p className="text-red-800 mb-4">
                Kişisel bilgileriniz kesinlikle üçüncü şahıslarla paylaşılmaz, satılmaz veya kiralanmaz.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-red-800">Yasal zorunluluklar (mahkeme kararı, savcılık talebi)</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-red-800">Güvenlik ihlalleri ve suç tespiti</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-red-800">Açık rızanızın bulunduğu durumlar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Veri Güvenliği
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">Teknik Önlemler</h3>
                <ul className="text-indigo-800 space-y-2">
                  <li>• SSL şifreleme</li>
                  <li>• Güvenli sunucu altyapısı</li>
                  <li>• Düzenli güvenlik güncellemeleri</li>
                  <li>• Erişim kontrol sistemleri</li>
                </ul>
              </div>
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">İdari Önlemler</h3>
                <ul className="text-indigo-800 space-y-2">
                  <li>• Personel eğitimleri</li>
                  <li>• Gizlilik sözleşmeleri</li>
                  <li>• Düzenli güvenlik denetimleri</li>
                  <li>• Veri minimizasyonu</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Rights */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              KVKK Kapsamındaki Haklarınız
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Temel Haklarınız</h3>
                  <ul className="text-yellow-800 space-y-2">
                    <li>• Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                    <li>• Kişisel verileriniz işlenmişse bilgi talep etme</li>
                    <li>• İşleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                    <li>• Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Talep Haklarınız</h3>
                  <ul className="text-yellow-800 space-y-2">
                    <li>• Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
                    <li>• Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                    <li>• Kişisel verilerinizin düzeltilmesi, silinmesi veya yok edilmesi halinde bu işlemlerin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                    <li>• İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              İletişim ve Başvuru
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                Kişisel verilerinizle ilgili her türlü soru, talep ve şikayetleriniz için bizimle iletişime geçebilirsiniz:
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
                Başvurularınız en geç 30 gün içerisinde değerlendirilip yanıtlanacaktır.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 