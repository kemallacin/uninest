#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Performance Test Başlatılıyor...\n');

// Test konfigürasyonu
const config = {
  baseUrl: 'http://localhost:3000',
  pages: [
    '/',
    '/ev-arkadasi',
    '/ikinci-el',
    '/etkinlikler',
    '/notlar',
    '/ozel-dersler',
    '/dolmus'
  ],
  outputDir: './performance-reports',
  lighthouseConfig: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    }
  }
};

// Output dizinini oluştur
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Test fonksiyonları
function runLighthouseTest(url, pageName) {
  console.log(`📊 Testing: ${pageName} (${url})`);
  
  const outputPath = path.join(config.outputDir, `${pageName}-lighthouse.json`);
  const htmlPath = path.join(config.outputDir, `${pageName}-lighthouse.html`);
  
  try {
    // Lighthouse test'i çalıştır
    const command = `lighthouse ${config.baseUrl}${url} --output=json --output-path=${outputPath} --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo`;
    
    execSync(command, { stdio: 'pipe' });
    
    // JSON raporunu oku ve analiz et
    const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    
    // HTML raporu da oluştur
    execSync(`lighthouse ${config.baseUrl}${url} --output=html --output-path=${htmlPath} --chrome-flags="--headless --no-sandbox"`, { stdio: 'pipe' });
    
    return {
      page: pageName,
      url: url,
      performance: report.categories.performance.score * 100,
      accessibility: report.categories.accessibility.score * 100,
      bestPractices: report.categories['best-practices'].score * 100,
      seo: report.categories.seo.score * 100,
      metrics: {
        fcp: report.audits['first-contentful-paint']?.numericValue,
        lcp: report.audits['largest-contentful-paint']?.numericValue,
        fid: report.audits['max-potential-fid']?.numericValue,
        cls: report.audits['cumulative-layout-shift']?.numericValue,
        ttfb: report.audits['server-response-time']?.numericValue
      },
      reportPath: htmlPath
    };
    
  } catch (error) {
    console.error(`❌ Error testing ${pageName}:`, error.message);
    return null;
  }
}

function generateSummaryReport(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    totalPages: results.length,
    averageScores: {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0
    },
    bestPerforming: null,
    worstPerforming: null,
    details: results
  };
  
  // Ortalama skorları hesapla
  const validResults = results.filter(r => r !== null);
  if (validResults.length > 0) {
    summary.averageScores.performance = validResults.reduce((sum, r) => sum + r.performance, 0) / validResults.length;
    summary.averageScores.accessibility = validResults.reduce((sum, r) => sum + r.accessibility, 0) / validResults.length;
    summary.averageScores.bestPractices = validResults.reduce((sum, r) => sum + r.bestPractices, 0) / validResults.length;
    summary.averageScores.seo = validResults.reduce((sum, r) => sum + r.seo, 0) / validResults.length;
    
    // En iyi ve en kötü performans
    summary.bestPerforming = validResults.reduce((best, current) => 
      current.performance > best.performance ? current : best
    );
    summary.worstPerforming = validResults.reduce((worst, current) => 
      current.performance < worst.performance ? current : worst
    );
  }
  
  return summary;
}

function printReport(summary) {
  console.log('\n📋 PERFORMANCE TEST RAPORU');
  console.log('=' .repeat(50));
  console.log(`Test Tarihi: ${new Date(summary.timestamp).toLocaleString('tr-TR')}`);
  console.log(`Test Edilen Sayfa: ${summary.totalPages}`);
  console.log('');
  
  console.log('📊 ORTALAMA SKORLAR:');
  console.log(`  Performance: ${summary.averageScores.performance.toFixed(1)}/100`);
  console.log(`  Accessibility: ${summary.averageScores.accessibility.toFixed(1)}/100`);
  console.log(`  Best Practices: ${summary.averageScores.bestPractices.toFixed(1)}/100`);
  console.log(`  SEO: ${summary.averageScores.seo.toFixed(1)}/100`);
  console.log('');
  
  if (summary.bestPerforming) {
    console.log('🏆 EN İYİ PERFORMANS:');
    console.log(`  Sayfa: ${summary.bestPerforming.page}`);
    console.log(`  Skor: ${summary.bestPerforming.performance.toFixed(1)}/100`);
    console.log('');
  }
  
  if (summary.worstPerforming) {
    console.log('⚠️  EN KÖTÜ PERFORMANS:');
    console.log(`  Sayfa: ${summary.worstPerforming.page}`);
    console.log(`  Skor: ${summary.worstPerforming.performance.toFixed(1)}/100`);
    console.log('');
  }
  
  console.log('📄 DETAYLI RAPORLAR:');
  summary.details.forEach(result => {
    if (result) {
      console.log(`  ${result.page}: ${result.reportPath}`);
    }
  });
  console.log('');
  
  // Öneriler
  console.log('💡 ÖNERİLER:');
  if (summary.averageScores.performance < 90) {
    console.log('  • Performance skorunu artırmak için image optimization yapın');
    console.log('  • Bundle size\'ı küçültün');
    console.log('  • Lazy loading kullanın');
  }
  if (summary.averageScores.accessibility < 90) {
    console.log('  • Accessibility için ARIA labels ekleyin');
    console.log('  • Color contrast\'ı kontrol edin');
    console.log('  • Keyboard navigation\'ı test edin');
  }
  if (summary.averageScores.seo < 90) {
    console.log('  • Meta tags\'leri optimize edin');
    console.log('  • Structured data ekleyin');
    console.log('  • Sitemap\'i güncelleyin');
  }
}

// Ana test fonksiyonu
async function runPerformanceTests() {
  console.log('🔍 Server kontrol ediliyor...');
  
  try {
    // Server'ın çalışıp çalışmadığını kontrol et
    execSync(`curl -s ${config.baseUrl} > /dev/null`, { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Server çalışmıyor! Lütfen "npm run dev" komutunu çalıştırın.');
    process.exit(1);
  }
  
  console.log('✅ Server çalışıyor, testler başlatılıyor...\n');
  
  const results = [];
  
  // Her sayfa için test yap
  for (const page of config.pages) {
    const pageName = page === '/' ? 'home' : page.slice(1).replace(/\//g, '-');
    const result = runLighthouseTest(page, pageName);
    results.push(result);
    
    // Rate limiting - her test arasında 2 saniye bekle
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Rapor oluştur
  const summary = generateSummaryReport(results);
  
  // Raporu dosyaya kaydet
  const summaryPath = path.join(config.outputDir, 'performance-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // Konsola yazdır
  printReport(summary);
  
  console.log(`📁 Tüm raporlar ${config.outputDir} klasöründe saklandı.`);
  console.log(`📄 Özet rapor: ${summaryPath}`);
}

// Script'i çalıştır
runPerformanceTests().catch(console.error); 