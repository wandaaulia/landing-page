import { createClient } from '@supabase/supabase-js';

// ===========================
// SUPABASE CLIENT CONFIGURATION
// ===========================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase URL atau Anon Key belum dikonfigurasi. App akan berjalan tetapi fitur database akan error.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ===========================
// AUTHENTICATION FUNCTIONS
// ===========================

/**
 * Sign up new user dengan email dan password
 */
export async function signUp(email: string, password: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error signing up:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Exception during sign up:', error);
    return { error };
  }
}

/**
 * Sign in dengan email dan password
 */
export async function signIn(email: string, password: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Exception during sign in:', error);
    return { error };
  }
}

/**
 * Sign out user yang sedang login
 */
export async function signOut(): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Exception during sign out:', error);
    return { error };
  }
}

/**
 * Reset password - kirim email reset password
 */
export async function resetPasswordEmail(email: string, redirectTo?: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${window.location.origin}/#/reset-password`,
    });

    if (error) {
      console.error('Error sending reset email:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Exception during password reset:', error);
    return { error };
  }
}

/**
 * Update password user yang sedang login
 */
export async function updatePassword(newPassword: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Error updating password:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Exception during password update:', error);
    return { error };
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting current user:', error);
      return { user: null, error };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Exception getting current user:', error);
    return { user: null, error };
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return { session: null, error };
    }

    return { session, error: null };
  } catch (error) {
    console.error('Exception getting session:', error);
    return { session: null, error };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

// ===========================
// DATABASE TYPES (TypeScript)
// ===========================

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  image_path: string;
  description: string;
  features: string[];
  detailed_features?: { name: string; desc: string }[];
  ideal_applications?: { icon: string; title: string; desc: string }[];
  created_at?: string;
  updated_at?: string;
}

export interface Portfolio {
  id: number;
  title: string;
  slug: string;
  category: string;
  location: string;
  products_used: string;
  image_path: string;
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id: number;
  year: string;
  title: string;
  slug: string;
  excerpt: string;
  image_path: string;
  category: string;
  author: string;
  published_at: string;
  read_time: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Award {
  id: number;
  year: string;
  institution: string;
  name: string;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  created_at?: string;
}

export interface FAQ {
  id: number;
  q: string;
  a: string;
  order?: number;
  created_at?: string;
}

// ===========================
// IMAGE STORAGE FUNCTIONS
// ===========================

/**
 * Upload gambar ke Supabase Storage
 * @param file - File yang akan diupload
 * @param bucket - Nama bucket storage (default: 'images')
 * @param folder - Folder di dalam bucket (opsional)
 * @returns URL publik gambar yang diupload
 */
export async function uploadImage(
  file: File,
  bucket: string = 'images',
  folder?: string
): Promise<{ url: string | null; error: any }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file ke storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return { url: null, error };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Exception during image upload:', error);
    return { url: null, error };
  }
}

/**
 * Delete gambar dari Supabase Storage
 * @param filePath - Path file yang akan dihapus (tanpa URL base)
 * @param bucket - Nama bucket storage
 */
export async function deleteImage(
  filePath: string,
  bucket: string = 'images'
): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Exception during image deletion:', error);
    return { success: false, error };
  }
}

/**
 * Get public URL dari file di storage
 * @param filePath - Path file di storage
 * @param bucket - Nama bucket storage
 */
export function getImageUrl(filePath: string, bucket: string = 'images'): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// ===========================
// DATABASE FETCH FUNCTIONS
// ===========================

/**
 * Fetch semua products dari database
 */
export async function fetchProducts(): Promise<{ data: Product[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching products:', error);
    return { data: null, error };
  }
}

/**
 * Fetch single product by slug
 */
export async function fetchProductBySlug(slug: string): Promise<{ data: Product | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching product:', error);
    return { data: null, error };
  }
}

/**
 * Fetch semua portfolios dari database
 */
export async function fetchPortfolios(): Promise<{ data: Portfolio[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching portfolios:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching portfolios:', error);
    return { data: null, error };
  }
}

/**
 * Fetch single portfolio by slug
 */
export async function fetchPortfolioBySlug(slug: string): Promise<{ data: Portfolio | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching portfolio:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching portfolio:', error);
    return { data: null, error };
  }
}

/**
 * Fetch semua articles dari database
 */
export async function fetchArticles(): Promise<{ data: Article[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching articles:', error);
    return { data: null, error };
  }
}

/**
 * Fetch single article by slug
 */
export async function fetchArticleBySlug(slug: string): Promise<{ data: Article | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching article:', error);
    return { data: null, error };
  }
}

/**
 * Fetch semua awards dari database
 */
export async function fetchAwards(): Promise<{ data: Award[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('awards')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching awards:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching awards:', error);
    return { data: null, error };
  }
}

/**
 * Fetch semua testimonials dari database
 */
export async function fetchTestimonials(): Promise<{ data: Testimonial[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching testimonials:', error);
    return { data: null, error };
  }
}

/**
 * Fetch semua FAQs dari database
 */
export async function fetchFAQs(): Promise<{ data: FAQ[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching FAQs:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching FAQs:', error);
    return { data: null, error };
  }
}

// ===========================
// CRUD HELPER FUNCTIONS
// ===========================

/**
 * Create new product
 */
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Product | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception creating product:', error);
    return { data: null, error };
  }
}

/**
 * Update product
 */
export async function updateProduct(id: number, updates: Partial<Product>): Promise<{ data: Product | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception updating product:', error);
    return { data: null, error };
  }
}

/**
 * Delete product
 */
export async function deleteProduct(id: number): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Exception deleting product:', error);
    return { success: false, error };
  }
}

/**
 * Create new portfolio
 */
export async function createPortfolio(portfolio: Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Portfolio | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .insert([portfolio])
      .select()
      .single();

    if (error) {
      console.error('Error creating portfolio:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception creating portfolio:', error);
    return { data: null, error };
  }
}

/**
 * Update portfolio
 */
export async function updatePortfolio(id: number, updates: Partial<Portfolio>): Promise<{ data: Portfolio | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating portfolio:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception updating portfolio:', error);
    return { data: null, error };
  }
}

/**
 * Delete portfolio
 */
export async function deletePortfolio(id: number): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting portfolio:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Exception deleting portfolio:', error);
    return { success: false, error };
  }
}

/**
 * Create new article
 */
export async function createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Article | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception creating article:', error);
    return { data: null, error };
  }
}

/**
 * Update article
 */
export async function updateArticle(id: number, updates: Partial<Article>): Promise<{ data: Article | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating article:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception updating article:', error);
    return { data: null, error };
  }
}

/**
 * Delete article
 */
export async function deleteArticle(id: number): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Exception deleting article:', error);
    return { success: false, error };
  }
}

// ===========================
// MOCK DATA (for development)
// ===========================

export const mockData = {
  products: [
    {
      id: 1,
      name: 'VRV / VRF SYSTEM',
      slug: 'vrv-system',
      category: 'Commercial Air Conditioning',
      image_path: 'https://www.daikin.co.id/storage/product/1623136585-VRV_A.png',
      description: 'Sistem tata udara sentral tercanggih dengan teknologi inverter variabel untuk efisiensi maksimal pada gedung bertingkat.',
      features: ['VRT Technology', 'BACnet Integration', 'Auto-Refill'],
      detailed_features: [
        { name: 'VRT Technology', desc: 'Variable Refrigerant Temperature memastikan penghematan energi hingga 28%.' },
        { name: 'BACnet Integration', desc: 'Dapat diintegrasikan dengan sistem manajemen gedung pihak ketiga.' }
      ],
      ideal_applications: [
        { icon: 'Building2', title: 'High-Rise Office', desc: 'Sistem sentral untuk beban panas gedung bertingkat.' },
        { icon: 'Hospital', title: 'Healthcare', desc: 'Hygienic cooling untuk ruang steril dan bedah.' }
      ]
    },
    {
      id: 2,
      name: 'MODULAR CHILLER',
      slug: 'modular-chiller',
      category: 'Industrial Cooling Solutions',
      image_path: 'https://www.daikin.com.sg/wp-content/uploads/2021/05/Air-Cooled-Scroll-Chiller-UAA-UAY-B-Series.png',
      description: 'Solusi pendinginan kapasitas besar untuk fasilitas manufaktur dan pusat data dengan keandalan operasional 24/7.',
      features: ['Modular Scalability', 'Low Noise', 'Rapid Cooling']
    },
    {
      id: 3,
      name: 'VRV HOME SERIES',
      slug: 'vrv-home',
      category: 'Residential Air Conditioning',
      image_path: 'https://www.daikin.co.id/storage/product/1623136625-VRV_H.png',
      description: 'Kenyamanan hotel bintang lima di hunian Anda. Menggantikan banyak outdoor unit dengan satu sistem sentral yang elegan.',
      features: ['Space Saving', 'Quiet Mode', 'Lifestyle Control']
    },
    {
      id: 4,
      name: 'RECLAIM AIR PURIFIER',
      slug: 'air-purifier',
      category: 'Indoor Air Quality Solutions',
      image_path: 'https://www.daikin.com.sg/wp-content/uploads/2021/03/MC55VMM-6-768x768.png',
      description: 'Sistem filtrasi udara tingkat rumah sakit yang menghilangkan 99.9% virus dan partikulat halus.',
      features: ['HEPA Filter', 'Streamer Technology', 'Active Plasma']
    },
    {
      id: 5,
      name: 'INTELLIGENT TOUCH MANAGER',
      slug: 'itm-control',
      category: 'Controls & Automation',
      image_path: 'https://www.daikin.com.sg/wp-content/uploads/2021/03/DCM601A51.png',
      description: 'Sistem manajemen gedung (BMS) yang memungkinkan kontrol terpusat seluruh unit HVAC dari satu antarmuka.',
      features: ['Cloud Access', 'Energy Monitoring', 'Schedule Logic']
    }
  ],
  portfolios: [
    {
      id: 1,
      title: 'PT. Logistik Nasional',
      slug: 'pt-logistik-nasional',
      category: 'INDUSTRIAL',
      location: 'Jakarta',
      products_used: 'VRV A Series, AHU Custom',
      image_path: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      summary: 'Optimalisasi suhu gudang farmasi dengan kontrol kelembaban presisi.',
      challenge: 'Gedung membutuhkan suhu konstan 18°C dengan variasi beban panas tinggi.',
      solution: 'Instalasi Daikin VRV A Series dengan integrasi BMS.',
      impact: 'Efisiensi biaya listrik turun 28%.'
    },
    {
      id: 2,
      title: 'The Ritz-Carlton Residences',
      slug: 'ritz-carlton-residences',
      category: 'RESIDENTIAL',
      location: 'Jakarta Selatan',
      products_used: 'VRV Home Series, Ducting Invisible',
      image_path: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
      summary: 'Sistem tata udara mewah yang tidak terlihat (invisible luxury).',
      challenge: 'Kebutuhan unit outdoor minimalis.',
      solution: 'VRV Home Series dengan ducting tersembunyi.',
      impact: 'Kenyamanan akustik maksimal (<25dB).'
    },
    {
      id: 3,
      title: 'Global Oncology Hospital',
      slug: 'global-oncology-hospital',
      category: 'HEALTHCARE',
      location: 'Tangerang',
      products_used: 'Hygienic VRV, HEPA Units',
      image_path: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
      summary: 'Standardisasi udara ruang operasi dengan teknologi filtrasi tingkat tinggi.',
      challenge: 'Sertifikasi ruang operasi kelas 10,000.',
      solution: 'Sistem HVAC khusus dengan air change rate yang tinggi.',
      impact: 'Zero contamination report selama 12 bulan pertama.'
    }
  ],
  awards: [
    { id: 1, year: '2024', institution: 'Daikin Indonesia', name: 'Million Dollar Award' },
    { id: 2, year: '2023', institution: 'Daikin Global', name: 'Elite Dealer Recognition' },
    { id: 3, year: '2022', institution: 'Daikin Indonesia', name: 'Best After-Sales Service' }
  ],
  faqs: [
    {
      id: 1,
      q: 'Bagaimana penanganan proyek skala komersial & industri?',
      a: 'Kami memiliki tim engineer khusus untuk menangani heat-load calculation, desain sistem, hingga supervisi instalasi skala besar.'
    },
    {
      id: 2,
      q: 'Apakah produk Daikin resmi dan bergaransi?',
      a: 'Ya, sebagai Daikin Proshop resmi, semua unit kami memiliki garansi penuh dari Daikin Indonesia dan dukungan suku cadang asli.'
    },
    {
      id: 3,
      q: 'Apakah tersedia layanan konsultasi teknis?',
      a: 'Kami menyediakan konsultasi gratis mulai dari tahap perencanaan arsitektur hingga pemilihan unit yang paling efisien.'
    },
    {
      id: 4,
      q: 'Bagaimana dengan kontrak pemeliharaan?',
      a: 'Kami menawarkan Preventive Maintenance Contract untuk memastikan sistem HVAC Anda beroperasi pada efisiensi puncak sepanjang tahun.'
    },
    {
      id: 5,
      q: 'Cakupan wilayah proyek CSL?',
      a: 'Layanan kami mencakup seluruh Indonesia, dengan fokus utama pada Jabodetabek dan kota-kota besar di Pulau Jawa.'
    },
    {
      id: 6,
      q: 'Estimasi waktu instalasi?',
      a: 'Tergantung skala proyek. Untuk residensial mewah biasanya 1-2 minggu, sedangkan industrial disesuaikan dengan timeline konstruksi.'
    }
  ],
  articles: [
    {
      id: 1,
      year: '2026',
      title: 'Masa Depan Sistem VRV Industri',
      slug: 'future-vrv',
      excerpt: 'Analisis mendalam tentang penghematan energi hingga 40% pada generasi terbaru unit VRV untuk gedung tinggi.',
      image_path: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
      category: 'Teknologi',
      author: 'Ahmad Sudirman',
      published_at: '2025-01-20',
      read_time: '5 min'
    },
    {
      id: 2,
      year: '2026',
      title: 'Standar Udara Higienis di Fasilitas Medis',
      slug: 'hygienic-air-standards',
      excerpt: 'Mengapa sistem HVAC konvensional tidak cukup untuk ruang operasi dan isolasi?',
      image_path: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      category: 'Kesehatan',
      author: 'Dr. Linda W.',
      published_at: '2025-01-18',
      read_time: '7 min'
    },
    {
      id: 3,
      year: '2025',
      title: 'Pentingnya Heat Load Calculation',
      slug: 'heat-load-importance',
      excerpt: 'Kesalahan perhitungan beban panas seringkali menyebabkan pemborosan biaya listrik hingga 30%.',
      image_path: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
      category: 'Engineering',
      author: 'Team CSL',
      published_at: '2025-01-15',
      read_time: '4 min'
    },
    {
      id: 4,
      year: '2025',
      title: 'Automasi Gedung dengan Daikin ITM',
      slug: 'itm-automation',
      excerpt: 'Cara mengontrol ribuan unit AC dari satu layar sentuh di pusat kendali gedung Anda.',
      image_path: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
      category: 'Automation',
      author: 'Rifki H.',
      published_at: '2025-01-12',
      read_time: '6 min'
    },
    {
      id: 5,
      year: '2025',
      title: 'Inovasi Indoor Air Quality 2025',
      slug: 'iaq-innovation-2025',
      excerpt: 'Teknologi Streamer Daikin yang mampu menonaktifkan varian virus baru secara efektif.',
      image_path: 'https://images.unsplash.com/photo-1532187875302-1ee665c542ee?auto=format&fit=crop&q=80&w=800',
      category: 'Teknologi',
      author: 'Engineering Dept',
      published_at: '2025-01-10',
      read_time: '5 min'
    }
  ],
  testimonials: [
    {
      id: 1,
      name: 'BUDI SANTOSO',
      role: 'Chief Engineer',
      company: 'Sudirman Tower',
      content: 'Sistem yang dipasang sangat stabil dan efisiensi listriknya terbukti. Pelayanan after-sales mereka benar-benar bisa diandalkan kapan saja.',
      image: 'https://i.pravatar.cc/150?u=budi'
    },
    {
      id: 2,
      name: 'LINDA KUSUMA',
      role: 'Property Manager',
      company: 'Green Residencies',
      content: 'Kualitas udara di unit hunian kami meningkat drastis. Tim CSL sangat profesional dalam menangani detail teknis yang rumit.',
      image: 'https://i.pravatar.cc/150?u=linda'
    },
    {
      id: 3,
      name: 'HENDRA WIJAYA',
      role: 'Project Director',
      company: 'Global Medika Hospital',
      content: 'Untuk kebutuhan udara higienis rumah sakit, CSL adalah mitra terbaik. Perhitungan heat load mereka sangat presisi dan akurat.',
      image: 'https://i.pravatar.cc/150?u=hendra'
    },
    {
      id: 4,
      name: 'ANTONI TAN',
      role: 'Owner',
      company: 'Tan & Co Office',
      content: 'Instalasi rapi dan tepat waktu. Sistem ITM yang direkomendasikan sangat membantu saya mengontrol AC gedung dari jarak jauh.',
      image: 'https://i.pravatar.cc/150?u=antoni'
    }
  ]
};

export const translations = {
  ID: {
    nav: { home: 'HOME', about: 'TENTANG KAMI', products: 'PRODUCTS', portfolio: 'PORTFOLIO', articles: 'ARTIKEL', contact: 'KONTAK' },
    hero: { title: 'Daikin Proshop Expertise.', sub: 'Menghadirkan kenyamanan udara kelas dunia untuk ruko, gedung dan hunian mewah selama lebih dari 3 dekade.' },
    products: { title: 'Produk Unggulan', viewAll: 'LIHAT SEMUA' },
    layanan: {
      title: 'LAYANAN',
      sub: 'Solusi HVAC Kami',
      items: [
        'HVAC consultation & system planning',
        'Custom HVAC system design',
        'Official Daikin product procurement',
        'Professional installation & commissioning',
        'Preventive maintenance & after-sales service',
        'Technical support for large-scale projects'
      ]
    },
    portfolio: { title: 'PORTOFOLIO', sub: 'Hasil Layanan Kami' },
    awards: { title: 'PENGHARGAAN', sub: 'Bukti Komitmen Kami', viewAll: 'LIHAT SEMUA' },
    testi: { title: 'TESTIMONI', sub: 'Apa Kata Klien Kami' },
    faq: { title: 'FAQ', sub: 'Pertanyaan Umum Seputar Layanan Kami' },
    articleList: { title: 'ARTIKEL', sub: 'Wawasan dan Tips HVAC' },
    footer: { navigasi: 'NAVIGASI', businessHours: 'JAM OPERASIONAL: SENIN - JUMAT, 09:00 - 17:00' },
    contact: {
      title: 'HUBUNGI SPESIALIS KAMI',
      sub: 'Konsultasikan Kebutuhan dan Optimalisasi Infrastruktur Pendingin Anda dengan tim kami yang bersertifikasi Daikin Global'
    }
  },
  EN: {
    nav: { home: 'HOME', about: 'ABOUT US', products: 'PRODUCTS', portfolio: 'PORTFOLIO', articles: 'ARTICLES', contact: 'CONTACT' },
    hero: { title: 'Daikin Proshop Expertise.', sub: 'Delivering world-class air comfort for shops, buildings and luxury homes for over 3 decades.' },
    products: { title: 'Featured Products', viewAll: 'VIEW ALL' },
    layanan: {
      title: 'OUR SERVICES',
      sub: 'Our HVAC Solutions',
      items: [
        'HVAC consultation & system planning',
        'Custom HVAC system design',
        'Official Daikin product procurement',
        'Professional installation & commissioning',
        'Preventive maintenance & after-sales service',
        'Technical support for large-scale projects'
      ]
    },
    portfolio: { title: 'PORTFOLIO', sub: 'Our Completed Projects' },
    awards: { title: 'AWARDS', sub: 'Proof of Our Commitment', viewAll: 'VIEW ALL' },
    testi: { title: 'TESTIMONIALS', sub: 'What Our Clients Say' },
    faq: { title: 'FAQ', sub: 'Frequently Asked Questions About Our Services' },
    articleList: { title: 'ARTICLES', sub: 'Insights and Tips for Your HVAC Projects' },
    footer: { navigasi: 'NAVIGATION', businessHours: 'BUSINESS HOURS: MON - FRI, 09:00 - 17:00' },
    contact: {
      title: 'CONTACT OUR SPECIALISTS',
      sub: 'Consult your needs and cooling infrastructure optimization with our Daikin Global certified team'
    }
  }
};
