
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { mockData, translations, fetchProducts, type Product } from '../../services/supabase';
import { LanguageContext } from '../../App';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const ProductList: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(12);
  const [products, setProducts] = useState<Product[]>(mockData.products);
  const [loading, setLoading] = useState(true);

  // Fetch products dari Supabase saat component mount
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const { data, error } = await fetchProducts();

      if (data && data.length > 0) {
        setProducts(data);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  const categories = [
    { id: 'ALL', name: lang === 'ID' ? 'SEMUA UNIT' : 'ALL UNITS' },
    { id: 'Residential', name: 'RESIDENTIAL' },
    { id: 'Commercial', name: 'COMMERCIAL' },
    { id: 'Industri Cooling', name: 'INDUSTRIAL COOLING' },
    { id: 'IAQ Solutions', name: 'IAQ SOLUTIONS' },
    { id: 'Automation', name: 'AUTOMATION' },
  ];

  const filteredProducts = activeTab === 'ALL'
    ? products
    : products.filter(p => p.category === activeTab);

  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />

      <section className="pt-48 pb-12 border-b border-[#d4af37]/10">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 text-left">
          <div className="space-y-4 max-w-4xl">
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">{lang === 'ID' ? 'KATALOG' : 'CATALOG'}</p>
            <h1 className="text-6xl md:text-8xl font-luxury font-bold tracking-tighter leading-none uppercase">PRODUK <br /> DAIKIN</h1>
            <p className="text-xl text-gray-500 font-light leading-relaxed">
              Inovasi HVAC untuk masa depan yang efisien dan berkelanjutan
            </p>
          </div>
        </div>
      </section>

      {/* Balanced Filter Chips - No Scroll */}
      <section className="bg-[#0a0a0a] py-10 border-b border-[#d4af37]/10">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveTab(cat.id); setVisibleCount(12); }}
                className={`text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase transition-all px-5 py-2.5 md:px-6 md:py-2.5 rounded-full border ${activeTab === cat.id
                  ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'text-gray-400 hover:text-white border-white/10 hover:border-[#d4af37]/30 bg-white/5'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((p) => (
              <div key={p.id} className="group bg-[#111] border border-white/5 rounded-[40px] p-8 hover:border-[#d4af37]/30 transition-all flex flex-col h-full text-left">
                <div className="relative h-64 bg-black rounded-[32px] overflow-hidden flex items-center justify-center p-8 mb-8">
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-black/50 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/20 px-3 py-1 text-[8px] font-bold uppercase tracking-widest rounded-full">{p.category}</span>
                  </div>
                  <img src={p.image_path} className="h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                </div>
                <div className="space-y-4 flex-grow">
                  <h3 className="text-2xl font-luxury font-bold uppercase group-hover:text-[#d4af37] transition-colors">{p.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.features && p.features.map(f => <span key={f} className="text-[9px] font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-tighter">{f}</span>)}
                  </div>
                </div>
                <Link to={`/product/${p.slug}`} className="block text-center py-4 mt-10 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all">
                  DETAIL SPESIFIKASI
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 font-luxury text-xl uppercase tracking-widest">
                {lang === 'ID' ? 'Produk belum tersedia untuk kategori ini' : 'No products available for this category'}
              </p>
            </div>
          )}
        </div>

        {filteredProducts.length > visibleCount && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="flex items-center gap-3 px-12 py-5 bg-[#111] border border-[#d4af37]/30 text-[#d4af37] font-bold text-xs tracking-widest rounded-full hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all uppercase"
            >
              <PlusCircle size={18} /> LOAD MORE PRODUCTS
            </button>
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  );
};

export default ProductList;
