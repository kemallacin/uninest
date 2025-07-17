// Firebase'de isApproved alanı undefined olan etkinlikleri düzeltme scripti
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Firebase konfigürasyonunuzu lib/firebase.ts dosyasından kopyalayın
const firebaseConfig = {
  // Firebase config buraya gelecek
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixUndefinedIsApproved() {
  console.log('🔄 isApproved alanı undefined olan etkinlikleri düzeltme başladı...');
  
  try {
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    console.log(`📊 ${snapshot.docs.length} etkinlik bulundu`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const eventId = docSnap.id;
      
      try {
        // isApproved alanını kontrol et
        if (data.isApproved === undefined || data.isApproved === null) {
          console.log(`🔧 Düzeltiliyor: ${eventId} - isApproved: ${data.isApproved} -> false`);
          
          // isApproved'u false yap (varsayılan olarak onaysız)
          await updateDoc(doc(db, 'events', eventId), {
            isApproved: false,
            isVerified: false // isVerified'u da ekle
          });
          
          console.log(`✅ Düzeltildi: ${eventId}`);
          fixedCount++;
        } else {
          console.log(`✅ Zaten doğru: ${eventId} - isApproved: ${data.isApproved}`);
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
fixUndefinedIsApproved().then(() => {
  console.log('🎉 İşlem tamamlandı!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 