# Firebase Storage Security Rules Deployment Rehberi

## 📋 Güvenlik Kuralları Özeti

Oluşturduğumuz güvenlik kuralları aşağıdaki koruma seviyelerini sağlar:

### 🔒 Güvenlik Özellikleri
- ✅ **Authentication Required**: Tüm işlemler kimlik doğrulaması gerektirir
- ✅ **File Size Limits**: Dosya boyutu sınırları (PDF: 10MB, Resim: 5MB)
- ✅ **Content Type Validation**: Sadece belirli dosya türlerine izin
- ✅ **Path Security**: Path traversal saldırılarına karşı koruma
- ✅ **User-based Access**: Kullanıcılar sadece kendi dosyalarına erişebilir
- ✅ **Admin Controls**: Admin kullanıcılar için özel yetkiler
- ✅ **Secure File Names**: Güvenli dosya adı kontrolleri

### 📁 Dosya Yolu Yapısı
```
/notes/{noteId}                    - PDF notları (10MB max)
/profile_images/{userId}/{imageId} - Profil resimleri (5MB max)
/uploads/{userId}/{path}           - Kullanıcı dosyaları (20MB max)
/public/{path}                     - Genel dosyalar (admin only write)
/users/{userId}/files/{fileName}   - Kişisel dosyalar (15MB max)
```

## 🚀 Deployment Adımları

### 1. Firebase Console Üzerinden Deployment

1. **Firebase Console'a Giriş Yapın**
   - https://console.firebase.google.com
   - `uninest-1f332` projesini seçin

2. **Storage Bölümüne Gidin**
   - Sol menüden "Storage" seçin
   - "Rules" sekmesine tıklayın

3. **Kuralları Güncelleyin**
   - Mevcut kuralları silin
   - `firebase_storage_rules.rules` dosyasının içeriğini kopyalayın
   - Rules editörüne yapıştırın
   - "Publish" butonuna tıklayın

### 2. Firebase CLI ile Deployment

```bash
# Firebase CLI kurulumu (eğer yoksa)
npm install -g firebase-tools

# Giriş yapın
firebase login

# Proje klasöründe firebase.json dosyası oluşturun
{
  "storage": {
    "rules": "firebase_storage_rules.rules"
  }
}

# Rules'ları deploy edin
firebase deploy --only storage
```

## 🧪 Test Senaryoları

### Başarılı Test Senaryoları
```javascript
// ✅ Kimlik doğrulanmış kullanıcı PDF yüklemesi
const user = firebase.auth().currentUser;
const file = new File([pdfBlob], "note.pdf", { type: "application/pdf" });
const ref = storage.ref(`notes/${Date.now()}-note.pdf`);
await ref.put(file);

// ✅ Kullanıcı kendi profil resmini yüklemesi
const imageFile = new File([imageBlob], "profile.jpg", { type: "image/jpeg" });
const ref = storage.ref(`profile_images/${user.uid}/profile.jpg`);
await ref.put(imageFile);
```

### Başarısız Test Senaryoları
```javascript
// ❌ Kimlik doğrulaması olmadan yükleme
// ❌ 10MB'dan büyük PDF yükleme
// ❌ PDF olmayan dosyayı notes klasörüne yükleme
// ❌ Başka kullanıcının dosyasına erişim
// ❌ Güvenli olmayan dosya adları
```

## ⚠️ Önemli Güvenlik Notları

### 1. Dosya Boyutu Sınırları
- **PDF Notları**: Maximum 10MB
- **Profil Resimleri**: Maximum 5MB
- **Genel Yüklemeler**: Maximum 20MB
- **Kişisel Dosyalar**: Maximum 15MB

### 2. İzin Verilen Dosya Türleri
- **Resimler**: jpg, jpeg, png, gif, webp
- **Dökümanlar**: pdf, doc, docx, xls, xlsx
- **Metin**: txt, csv

### 3. Güvenlik Kontrolleri
- Path traversal koruması (`../` engellendi)
- XSS koruması (`<>` karakterleri engellendi)
- Dosya adı uzunluk sınırı (255 karakter)
- Sadece güvenli karakterler (`a-zA-Z0-9_.-`)

## 🔧 Uygulama Kodunda Değişiklikler

### NotlarClient.tsx Güncellemesi
```javascript
// Dosya yolunu güvenlik kurallarına uygun hale getirin
const timestamp = Date.now();
const fileName = `${timestamp}-${formData.file.name}`;
const storageRef = ref(storage, `notes/${fileName}`);
```

### Profil Resmi Yükleme
```javascript
// Profil resmi yolu
const storageRef = ref(storage, `profile_images/${user.uid}/${fileName}`);
```

## 📊 Monitoring ve Alerting

### 1. Firebase Console'da İzleme
- Storage > Usage sekmesinden kullanım istatistiklerini izleyin
- Rules > Logs sekmesinden güvenlik kuralı loglarını kontrol edin

### 2. Güvenlik Alertleri
- Anormal yükleme aktivitesi
- Başarısız authentication denemeleri
- Büyük dosya yükleme girişimleri

## 🚨 Acil Durum Prosedürleri

### Güvenlik İhlali Durumunda
1. **Hemen Rules'ları Kilitle**
   ```javascript
   // Tüm erişimi geçici olarak kapat
   allow read, write: if false;
   ```

2. **Şüpheli Dosyaları İncele**
   - Storage console'dan dosyaları kontrol edin
   - Şüpheli dosyaları silin

3. **Kullanıcı Hesaplarını Kontrol Edin**
   - Authentication console'dan şüpheli hesapları inceleyin
   - Gerekirse hesapları devre dışı bırakın

## ✅ Deployment Checklist

- [ ] Rules dosyası oluşturuldu
- [ ] Firebase Console'a yüklendi
- [ ] Test senaryoları çalıştırıldı
- [ ] Uygulama kodu güncellendi
- [ ] Monitoring kuruldu
- [ ] Ekip bilgilendirildi
- [ ] Backup alındı

## 📝 Notlar

- Bu kurallar production ortamı için tasarlanmıştır
- Herhangi bir değişiklik öncesi test ortamında deneyiniz
- Kurallar deploy edildikten sonra 1-2 dakika içinde aktif olur
- Değişiklikler geri alınabilir (Firebase Console > Rules > History) 