# Panduan Setup Supabase

## 📋 Daftar Isi
1. [Setup Environment Variables](#1-setup-environment-variables)
2. [Setup Database di Supabase](#2-setup-database-di-supabase)
3. [Setup Storage Bucket](#3-setup-storage-bucket)
4. [Cara Menggunakan di Frontend](#4-cara-menggunakan-di-frontend)
5. [Contoh Penggunaan](#5-contoh-penggunaan)

---

## 1. Setup Environment Variables

Buka file [.env.local](.env.local) dan isi dengan kredensial Supabase Anda:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Cara mendapatkan kredensial:**
1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda (atau buat project baru)
3. Pergi ke **Settings** → **API**
4. Copy **Project URL** dan **anon/public key**

---

## 2. Setup Database di Supabase

Jalankan SQL berikut di **SQL Editor** di Supabase Dashboard:

```sql
-- Table: products
CREATE TABLE products (
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

-- Table: portfolios
CREATE TABLE portfolios (
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

-- Table: articles
CREATE TABLE articles (
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

-- Table: awards
CREATE TABLE awards (
  id BIGSERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  institution TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: testimonials
CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: faqs
CREATE TABLE faqs (
  id BIGSERIAL PRIMARY KEY,
  q TEXT NOT NULL,
  a TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Public Read Access untuk semua table
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON articles FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON awards FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON faqs FOR SELECT USING (true);

-- Authenticated Write Access (hanya user login yang bisa insert/update/delete)
CREATE POLICY "Enable insert for authenticated users" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON products FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON portfolios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON portfolios FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON portfolios FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON articles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON articles FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON awards FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON awards FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON awards FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON testimonials FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON faqs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON faqs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON faqs FOR DELETE TO authenticated USING (true);
```

---

## 3. Setup Storage Bucket

1. Pergi ke **Storage** di Supabase Dashboard
2. Klik **New Bucket**
3. Beri nama: `images`
4. Pilih **Public bucket** agar gambar bisa diakses publik
5. Klik **Create bucket**

**Mengatur Storage Policy:**
```sql
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');
```

---

## 4. Cara Menggunakan di Frontend

### Import Functions

```typescript
import {
  supabase,
  fetchProducts,
  fetchProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  deleteImage
} from '../services/supabase';
```

---

## 5. Contoh Penggunaan

### A. Fetch Data dari Database

```typescript
// Di dalam React component
import { useEffect, useState } from 'react';
import { fetchProducts, Product } from '../services/supabase';

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await fetchProducts();

      if (error) {
        console.error('Error loading products:', error);
        return;
      }

      if (data) {
        setProducts(data);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <img src={product.image_path} alt={product.name} />
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### B. Upload Image dan Create Product

```typescript
import { useState } from 'react';
import { uploadImage, createProduct } from '../services/supabase';

function AddProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    description: '',
    features: []
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Upload image terlebih dahulu
      let imagePath = '';
      if (imageFile) {
        const { url, error: uploadError } = await uploadImage(
          imageFile,
          'images',
          'products'
        );

        if (uploadError) {
          alert('Error uploading image');
          return;
        }

        imagePath = url || '';
      }

      // 2. Create product dengan image URL
      const { data, error } = await createProduct({
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        description: formData.description,
        features: formData.features,
        image_path: imagePath
      });

      if (error) {
        alert('Error creating product');
        return;
      }

      alert('Product created successfully!');
      // Reset form
      setFormData({ name: '', slug: '', category: '', description: '', features: [] });
      setImageFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />

      <input
        type="text"
        placeholder="Slug"
        value={formData.slug}
        onChange={(e) => setFormData({...formData, slug: e.target.value})}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />

      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Create Product'}
      </button>
    </form>
  );
}
```

### C. Update Product

```typescript
import { updateProduct } from '../services/supabase';

async function handleUpdateProduct(productId: number) {
  const { data, error } = await updateProduct(productId, {
    name: 'Updated Product Name',
    description: 'Updated description'
  });

  if (error) {
    console.error('Error updating product:', error);
    return;
  }

  console.log('Product updated:', data);
}
```

### D. Delete Product

```typescript
import { deleteProduct } from '../services/supabase';

async function handleDeleteProduct(productId: number) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  const { success, error } = await deleteProduct(productId);

  if (error) {
    console.error('Error deleting product:', error);
    return;
  }

  console.log('Product deleted successfully');
}
```

### E. Real-time Subscription (Optional)

```typescript
import { useEffect } from 'react';
import { supabase } from '../services/supabase';

function ProductListRealtime() {
  useEffect(() => {
    // Subscribe to INSERT events
    const subscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('New product added:', payload.new);
          // Update UI dengan product baru
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <div>Product List with Real-time Updates</div>;
}
```

---

## 📝 Catatan Penting

1. **Environment Variables**: Pastikan file `.env.local` tidak di-commit ke Git (sudah ada di `.gitignore`)
2. **Image Naming**: Fungsi `uploadImage` otomatis generate unique filename menggunakan timestamp + random string
3. **Error Handling**: Selalu handle error dari setiap function call
4. **TypeScript Types**: Gunakan interfaces yang sudah disediakan untuk type safety
5. **RLS Policies**: Row Level Security sudah diatur agar public bisa read, tapi hanya authenticated users yang bisa write/update/delete

---

## 🔗 Referensi

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**File terkait:**
- [services/supabase.ts](services/supabase.ts) - Konfigurasi dan helper functions
- [.env.local](.env.local) - Environment variables
