# 🧪 Performance Test Rehberi

Bu dokümantasyon, UniNestcy projesinin performans testlerini nasıl yapacağınızı açıklar.

## 📋 Test Türleri

### 1. **Hızlı Test (Quick Test)**
Ana sayfa için hızlı performans kontrolü.

```bash
# Server'ı başlat
npm run dev

# Yeni terminal'de hızlı test yap
npm run test:quick
```

### 2. **Kapsamlı Test (Full Performance Test)**
Tüm sayfalar için detaylı performans analizi.

```bash
# Server'ı başlat
npm run dev

# Yeni terminal'de kapsamlı test yap
npm run test:performance
```

### 3. **Bundle Analizi**
JavaScript bundle'larının boyut analizi.

```bash
npm run analyze:win
```

### 4. **Lighthouse Manuel Test**
Tek sayfa için manuel Lighthouse test'i.

```bash
# Ana sayfa
lighthouse http://localhost:3000 --output=html

# Belirli sayfa
lighthouse http://localhost:3000/ev-arkadasi --output=html
```

## 🎯 Test Kriterleri

### **Performance Skorları**
- **90-100**: Mükemmel ✅
- **70-89**: İyi ⚠️
- **0-69**: Düşük ❌

### **Core Web Vitals Hedefleri**
- **FCP (First Contentful Paint)**: < 1.8s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 800ms

## 📊 Test Sonuçları

### **Hızlı Test Sonuçları**
- Dosya: `./quick-test.json`
- Format: JSON
- İçerik: Performance skoru ve Core Web Vitals

### **Kapsamlı Test Sonuçları**
- Klasör: `./performance-reports/`
- Dosyalar:
  - `performance-summary.json` - Özet rapor
  - `{sayfa}-lighthouse.json` - Her sayfa için JSON rapor
  - `{sayfa}-lighthouse.html` - Her sayfa için HTML rapor

## 🔧 Test Konfigürasyonu

### **Test Edilen Sayfalar**
```javascript
pages: [
  '/',              // Ana sayfa
  '/ev-arkadasi',   // Ev arkadaşı
  '/ikinci-el',     // İkinci el
  '/etkinlikler',   // Etkinlikler
  '/notlar',        // Notlar
  '/ozel-dersler',  // Özel dersler
  '/dolmus'         // Dolmuş
]
```

### **Lighthouse Konfigürasyonu**
```javascript
{
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  formFactor: 'desktop',
  throttling: {
    rttMs: 40,
    throughputKbps: 10240,
    cpuSlowdownMultiplier: 1
  }
}
```

## 🚀 Test Senaryoları

### **Senaryo 1: Development Test**
```bash
# 1. Server'ı başlat
npm run dev

# 2. Hızlı test yap
npm run test:quick

# 3. Sonuçları kontrol et
cat quick-test.json
```

### **Senaryo 2: Production Test**
```bash
# 1. Production build yap
npm run build

# 2. Production server'ı başlat
npm run start

# 3. Kapsamlı test yap
npm run test:performance
```

### **Senaryo 3: Bundle Analizi**
```bash
# 1. Bundle analizi yap
npm run analyze:win

# 2. Browser'da analiz raporunu aç
# .next/analyze/client.html dosyasını aç
```

## 📈 Performance Monitoring

### **Real-time Monitoring**
Proje içinde Performance Monitor component'i bulunur:
- Sağ alt köşede 📊 butonu
- Core Web Vitals real-time tracking
- Custom event logging

### **Console Monitoring**
```javascript
// Performance raporu oluştur
console.log(performanceMonitor.generateReport());

// Metrics al
const metrics = performanceMonitor.getMetrics();
console.log('FCP:', metrics.FCP);
console.log('LCP:', metrics.LCP);
```

## 🐛 Sorun Giderme

### **Server Çalışmıyor Hatası**
```bash
# Server'ın çalıştığından emin olun
npm run dev

# Port kontrolü
netstat -an | findstr :3000
```

### **Lighthouse Hatası**
```bash
# Lighthouse'u yeniden yükle
npm install -g lighthouse

# Chrome kontrolü
lighthouse --version
```

### **Bundle Analyzer Hatası**
```bash
# Node modules'u temizle
rm -rf node_modules
npm install

# Cache temizle
npm run build -- --no-cache
```

## 📝 Test Raporu Örneği

```
📋 PERFORMANCE TEST RAPORU
==================================================
Test Tarihi: 17.07.2025 09:30:45
Test Edilen Sayfa: 7

📊 ORTALAMA SKORLAR:
  Performance: 85.2/100
  Accessibility: 92.1/100
  Best Practices: 88.7/100
  SEO: 95.3/100

🏆 EN İYİ PERFORMANS:
  Sayfa: home
  Skor: 92.1/100

⚠️  EN KÖTÜ PERFORMANS:
  Sayfa: ev-arkadasi
  Skor: 78.3/100

📄 DETAYLI RAPORLAR:
  home: ./performance-reports/home-lighthouse.html
  ev-arkadasi: ./performance-reports/ev-arkadasi-lighthouse.html
  ...

💡 ÖNERİLER:
  • Performance skorunu artırmak için image optimization yapın
  • Bundle size'ı küçültün
  • Lazy loading kullanın
```

## 🎯 İyileştirme Önerileri

### **Performance < 90 ise:**
1. Image optimization
2. Bundle size reduction
3. Code splitting
4. Lazy loading
5. Caching strategies

### **Accessibility < 90 ise:**
1. ARIA labels ekle
2. Color contrast kontrol
3. Keyboard navigation
4. Screen reader support

### **SEO < 90 ise:**
1. Meta tags optimize
2. Structured data ekle
3. Sitemap güncelle
4. Canonical URLs

## 📞 Destek

Test sırasında sorun yaşarsanız:
1. Console loglarını kontrol edin
2. Network tab'ını inceleyin
3. Performance tab'ını kullanın
4. Lighthouse raporlarını detaylı inceleyin 