# Kıbrıs Öğrenci Platformu

Kıbrıs'ta üniversite öğrencilerinin dijital ortamda ihtiyaçlarını karşılayan kapsamlı bir web platformu.

## 🚀 Özellikler

### 🏠 Ev Arkadaşı Bulma
- Ev arkadaşı arayan ve veren öğrencileri buluşturma
- Detaylı filtreleme sistemi (konum, bütçe, cinsiyet, yaş)
- Profil görüntüleme ve iletişim

### 🛍️ 2.El Eşya Pazarı
- İkinci el eşya alım-satım platformu
- Kategori bazlı filtreleme
- Fiyat karşılaştırma ve indirim takibi
- Güvenli alışveriş deneyimi

### 🚌 Dolmuş Saatleri
- Güncel dolmuş saatleri
- Rota bazlı planlama
- Hafta içi/sonu ayrımı
- Express ve normal seferler

### 🎉 Etkinlikler
- Öğrenci etkinlikleri takvimi
- Etkinlik oluşturma ve katılım
- Sosyal ağ özellikleri

### 📚 Özel Dersler
- Özel ders veren ve alan öğrencileri buluşturma
- Ders kategorileri ve fiyatlandırma
- Değerlendirme sistemi

### 📝 Not Paylaşımı
- Ders notları ve ödev paylaşımı
- Dosya yükleme ve indirme
- Akademik işbirliği

### 🗺️ Kıbrıs Rehberi
- Kıbrıs yaşam rehberi
- Yerel bilgiler ve ipuçları
- Öğrenci deneyimleri

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons, Lucide React
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/your-username/kibris-ogrenci-platformu.git
cd kibris-ogrenci-platformu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🏗️ Proje Yapısı

```
kibris-ogrenci-platformu/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global stiller
│   ├── layout.tsx         # Ana layout
│   ├── page.tsx           # Ana sayfa
│   ├── ev-arkadasi/       # Ev arkadaşı sayfası
│   ├── ikinci-el/         # 2.el eşya sayfası
│   ├── dolmus/            # Dolmuş saatleri sayfası
│   ├── etkinlikler/       # Etkinlikler sayfası
│   ├── ozel-dersler/      # Özel dersler sayfası
│   ├── notlar/            # Not paylaşımı sayfası
│   └── rehber/            # Kıbrıs rehberi sayfası
├── components/            # Yeniden kullanılabilir bileşenler
│   ├── Header.tsx         # Navigasyon header
│   ├── Hero.tsx           # Ana sayfa hero bölümü
│   ├── Features.tsx       # Özellikler bölümü
│   └── Footer.tsx         # Footer bileşeni
├── public/                # Statik dosyalar
├── package.json           # Proje bağımlılıkları
├── tailwind.config.js     # Tailwind konfigürasyonu
├── next.config.js         # Next.js konfigürasyonu
└── README.md              # Proje dokümantasyonu
```

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: Mavi tonları (#3B82F6, #2563EB, #1D4ED8)
- **Secondary**: Gri tonları (#64748B, #475569, #334155)
- **Accent**: Sarı (#FBBF24) - CTA butonları için

### Tipografi
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Bileşenler
- **Buttons**: Primary, Secondary, CTA varyantları
- **Cards**: Gölgeli, hover efektli kartlar
- **Forms**: Input alanları ve form bileşenleri

## 📱 Responsive Tasarım

Platform tüm cihazlarda optimize edilmiştir:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Deployment

### Vercel (Önerilen)
1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Otomatik deployment başlayacaktır

### Netlify
1. [Netlify](https://netlify.com) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Build komutunu `npm run build` olarak ayarlayın

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Email**: info@kibrisogrenci.com
- **Website**: https://kibrisogrenci.com
- **GitHub**: https://github.com/your-username/kibris-ogrenci-platformu

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org) ekibine
- [Tailwind CSS](https://tailwindcss.com) ekibine
- [Vercel](https://vercel.com) ekibine
- Tüm katkıda bulunanlara

---

**Kıbrıs Öğrenci Platformu** - Öğrenci hayatını kolaylaştıran dijital platform 🎓 