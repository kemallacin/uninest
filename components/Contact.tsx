'use client'

import React, { useState } from 'react'
import { useToast } from './ToastProvider';
import { useFormValidation, commonValidationRules } from './useFormValidation';
import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Validasyon kuralları
  const validationRules = {
    name: commonValidationRules.name,
    email: commonValidationRules.email,
    subject: {
      required: true,
      minLength: 5,
      maxLength: 100
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000
    }
  }

  const {
    errors,
    touched,
    validateForm,
    handleBlur,
    handleChange,
    hasErrors,
    hasFieldError,
    isFieldTouched,
    sanitizeInput
  } = useFormValidation(validationRules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basit validasyon
      if (!formData.name.trim()) {
        showToast('Lütfen adınızı ve soyadınızı girin', 'error');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.email.trim()) {
        showToast('Lütfen e-posta adresinizi girin', 'error');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.subject.trim()) {
        showToast('Lütfen bir konu seçin', 'error');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.message.trim()) {
        showToast('Lütfen mesajınızı yazın', 'error');
        setIsSubmitting(false);
        return;
      }

      // E-posta formatı kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showToast('Lütfen geçerli bir e-posta adresi girin', 'error');
        setIsSubmitting(false);
        return;
      }

      // Firebase'e mesajı kaydet
      await addDoc(collection(db, 'contact_messages'), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        timestamp: serverTimestamp(),
        status: 'unread'
      });
      
      showToast('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      showToast('Mesaj gönderilirken bir hata oluştu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  }



  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bize Ulaşın
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya işbirliği teklifleriniz için bizimle iletişime geçin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Mesaj Gönder</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Adınız ve soyadınız"
                  />

                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />

                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Konu *
                </label>
                                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Konu Seçin</option>
                  <option value="genel">Genel Bilgi</option>
                  <option value="teknik">Teknik Destek</option>
                  <option value="oneri">Öneri/Şikayet</option>
                  <option value="isbirligi">İşbirliği</option>
                  <option value="diger">Diğer</option>
                </select>

              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Mesajınız *
                </label>
                                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                />

              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">İletişim Bilgileri</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">E-posta</h4>
                    <p className="text-gray-300">info@uninest.app</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Adres</h4>
                    <p className="text-gray-300">Kıbrıs, Lefkoşa<br />Marmara Bölgesi, 19. Sokak<br />4. Bina, Kat 2</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Çalışma Saatleri</h4>
                    <p className="text-gray-300">Pazartesi - Cumartesi: 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Sık Sorulan Sorular</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-primary-400 mb-1">Platform nasıl çalışır?</h5>
                  <p className="text-sm text-gray-300">UniNestcy, Kıbrıs'taki öğrencilerin ev arkadaşı bulması, ikinci el eşya alım-satımı yapması, etkinliklere katılması ve dolmuş saatlerini öğrenmesi için tasarlanmış güvenli bir platformdur. Hesap oluşturup e-posta doğrulaması yaptıktan sonra tüm özelliklerden faydalanabilirsiniz.</p>
                </div>
                <div>
                  <h5 className="font-medium text-primary-400 mb-1">Güvenlik nasıl sağlanır?</h5>
                  <p className="text-sm text-gray-300">E-posta doğrulama sistemi, admin onay süreci, kullanıcı rapor sistemi ve güvenli mesajlaşma ile kullanıcı güvenliği sağlanır. Tüm ilanlar yayınlanmadan önce admin tarafından kontrol edilir.</p>
                </div>
                <div>
                  <h5 className="font-medium text-primary-400 mb-1">Platform ücretli mi?</h5>
                  <p className="text-sm text-gray-300">UniNestcy tamamen ücretsizdir. Kayıt olmak, ilan vermek, mesajlaşmak ve tüm özelliklerden yararlanmak için herhangi bir ücret alınmaz.</p>
                </div>
                <div>
                  <h5 className="font-medium text-primary-400 mb-1">Hangi üniversitelerden öğrenciler katılabilir?</h5>
                  <p className="text-sm text-gray-300">Kıbrıs'taki tüm üniversitelerden öğrenciler platforma katılabilir. Yakın Doğu, Doğu Akdeniz, Girne, Lefke Avrupa, Final ve diğer tüm üniversitelerden öğrenciler hoş geldiniz.</p>
                </div>
                <div>
                  <h5 className="font-medium text-primary-400 mb-1">Mobil uygulama ne zaman çıkacak?</h5>
                  <p className="text-sm text-gray-300">Mobil uygulamamız yakında çıkacak. Erken erişim için kayıt olarak ilk kullananlardan biri olabilir ve özel avantajlardan yararlanabilirsiniz.</p>
                </div>
                <div>
                  <h5 className="font-medium text-primary-400 mb-1">Sorun yaşadığımda nasıl yardım alabilirim?</h5>
                  <p className="text-sm text-gray-300">İletişim formu üzerinden bize ulaşabilir, e-posta gönderebilir veya sosyal medya hesaplarımızdan destek alabilirsiniz. Genellikle 24 saat içinde yanıt veriyoruz.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact 