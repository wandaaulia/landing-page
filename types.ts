
export interface About {
  id: number;
  content: string;
  vision: string;
  image_path: string | null;
  projects_count: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_path: string;
  category: string;
  author: string;
  published_at: string;
  read_time: string;
}

export interface Portfolio {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image_path: string;
  category: string;
  location: string;
  products_used: string;
  challenge: string;
  solution: string;
  impact: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  image_path: string;
  description: string;
  features: string[]; // JSON in DB
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

export type CMSModule = 'dashboard' | 'about' | 'products' | 'portfolios' | 'articles' | 'testimonials' | 'faqs' | 'awards';
