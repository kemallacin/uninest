import React, { useState, useEffect } from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  tab?: 'login' | 'register';
  setTab?: (tab: 'login' | 'register') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, tab: tabProp, setTab: setTabProp }) => {
  const [tab, setTabState] = useState<'login' | 'register'>(tabProp || 'login');
  const router = useRouter();

  // Dışarıdan tab değişirse güncelle
  useEffect(() => {
    if (tabProp) setTabState(tabProp);
  }, [tabProp]);

  const setTab = (t: 'login' | 'register') => {
    setTabState(t);
    setTabProp && setTabProp(t);
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [agree, setAgree] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-indigo-700/80 backdrop-blur-sm">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative animate-fade-in border border-white/30">
        {/* Kapat */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Kapat"
        >
          ×
        </button>
        {/* Tablar */}
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 font-bold text-base tracking-wide rounded-l-lg transition-colors duration-200 ${tab === 'login' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setTab('login')}
          >
            Giriş
          </button>
          <button
            className={`px-6 py-2 font-bold text-base tracking-wide rounded-r-lg transition-colors duration-200 ${tab === 'register' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setTab('register')}
          >
            Kayıt
          </button>
        </div>
        {/* Form */}
        {tab === 'register' ? (
          <div className="flex flex-col items-center justify-center gap-8 py-8">
            <h2 className="text-3xl font-extrabold text-center mb-4 text-primary-700 drop-shadow">Kayıt Ol</h2>
            <p className="text-lg text-center text-gray-700 max-w-xs mb-2">Modern ve güvenli kayıt formu ile hemen aramıza katıl!</p>
            <ul className="text-gray-600 text-base mb-4 space-y-2 text-left max-w-xs mx-auto">
              <li>✔️ Hızlı ve kolay kayıt</li>
              <li>✔️ Tüm öğrenci hizmetlerine tek panelden erişim</li>
              <li>✔️ Güvenli ve gizli bilgi yönetimi</li>
              <li>✔️ Mobil ve web uyumlu</li>
            </ul>
            <button
              className="w-full max-w-xs bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-4 rounded-2xl text-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              onClick={() => {
                onClose();
                router.push('/hesap-olustur');
              }}
            >
              <span className="relative z-10">Hesap Oluştur</span>
              <svg className="w-7 h-7 ml-2 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-8 py-8">
            <h2 className="text-3xl font-extrabold text-center mb-4 text-primary-700 drop-shadow">Giriş Yap</h2>
            <p className="text-lg text-center text-gray-700 max-w-xs mb-2">Hesabına güvenli ve hızlı şekilde giriş yap!</p>
            <ul className="text-gray-600 text-base mb-4 space-y-2 text-left max-w-xs mx-auto">
              <li>✔️ Güvenli oturum açma</li>
              <li>✔️ Tüm öğrenci hizmetlerine erişim</li>
              <li>✔️ Mobil ve web uyumlu</li>
              <li>✔️ Şifremi unuttum desteği</li>
            </ul>
            <button
              className="w-full max-w-xs bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl text-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              onClick={() => {
                onClose();
                router.push('/');
              }}
            >
              <span className="relative z-10">Giriş Yap</span>
              <svg className="w-7 h-7 ml-2 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal; 