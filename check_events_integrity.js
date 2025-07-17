// Firebase'deki etkinlik verilerini kontrol eden script
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Firebase konfigürasyonunuzu lib/firebase.ts dosyasından kopyalayın
const firebaseConfig = {
  // Firebase config buraya gelecek
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkEventsIntegrity() {
  console.log('🔍 Etkinlik verilerinin bütünlüğü kontrol ediliyor...');
  
  try {
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    console.log(`📊 Toplam etkinlik sayısı: ${snapshot.docs.length}`);
    console.log('\n📋 Etkinlik detayları:');
    
    let validCount = 0;
    let invalidCount = 0;
    
    for (let i = 0; i < snapshot.docs.length; i++) {
      const docSnap = snapshot.docs[i];
      const data = docSnap.data();
      
      const isValid = data.title && data.id;
      
      console.log(`${i + 1}. ID: "${docSnap.id}"`);
      console.log(`   Title: "${data.title || 'YOK'}"`);
      console.log(`   isApproved: ${data.isApproved}`);
      console.log(`   isVerified: ${data.isVerified}`);
      console.log(`   Geçerli: ${isValid ? '✅' : '❌'}`);
      
      // Spesifik ID'yi kontrol et
      if (docSnap.id === '1752576434266') {
        console.log('   🔍 ARANAN ID BULUNDU!');
        
        // Double check
        const directCheck = await getDoc(doc(db, 'events', '1752576434266'));
        console.log(`   🔍 Direct check exists: ${directCheck.exists()}`);
      }
      
      if (isValid) validCount++;
      else invalidCount++;
      
      console.log('   ---');
    }
    
    console.log(`\n📊 Özet:`);
    console.log(`✅ Geçerli: ${validCount}`);
    console.log(`❌ Geçersiz: ${invalidCount}`);
    
    // Spesifik ID kontrolü
    console.log('\n🔍 Spesifik ID kontrolü: 1752576434266');
    try {
      const specificDoc = await getDoc(doc(db, 'events', '1752576434266'));
      console.log(`Exists: ${specificDoc.exists()}`);
      if (specificDoc.exists()) {
        console.log('Data:', specificDoc.data());
      }
    } catch (error) {
      console.error('Spesifik ID kontrol hatası:', error);
    }
    
  } catch (error) {
    console.error('❌ Kontrol hatası:', error);
  }
}

// Scripti çalıştır
checkEventsIntegrity().then(() => {
  console.log('🎉 Kontrol tamamlandı!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 