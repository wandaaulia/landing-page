# 🚀 Cara Setup Storage Bucket Supabase untuk Upload Image

## ⚠️ PENTING: Baca ini terlebih dahulu!

Jika Anda mendapatkan error saat upload image di CMS seperti:
- "Error uploading image: Bucket not found"
- "Error uploading image: new row violates row-level security policy"
- Image tidak ter-upload

Artinya **Storage Bucket belum disetup**. Ikuti langkah-langkah berikut:

---

## 📝 Langkah Setup Storage Bucket

### 1. Login ke Supabase Dashboard
1. Buka [https://app.supabase.com](https://app.supabase.com)
2. Login dengan akun Anda
3. Pilih project Daikin Proshop

### 2. Buat Storage Bucket
1. Di sidebar kiri, klik **Storage**
2. Klik tombol **New bucket**
3. Isi form:
   - **Name**: `images` (harus persis seperti ini, huruf kecil semua)
   - **Public bucket**: ✅ **CENTANG** (sangat penting!)
   - **File size limit**: Kosongkan atau isi 50MB
   - **Allowed MIME types**: Kosongkan
4. Klik **Create bucket**

### 3. Setup Storage Policies (PENTING!)

Setelah bucket dibuat, Anda HARUS setup policies agar:
- Semua orang bisa **melihat** gambar (public read)
- User yang login bisa **upload/delete** gambar

**Cara setup policies:**

1. Masih di halaman **Storage**, klik bucket `images` yang baru dibuat
2. Klik tab **Policies** (di bagian atas)
3. Klik tombol **New policy**

**Policy 1: Public Read Access**
- Klik **"For full customization"** atau **"Create policy"**
- Isi:
  - **Policy name**: `Public Access`
  - **Allowed operation**: `SELECT` (centang)
  - **Target roles**: `public` (pilih dari dropdown)
  - **Policy command**:
    ```sql
    bucket_id = 'images'
    ```
- Klik **Save**

**Policy 2: Authenticated Upload**
- Klik **New policy** lagi
- Isi:
  - **Policy name**: `Authenticated users can upload`
  - **Allowed operation**: `INSERT` (centang)
  - **Target roles**: `authenticated` (pilih dari dropdown)
  - **Policy command**:
    ```sql
    bucket_id = 'images'
    ```
- Klik **Save**

**Policy 3: Authenticated Delete**
- Klik **New policy** lagi
- Isi:
  - **Policy name**: `Authenticated users can delete`
  - **Allowed operation**: `DELETE` (centang)
  - **Target roles**: `authenticated`
  - **Policy command**:
    ```sql
    bucket_id = 'images'
    ```
- Klik **Save**

**Policy 4: Authenticated Update**
- Klik **New policy** lagi
- Isi:
  - **Policy name**: `Authenticated users can update`
  - **Allowed operation**: `UPDATE` (centang)
  - **Target roles**: `authenticated`
  - **Policy command**:
    ```sql
    bucket_id = 'images'
    ```
- Klik **Save**

### 4. Cara Cepat dengan SQL (Alternatif)

Jika Anda lebih suka menggunakan SQL, jalankan kode ini di **SQL Editor**:

```sql
-- Buat bucket (skip jika sudah dibuat via UI)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy: Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy: Authenticated users can update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Policy: Authenticated users can delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

### 5. Verifikasi Setup

1. Kembali ke halaman **Storage** → Bucket `images`
2. Tab **Policies** harus menampilkan 4 policies:
   - ✅ Public Access (SELECT)
   - ✅ Authenticated users can upload (INSERT)
   - ✅ Authenticated users can update (UPDATE)
   - ✅ Authenticated users can delete (DELETE)

---

## ✅ Testing Upload

1. Login ke CMS: `http://localhost:5173/#/login`
2. Masuk ke salah satu menu CMS (Products, Portfolios, dll)
3. Klik **ADD** / **NEW**
4. Upload image
5. Klik **SIMPAN**

Jika berhasil:
- ✅ Image ter-upload
- ✅ Muncul di list
- ✅ Bisa dilihat di public page

Jika masih error:
- ❌ Cek apakah bucket name = `images` (huruf kecil)
- ❌ Cek apakah bucket di-set **Public**
- ❌ Cek apakah 4 policies sudah dibuat
- ❌ Cek console browser untuk error detail (F12 → Console)

---

## 📂 Struktur Folder di Bucket

Aplikasi akan otomatis membuat folder:
- `products/` - untuk gambar produk
- `portfolios/` - untuk gambar portfolio
- `articles/` - untuk gambar artikel
- `testimonials/` - untuk foto testimonial
- `about/` - untuk gambar company profile

Anda **TIDAK** perlu membuat folder ini manual, akan otomatis terbuat saat upload pertama kali.

---

## 🔍 Troubleshooting

### Error: "Bucket not found"
**Solusi**: Bucket belum dibuat. Kembali ke langkah 2.

### Error: "new row violates row-level security policy"
**Solusi**: Policies belum disetup. Kembali ke langkah 3.

### Error: "The resource already exists"
**Solusi**: File dengan nama yang sama sudah ada. Coba upload file lain atau rename file.

### Image tidak muncul di public page
**Solusi**:
1. Cek apakah bucket `images` di-set sebagai **Public bucket**
2. Cek apakah policy "Public Access" sudah dibuat untuk SELECT

### Upload lambat
**Solusi**: Compress gambar terlebih dahulu. Rekomendasi max size: 2MB per file.

---

## 📖 Referensi
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)

---

**Selesai!** 🎉

Sekarang semua upload image di CMS seharusnya berfungsi dengan baik.
