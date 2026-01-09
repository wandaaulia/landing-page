
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, PlusCircle } from 'lucide-react';
import { mockData, translations, fetchPortfolios, type Portfolio } from '../../services/supabase';
import { LanguageContext } from '../../App';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const PortfolioList: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const [filter, setFilter] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(12);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(mockData.portfolios);
  const [loading, setLoading] = useState(true);

  // Fetch portfolios dari Supabase saat component mount
  useEffect(() => {
    async function loadPortfolios() {
      setLoading(true);
      const { data, error } = await fetchPortfolios();

      if (data && data.length > 0) {
        setPortfolios(data);
      }

      setLoading(false);
    }

    loadPortfolios();
  }, []);

  const categories = ['ALL', 'Industrial', 'Healthcare', 'Commercial', 'Residential'];

  const filteredPortfolios = filter === 'ALL'
    ? portfolios
    : portfolios.filter(p => p.category === filter);

  const paginatedPortfolios = filteredPortfolios.slice(0, visibleCount);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />

      <section className="pt-48 pb-12 border-b border-[#d4af37]/10">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 text-left">
          <div className="space-y-4 max-w-4xl">
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">{lang === 'ID' ? 'PORTOFOLIO KAMI' : 'OUR PORTFOLIO'}</p>
            <h1 className="text-6xl md:text-8xl font-luxury font-bold tracking-tighter leading-none uppercase">CASE <br /> STUDIES</h1>
            <p className="text-xl text-gray-500 font-light leading-relaxed">
              Menampilkan keunggulan teknis PT Cipta Sejahtera Lestari dalam setiap proyek            </p>
          </div>
        </div>
      </section>

      {/* Balanced Filter Chips - No Scroll */}
      <section className="bg-[#0a0a0a] py-10 border-b border-[#d4af37]/10">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setVisibleCount(12); }}
                className={`text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase transition-all px-5 py-2.5 md:px-6 md:py-2.5 rounded-full border ${filter === cat
                  ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'text-gray-400 hover:text-white border-white/10 hover:border-[#d4af37]/30 bg-white/5'
                  }`}
              >
                {cat === 'ALL' ? (lang === 'ID' ? 'SEMUA PROYEK' : 'ALL PROJECTS') : cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
          {paginatedPortfolios.length > 0 ? (
            paginatedPortfolios.map((item) => (
              <Link to={`/portfolio/${item.slug}`} key={item.id} className="group flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 border border-[#d4af37]/10 bg-[#111]">
                  <img src={item.image_path} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-1000" alt={item.title} />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-luxury font-bold mb-3 uppercase leading-tight group-hover:text-[#d4af37] transition-colors">{item.title}</h3>
                  <p className="text-gray-500 text-xs font-light mb-6 line-clamp-2">{item.summary}</p>
                  <div className="flex items-center gap-2 text-[#d4af37] mt-auto">
                    <MapPin size={12} />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{item.location}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 font-luxury text-xl uppercase tracking-widest">
                {lang === 'ID' ? 'Proyek belum tersedia untuk kategori ini' : 'No projects available for this category'}
              </p>
            </div>
          )}
        </div>

        {filteredPortfolios.length > visibleCount && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="flex items-center gap-3 px-12 py-5 bg-[#111] border border-[#d4af37]/30 text-[#d4af37] font-bold text-xs tracking-widest rounded-full hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all uppercase"
            >
              <PlusCircle size={18} /> LOAD MORE CASE STUDIES
            </button>
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  );
};

export default PortfolioList;
