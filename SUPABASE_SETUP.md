# Supabase Setup for SecondHandForm Component

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 2. Supabase Database Setup

### Create the `second_hand_items` table:

```sql
CREATE TABLE second_hand_items (
  id BIGSERIAL PRIMARY KEY,
  urun_adi TEXT NOT NULL,
  kategori TEXT NOT NULL,
  satis_fiyati DECIMAL(10,2) NOT NULL,
  orijinal_fiyat DECIMAL(10,2),
  urun_durumu TEXT NOT NULL,
  konum TEXT NOT NULL,
  telefon TEXT NOT NULL,
  eposta TEXT,
  aciklama TEXT NOT NULL,
  urun_fotograf TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE second_hand_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read
CREATE POLICY "Allow public read access" ON second_hand_items
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON second_hand_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow users to update their own items
CREATE POLICY "Allow users to update own items" ON second_hand_items
  FOR UPDATE USING (auth.uid()::text = created_by);

-- Create policy to allow users to delete their own items
CREATE POLICY "Allow users to delete own items" ON second_hand_items
  FOR DELETE USING (auth.uid()::text = created_by);
```

### Create Storage Bucket:

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a new bucket called `images`
4. Set the bucket to public
5. Create the following storage policy:

```sql
-- Allow public read access to images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

## 3. Install Dependencies

```bash
npm install @supabase/supabase-js
```

## 4. Usage

Import and use the component in your page:

```tsx
import SecondHandForm from '../components/SecondHandForm'

// In your component
const [showForm, setShowForm] = useState(false)

// In your JSX
{showForm && (
  <SecondHandForm 
    onClose={() => setShowForm(false)}
    onSuccess={() => {
      // Handle success - e.g., refresh data, show notification
      console.log('Item posted successfully!')
    }}
  />
)}
```

## 5. Features

- ✅ Image upload to Supabase Storage
- ✅ Form validation
- ✅ Drag & drop image upload
- ✅ Loading states
- ✅ Error handling
- ✅ Success feedback
- ✅ Responsive design
- ✅ TypeScript support

## 6. Database Schema

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| urun_adi | TEXT | Product name |
| kategori | TEXT | Category (elektronik, mobilya, etc.) |
| satis_fiyati | DECIMAL(10,2) | Sale price |
| orijinal_fiyat | DECIMAL(10,2) | Original price (optional) |
| urun_durumu | TEXT | Condition (yeni, çok iyi, etc.) |
| konum | TEXT | Location (lefkosa, gazimagusa, etc.) |
| telefon | TEXT | Phone number |
| eposta | TEXT | Email (optional) |
| aciklama | TEXT | Description |
| urun_fotograf | TEXT | Image URL from storage |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp | 