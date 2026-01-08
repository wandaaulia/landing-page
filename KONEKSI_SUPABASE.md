# 🔐 Panduan Koneksi Supabase - Daikin Proshop CMS

## ✅ Status Integrasi

Semua halaman sudah terintegrasi dengan Supabase Auth:
- ✅ Login (`/login`)
- ✅ Sign Up (`/signup`)
- ✅ Forgot Password (`/forgot-password`)
- ✅ Reset Password (`/reset-password`)
- ✅ Protected Routes (Dashboard, CMS Pages)
- ✅ Logout Function

---

## 🚀 Cara Koneksi ke Supabase

### 1. Kredensial Sudah Terkonfigurasi

File [.env.local](.env.local) sudah berisi kredensial Supabase Anda:

```env
VITE_SUPABASE_URL=https://xhyozguzmmfhhmgfroid.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Setup Database Tables

Buka [Supabase Dashboard](https://app.supabase.com/project/xhyozguzmmfhhmgfroid) dan jalankan SQL berikut:

```sql
-- Enable Email Auth
-- Sudah enabled by default di Supabase, tapi pastikan di Dashboard:
-- Authentication → Providers → Email → Enabled

-- Buat tables untuk CMS (opsional, jika ingin menyimpan data)
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  image_path TEXT,
  description TEXT,
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolios (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  products_used TEXT,
  image_path TEXT,
  summary TEXT,
  challenge TEXT,
  solution TEXT,
  impact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  year TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  image_path TEXT,
  category TEXT,
  author TEXT,
  published_at DATE,
  read_time TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON articles FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Enable insert for authenticated users" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON products FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON portfolios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON portfolios FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON portfolios FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON articles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON articles FOR DELETE TO authenticated USING (true);
```

### 3. Setup Storage Bucket (untuk upload images)

1. Buka **Storage** di Supabase Dashboard
2. Klik **New Bucket**
3. Nama: `images`
4. Pilih **Public bucket**
5. Klik **Create bucket**

Jalankan SQL policy untuk storage:

```sql
-- Allow public read
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated delete
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');
```

### 4. Setup Email Authentication

Di Supabase Dashboard:
1. Pergi ke **Authentication** → **Providers**
2. Pastikan **Email** provider enabled
3. Di **Email Templates**, Anda bisa customize email:
   - Confirm signup
   - Reset password
   - Magic link

**URL Configuration:**
- Site URL: `http://localhost:5173` (untuk development)
- Redirect URLs: Tambahkan:
  - `http://localhost:5173/#/reset-password`
  - `http://your-production-domain.com/#/reset-password`

---

## 🔧 Cara Testing Koneksi

### Test 1: Sign Up (Membuat User Baru)

```bash
# Jalankan development server
npm run dev
```

1. Buka browser: `http://localhost:5173/#/signup`
2. Masukkan email dan password
3. Klik "Register Staff"
4. **Penting**: Cek email untuk konfirmasi (kecuali auto-confirm enabled)

### Test 2: Login

1. Buka: `http://localhost:5173/#/login`
2. Masukkan email dan password yang sudah terdaftar
3. Klik "Grant Access"
4. Jika berhasil, akan redirect ke `/dashboard`

### Test 3: Protected Routes

Coba akses halaman CMS tanpa login:
```
http://localhost:5173/#/dashboard
```

Seharusnya otomatis redirect ke `/login`

### Test 4: Logout

1. Login terlebih dahulu
2. Di dashboard, klik tombol **Logout** di sidebar
3. Seharusnya redirect ke `/login`
4. Coba akses `/dashboard` lagi → harus redirect ke login

### Test 5: Forgot Password

1. Buka: `http://localhost:5173/#/forgot-password`
2. Masukkan email yang terdaftar
3. Klik "Send Recovery Link"
4. Cek email untuk link reset password
5. Klik link → akan redirect ke `/reset-password`
6. Masukkan password baru
7. Login dengan password baru

---

## 📦 API Functions yang Tersedia

Di [services/supabase.ts](services/supabase.ts), sudah ada functions:

### Authentication
```typescript
import { signIn, signUp, signOut, resetPasswordEmail, updatePassword, getCurrentUser } from './services/supabase';

// Sign up
await signUp('email@example.com', 'password123');

// Sign in
await signIn('email@example.com', 'password123');

// Sign out
await signOut();

// Reset password email
await resetPasswordEmail('email@example.com');

// Update password (saat reset)
await updatePassword('newPassword123');

// Get current user
const { user } = await getCurrentUser();
```

### Database Operations
```typescript
import { fetchProducts, fetchProductBySlug, createProduct, updateProduct, deleteProduct } from './services/supabase';

// Fetch all products
const { data, error } = await fetchProducts();

// Fetch by slug
const { data, error } = await fetchProductBySlug('vrv-system');

// Create
const { data, error } = await createProduct({
  name: 'VRV System',
  slug: 'vrv-system',
  category: 'Commercial',
  description: 'Description here',
  features: ['Feature 1', 'Feature 2'],
  image_path: 'https://...'
});

// Update
const { data, error } = await updateProduct(1, {
  name: 'Updated Name'
});

// Delete
const { success, error } = await deleteProduct(1);
```

### Image Upload
```typescript
import { uploadImage, deleteImage } from './services/supabase';

// Upload image
const file = event.target.files[0];
const { url, error } = await uploadImage(file, 'images', 'products');
console.log('Image URL:', url);

// Delete image
await deleteImage('products/123456-abc.jpg', 'images');
```

---

## 🎨 UI Theme: Putih & Emas

Semua halaman auth sudah menggunakan theme:
- Background: Putih (`bg-white`)
- Accent: Emas (`#d4af37`)
- Border: Emas dengan opacity (`border-[#d4af37]/30`)
- Button: Gold gradient dengan text putih
- Text: Hitam/Gray untuk readability

---

## 🔒 Security Features

### 1. Row Level Security (RLS)
- Public: Bisa **READ** semua data
- Authenticated: Bisa **INSERT, UPDATE, DELETE**

### 2. Protected Routes
File [App.tsx](App.tsx) menggunakan:
```typescript
<ProtectedRoute isLoggedIn={isLoggedIn}>
  <Layout><Dashboard /></Layout>
</ProtectedRoute>
```

Semua halaman CMS terlindungi dan hanya bisa diakses setelah login.

### 3. Auth State Management
Menggunakan `onAuthStateChange` dari Supabase untuk real-time auth tracking.

---

## 🐛 Troubleshooting

### Error: "Invalid login credentials"
- **Solusi**: Pastikan user sudah confirm email (cek inbox)
- Di Supabase Dashboard → Authentication → Users → pastikan email confirmed
- Atau disable email confirmation: Authentication → Providers → Email → Disable "Confirm email"

### Error: "Failed to fetch"
- **Solusi**: Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` benar di `.env.local`
- Restart dev server: `npm run dev`

### Protected route tidak redirect
- **Solusi**: Clear browser cache dan localStorage
- Logout kemudian login ulang

### Email tidak terkirim
- **Solusi**:
  - Cek spam folder
  - Di development, bisa gunakan [Inbucket](https://inbucket.org) atau disable email confirmation
  - Di Supabase Dashboard → Authentication → Settings → cek SMTP configuration

### Upload image gagal
- **Solusi**:
  - Pastikan storage bucket `images` sudah dibuat
  - Pastikan bucket policy sudah di-setup
  - Cek ukuran file (max 50MB by default)

---

## 📊 Monitoring & Logs

### Cek Auth Logs
1. Buka Supabase Dashboard
2. Pergi ke **Authentication** → **Users**
3. Lihat list users yang terdaftar
4. Untuk logs: **Logs** → **Auth Logs**

### Cek Database Logs
1. **Database** → **Roles**
2. **Logs** → **Postgres Logs**

### Cek Storage Logs
1. **Storage** → Bucket **images**
2. Lihat files yang sudah diupload

---

## 🚀 Next Steps

### 1. Integrasi Fetch Data ke Landing Page

Edit halaman public (contoh: [pages/Public/Home.tsx](pages/Public/Home.tsx)):

```typescript
import { useEffect, useState } from 'react';
import { fetchProducts, fetchPortfolios } from '../../services/supabase';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data } = await fetchProducts();
      if (data) setProducts(data);
    }
    loadData();
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### 2. Implement Image Upload di CMS

Contoh di ProductManagement:

```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const { url, error } = await uploadImage(file, 'images', 'products');
  if (error) {
    alert('Upload failed');
  } else {
    setImageUrl(url);
  }
};
```

### 3. Deploy to Production

Saat deploy, jangan lupa:
1. Update `VITE_SUPABASE_URL` di environment production
2. Update Redirect URLs di Supabase Dashboard
3. Update Site URL untuk email templates

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Cek [Supabase Documentation](https://supabase.com/docs)
2. Lihat [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
3. Buka [Supabase Logs](https://app.supabase.com/project/xhyozguzmmfhhmgfroid/logs/explorer) untuk debugging

---

**✨ Koneksi Supabase sudah siap digunakan!**

Untuk mulai testing:
```bash
npm run dev
```

Kemudian akses:
- Login: `http://localhost:5173/#/login`
- Sign Up: `http://localhost:5173/#/signup`
- Dashboard: `http://localhost:5173/#/dashboard` (harus login dulu)
