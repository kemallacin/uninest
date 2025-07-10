-- Ev Arkadaşı İlanları Tablosu
CREATE TABLE ev_arkadasi_ilanlari (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Kişisel Bilgiler
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  university TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  
  -- İlan Detayları
  listing_type TEXT NOT NULL CHECK (listing_type IN ('arayan', 'veren')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Konum ve Ev Bilgileri
  location TEXT NOT NULL,
  neighborhood TEXT,
  room_type TEXT,
  available_from DATE,
  lease_duration TEXT,
  
  -- Bütçe
  budget TEXT NOT NULL,
  utilities_included BOOLEAN DEFAULT false,
  deposit TEXT,
  
  -- Tercihler
  preferred_gender TEXT,
  preferred_age TEXT,
  smoking TEXT,
  pets TEXT,
  lifestyle TEXT,
  study_habits TEXT,
  visitors TEXT,
  
  -- Ek Bilgiler
  furnished BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  internet BOOLEAN DEFAULT false,
  washing_machine BOOLEAN DEFAULT false,
  balcony BOOLEAN DEFAULT false,
  additional_info TEXT,
  
  -- Fotoğraflar
  photos TEXT[] DEFAULT '{}',
  
  -- Meta Bilgiler
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- İndeksler
  CONSTRAINT valid_age CHECK (age >= 16 AND age <= 100)
);

-- RLS (Row Level Security) Etkinleştir
ALTER TABLE ev_arkadasi_ilanlari ENABLE ROW LEVEL SECURITY;

-- Herkesin ilanları görebilmesi için policy
CREATE POLICY "İlanları herkes görebilir" ON ev_arkadasi_ilanlari
  FOR SELECT USING (true);

-- Kimlik doğrulaması yapılmış kullanıcılar ilan ekleyebilir
CREATE POLICY "Kimlik doğrulaması yapılmış kullanıcılar ilan ekleyebilir" ON ev_arkadasi_ilanlari
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Kullanıcılar kendi ilanlarını güncelleyebilir (opsiyonel)
CREATE POLICY "Kullanıcılar kendi ilanlarını güncelleyebilir" ON ev_arkadasi_ilanlari
  FOR UPDATE USING (auth.uid()::text = created_by);

-- Kullanıcılar kendi ilanlarını silebilir (opsiyonel)
CREATE POLICY "Kullanıcılar kendi ilanlarını silebilir" ON ev_arkadasi_ilanlari
  FOR DELETE USING (auth.uid()::text = created_by);

-- Storage bucket oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy - herkes fotoğrafları görebilir
CREATE POLICY "Fotoğrafları herkes görebilir" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

-- Storage policy - kimlik doğrulaması yapılmış kullanıcılar fotoğraf yükleyebilir
CREATE POLICY "Kimlik doğrulaması yapılmış kullanıcılar fotoğraf yükleyebilir" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated'); 