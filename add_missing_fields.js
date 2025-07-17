// Eksik isApproved alanlarını eklemek için hızlı script
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Firebase konfigürasyonunuzu lib/firebase.ts dosyasından kopyalayın
const firebaseConfig = {
  // Firebase config buraya gelecek - lib/firebase.ts dosyasından kopyalayın
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addMissingFields() {
  console.log('🔄 Eksik alanları ekleme başladı...');
  
  // Spesifik ID için alanları ekle
  const eventId = '1752570895744';
  
  try {
    console.log(`🔧 ${eventId} için eksik alanlar ekleniyor...`);
    
    await updateDoc(doc(db, 'events', eventId), {
      isApproved: false,
      // isVerified zaten var, dokunmuyoruz
    });
    
    console.log(`✅ ${eventId} için isApproved: false eklendi`);
    
  } catch (error) {
    console.error(`❌ Hata: ${eventId} -`, error);
  }
}

// Scripti çalıştır
addMissingFields().then(() => {
  console.log('🎉 İşlem tamamlandı!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 