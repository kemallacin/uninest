export const metadata = {
  title: 'Sıkça Sorulan Sorular (SSS) | UniNestcy',
  description: 'UniNestcy platformu hakkında sıkça sorulan sorular ve cevapları. Hesap oluşturma, güvenlik, kullanım rehberi ve daha fazlası.',
  openGraph: {
    title: 'Sıkça Sorulan Sorular (SSS) | UniNestcy',
    description: 'UniNestcy platformu hakkında sıkça sorulan sorular ve cevapları. Hesap oluşturma, güvenlik, kullanım rehberi ve daha fazlası.',
    url: 'https://uninestcy.com/sss',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Sıkça Sorulan Sorular (SSS) | UniNestcy',
    description: 'UniNestcy platformu hakkında sıkça sorulan sorular ve cevapları.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://uninestcy.com/sss',
  },
};

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function SSS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sıkça Sorulan Sorular</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            UniNestcy platformu hakkında merak ettiğiniz her şeyi burada bulabilirsiniz. 
            Aradığınız cevabı bulamadıysanız, bizimle iletişime geçmekten çekinmeyin.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Kategoriler</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-blue-800 font-medium">Hesap İşlemleri</span>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-green-800 font-medium">Güvenlik</span>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-purple-800 font-medium">Alışveriş</span>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 text-yellow-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-yellow-800 font-medium">Mobil Uygulama</span>
              </div>
            </div>
          </div>

          {/* General Questions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Genel Sorular
            </h2>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">UniNestcy nedir ve nasıl çalışır?</h3>
                <p className="text-blue-800 mb-3">
                  UniNestcy, Kıbrıs'taki öğrenciler için özel olarak tasarlanmış kapsamlı bir dijital platformdur. 
                  Platform üzerinde ev arkadaşı bulabilir, ikinci el eşya alım-satımı yapabilir, etkinliklere katılabilir, 
                  dolmuş saatlerini öğrenebilir ve ders notlarını paylaşabilirsiniz.
                </p>
                <p className="text-blue-800">
                  Hesap oluşturup e-posta doğrulaması yaptıktan sonra tüm özelliklerden faydalanabilirsiniz. 
                  Tüm ilanlar admin onayından geçer ve güvenli bir ortam sağlanır.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Platform tamamen ücretsiz mi?</h3>
                <p className="text-blue-800">
                  Evet! UniNestcy tamamen ücretsizdir. Kayıt olmak, ilan vermek, mesajlaşmak, etkinliklere katılmak 
                  ve platform özelliklerinden yararlanmak için herhangi bir ücret alınmaz. Amacımız öğrenci hayatını kolaylaştırmaktır.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Hangi üniversitelerden öğrenciler katılabilir?</h3>
                <p className="text-blue-800">
                  Kıbrıs'taki tüm üniversitelerden öğrenciler platforma katılabilir. Yakın Doğu Üniversitesi, 
                  Doğu Akdeniz Üniversitesi, Girne Üniversitesi, Lefke Avrupa Üniversitesi, Final Üniversitesi 
                  ve diğer tüm üniversitelerden öğrenciler hoş geldiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Account Questions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Hesap İşlemleri
            </h2>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Nasıl hesap oluşturabilirim?</h3>
                <p className="text-green-800 mb-3">
                  Hesap oluşturmak çok kolay! Ana sayfadaki "Hesap Oluştur" butonuna tıklayın ve aşağıdaki adımları izleyin:
                </p>
                <ul className="text-green-800 space-y-1 ml-4">
                  <li>• Ad, soyad ve e-posta adresinizi girin</li>
                  <li>• Güvenli bir şifre oluşturun</li>
                  <li>• Üniversite bilginizi seçin</li>
                  <li>• E-posta adresinize gelen doğrulama linkine tıklayın</li>
                  <li>• Hesabınız aktif olacak ve platforma giriş yapabileceksiniz</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Şifremi unuttum, ne yapmalıyım?</h3>
                <p className="text-green-800">
                  Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayın. E-posta adresinizi girin ve 
                  size gönderilecek şifre sıfırlama linkini kullanarak yeni şifre oluşturun. 
                  E-posta gelmezse spam klasörünü kontrol etmeyi unutmayın.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Hesabımı nasıl silebilirim?</h3>
                <p className="text-green-800">
                  Hesabınızı silmek için profil ayarlarından "Hesabı Sil" seçeneğini kullanabilir veya 
                  info@uninest.app adresinden bizimle iletişime geçebilirsiniz. 
                  Hesap silme işlemi geri alınamaz olduğunu unutmayın.
                </p>
              </div>
            </div>
          </div>

          {/* Security Questions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Güvenlik ve Gizlilik
            </h2>
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Kişisel bilgilerim güvende mi?</h3>
                <p className="text-purple-800">
                  Evet! Kişisel verileriniz KVKK (Kişisel Verilerin Korunması Kanunu) kapsamında korunmaktadır. 
                  SSL şifreleme, güvenli sunucu altyapısı ve düzenli güvenlik güncellemeleri ile verileriniz korunur. 
                  Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Şüpheli bir kullanıcıyı nasıl bildirebilirim?</h3>
                <p className="text-purple-800">
                  Her kullanıcı profilinde ve ilan sayfasında "Bildir" butonu bulunur. 
                  Şüpheli davranış, dolandırıcılık girişimi veya kurallara aykırı içerik gördüğünüzde 
                  bu butonu kullanarak bizi bilgilendirebilirsiniz. Raporlar 24 saat içinde değerlendirilir.
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Güvenli alışveriş için ne yapmalıyım?</h3>
                <p className="text-purple-800 mb-3">
                  Güvenli alışveriş için şu önerileri takip edin:
                </p>
                <ul className="text-purple-800 space-y-1 ml-4">
                  <li>• Ürünü satın almadan önce mutlaka görün ve test edin</li>
                  <li>• Kalabalık ve güvenli yerlerde buluşun</li>
                  <li>• Peşin ödeme yapmaktan kaçının</li>
                  <li>• Satıcının profil bilgilerini kontrol edin</li>
                  <li>• Şüpheli durumları derhal bildirin</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shopping Questions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Alışveriş ve İlanlar
            </h2>
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">İlan nasıl verebilirim?</h3>
                <p className="text-yellow-800 mb-3">
                  İlan vermek için giriş yaptıktan sonra ilgili bölüme gidin (İkinci El, Ev Arkadaşı, Etkinlik vb.) 
                  ve "İlan Ver" butonuna tıklayın. Aşağıdaki bilgileri doldurun:
                </p>
                <ul className="text-yellow-800 space-y-1 ml-4">
                  <li>• Başlık ve açıklama</li>
                  <li>• Fiyat bilgisi (varsa)</li>
                  <li>• Fotoğraflar (en az 1, en fazla 5)</li>
                  <li>• Konum bilgisi</li>
                  <li>• İletişim tercihleri</li>
                </ul>
                <p className="text-yellow-800 mt-3">
                  İlanınız admin onayından geçtikten sonra yayınlanacaktır.
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">İlanım neden onaylanmadı?</h3>
                <p className="text-yellow-800 mb-3">
                  İlan onaylanmama sebepleri:
                </p>
                <ul className="text-yellow-800 space-y-1 ml-4">
                  <li>• Eksik veya yanlış bilgiler</li>
                  <li>• Kalitesiz veya uygunsuz fotoğraflar</li>
                  <li>• Kurallara aykırı içerik</li>
                  <li>• Fiyat bilgisi eksikliği</li>
                  <li>• Spam veya tekrarlanan içerik</li>
                </ul>
                <p className="text-yellow-800 mt-3">
                  İlanınızı düzenleyerek tekrar gönderebilirsiniz.
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Favori listeme nasıl eklerim?</h3>
                <p className="text-yellow-800">
                  Her ilan kartında kalp simgesi bulunur. Bu simgeye tıklayarak ilanı favori listenize ekleyebilirsiniz. 
                  Favori ilanlarınızı profil menüsünden "Favorilerim" bölümünde görüntüleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile App Questions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobil Uygulama
            </h2>
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">Mobil uygulama ne zaman çıkacak?</h3>
                <p className="text-indigo-800">
                  UniNestcy mobil uygulaması yakında çıkacak! Erken erişim için ana sayfadaki 
                  "Mobil Uygulama Yakında" bölümünden e-posta adresinizi kaydedin. 
                  Uygulama çıktığında size haber vereceğiz ve özel avantajlardan yararlanabileceksiniz.
                </p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">Mobil uygulamanın özellikleri neler olacak?</h3>
                <p className="text-indigo-800 mb-3">
                  Mobil uygulama şu özellikleri içerecek:
                </p>
                <ul className="text-indigo-800 space-y-1 ml-4">
                  <li>• Anlık bildirimler</li>
                  <li>• Konum bazlı hizmetler</li>
                  <li>• Anlık mesajlaşma</li>
                  <li>• Akıllı filtreleme</li>
                  <li>• Offline görüntüleme</li>
                  <li>• Hızlı ilan verme</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Hâlâ Sorunuz mu Var?
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                Aradığınız cevabı bulamadıysanız, bizimle iletişime geçmekten çekinmeyin:
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
                Çalışma saatleri: Pazartesi - Cumartesi, 09:00 - 18:00<br />
                Genellikle 24 saat içinde yanıt veriyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 