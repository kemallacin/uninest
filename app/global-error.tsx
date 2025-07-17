'use client'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-yellow-900 to-slate-900 text-white px-4">
        <h1 className="text-6xl font-black mb-4">Bir Hata Oluştu</h1>
        <h2 className="text-2xl font-bold mb-4">Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.</h2>
        {error?.message && <pre className="mb-8 text-sm text-red-200 bg-red-950 rounded p-4 max-w-xl overflow-x-auto">{error.message}</pre>}
        <button onClick={() => reset()} className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl text-lg shadow-lg hover:bg-yellow-300 transition mb-2">Tekrar Dene</button>
        <a href="/" className="px-6 py-3 bg-white/10 text-yellow-300 font-bold rounded-xl text-lg shadow-lg hover:bg-white/20 transition">Ana Sayfaya Dön</a>
      </body>
    </html>
  );
}