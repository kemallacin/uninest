'use client';

import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, query, orderBy, where } from "firebase/firestore";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function AdminReportsClient() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'statistics'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDocs(collection(db, "users"));
        const adminUser = userSnap.docs.find(d => d.id === user.uid && d.data().role === "admin");
        if (adminUser) setIsAdmin(true);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchReports = async () => {
      const reportsRef = collection(db, "reports");
      const snap = await getDocs(reportsRef);
      setReports(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchReports();
  }, [isAdmin, actionLoading]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchNotes = async () => {
      const notesRef = collection(db, "notes");
      const notesQuery = query(notesRef, orderBy('downloadCount', 'desc'));
      const snap = await getDocs(notesQuery);
      setNotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNotes();
  }, [isAdmin]);

  const handleDeleteReport = async (id: string) => {
    if (!window.confirm("Raporu silmek istediğinize emin misiniz?")) return;
    setActionLoading(id);
    try {
      await deleteDoc(doc(db, "reports", id));
    } catch (e) {
      alert("Silme işlemi başarısız: " + e);
    }
    setActionLoading(null);
  };

  // İstatistik hesaplamaları
  const totalNotes = notes.length;
  const totalDownloads = notes.reduce((sum, note) => sum + (note.downloadCount || 0), 0);
  const averageDownloads = totalNotes > 0 ? Math.round(totalDownloads / totalNotes) : 0;
  const mostDownloadedNote = notes.length > 0 ? notes[0] : null;
  const approvedNotes = notes.filter(note => note.isApproved === true).length;
  const pendingNotes = notes.filter(note => note.isApproved !== true).length;

  // En popüler dersler
  const subjectStats = notes.reduce((acc, note) => {
    const subject = note.subject || 'Bilinmeyen';
    if (!acc[subject]) {
      acc[subject] = { count: 0, downloads: 0 };
    }
    acc[subject].count++;
    acc[subject].downloads += note.downloadCount || 0;
    return acc;
  }, {} as Record<string, { count: number; downloads: number }>);

  const topSubjects = Object.entries(subjectStats)
    .sort(([,a], [,b]) => (a as { downloads: number }).downloads - (b as { downloads: number }).downloads)
    .slice(0, 5);

  if (loading) return <div>Yükleniyor...</div>;
  if (!isAdmin) return <div>Erişim yok</div>;

  return (
    <div>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Raporlar & İstatistikler</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'reports' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 Kullanıcı Raporları
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'statistics' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📊 Not İstatistikleri
          </button>
        </div>

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Kullanıcı Raporları</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left">Raporlayan</th>
                    <th className="py-3 px-4 text-left">İçerik Tipi</th>
                    <th className="py-3 px-4 text-left">İçerik ID</th>
                    <th className="py-3 px-4 text-left">Sebep</th>
                    <th className="py-3 px-4 text-left">Tarih</th>
                    <th className="py-3 px-4 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-8">
                        Hiç rapor bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    reports.map((r) => {
                      let url = "#";
                      if (r.contentType === "secondhand") url = `/ikinci-el/${r.contentId}`;
                      else if (r.contentType === "not") url = `/notlar/${r.contentId}`;
                      else if (r.contentType === "event") url = `/etkinlikler/${r.contentId}`;
                      else if (r.contentType === "roommate") url = `/ev-arkadasi/${r.contentId}`;
                      else if (r.contentType === "tutor") url = `/ozel-dersler/${r.contentId}`;
                      return (
                        <tr key={r.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{r.reporterId || "-"}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              r.contentType === 'not' ? 'bg-blue-100 text-blue-800' :
                              r.contentType === 'event' ? 'bg-green-100 text-green-800' :
                              r.contentType === 'roommate' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {r.contentType || "-"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs font-mono">{r.contentId || "-"}</td>
                          <td className="py-3 px-4">{r.reason || "-"}</td>
                          <td className="py-3 px-4">
                            {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : "-"}
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            <a href={url} target="_blank" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">İçeriğe Git</a>
                            <button
                              onClick={() => handleDeleteReport(r.id)}
                              disabled={actionLoading === r.id}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="space-y-8">
            {/* Genel İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Toplam Not</h3>
                <p className="text-3xl font-bold text-blue-600">{totalNotes}</p>
                <p className="text-sm text-gray-500">Onaylanmış: {approvedNotes}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Toplam İndirme</h3>
                <p className="text-3xl font-bold text-green-600">{totalDownloads.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Ortalama: {averageDownloads}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Onay Bekleyen</h3>
                <p className="text-3xl font-bold text-yellow-600">{pendingNotes}</p>
                <p className="text-sm text-gray-500">Onaylanmamış notlar</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">En Popüler Not</h3>
                <p className="text-lg font-bold text-purple-600">
                  {mostDownloadedNote ? mostDownloadedNote.downloadCount || 0 : 0}
                </p>
                <p className="text-sm text-gray-500">
                  {mostDownloadedNote ? mostDownloadedNote.title : 'Henüz not yok'}
                </p>
              </div>
            </div>

            {/* En Popüler Dersler */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">En Popüler Dersler (İndirme Sayısına Göre)</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topSubjects.map(([subject, stats], index) => (
                    <div key={subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                                                 <div>
                           <h3 className="font-semibold text-gray-800">{subject}</h3>
                           <p className="text-sm text-gray-600">{(stats as { count: number }).count} not</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="text-2xl font-bold text-green-600">{(stats as { downloads: number }).downloads}</p>
                         <p className="text-sm text-gray-500">indirme</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* En Çok İndirilen Notlar */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">En Çok İndirilen Notlar</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left">Sıra</th>
                      <th className="py-3 px-4 text-left">Not Başlığı</th>
                      <th className="py-3 px-4 text-left">Ders</th>
                      <th className="py-3 px-4 text-left">Üniversite</th>
                      <th className="py-3 px-4 text-left">İndirme</th>
                      <th className="py-3 px-4 text-left">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.slice(0, 10).map((note, index) => (
                      <tr key={note.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{note.title}</td>
                        <td className="py-3 px-4">{note.subject}</td>
                        <td className="py-3 px-4">{note.university}</td>
                        <td className="py-3 px-4">
                          <span className="text-lg font-bold text-green-600">{note.downloadCount || 0}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            note.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {note.isApproved ? 'Onaylandı' : 'Onay Bekliyor'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 