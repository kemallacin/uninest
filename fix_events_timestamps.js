// Firestore'daki etkinliklerin createdAt alanlarını düzeltme scripti
// Bu scripti Node.js ile çalıştırın

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

// Firebase konfigürasyonunuzu buraya ekleyin
const firebaseConfig = {
  // Firebase config buraya gelecek
  // Projenizin firebase.ts dosyasından kopyalayın
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixEventTimestamps() {
  console.log('🔄 Etkinlik timestamp\'lerini düzeltme başladı...');
  
  try {
    // Tüm etkinlikleri çek
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    console.log(`📊 ${snapshot.docs.length} etkinlik bulundu`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const eventId = docSnap.id;
      
      try {
        // createdAt alanını kontrol et
        if (data.createdAt && typeof data.createdAt === 'string') {
          console.log(`🔧 Düzeltiliyor: ${eventId} - createdAt: ${data.createdAt}`);
          
          // String'i Date'e çevir, sonra Timestamp'e çevir
          const dateValue = new Date(data.createdAt);
          const timestamp = Timestamp.fromDate(dateValue);
          
          // Güncelle
          await updateDoc(doc(db, 'events', eventId), {
            createdAt: timestamp
          });
          
          console.log(`✅ Düzeltildi: ${eventId}`);
          fixedCount++;
        } else if (data.createdAt && data.createdAt.seconds) {
          console.log(`✅ Zaten doğru: ${eventId} (timestamp)`);
        } else if (!data.createdAt) {
          console.log(`⚠️ createdAt yok: ${eventId} - bugünün tarihi atanacak`);
          
          // createdAt yoksa bugünün tarihini ata
          await updateDoc(doc(db, 'events', eventId), {
            createdAt: Timestamp.now()
          });
          
          console.log(`✅ Bugünün tarihi atandı: ${eventId}`);
          fixedCount++;
        }
      } catch (error) {
        console.error(`❌ Hata: ${eventId} -`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Özet:');
    console.log(`✅ Düzeltilen: ${fixedCount}`);
    console.log(`❌ Hata: ${errorCount}`);
    console.log(`📋 Toplam: ${snapshot.docs.length}`);
    
  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
fixEventTimestamps().then(() => {
  console.log('🎉 İşlem tamamlandı!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 