
import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Zap,
  Settings,
  Building2,
  Hospital,
  Factory,
  Hotel,
  ArrowLeft,
  ShieldCheck,
  ArrowUpRight,
  Wind,
  CheckSquare,
  Home
} from 'lucide-react';
import { mockData, translations, fetchProductBySlug, fetchPortfolios, type Product, type Portfolio } from '../../services/supabase';
import { LanguageContext } from '../../App';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const ProductDetail: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(mockData.portfolios);
  const [loading, setLoading] = useState(true);

  // Fetch product by slug dan portfolios dari Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      if (slug) {
        const productRes = await fetchProductBySlug(slug);
        if (productRes.data) {
          setProduct(productRes.data);
        } else {
          // Fallback ke mockData jika tidak ditemukan
          const fallbackProduct = mockData.products.find(p => p.slug === slug) || mockData.products[0];
          setProduct(fallbackProduct);
        }
      }

      const portfoliosRes = await fetchPortfolios();
      if (portfoliosRes.data && portfoliosRes.data.length > 0) {
        setPortfolios(portfoliosRes.data);
      }

      setLoading(false);
    }

    loadData();
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Icon mapping for dynamic scenarios
  const IconComponent = ({ name, size = 24 }: { name: string; size?: number }) => {
    switch (name) {
      case 'Building2': return <Building2 size={size} />;
      case 'Hospital': return <Hospital size={size} />;
      case 'Hotel': return <Hotel size={size} />;
      case 'Home': return <Home size={size} />;
      case 'Factory': return <Factory size={size} />;
      case 'Zap': return <Zap size={size} />;
      default: return <Building2 size={size} />;
    }
  };

  const scenarios = product.ideal_applications && product.ideal_applications.length > 0
    ? product.ideal_applications
    : [
      { icon: 'Building2', title: 'High-Rise Office', desc: 'Sistem sentral untuk beban panas gedung bertingkat.' },
      { icon: 'Hospital', title: 'Healthcare', desc: 'Hygienic cooling untuk ruang steril dan bedah.' },
      { icon: 'Hotel', title: 'Hospitality', desc: 'Kontrol presisi per kamar dengan efisiensi chiller.' },
      { icon: 'Home', title: 'Luxury Residence', desc: 'Kenyamanan akustik maksimal untuk hunian eksklusif.' },
    ];

  const displayFeatures = product.detailed_features && product.detailed_features.length > 0
    ? product.detailed_features
    : product.features.map(f => ({
      name: f,
      desc: lang === 'ID'
        ? 'Fitur canggih untuk efisiensi energi maksimal dan kontrol yang presisi.'
        : 'Advanced features for maximum energy efficiency and precise control.'
    }));

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />

      <section className="pt-48 pb-12 w-[90%] md:w-[80%] mx-auto px-3 md:px-8 text-left">
        <Link to="/products" className="inline-flex items-center gap-4 text-[#d4af37] text-[11px] font-bold tracking-[0.4em] uppercase mb-12">
          <ArrowLeft size={18} /> {lang === 'ID' ? 'KEMBALI KE KATALOG' : 'BACK TO CATALOG'}
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="bg-[#d4af37]/10 text-[#d4af37] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest border border-[#d4af37]/30 uppercase">
                {product.category}
              </span>
              <h1 className="text-5xl md:text-7xl font-luxury font-bold uppercase">{product.name}</h1>
            </div>
            <p className="text-xl text-gray-400 font-light leading-relaxed">{product.description}</p>

            {/* Dynamic mini features list */}
            <div className="space-y-4 pt-4 border-l border-[#d4af37]/20 pl-6">
              {product.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 text-gray-300">
                  {idx === 0 ? <ShieldCheck className="text-[#d4af37]" size={24} /> : <Zap className="text-[#d4af37]" size={24} />}
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase">{feature}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                      {idx === 0 ? 'Verified reliability' : 'Optimized performance'}
                    </p>
                  </div>
                </div>
              ))}
              {product.features.length === 0 && (
                <div className="flex items-center gap-4 text-gray-300">
                  <ShieldCheck className="text-[#d4af37]" size={24} />
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase">High Reliability</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Daikin Certified Standard.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6">
              <a href="https://wa.me/62811102977" className="gold-gradient px-12 py-4 rounded-full text-[#0a0a0a] font-bold text-xs tracking-widest uppercase shadow-2xl hover:scale-105 transition-all inline-block">
                MINTA PENAWARAN B2B
              </a>
            </div>
          </div>
          <div className="aspect-square flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
            <img src={product.image_path} className="w-full h-auto relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" alt={product.name} />
          </div>
        </div>
      </section>

      {/* FITUR UNGGULAN */}
      <section className="py-16 bg-[#050505] border-y border-white/5">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="md:w-1/3 space-y-4 text-left">
              <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">Tech Specs</p>
              <h2 className="text-4xl font-luxury font-bold normal-case">Fitur Unggulan</h2>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-10 text-left">
              {displayFeatures.map((feature, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:border-[#d4af37] transition-colors">
                    <CheckSquare size={20} className="text-[#d4af37]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-widest uppercase mb-2 group-hover:text-[#d4af37] transition-colors">{feature.name}</h4>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* APLIKASI COCOK */}
      <section className="py-16 bg-black">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 text-left">
          <div className="mb-12 space-y-4">
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">Usage Scenarios</p>
            <h2 className="text-4xl font-luxury font-bold normal-case tracking-widest">Aplikasi Ideal</h2>
            <p className="text-gray-500 font-light max-w-2xl italic">"Sistem ini dirancang optimal untuk mendukung infrastruktur kritis dan hunian kelas atas."</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {scenarios.map((s, i) => (
              <div key={i} className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[40px] group hover:border-[#d4af37]/40 transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center text-[#d4af37] mb-8 group-hover:bg-[#d4af37] group-hover:text-[#0a0a0a] transition-all">
                  <IconComponent name={s.icon} size={32} />
                </div>
                <h4 className="text-xl font-luxury font-bold mb-4 tracking-tight uppercase group-hover:text-[#d4af37] transition-colors">{s.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPLEMENTASI PROYEK - Spacing reduced */}
      <section className="py-16 bg-[#050505] border-t border-white/5">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 text-left">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-8 md:gap-0">
            <div className="space-y-2">
              <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">Social Proof</p>
              <h2 className="text-4xl font-luxury font-bold normal-case">Proyek Terkait</h2>
            </div>
            <Link to="/portfolio" className="gold-gradient px-8 py-3 rounded-full text-[#0a0a0a] text-[10px] font-bold uppercase tracking-widest text-center w-fit md:w-auto">
              LIHAT PORTOFOLIO LAINNYA
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolios.slice(0, 3).map((item) => (
              <Link to={`/portfolio/${item.slug}`} key={item.id} className="group">
                <div className="aspect-[16/10] overflow-hidden rounded-3xl mb-6 bg-[#111] border border-white/5">
                  <img src={item.image_path} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 opacity-80 group-hover:opacity-100" alt={item.title} />
                </div>
                <h3 className="text-xl font-luxury font-bold uppercase group-hover:gold-text transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-[10px] font-bold mt-2 uppercase tracking-widest">{item.location}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default ProductDetail;
