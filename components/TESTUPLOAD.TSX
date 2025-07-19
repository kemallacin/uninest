"use client";
import React, { useState } from "react";
import { storage } from "../lib/firebase";
import { ref, uploadBytes } from "firebase/storage";

export default function TestUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");

  const handleUpload = async () => {
    if (!file) {
      setResult("Lütfen bir dosya seçin.");
      return;
    }
    try {
      const fileRef = ref(storage, `test/${file.name}`);
      const uploadResult = await uploadBytes(fileRef, file);
      setResult("Yükleme başarılı!");
      console.log("Yükleme sonucu:", uploadResult);
    } catch (e: any) {
      setResult("Hata: " + e.message);
      console.error(e);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} style={{ marginLeft: 8 }}>Yükle</button>
      <div style={{ marginTop: 16, color: "red" }}>{result}</div>
    </div>
  );
}













