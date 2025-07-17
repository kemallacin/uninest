"use client";

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SifremiUnuttumClient() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch (err: any) {
      setError('Hata: ' + (err.message || 'Bir hata oluştu.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <button
          onClick={() => router.push('/giris')}
          className="absolute top-8 right-8 z-20 text-gray-300 hover:text-white text-3xl font-bold focus:outline-none bg-black/20 rounded-full w-12 h-12 flex items-center justify-center transition"
          aria-label="Kapat"
        >
          ×
        </button>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="transition-all duration-1000 opacity-100 translate-y-0">
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-8">
              <h1 className="text-4xl md:text-6xl font-black text-white">
                <span className="bg-gradient-to-r from-white via-yellow-300 to-white bg-clip-text text-transparent">
                  UniNestcy
                </span>
              </h1>
            </Link>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Şifre Sıfırlama
            </h2>
            <p className="text-xl text-gray-300">
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                  placeholder="ornek@email.com"
                />
              </div>
              {message && <div className="text-green-400 font-semibold text-center">{message}</div>}
              {error && <div className="text-red-400 font-semibold text-center">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25 disabled:opacity-60"
              >
                <span className="relative z-10">{loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
            <div className="mt-8 text-center">
              <Link href="/giris" className="text-yellow-400 hover:text-yellow-300 font-medium underline">
                Girişe Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 