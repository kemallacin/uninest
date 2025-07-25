'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useFormValidation, commonValidationRules } from './useFormValidation'
import TouchButton from './TouchButton'

interface FormData {
  urun_adi: string
  kategori: string
  satis_fiyati: string
  urun_durumu: string
  konum: string
  telefon: string
  eposta: string
  aciklama: string
  urun_fotograflar: { file: File; preview: string }[]
  iletisim_tercihleri: {
    whatsapp: boolean
    telefon: boolean
    eposta: boolean
  }
}

interface SecondHandFormProps {
  onClose: () => void
  onSubmit: (data: any) => void
  initialValues?: any
}

const SecondHandForm: React.FC<SecondHandFormProps> = ({ onClose, onSubmit, initialValues }) => {
  const [formData, setFormData] = useState<FormData>(
    initialValues
      ? {
          urun_adi: initialValues.title || '',
          kategori: initialValues.category || '',
          satis_fiyati: initialValues.price ? String(initialValues.price) : '',
          urun_durumu: initialValues.condition || '',
          konum: initialValues.location || '',
          telefon: initialValues.phone || '',
          eposta: initialValues.email || '',
          aciklama: initialValues.description || '',
          urun_fotograflar: initialValues.images ? initialValues.images.map((img: string) => ({
            file: null as any,
            preview: img
          })) : [],
          iletisim_tercihleri: initialValues.contactPreferences || {
            whatsapp: false,
            telefon: false,
            eposta: false
          }
        }
      : {
          urun_adi: '',
          kategori: '',
          satis_fiyati: '',
          urun_durumu: '',
          konum: '',
          telefon: '',
          eposta: '',
          aciklama: '',
          urun_fotograflar: [],
          iletisim_tercihleri: {
            whatsapp: false,
            telefon: false,
            eposta: false
          }
        }
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validasyon kuralları
  const validationRules = {
    urun_adi: commonValidationRules.title,
    kategori: { required: true },
    satis_fiyati: commonValidationRules.price,
    urun_durumu: { required: true },
    konum: { required: true },
    telefon: commonValidationRules.phone,
    eposta: { email: true },
    aciklama: commonValidationRules.description
  }

  const {
    errors,
    touched,
    validateForm,
    validateField,
    handleBlur,
    handleChange,
    hasErrors,
    hasFieldError,
    isFieldTouched,
    sanitizeInput,
    setErrors,
    setTouched
  } = useFormValidation(validationRules);

  // Form değiştiğinde sürekli validasyon yap
  useEffect(() => {
    // Sadece en az bir alan doluysa validasyon yap
    const hasAnyValue = Object.values(formData).some(value => 
      typeof value === 'string' && value.trim() !== ''
    );
    
    if (hasAnyValue) {
      validateForm(formData);
    }
  }, [formData, validateForm]);

  // Prevent pull-to-refresh when modal is open
  useEffect(() => {
    // Disable pull-to-refresh completely
    document.body.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehaviorY = 'none';
    document.body.style.touchAction = 'none';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehaviorY = 'none';
    document.documentElement.style.touchAction = 'none';
    
    return () => {
      // Restore original behavior
      document.body.style.overscrollBehavior = '';
      document.body.style.overscrollBehaviorY = '';
      document.body.style.touchAction = '';
      document.body.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehaviorY = '';
      document.documentElement.style.touchAction = '';
    };
  }, []);

  useEffect(() => {
    // When the modal is mounted, prevent the body from scrolling
    document.body.style.overflow = 'hidden';

    // When the modal is unmounted, restore the body's scrolling
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount


  const categories = [
    { value: 'electronics', label: 'Elektronik' },
    { value: 'furniture', label: 'Mobilya' },
    { value: 'books', label: 'Kitap' },
    { value: 'clothing', label: 'Giyim' },
    { value: 'sports', label: 'Spor' },
    { value: 'other', label: 'Diğer' }
  ]

  const conditions = [
    { value: 'new', label: 'Sıfır' },
    { value: 'like-new', label: 'Sıfır Gibi' },
    { value: 'good', label: 'İyi' },
    { value: 'fair', label: 'Orta' },
    { value: 'old', label: 'Eski' }
  ]

  const locations = [
    { value: 'lefkosa', label: 'Lefkoşa' },
    { value: 'gazimagusa', label: 'Gazimağusa' },
    { value: 'girne', label: 'Girne' },
    { value: 'lefke', label: 'Lefke' },
    { value: 'iskele', label: 'İskele' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    // Checkbox handling
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      
      // Handle nested object fields (like iletisim_tercihleri.whatsapp)
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.')
        setFormData(prev => ({
          ...prev,
          [parentKey]: {
            ...prev[parentKey as keyof FormData] as any,
            [childKey]: checked
          }
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }))
      }
      return
    }
    
    // Regular input handling
    const sanitizedValue = sanitizeInput(value, name)
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))

    // Validasyon ve touched durumu
    handleChange(name, sanitizedValue)
    
    // Alanı hemen touched olarak işaretle (değer varsa)
    if (sanitizedValue.trim() !== '') {
      setTouched(prev => ({ ...prev, [name]: true }))
    }
  }

  // Form geçerli mi kontrol et
  const isFormValid = () => {
    // Tüm zorunlu alanların dolu olduğunu kontrol et
    const requiredFieldsFilled = 
      formData.urun_adi.trim() !== '' &&
      formData.kategori !== '' &&
      formData.satis_fiyati.trim() !== '' &&
      formData.urun_durumu !== '' &&
      formData.konum !== '' &&
      formData.telefon.trim() !== '' &&
      formData.aciklama.trim() !== '';

    // En az bir iletişim tercihi seçili olmalı
    const hasContactPreference = 
      formData.iletisim_tercihleri.whatsapp ||
      formData.iletisim_tercihleri.telefon ||
      formData.iletisim_tercihleri.eposta;

    // E-posta seçiliyse e-posta alanı da dolu olmalı
    const emailValid = !formData.iletisim_tercihleri.eposta || 
                      (formData.iletisim_tercihleri.eposta && formData.eposta.trim() !== '');

    // Mevcut hataları kontrol et (validateForm zaten useEffect'te çağrılıyor)
    const noValidationErrors = Object.keys(errors).length === 0;

    return requiredFieldsFilled && hasContactPreference && emailValid && noValidationErrors;
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    handleBlur(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // İletişim tercihi kontrolü
      const hasContactPreference = 
        formData.iletisim_tercihleri.whatsapp ||
        formData.iletisim_tercihleri.telefon ||
        formData.iletisim_tercihleri.eposta;

      if (!hasContactPreference) {
        setError('En az bir iletişim tercihi seçmelisiniz (WhatsApp, Telefon veya E-posta)');
        setIsSubmitting(false);
        return;
      }

      // E-posta seçiliyse e-posta alanı dolu olmalı
      if (formData.iletisim_tercihleri.eposta && formData.eposta.trim() === '') {
        setError('E-posta tercihi seçtiyseniz, e-posta adresinizi girmelisiniz');
        setIsSubmitting(false);
        return;
      }

      // Form validasyonu
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setError('Lütfen form hatalarını düzeltin');
        setIsSubmitting(false);
        return;
      }

      // Resimleri kontrol et
      const images = formData.urun_fotograflar
        .filter(photo => photo.file instanceof File)
        .map(photo => photo.file);

      const itemData = {
        urun_adi: formData.urun_adi,
        kategori: formData.kategori,
        satis_fiyati: formData.satis_fiyati,
        urun_durumu: formData.urun_durumu,
        konum: formData.konum,
        telefon: formData.telefon,
        eposta: formData.eposta,
        aciklama: formData.aciklama,
        iletisim_tercihleri: formData.iletisim_tercihleri,
        images: images, // Sadece geçerli File objelerini gönder
        // Also send English field names for compatibility
        title: formData.urun_adi,
        category: formData.kategori, // İngilizce id
        price: parseFloat(formData.satis_fiyati),
        condition: formData.urun_durumu, // İngilizce id
        location: formData.konum,
        phone: formData.telefon,
        email: formData.eposta,
        description: formData.aciklama,
        contactPreferences: formData.iletisim_tercihleri,
        createdAt: new Date().toISOString()
      }

      console.log('Form data being submitted:', itemData);

      if (images.length > 4) {
        setError('En fazla 4 fotoğraf yükleyebilirsiniz!');
        setIsSubmitting(false);
        return;
      }

      onSubmit(itemData)
      setFormData(prev => ({ ...prev, urun_fotograflar: [] }))
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => {
      // Daha kapsamlı dosya tipi kontrolü - HEIC ve diğer formatları da kabul et
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
      const fileType = file.type.toLowerCase();
      return fileType.startsWith('image/') || validTypes.includes(fileType) || file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|heic|heif)$/);
    });
    
    if (formData.urun_fotograflar.length + imageFiles.length > 4) {
      alert('En fazla 4 fotoğraf yükleyebilirsiniz!');
      return;
    }
    
    // Resim sıkıştırma fonksiyonu
    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Maksimum boyutlar
          const maxWidth = 1200;
          const maxHeight = 1200;
          
          let { width, height } = img;
          
          // Boyut oranını koru
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Resmi çiz ve sıkıştır
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Base64 olarak dışa aktar (0.8 kalite)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedBase64);
        };
        
        img.onerror = () => reject(new Error('Resim yüklenemedi'));
        
        // File'ı image'a yükle
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Dosya okunamadı'));
        reader.readAsDataURL(file);
      });
    };

    // Dosyaları sıkıştırarak ekle
    const processFiles = async () => {
      const newPhotos: { file: File; preview: string }[] = [];
      
      for (const file of imageFiles) {
        // Dosya boyutu kontrolü (10MB - telefon fotoğrafları için artırıldı)
        if (file.size > 10 * 1024 * 1024) {
          alert(`"${file.name}" çok büyük (max 10MB)`);
          continue;
        }

        try {
          const compressedBase64 = await compressImage(file);
          newPhotos.push({
            file: file,
            preview: compressedBase64
          });
        } catch (error) {
          console.error('Resim işleme hatası:', error);
          alert(`"${file.name}" işlenirken hata oluştu`);
        }
      }

      setFormData(prev => ({
        ...prev,
        urun_fotograflar: [...prev.urun_fotograflar, ...newPhotos]
      }));
    };

    processFiles();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(file => {
      // Daha kapsamlı dosya tipi kontrolü - HEIC ve diğer formatları da kabul et
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
      const fileType = file.type.toLowerCase();
      return fileType.startsWith('image/') || validTypes.includes(fileType) || file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|heic|heif)$/);
    });

    if (formData.urun_fotograflar.length + imageFiles.length > 4) {
      alert('En fazla 4 fotoğraf yükleyebilirsiniz!');
      return;
    }

    // Resim sıkıştırma fonksiyonu
    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Maksimum boyutlar
          const maxWidth = 1200;
          const maxHeight = 1200;
          
          let { width, height } = img;
          
          // Boyut oranını koru
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Resmi çiz ve sıkıştır
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Base64 olarak dışa aktar (0.8 kalite)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedBase64);
        };
        
        img.onerror = () => reject(new Error('Resim yüklenemedi'));
        
        // File'ı image'a yükle
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Dosya okunamadı'));
        reader.readAsDataURL(file);
      });
    };

    // Dosyaları sıkıştırarak ekle
    const processFiles = async () => {
      const newPhotos: { file: File; preview: string }[] = [];
      
      for (const file of imageFiles) {
        // Dosya boyutu kontrolü (10MB - telefon fotoğrafları için artırıldı)
        if (file.size > 10 * 1024 * 1024) {
          alert(`"${file.name}" çok büyük (max 10MB)`);
          continue;
        }

        try {
          const compressedBase64 = await compressImage(file);
          newPhotos.push({
            file: file,
            preview: compressedBase64
          });
        } catch (error) {
          console.error('Resim işleme hatası:', error);
          alert(`"${file.name}" işlenirken hata oluştu`);
        }
      }

      setFormData(prev => ({
        ...prev,
        urun_fotograflar: [...prev.urun_fotograflar, ...newPhotos]
      }));
    };

    processFiles();
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            İlan Başarıyla Yayınlandı!
          </h3>
          <p className="text-gray-600">
            İlanınız başarıyla yayınlandı ve diğer kullanıcılar tarafından görülebilir.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start md:items-center justify-center z-50 p-2 md:p-4 pt-4 md:pt-0" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto p-4 md:p-6 shadow-xl mt-4 md:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {initialValues ? 'İlanı Düzenle' : 'Yeni İlan Ver'}
          </h3>
          <TouchButton
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </TouchButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-40">
          {/* Ürün Bilgileri */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Ürün Bilgileri</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                name="urun_adi"
                value={formData.urun_adi}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  hasFieldError('urun_adi') && isFieldTouched('urun_adi')
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
                placeholder="Ürün adını girin"
              />
              {hasFieldError('urun_adi') && isFieldTouched('urun_adi') && (
                <p className="mt-1 text-sm text-red-600">{errors.urun_adi}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  hasFieldError('kategori') && isFieldTouched('kategori')
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
              >
                <option value="">Kategori Seçin</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {hasFieldError('kategori') && isFieldTouched('kategori') && (
                <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satış Fiyatı (TL) *
              </label>
              <input
                type="number"
                name="satis_fiyati"
                value={formData.satis_fiyati}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  hasFieldError('satis_fiyati') && isFieldTouched('satis_fiyati')
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
                placeholder="1500"
              />
              {hasFieldError('satis_fiyati') && isFieldTouched('satis_fiyati') && (
                <p className="mt-1 text-sm text-red-600">{errors.satis_fiyati}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Durumu *
              </label>
              <select
                name="urun_durumu"
                value={formData.urun_durumu}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  hasFieldError('urun_durumu') && isFieldTouched('urun_durumu')
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
              >
                <option value="">Durum Seçin</option>
                {conditions.map(condition => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
              {hasFieldError('urun_durumu') && isFieldTouched('urun_durumu') && (
                <p className="mt-1 text-sm text-red-600">{errors.urun_durumu}</p>
              )}
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">İletişim Bilgileri</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konum *
              </label>
              <select
                name="konum"
                value={formData.konum}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  hasFieldError('konum') && isFieldTouched('konum')
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
              >
                <option value="">Konum Seçin</option>
                {locations.map(location => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
              {hasFieldError('konum') && isFieldTouched('konum') && (
                <p className="mt-1 text-sm text-red-600">{errors.konum}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                name="telefon"
                value={formData.telefon}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  hasFieldError('telefon') && isFieldTouched('telefon')
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
                placeholder="+90 555 123 45 67"
              />
              {hasFieldError('telefon') && isFieldTouched('telefon') && (
                <p className="mt-1 text-sm text-red-600">{errors.telefon}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta {formData.iletisim_tercihleri.eposta && '*'}
              </label>
              <input
                type="email"
                name="eposta"
                value={formData.eposta}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  hasFieldError('eposta') && isFieldTouched('eposta')
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
                placeholder={formData.iletisim_tercihleri.eposta ? "ornek@email.com (zorunlu)" : "ornek@email.com (isteğe bağlı)"}
              />
              {hasFieldError('eposta') && isFieldTouched('eposta') && (
                <p className="mt-1 text-sm text-red-600">{errors.eposta}</p>
              )}
            </div>
          </div>

          {/* İletişim Tercihleri */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">İletişim Tercihleri</h4>
            <p className="text-sm text-gray-600 mb-4">Hangi yöntemlerle iletişime geçilmesini istiyorsunuz? (En az bir seçenek seçiniz)</p>
            {!formData.iletisim_tercihleri.whatsapp && 
             !formData.iletisim_tercihleri.telefon && 
             !formData.iletisim_tercihleri.eposta && (
              <div className="text-red-600 text-sm mb-2">⚠️ En az bir iletişim yöntemi seçmelisiniz</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="iletisim_tercihleri.whatsapp"
                  checked={formData.iletisim_tercihleri.whatsapp}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">📱</span>
                  <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="iletisim_tercihleri.telefon"
                  checked={formData.iletisim_tercihleri.telefon}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">📞</span>
                  <span className="text-sm font-medium text-gray-700">Telefon</span>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="iletisim_tercihleri.eposta"
                  checked={formData.iletisim_tercihleri.eposta}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-purple-600">📧</span>
                  <span className="text-sm font-medium text-gray-700">E-posta</span>
                </div>
              </label>
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Açıklaması *
            </label>
            <textarea
              name="aciklama"
              value={formData.aciklama}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent resize-none ${
                hasFieldError('aciklama') && isFieldTouched('aciklama')
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
              placeholder="Ürününüzün detaylı açıklamasını yazın..."
            />
            {hasFieldError('aciklama') && isFieldTouched('aciklama') && (
              <p className="mt-1 text-sm text-red-600">{errors.aciklama}</p>
            )}
          </div>

          {/* Fotoğraf Yükleme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Fotoğrafları (En fazla 4 adet)
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.urun_fotograflar.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.urun_fotograflar.map((photo, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={photo.preview} 
                        alt={`Preview ${index + 1}`} 
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFormData(prev => ({
                            ...prev,
                            urun_fotograflar: prev.urun_fotograflar.filter((_, i) => i !== index)
                          }))
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {formData.urun_fotograflar.length < 4 && (
                    <div className="h-24 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">+ Ekle</span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Fotoğraf yüklemek için tıklayın veya sürükleyin
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF, WebP, HEIC (max. 4 adet, her biri max. 10MB)
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6">
            <TouchButton
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              İptal
            </TouchButton>
            <TouchButton
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Yayınlanıyor...' : 'İlanı Yayınla'}
            </TouchButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SecondHandForm 