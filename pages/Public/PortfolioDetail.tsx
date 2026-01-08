
import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Zap, ArrowUpRight, CheckCircle2, Package, Activity } from 'lucide-react';
import { mockData, translations, fetchPortfolioBySlug, fetchPortfolios, type Portfolio } from '../../services/supabase';
import { LanguageContext } from '../../App';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const PortfolioDetail: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const { slug } = useParams();
  const [project, setProject] = useState<Portfolio | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(mockData.portfolios);
  const [loading, setLoading] = useState(true);

  // Fetch portfolio by slug dan all portfolios dari Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      if (slug) {
        const projectRes = await fetchPortfolioBySlug(slug);
        if (projectRes.data) {
          setProject(projectRes.data);
        } else {
          // Fallback ke mockData jika tidak ditemukan
          const fallbackProject = mockData.portfolios.find(p => p.slug === slug) || mockData.portfolios[0];
          setProject(fallbackProject);
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

  if (loading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />
      
      <section className="pt-48 pb-12 px-8 max-w-[85%] mx-auto text-left">
        <Link to="/portfolio" className="inline-flex items-center gap-4 text-[#d4af37] text-[11px] font-bold tracking-[0.4em] uppercase mb-12 hover:gap-8 transition-all">
          <ArrowLeft size={18} /> KEMBALI KE PORTOFOLIO
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">
            <div className="rounded-[40px] overflow-hidden aspect-[21/9] border border-white/5 bg-[#111] shadow-2xl">
              <img src={project.image_path} className="w-full h-full object-cover" alt={project.title} />
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-luxury font-bold leading-tight uppercase tracking-tighter">{project.title}</h1>
              <p className="text-xl text-gray-400 font-light italic leading-relaxed border-l-4 border-[#d4af37]/40 pl-8">"{project.summary}"</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-luxury font-bold gold-text uppercase tracking-widest">{lang === 'ID' ? 'TANTANGAN' : 'CHALLENGE'}</h3>
                <p className="text-lg text-gray-400 font-light leading-relaxed">{project.challenge}</p>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-luxury font-bold gold-text uppercase tracking-widest">{lang === 'ID' ? 'SOLUSI' : 'SOLUTION'}</h3>
                <p className="text-lg text-gray-400 font-light leading-relaxed">{project.solution}</p>
              </div>
            </div>
          </div>
          
          <aside>
            <div className="p-10 bg-[#111] border border-[#d4af37]/20 rounded-[32px] space-y-8 sticky top-32 text-left shadow-2xl">
              <div className="space-y-1 border-b border-white/5 pb-6">
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">LOKASI PROYEK</span>
                 <p className="text-lg font-bold flex items-center gap-3 mt-1 tracking-tight text-white"><MapPin size={18} className="text-[#d4af37]" /> {project.location}</p>
              </div>
              <div className="space-y-1 border-b border-white/5 pb-6">
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">STATUS IMPLEMENTASI</span>
                 <p className="text-lg font-bold text-green-400 uppercase tracking-widest mt-1">OPERASIONAL AKTIF</p>
              </div>
              <div className="space-y-1 border-b border-white/5 pb-6">
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PRODUCTS DEPLOYED</span>
                 <div className="flex items-center gap-3 mt-2">
                   <Package size={18} className="text-[#d4af37] shrink-0" />
                   <p className="text-base font-bold text-white uppercase leading-snug">{project.products_used}</p>
                 </div>
              </div>
              {/* Impact tracking removed as requested */}
              <a href="https://wa.me/62811102977" target="_blank" className="block text-center py-5 gold-gradient text-[#0a0a0a] font-bold rounded-2xl text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all uppercase">MINTA ANALISIS SERUPA</a>
            </div>
          </aside>
        </div>
      </section>

      {/* PROYEK SERUPA */}
      <section className="py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-[85%] mx-auto px-8">
          <div className="text-left mb-16 space-y-2">
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">Discovery</p>
            <h2 className="text-4xl font-luxury font-bold uppercase">{lang === 'ID' ? 'PROYEK SERUPA' : 'SIMILAR PROJECTS'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {portfolios.filter(p => p.slug !== slug).slice(0, 3).map((item) => (
              <Link to={`/portfolio/${item.slug}`} key={item.id} className="group">
                <div className="aspect-[16/11] overflow-hidden rounded-[32px] mb-8 bg-[#111] border border-white/5">
                  <img src={item.image_path} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 opacity-80 group-hover:opacity-100" alt={item.title} />
                </div>
                <h3 className="text-2xl font-luxury font-bold uppercase group-hover:text-[#d4af37] transition-colors">{item.title}</h3>
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

export default PortfolioDetail;
