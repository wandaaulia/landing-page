
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

  const categories = ['ALL', 'INDUSTRIAL', 'HEALTHCARE', 'COMMERCIAL', 'RESIDENTIAL'];

  const filteredPortfolios = filter === 'ALL'
    ? portfolios
    : portfolios.filter(p => p.category === filter);

  const paginatedPortfolios = filteredPortfolios.slice(0, visibleCount);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />
      
      <section className="pt-48 pb-12 px-8 border-b border-[#d4af37]/10">
        <div className="max-w-[85%] mx-auto text-left">
          <div className="space-y-4 max-w-4xl">
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">{lang === 'ID' ? 'PORTOFOLIO KAMI' : 'OUR PORTFOLIO'}</p>
            <h1 className="text-6xl md:text-8xl font-luxury font-bold tracking-tighter leading-none uppercase">CASE <br/> STUDIES</h1>
            <p className="text-xl text-gray-500 font-light leading-relaxed">
              Documenting Daikin Proshop's technical excellence across every project.
            </p>
          </div>
        </div>
      </section>

      {/* Static Filter Toolbar */}
      <section className="bg-[#0a0a0a] py-8 border-b border-[#d4af37]/10 overflow-x-auto no-scrollbar">
        <div className="max-w-[85%] mx-auto px-8 flex flex-nowrap md:flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setFilter(cat); setVisibleCount(12); }}
                  className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-all px-6 py-2 rounded-full whitespace-nowrap border ${
                    filter === cat ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37]' : 'text-gray-500 hover:text-white border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>
      </section>

      <section className="py-24 px-8">
        <div className="max-w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
          {paginatedPortfolios.map((item) => (
            <Link to={`/portfolio/${item.slug}`} key={item.id} className="group">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 border border-[#d4af37]/10 bg-[#111]">
                <img src={item.image_path} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-1000" alt={item.title} />
              </div>
              <h3 className="text-2xl font-luxury font-bold mb-3 uppercase leading-tight">{item.title}</h3>
              <p className="text-gray-500 text-xs font-light mb-6 line-clamp-2">{item.summary}</p>
              <div className="flex items-center gap-2 text-[#d4af37]">
                <MapPin size={12} />
                <span className="text-[10px] font-bold tracking-widest uppercase">{item.location}</span>
              </div>
            </Link>
          ))}
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
