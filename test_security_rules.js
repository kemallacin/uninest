// Firebase Storage Security Rules Test Script
// Bu script Firebase Storage güvenlik kurallarını test eder

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Firebase konfigürasyonu (gerçek değerlerinizi kullanın)
const firebaseConfig = {
  // Firebase config buraya gelecek
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

// Test dosyaları oluştur
function createTestFile(size, type) {
  const content = 'A'.repeat(size);
  const blob = new Blob([content], { type });
  return blob;
}

// Test senaryoları
const testScenarios = [
  {
    name: "✅ Geçerli PDF Upload (Kimlik Doğrulanmış)",
    path: "notes/test-valid.pdf",
    file: createTestFile(1024 * 1024, 'application/pdf'), // 1MB PDF
    shouldPass: true,
    requiresAuth: true
  },
  {
    name: "❌ Çok Büyük PDF Upload (11MB)",
    path: "notes/test-large.pdf", 
    file: createTestFile(11 * 1024 * 1024, 'application/pdf'), // 11MB PDF
    shouldPass: false,
    requiresAuth: true
  },
  {
    name: "❌ Geçersiz Dosya Türü (TXT)",
    path: "notes/test-invalid.txt",
    file: createTestFile(1024, 'text/plain'), // 1KB TXT
    shouldPass: false,
    requiresAuth: true
  },
  {
    name: "❌ Kimlik Doğrulaması Olmadan Upload",
    path: "notes/test-unauth.pdf",
    file: createTestFile(1024, 'application/pdf'), // 1KB PDF
    shouldPass: false,
    requiresAuth: false
  },
  {
    name: "✅ Geçerli Profil Resmi Upload",
    path: "profile_images/test-user-id/avatar.jpg",
    file: createTestFile(1024 * 1024, 'image/jpeg'), // 1MB JPEG
    shouldPass: true,
    requiresAuth: true
  },
  {
    name: "❌ Çok Büyük Profil Resmi (6MB)",
    path: "profile_images/test-user-id/large-avatar.jpg",
    file: createTestFile(6 * 1024 * 1024, 'image/jpeg'), // 6MB JPEG
    shouldPass: false,
    requiresAuth: true
  },
  {
    name: "❌ Güvenli Olmayan Dosya Adı",
    path: "notes/../../../etc/passwd.pdf",
    file: createTestFile(1024, 'application/pdf'), // 1KB PDF
    shouldPass: false,
    requiresAuth: true
  }
];

// Test çalıştır
async function runSecurityTest(scenario) {
  console.log(`\n🧪 Test: ${scenario.name}`);
  console.log(`📁 Path: ${scenario.path}`);
  console.log(`📄 File: ${scenario.file.size} bytes, ${scenario.file.type}`);
  
  try {
    // Kimlik doğrulaması gerekiyorsa giriş yap
    if (scenario.requiresAuth) {
      // Test kullanıcısı ile giriş yap (gerçek email/password kullanın)
      // await signInWithEmailAndPassword(auth, 'test@example.com', 'password');
      console.log('🔐 Kimlik doğrulaması gerekiyor (simüle ediliyor)');
    } else {
      // Çıkış yap
      await signOut(auth);
      console.log('🚫 Kimlik doğrulaması yok');
    }
    
    // Dosya upload et
    const storageRef = ref(storage, scenario.path);
    await uploadBytes(storageRef, scenario.file);
    
    // Başarılı upload
    console.log(`✅ Upload başarılı: ${scenario.shouldPass ? 'BEKLENEN' : 'BEKLENMEYEN'}`);
    
    // Test dosyasını temizle
    try {
      await deleteObject(storageRef);
      console.log('🧹 Test dosyası temizlendi');
    } catch (deleteError) {
      console.log('⚠️ Test dosyası temizlenemedi:', deleteError.message);
    }
    
    return scenario.shouldPass;
    
  } catch (error) {
    // Upload başarısız
    console.log(`❌ Upload başarısız: ${error.message}`);
    console.log(`📋 Hata kodu: ${error.code}`);
    console.log(`🎯 Sonuç: ${!scenario.shouldPass ? 'BEKLENEN' : 'BEKLENMEYEN'}`);
    
    return !scenario.shouldPass;
  }
}

// Tüm testleri çalıştır
async function runAllTests() {
  console.log('🔥 Firebase Storage Security Rules Test Suite');
  console.log('=' * 50);
  
  let passedTests = 0;
  let totalTests = testScenarios.length;
  
  for (const scenario of testScenarios) {
    const testPassed = await runSecurityTest(scenario);
    if (testPassed) {
      passedTests++;
    }
    
    // Testler arasında kısa bekleme
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Test Sonuçları:');
  console.log(`✅ Başarılı: ${passedTests}/${totalTests}`);
  console.log(`❌ Başarısız: ${totalTests - passedTests}/${totalTests}`);
  console.log(`🎯 Başarı Oranı: ${(passedTests / totalTests * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 Tüm güvenlik testleri başarıyla geçti!');
  } else {
    console.log('\n⚠️ Bazı güvenlik testleri başarısız oldu. Kuralları kontrol edin.');
  }
}

// Manuel test fonksiyonları
export const securityTestUtils = {
  // PDF upload testi
  async testPDFUpload(file, userEmail, userPassword) {
    try {
      await signInWithEmailAndPassword(auth, userEmail, userPassword);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `notes/${fileName}`);
      
      await uploadBytes(storageRef, file);
      console.log('✅ PDF upload başarılı');
      return true;
    } catch (error) {
      console.log('❌ PDF upload başarısız:', error.message);
      return false;
    }
  },
  
  // Profil resmi upload testi
  async testProfileImageUpload(file, userId, userEmail, userPassword) {
    try {
      await signInWithEmailAndPassword(auth, userEmail, userPassword);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `profile_images/${userId}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      console.log('✅ Profil resmi upload başarılı');
      return true;
    } catch (error) {
      console.log('❌ Profil resmi upload başarısız:', error.message);
      return false;
    }
  },
  
  // Kimlik doğrulaması olmadan test
  async testUnauthenticatedUpload(file) {
    try {
      await signOut(auth);
      const storageRef = ref(storage, `notes/test-unauth.pdf`);
      
      await uploadBytes(storageRef, file);
      console.log('❌ Kimlik doğrulaması olmadan upload başarılı - GÜVENLİK AÇIĞI!');
      return false;
    } catch (error) {
      console.log('✅ Kimlik doğrulaması olmadan upload reddedildi:', error.message);
      return true;
    }
  }
};

// Eğer doğrudan çalıştırılırsa tüm testleri çalıştır
if (typeof window === 'undefined') {
  runAllTests().catch(console.error);
}

export default { runAllTests, securityTestUtils }; 