# 🔧 Fix Portfolio Table Structure

## ⚠️ Error yang Muncul

Jika Anda mendapat error:
```
Could not find the 'capacity' column of 'portfolios' in the schema cache
```

Artinya struktur tabel `portfolios` di database Anda berbeda dengan kode aplikasi.

---

## ✅ Solusi 1: Update Tabel Portfolios di Supabase (RECOMMENDED)

Jalankan SQL berikut di **SQL Editor** Supabase:

### Jika tabel belum ada, buat dengan struktur yang benar:

```sql
-- Hapus tabel lama jika ada (HATI-HATI: ini akan menghapus semua data)
-- DROP TABLE IF EXISTS portfolios;

-- Buat tabel portfolios dengan struktur yang benar
CREATE TABLE IF NOT EXISTS portfolios (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  category TEXT NOT NULL DEFAULT 'Residential',
  location TEXT,
  products_used TEXT,
  challenge TEXT,
  solution TEXT,
  impact TEXT,
  image_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON portfolios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON portfolios FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON portfolios FOR DELETE TO authenticated USING (true);
```

### Jika tabel sudah ada, update strukturnya:

```sql
-- Cek kolom yang ada
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'portfolios';

-- Hapus kolom yang tidak dipakai (jika ada)
ALTER TABLE portfolios DROP COLUMN IF EXISTS capacity;
ALTER TABLE portfolios DROP COLUMN IF EXISTS description;

-- Tambahkan kolom products_used jika belum ada
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS products_used TEXT;

-- Pastikan kolom yang wajib ada
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS challenge TEXT;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS solution TEXT;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS impact TEXT;
```

---

## ✅ Solusi 2: Cek Struktur Tabel yang Ada

Jalankan query ini untuk melihat struktur tabel portfolios Anda saat ini:

```sql
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'portfolios'
ORDER BY ordinal_position;
```

Pastikan tabel Anda memiliki kolom-kolom berikut:

| Column Name    | Type                        | Required |
|---------------|----------------------------|----------|
| id            | bigint                     | YES      |
| title         | text                       | YES      |
| slug          | text                       | YES      |
| summary       | text                       | NO       |
| category      | text                       | YES      |
| location      | text                       | NO       |
| products_used | text                       | NO       |
| challenge     | text                       | NO       |
| solution      | text                       | NO       |
| impact        | text                       | NO       |
| image_path    | text                       | YES      |
| created_at    | timestamp with time zone   | NO       |
| updated_at    | timestamp with time zone   | NO       |

---

## 📋 Kolom yang TIDAK digunakan lagi:

- ❌ `capacity` - Diganti dengan `products_used`
- ❌ `description` - Diganti dengan `summary`

---

## 🧪 Testing

Setelah update struktur database:

1. Restart aplikasi: `npm run dev`
2. Login ke CMS
3. Buka `/portfolios`
4. Klik **ADD PROJECT**
5. Isi form dan upload image
6. Klik **SIMPAN**

Seharusnya sekarang tidak ada error lagi! ✅

---

## 🔍 Troubleshooting

### Error: "column does not exist"
**Solusi**: Jalankan ALTER TABLE untuk menambahkan kolom yang hilang

### Error: "violates not-null constraint"
**Solusi**: Pastikan field yang required sudah diisi (title, category, image_path)

### Data lama hilang
**Solusi**: Jangan gunakan `DROP TABLE`, gunakan `ALTER TABLE` untuk update struktur

---

## 📖 Reference

Struktur lengkap tabel ada di: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
