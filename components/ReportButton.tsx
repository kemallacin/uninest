"use client";
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function ReportButton({ contentType, contentId }: { contentType: string, contentId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReport = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      alert("Raporlamak için giriş yapmalısınız.");
      setLoading(false);
      return;
    }
    await addDoc(collection(db, "reports"), {
      reporterId: user.uid,
      contentType,
      contentId,
      reason,
      createdAt: serverTimestamp(),
    });
    setLoading(false);
    setSuccess(true);
    
    // 2 saniye sonra modal'ı kapat
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
      setReason("");
    }, 2000);
  };

  return (
    <>
      <button
        className="flex items-center justify-center gap-1 bg-red-100 text-red-600 hover:bg-red-200 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
        onClick={() => setOpen(true)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        Şikayet
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">İçeriği Şikayet Et</h2>
            <p className="text-gray-600 text-sm mb-4">
              Bu içerik neden uygunsuz olduğunu açıklayın. Şikayetiniz incelenecek ve gerekli işlem yapılacaktır.
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Şikayet sebebinizi detaylı olarak açıklayın..."
              rows={4}
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setOpen(false)} 
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleReport}
                disabled={loading || !reason.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gönderiliyor...
                  </>
                ) : (
                  'Şikayet Gönder'
                )}
              </button>
            </div>
            {success && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                ✅ Şikayetiniz başarıyla gönderildi! İnceleme süreci başlatılmıştır.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 