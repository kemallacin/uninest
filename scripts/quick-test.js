#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('⚡ Hızlı Performance Test Başlatılıyor...\n');

// Basit Lighthouse test'i
function runQuickTest() {
  try {
    console.log('📊 Ana sayfa test ediliyor...');
    
    const command = 'lighthouse http://localhost:3000 --output=json --output-path=./quick-test.json --only-categories=performance --chrome-flags="--headless --no-sandbox"';
    execSync(command, { stdio: 'pipe' });
    
    // Sonuçları oku ve analiz et
    const report = JSON.parse(fs.readFileSync('./quick-test.json', 'utf8'));
    const performance = report.categories.performance.score * 100;
    
    console.log('\n📋 HIZLI TEST SONUÇLARI');
    console.log('=' .repeat(30));
    console.log(`Performance Skoru: ${performance.toFixed(1)}/100`);
    
    // Core Web Vitals
    const fcp = report.audits['first-contentful-paint']?.numericValue;
    const lcp = report.audits['largest-contentful-paint']?.numericValue;
    const cls = report.audits['cumulative-layout-shift']?.numericValue;
    
    console.log('\n📊 Core Web Vitals:');
    console.log(`  FCP: ${fcp ? (fcp / 1000).toFixed(2) + 's' : 'N/A'}`);
    console.log(`  LCP: ${lcp ? (lcp / 1000).toFixed(2) + 's' : 'N/A'}`);
    console.log(`  CLS: ${cls ? cls.toFixed(3) : 'N/A'}`);
    
    // Değerlendirme
    console.log('\n🎯 DEĞERLENDİRME:');
    if (performance >= 90) {
      console.log('  ✅ Mükemmel! Performance skoru çok iyi.');
    } else if (performance >= 70) {
      console.log('  ⚠️  İyi, ancak iyileştirme yapılabilir.');
    } else {
      console.log('  ❌ Performance skoru düşük, optimizasyon gerekli.');
    }
    
    // Öneriler
    console.log('\n💡 ÖNERİLER:');
    if (performance < 90) {
      console.log('  • Bundle size\'ı küçültün');
      console.log('  • Image optimization yapın');
      console.log('  • Lazy loading kullanın');
      console.log('  • Code splitting uygulayın');
    }
    
    console.log('\n📄 Detaylı rapor: ./quick-test.json');
    
  } catch (error) {
    console.error('❌ Test hatası:', error.message);
    console.log('💡 Lütfen server\'ın çalıştığından emin olun: npm run dev');
  }
}

runQuickTest(); 