export const metadata = {
  title: 'Çerez Politikası | UniNestcy',
  description: 'UniNestcy çerez politikası. Web sitemizde kullanılan çerezler, amaçları ve yönetimi hakkında bilgi alın.',
  keywords: 'çerez politikası, cookies, gizlilik, web sitesi, UniNestcy',
  openGraph: {
    title: 'Çerez Politikası | UniNestcy',
    description: 'UniNestcy çerez politikası. Web sitemizde kullanılan çerezler, amaçları ve yönetimi hakkında bilgi alın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'UniNestcy',
  },
  alternates: {
    canonical: 'https://uninestcy.com/cerez-politikasi',
  },
};

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CerezPolitikasi() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Çerez Politikası</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Web sitemizde kullanılan çerezler, amaçları ve yönetimi hakkında şeffaf bilgi. 
            Çerezler sayesinde size daha iyi hizmet sunabiliyoruz.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Last Updated */}
          <div className="mb-8 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
            <p className="text-sm text-indigo-700">
              <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Çerez Politikası Hakkında
            </h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <p className="text-indigo-800 mb-4">
                Bu çerez politikası, UniNestcy web sitesinde kullanılan çerezler hakkında bilgi vermektedir. 
                Web sitemizi ziyaret ettiğinizde, kullanıcı deneyimini geliştirmek ve hizmetlerimizi sunmak için çerezler kullanılır.
              </p>
              <p className="text-indigo-800">
                Bu politika, hangi çerezlerin kullanıldığı, neden kullanıldığı ve nasıl yönetebileceğiniz hakkında detaylı bilgi sağlar.
              </p>
            </div>
          </div>

          {/* What are Cookies */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Çerez Nedir?
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır. 
                Bu dosyalar, web sitesinin size daha iyi hizmet sunmasını sağlar ve kullanıcı deneyimini geliştirir.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Çerezlerin Faydaları</h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>• Tercihlerinizi hatırlama</li>
                    <li>• Oturum bilgilerini saklama</li>
                    <li>• Site performansını iyileştirme</li>
                    <li>• Kişiselleştirilmiş deneyim</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Çerez Türleri</h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>• Oturum çerezleri (geçici)</li>
                    <li>• Kalıcı çerezler (uzun süreli)</li>
                    <li>• Birinci taraf çerezler</li>
                    <li>• Üçüncü taraf çerezler</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cookie Types */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Kullandığımız Çerez Türleri
            </h2>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">🔒 Zorunlu Çerezler</h3>
                <p className="text-green-800 mb-3">
                  Web sitesinin temel işlevlerini yerine getirmesi için gerekli çerezlerdir. Bu çerezler olmadan site düzgün çalışmaz.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Kullanım Alanları:</h4>
                  <ul className="text-green-800 space-y-1">
                    <li>• Oturum yönetimi ve kullanıcı girişi</li>
                    <li>• Güvenlik ve doğrulama</li>
                    <li>• Form verilerinin geçici olarak saklanması</li>
                    <li>• Alışveriş sepeti işlevselliği</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">📊 Analitik Çerezler</h3>
                <p className="text-yellow-800 mb-3">
                  Web sitesinin nasıl kullanıldığını anlamamız ve performansını iyileştirmemiz için veri toplayan çerezlerdir.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Toplanan Bilgiler:</h4>
                  <ul className="text-yellow-800 space-y-1">
                    <li>• Sayfa görüntüleme sayıları</li>
                    <li>• Ziyaret süresi ve davranış analizi</li>
                    <li>• Popüler içerik ve özellikler</li>
                    <li>• Hata raporları ve performans metrikleri</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">⚙️ Fonksiyonel Çerezler</h3>
                <p className="text-purple-800 mb-3">
                  Kullanıcı tercihlerinizi hatırlayarak kişiselleştirilmiş deneyim sunan çerezlerdir.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Saklanan Tercihler:</h4>
                  <ul className="text-purple-800 space-y-1">
                    <li>• Dil ve bölge ayarları</li>
                    <li>• Tema ve görünüm tercihleri</li>
                    <li>• Arama filtreleri ve sıralama</li>
                    <li>• Favori listesi ve kayıtlı aramalar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cookie Management */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Çerez Yönetimi
          </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Çerezleri Nasıl Kontrol Edebilirsiniz?</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">🌐 Tarayıcı Ayarları</h4>
                  <p className="text-red-800 mb-2">
                    Tarayıcınızın ayarlarından çerezleri yönetebilirsiniz:
                  </p>
                  <ul className="text-red-800 space-y-1 ml-4">
                    <li>• Tüm çerezleri engelleme</li>
                    <li>• Belirli çerezleri silme</li>
                    <li>• Çerez bildirimleri açma</li>
                    <li>• Üçüncü taraf çerezleri engelleme</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">⚠️ Önemli Uyarı</h4>
                  <p className="text-red-800">
                    Çerezleri engellerseniz, web sitesinin bazı özellikleri düzgün çalışmayabilir. 
                    Özellikle giriş yapma, tercihlerinizi kaydetme ve kişiselleştirilmiş deneyim 
                    gibi özellikler etkilenebilir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Instructions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tarayıcı Özel Ayarları
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Chrome</h3>
                <ol className="text-purple-800 space-y-1 text-sm">
                  <li>1. Ayarlar → Gizlilik ve güvenlik</li>
                  <li>2. Çerezler ve diğer site verileri</li>
                  <li>3. İstediğiniz ayarı seçin</li>
                  <li>4. Belirli siteleri engelle/izin ver</li>
                </ol>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Firefox</h3>
                <ol className="text-purple-800 space-y-1 text-sm">
                  <li>1. Ayarlar → Gizlilik ve Güvenlik</li>
                  <li>2. Çerezler ve Site Verileri</li>
                  <li>3. İstisnaları yönet</li>
                  <li>4. Çerezleri temizle</li>
                </ol>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Safari</h3>
                <ol className="text-purple-800 space-y-1 text-sm">
                  <li>1. Tercihler → Gizlilik</li>
                  <li>2. Çerezler ve web sitesi verileri</li>
                  <li>3. Detayları göster</li>
                  <li>4. Çerezleri kaldır</li>
                </ol>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Edge</h3>
                <ol className="text-purple-800 space-y-1 text-sm">
                  <li>1. Ayarlar → Çerezler ve site izinleri</li>
                  <li>2. Çerezler ve saklanan veriler</li>
                  <li>3. Tüm çerezleri görüntüle</li>
                  <li>4. Çerezleri yönet</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Updates */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Politika Güncellemeleri
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800 mb-3">
                Bu çerez politikası, yasal değişiklikler veya hizmet güncellemeleri nedeniyle zaman zaman güncellenebilir. 
                Önemli değişiklikler olduğunda sizi bilgilendireceğiz.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-yellow-800">Düzenli olarak bu sayfayı kontrol edin</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-yellow-800">Değişiklikler hakkında e-posta bildirimi alın</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-yellow-800">Güncellemeler sayfanın üst kısmında gösterilir</span>
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
              Sorularınız İçin İletişim
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                Çerez politikası hakkında sorularınız veya endişeleriniz varsa, bizimle iletişime geçebilirsiniz:
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