export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white px-4">
      <h1 className="text-6xl font-black mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h2>
      <p className="mb-8 text-lg text-gray-300">Aradığınız sayfa bulunamadı veya kaldırılmış olabilir.</p>
      <a href="/" className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl text-lg shadow-lg hover:bg-yellow-300 transition">Ana Sayfaya Dön</a>
    </div>
  );
} 