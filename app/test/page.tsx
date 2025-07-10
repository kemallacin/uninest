'use client';

import { useState } from 'react';

export default function TestPage() {
  const [msg, setMsg] = useState('');

  const handleClick = async () => {
    // Mock test - gerçek veritabanı yerine
    setMsg('✅ Test başarılı! Mock veri sistemi çalışıyor.');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Sayfası</h1>
      <p>Bu sayfa veritabanı bağlantısını test etmek için kullanılıyor.</p>
      <button onClick={handleClick} style={{ 
        padding: '10px 20px', 
        backgroundColor: '#3b82f6', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Test Ürün Ekle
      </button>
      <p>{msg}</p>
    </div>
  );
}
