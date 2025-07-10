'use client'

import React, { useState } from 'react'
import Header from '../../components/Header'

  const categories = [
  { id: 'genel', name: 'Genel Bilgiler', icon: '🏝️', color: 'from-blue-500 to-cyan-500' },
  { id: 'egitim', name: 'Eğitim', icon: '🎓', color: 'from-purple-500 to-pink-500' },
  { id: 'yasam', name: 'Yaşam', icon: '🏠', color: 'from-green-500 to-emerald-500' },
  { id: 'ulasim', name: 'Ulaşım', icon: '🚌', color: 'from-orange-500 to-red-500' },
  { id: 'yemek', name: 'Yemek', icon: '🍕', color: 'from-yellow-500 to-orange-500' },
  { id: 'eglence', name: 'Eğlence', icon: '🎉', color: 'from-pink-500 to-rose-500' },
  { id: 'saglik', name: 'Sağlık', icon: '🏥', color: 'from-teal-500 to-cyan-500' },
  { id: 'guvenlik', name: 'Güvenlik', icon: '🛡️', color: 'from-indigo-500 to-purple-500' }
  ]

  const guideContent = {
    genel: [
      {
        title: 'Kıbrıs Hakkında Genel Bilgiler',
      content: `Kıbrıs, Akdeniz'in en büyük üçüncü adasıdır ve Kuzey Kıbrıs Türk Cumhuriyeti (KKTC) 1983'te kurulmuştur. Nüfusu yaklaşık 345.000'dir. Başkent Lefkoşa'dır. Resmi dil Türkçe, yaygın olarak İngilizce de konuşulur. Akdeniz iklimi hâkimdir: yazlar sıcak ve kurak, kışlar ılık ve yağışlıdır. Ada, zengin tarihiyle Hittitler, Romalılar, Bizanslılar, Osmanlılar ve İngilizler gibi birçok medeniyete ev sahipliği yapmıştır. Doğası, endemik bitkileri ve Caretta Caretta kaplumbağalarıyla ünlüdür.`,
      tips: [
        'Nüfus: ~345.000',
        'Başkent: Lefkoşa',
        'Resmi dil: Türkçe, İngilizce yaygın',
        'Para birimi: Türk Lirası',
        'Akdeniz iklimi: Yazlar sıcak, kışlar ılık',
        'Trafik soldan akar',
        'Uluslararası telefon kodu: +90 392'
      ]
      },
      {
      title: 'Kıbrıs’ın Kültürü ve Ekonomisi',
      content: `Kıbrıs kültürü, Türk, Akdeniz ve Orta Doğu etkilerini taşır. Misafirperverlik, geleneksel el sanatları (dantel, seramik), halk dansları ve festivaller öne çıkar. Ekonomisi turizm, tarım (narenciye, patates, zeytin), eğitim ve hizmet sektörüne dayanır. Yıllık 1.7 milyon turist çeker.`,
      tips: [
        'Kültürel etkinlikler ve festivaller çok yaygın',
        'Turizm ve eğitim ekonomide başı çeker',
        'Narenciye ve patates başlıca tarım ürünleri',
        'Yabancı öğrenciler için çok sayıda fırsat',
        'Geleneksel el sanatları yaygın'
      ]
    },
    {
      title: 'Kıbrıs’ta Gezilecek Yerler',
      content: `Kıbrıs, tarihi ve doğal güzellikleriyle ünlüdür. Girne Kalesi, Bellapais Manastırı, Salamis Antik Kenti, St. Hilarion Kalesi, Karpaz Yarımadası ve Altınkum Plajı mutlaka görülmeli. Yaz aylarında plajlar ve doğa yürüyüşleri popülerdir.`,
      tips: [
        'Girne Kalesi ve limanı',
        'Salamis Antik Kenti',
        'Karpaz’da eşekler ve bakir plajlar',
        'St. Hilarion Kalesi: Manzara',
        'Altınkum: En popüler plajlardan'
      ]
      }
    ],
    egitim: [
      {
        title: 'Üniversiteler ve Eğitim Sistemi',
      content: `KKTC, uluslararası standartlarda eğitim veren çok sayıda üniversiteye sahiptir. En bilinenler: Doğu Akdeniz Üniversitesi (DAÜ), Yakın Doğu Üniversitesi (YDÜ), Girne Amerikan Üniversitesi (GAÜ), Lefke Avrupa Üniversitesi (LAÜ). Eğitim dili genellikle İngilizce veya Türkçe’dir. Üniversiteler, modern kampüsler, geniş sosyal olanaklar ve çok uluslu öğrenci toplulukları sunar.`,
      tips: [
        'DAÜ: En büyük ve en köklü üniversite',
        'YDÜ: Sağlık ve mühendislikte güçlü',
        'GAÜ: Amerikan sistemi',
        'LAÜ: Avrupa standartları',
        'YÖK ve uluslararası denklik mevcut',
        'Çok sayıda burs ve indirim imkanı'
      ]
      },
      {
      title: 'Kayıt, Vize ve Öğrenci Hayatı',
      content: `Türk vatandaşları için vize gerekmiyor, pasaport veya kimlik ile giriş yapılabiliyor. Kayıtlar genellikle Eylül ve Şubat aylarında. Üniversiteler öğrencilere yurt, danışmanlık, sağlık ve kariyer hizmetleri sunar. Öğrenci kulüpleri, spor ve sanat etkinlikleriyle sosyal yaşam çok canlıdır.`,
      tips: [
        'Vize gerekmez, pasaport/kimlik yeterli',
        'Kayıtlar: Eylül ve Şubat',
        'Yurt ve özel konaklama seçenekleri',
        'Çok sayıda öğrenci kulübü',
        'Kariyer ve staj imkanları',
        'Uluslararası öğrenci topluluğu'
      ]
    },
    {
      title: 'Burslar ve Akademik Olanaklar',
      content: `Üniversiteler, başarıya ve ihtiyaca göre çeşitli burslar sunar. Akademik danışmanlık, kütüphaneler, laboratuvarlar ve online kaynaklar yaygındır. Erasmus ve değişim programları ile yurt dışı deneyimi mümkündür.`,
      tips: [
        'Başarı ve ihtiyaç bursları',
        'Erasmus ve değişim programları',
        'Geniş kütüphane ve laboratuvar olanakları',
        'Online eğitim ve uzaktan erişim',
        'Akademik danışmanlık hizmetleri'
      ]
      }
    ],
    yasam: [
      {
      title: 'Konaklama ve Yaşam Maliyetleri',
      content: `Üniversite yurtları, özel yurtlar, apart ve ev kiralama seçenekleri mevcut. Ev kiraları şehir ve konuma göre değişir. Yaşam maliyetleri Türkiye’ye göre biraz daha yüksektir. Ortalama bir öğrencinin aylık gideri 8.000-15.000 TL arasıdır.`,
      tips: [
        'Yurtlar: 3.000-7.000 TL/ay',
        'Ev kiraları: 6.000-15.000 TL/ay',
        'Yemek: 2.000-4.000 TL/ay',
        'Ulaşım: 500-1.500 TL/ay',
        'Elektrik ve su pahalı olabilir',
        'Paylaşımlı evler yaygın'
      ]
      },
      {
      title: 'Sosyal Yaşam ve Alışveriş',
      content: `Kıbrıs’ta sosyal yaşam hareketlidir. Kafeler, restoranlar, AVM’ler, sinemalar ve spor salonları yaygındır. Alışveriş için Lefkoşa, Girne ve Mağusa’da büyük marketler ve butik mağazalar bulunur. Gece hayatı özellikle Girne ve Mağusa’da canlıdır.`,
      tips: [
        'Kafeler ve restoranlar çok çeşitli',
        'AVM ve marketler yaygın',
        'Gece hayatı: Girne ve Mağusa',
        'Spor salonları ve açık hava aktiviteleri',
        'Fiyatlar Türkiye’ye göre biraz yüksek'
      ]
    },
    {
      title: 'İnternet, Bankacılık ve İletişim',
      content: `Kıbrıs’ta internet altyapısı gelişmiştir, üniversite kampüslerinde ücretsiz Wi-Fi bulunur. Bankacılık işlemleri için Türkiye bankalarının şubeleri ve ATM’leri yaygındır. Telefon hattı almak için pasaport yeterlidir.`,
      tips: [
        'Kampüslerde ücretsiz Wi-Fi',
        'Türk bankalarının şubeleri mevcut',
        'Telefon hattı için pasaport yeterli',
        'Online alışveriş yaygın',
        'Kargo ve posta hizmetleri hızlı'
      ]
      }
    ],
    ulasim: [
      {
        title: 'Şehir İçi Ulaşım',
      content: `Şehir içi ulaşımda dolmuş (minibüs), otobüs ve taksi kullanılır. Dolmuşlar en yaygın ve ekonomik seçenektir. Bisiklet ve scooter kiralama da popülerdir. Taksi ücretleri Türkiye’ye göre yüksektir. Yürüyerek ulaşım küçük şehirlerde mümkündür.`,
      tips: [
        'Dolmuşlar: En yaygın ve ucuz',
        'Otobüs hatları sınırlı',
        'Taksi pahalı, pazarlık yapılabilir',
        'Bisiklet ve scooter kiralama yaygın',
        'Yürüyerek ulaşım kolay'
      ]
      },
      {
      title: 'Şehirler Arası Ulaşım ve Ulaşım İpuçları',
      content: `Şehirler arası ulaşımda dolmuşlar ve otobüsler kullanılır. Gazimağusa-Girne, Lefkoşa-Girne, Lefkoşa-Gazimağusa arasında düzenli seferler vardır. Ercan Havalimanı ana giriş noktasıdır. Araç kiralama için uluslararası ehliyet gerekir.`,
      tips: [
        'Şehirler arası dolmuşlar düzenli',
        'Ercan Havalimanı ana giriş noktası',
        'Araç kiralama için ehliyet gerekli',
        'Ferry ile Türkiye’ye ulaşım mümkün',
        'Trafik soldan akar, dikkatli olun'
      ]
      }
    ],
    yemek: [
      {
      title: 'Kıbrıs Mutfağı ve Lezzetler',
      content: `Kıbrıs mutfağı, Türk ve Akdeniz mutfağının birleşimidir. Halloumi (hellim) peyniri, şeftali kebabı, molehiya, kleftiko, kolokas, pilavuna, meze çeşitleri ve taze deniz ürünleri öne çıkar. Tatlı olarak baklava, lokma ve şam tatlısı popülerdir.`,
      tips: [
        'Hellim peyniri: Kıbrıs’a özgü',
        'Şeftali kebabı: Izgara et',
        'Meze çeşitleri: Zengin',
        'Taze deniz ürünleri',
        'Baklava ve lokma tatlısı'
      ]
      },
      {
      title: 'Öğrenci Dostu Restoranlar ve Fiyatlar',
      content: `Üniversite çevrelerinde uygun fiyatlı restoranlar, kafeler ve fast food zincirleri bulunur. Öğle yemeği 80-150 TL, akşam yemeği 150-300 TL civarındadır. Market alışverişi için büyük zincirler ve yerel pazarlar tercih edilebilir.`,
      tips: [
        'Öğrenci menüleri yaygın',
        'Kafeler ve fast food zincirleri',
        'Market alışverişi için zincirler',
        'Yerel pazarlar taze ürün sunar',
        'Dışarıda yemek Türkiye’ye göre biraz pahalı'
      ]
      }
    ],
    eglence: [
      {
      title: 'Gece Hayatı ve Sosyal Aktiviteler',
      content: `Kıbrıs’ta gece hayatı oldukça canlıdır. Girne ve Gazimağusa’da barlar, kulüpler ve sahil partileri popülerdir. Üniversiteler sık sık konser, festival ve etkinlikler düzenler. Plaj partileri ve açık hava konserleri yaz aylarında öne çıkar.`,
      tips: [
        'Girne ve Mağusa: Gece hayatının merkezi',
        'Üniversite etkinlikleri çok çeşitli',
        'Plaj partileri ve festivaller',
        'Canlı müzik ve DJ performansları',
        'Giriş ücretleri 100-300 TL arası'
      ]
      },
      {
      title: 'Doğa, Spor ve Kültürel Etkinlikler',
      content: `Kıbrıs’ta doğa yürüyüşleri, bisiklet turları, su sporları, dalış ve kampçılık popülerdir. Ayrıca tiyatro, sergi, sinema ve halk dansları gibi kültürel etkinlikler yıl boyu devam eder.`,
      tips: [
        'Plajlar ve doğa yürüyüş parkurları',
        'Dalış ve su sporları',
        'Kamp ve bisiklet turları',
        'Tiyatro ve sergi etkinlikleri',
        'Üniversite spor kulüpleri aktif'
      ]
      }
    ],
    saglik: [
      {
      title: 'Sağlık Sistemi ve Hastaneler',
      content: `Kıbrıs’ta devlet ve özel hastaneler, poliklinikler ve eczaneler yaygındır. Öğrenciler için sağlık sigortası zorunludur. Acil durumlarda 112 aranır. Üniversitelerin kendi sağlık merkezleri de bulunur.`,
      tips: [
        'Devlet ve özel hastaneler yaygın',
        'Sağlık sigortası zorunlu',
        'Acil durum: 112',
        'Üniversite sağlık merkezleri',
        'Eczaneler hafta içi ve cumartesi açık'
      ]
      },
      {
      title: 'Acil Durumlar ve Sağlık İpuçları',
      content: `Acil durumlarda ambulans, polis ve itfaiye hizmetleri 7/24 aktiftir. Eczaneler nöbetçi sistemiyle çalışır. Sağlıklı kalmak için bol su içmek, güneşten korunmak ve dengeli beslenmek önemlidir.`,
      tips: [
        'Ambulans: 112',
        'Polis: 155',
        'İtfaiye: 199',
        'Nöbetçi eczaneler',
        'Güneşten korunmaya dikkat edin'
      ]
      }
    ],
    guvenlik: [
      {
      title: 'Genel Güvenlik ve Acil Numaralar',
      content: `Kıbrıs genel olarak güvenli bir ülkedir. Suç oranı düşüktür, ancak her yerde olduğu gibi dikkatli olmak gerekir. Gece geç saatlerde tenha yerlerden kaçının, değerli eşyalarınızı koruyun. Polis ve acil servisler hızlıdır.`,
      tips: [
        'Polis: 155',
        'Acil: 112',
        'İtfaiye: 199',
        'Gece yalnız yürümemeye özen gösterin',
        'Değerli eşyalarınızı yanınızda taşımayın'
      ]
      },
      {
      title: 'Öğrenciler İçin Güvenlik İpuçları',
      content: `Kampüsler ve yurtlar güvenlidir, giriş-çıkışlar kontrollüdür. Üniversiteler güvenlik görevlileriyle 7/24 hizmet verir. Toplu taşıma ve taksiler güvenilirdir. Acil durumlarda üniversite danışmanlarından destek alınabilir.`,
      tips: [
        'Kampüs ve yurtlar güvenli',
        'Üniversite güvenlik birimi 7/24 aktif',
        'Toplu taşıma güvenli',
        'Acilde danışman desteği alın',
        'Şüpheli durumlarda hemen polise başvurun'
      ]
    }
  ]
}

export default function RehberPage() {
  const [activeCategory, setActiveCategory] = useState('genel')
  const [search, setSearch] = useState('')

  const currentContent = guideContent[activeCategory as keyof typeof guideContent] || []
  const filteredContent = currentContent.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Kıbrıs Rehberi
          </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Kıbrıs'ta öğrenci yaşamı, pratik bilgiler ve deneyimlerinizi paylaşın. 
                Ada hayatının tüm detaylarını keşfedin.
          </p>
        </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rehberde ara..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-12">
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                    className={`flex-shrink-0 px-6 py-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-xl` 
                        : 'bg-white/70 backdrop-blur-sm text-gray-700 border-white/20 hover:bg-white/90 shadow-lg'
                }`}
              >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-semibold text-sm whitespace-nowrap">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredContent.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Sonuç Bulunamadı</h3>
                    <p className="text-gray-500">Aradığınız kriterlere uygun bilgi bulunamadı.</p>
                  </div>
                </div>
              ) : (
                filteredContent.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                      {/* Card Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${categories.find(c => c.id === activeCategory)?.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                          {categories.find(c => c.id === activeCategory)?.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">{item.title}</h3>
        </div>

        {/* Content */}
                      <div className="text-gray-600 leading-relaxed mb-6">
                {item.content}
                      </div>

                      {/* Tips Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-blue-900">Önemli İpuçları</h4>
                        </div>
                        <ul className="space-y-3">
                  {item.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-blue-800 font-medium">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
        </div>
                ))
              )}
            </div>
            
            {/* Footer Section */}
            <div className="mt-16 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Daha Fazla Bilgi İçin</h3>
                <p className="text-gray-600 mb-6">
                  Kıbrıs'ta öğrenci yaşamı hakkında daha detaylı bilgi almak için 
                  diğer öğrencilerle iletişime geçebilir veya forum sayfamızı ziyaret edebilirsiniz.
              </p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Topluluğa Katıl
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 