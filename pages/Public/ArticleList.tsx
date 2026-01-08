
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { mockData, translations, fetchArticles, type Article } from '../../services/supabase';
import { LanguageContext } from '../../App';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const ArticleList: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];
  const [articles, setArticles] = useState<Article[]>(mockData.articles);
  const [loading, setLoading] = useState(true);

  // Fetch articles dari Supabase saat component mount
  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      const { data, error } = await fetchArticles();

      if (data && data.length > 0) {
        setArticles(data);
      }

      setLoading(false);
    }

    loadArticles();
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />

      {/* Page Header */}
      <section className="pt-48 pb-20 px-8 border-b border-white/5">
        <div className="max-w-[85%] mx-auto">
          <div className="text-left space-y-6">
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">{t.articleList.title}</p>
            <h1 className="text-4xl md:text-6xl font-luxury font-bold tracking-tighter uppercase leading-tight max-w-4xl">
              {t.articleList.sub}
            </h1>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 px-8">
        <div className="max-w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 text-left">
          {articles.map((item) => (
            <Link to={`/article/${item.slug}`} key={item.id} className="group flex flex-col h-full">
              <div className="aspect-[16/10] rounded-3xl overflow-hidden border border-white/5 relative bg-[#111] mb-8">
                 <img src={item.image_path} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                 <div className="absolute top-4 left-4">
                    <span className="bg-black/50 backdrop-blur-md px-4 py-1.5 text-[9px] font-bold text-[#d4af37] rounded-full uppercase tracking-widest border border-[#d4af37]/30">
                       {item.category}
                    </span>
                 </div>
              </div>
              <div className="flex flex-col flex-1">
                 <div className="flex items-center gap-6 text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                    <span className="flex items-center gap-2"><Clock size={14} className="text-[#d4af37]" /> {item.read_time}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                 </div>
                 <h3 className="text-2xl font-luxury font-bold leading-tight group-hover:text-[#d4af37] transition-colors uppercase mb-4">{item.title}</h3>
                 <p className="text-gray-500 text-sm leading-relaxed font-light line-clamp-3 mb-8">{item.excerpt}</p>
                 <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between group">
                    <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase">BACA</span>
                    <ArrowRight size={16} className="text-[#d4af37] transform group-hover:translate-x-2 transition-transform" />
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default ArticleList;
