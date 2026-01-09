
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Send, Download, Clock, ArrowLeft, TrendingUp, ChevronRight } from 'lucide-react';
import { mockData, fetchArticleBySlug, fetchArticles, type Article } from '../../services/supabase';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [article, setArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>(mockData.articles);
  const [loading, setLoading] = useState(true);

  // Fetch article by slug dan all articles dari Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      if (slug) {
        const articleRes = await fetchArticleBySlug(slug);
        if (articleRes.data) {
          setArticle(articleRes.data);
        } else {
          // Fallback ke mockData jika tidak ditemukan
          const fallbackArticle = mockData.articles.find(a => a.slug === slug) || mockData.articles[0];
          setArticle(fallbackArticle);
        }
      }

      const articlesRes = await fetchArticles();
      if (articlesRes.data && articlesRes.data.length > 0) {
        setArticles(articlesRes.data);
      }

      setLoading(false);
    }

    loadData();
  }, [slug]);

  const nextArticles = articles.filter(a => a.slug !== slug).slice(0, 2);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
      </div>
    );
  }

  const sections = [
    { id: 'summary', name: 'Ringkasan' },
    { id: 'body', name: 'Analisis Teknis' },
  ];

  const handleShare = () => {
    alert("Tautan artikel telah disalin ke papan klip untuk dibagikan.");
  };

  const handleDownload = () => {
    alert("Menyiapkan unduhan PDF artikel ini...");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // sticky header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />

      {/* Header Info */}
      <header className="pt-48 pb-12 w-[90%] md:w-[80%] mx-auto px-3 md:px-8 text-left">
        <Link to="/articles" className="inline-flex items-center gap-3 text-[#d4af37] text-[10px] font-bold tracking-[0.3em] mb-12 hover:gap-6 transition-all uppercase">
          <ArrowLeft size={16} /> Kembali ke Artikel
        </Link>
        <span className="text-[#d4af37] text-[11px] font-bold tracking-[0.5em] uppercase mb-6 block opacity-80">{article.category}</span>
        <h1 className="text-4xl md:text-7xl font-luxury font-bold mb-10 leading-[1.1] uppercase">{article.title}</h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8 border-t border-[#d4af37]/10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#111] border border-[#d4af37]/20 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${article.author}`} alt={article.author} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest">{article.author}</p>
                <p className="text-[9px] text-gray-500 tracking-[0.2em] uppercase mt-0.5">Editor</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-gray-800 hidden md:block"></div>
            <div className="flex items-center gap-3 text-gray-400 text-[10px] font-bold tracking-widest uppercase">
              <Clock size={14} className="text-[#d4af37]" />
              <span>{article.read_time || '5 MIN'} BACA</span>
            </div>
          </div>

          <div className="flex gap-4 self-end">
            <button
              onClick={handleShare}
              className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all"
              title="Bagikan Artikel"
            >
              <Send size={18} />
            </button>
            <button
              onClick={handleDownload}
              className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all"
              title="Unduh PDF"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 grid grid-cols-1 lg:grid-cols-4 gap-12 md:gap-20 pb-32">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-16">
          {/* Summary */}
          <section id="summary" className="scroll-mt-32">
            <p className="text-xl text-gray-300 font-light leading-relaxed italic bg-[#111] p-10 border-l-4 border-[#d4af37] rounded-r-3xl">
              {article.excerpt}
            </p>
          </section>

          {/* Body Content */}
          <section id="body" className="scroll-mt-32">
            <div className="prose prose-invert max-w-none text-gray-400 font-light leading-relaxed">
              <div
                className="article-rich-text text-base md:text-lg space-y-6 break-words overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </section>



          {/* Next Articles */}
          <section className="pt-20 border-t border-white/5 space-y-12">
            <div className="flex justify-between items-end">
              <h4 className="text-2xl font-luxury font-bold uppercase tracking-widest">Artikel Selanjutnya</h4>
              <Link to="/articles" className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase">Lihat Semua</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {nextArticles.map(a => (
                <Link to={`/article/${a.slug}`} key={a.id} className="group bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-[#d4af37]/20 transition-all">
                  <p className="text-[9px] text-[#d4af37] font-bold tracking-widest uppercase mb-4">{a.category}</p>
                  <h5 className="text-xl font-luxury font-bold group-hover:text-[#d4af37] transition-colors line-clamp-2 uppercase">{a.title}</h5>
                  <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                    BACA <ChevronRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-12">
            <div className="space-y-6">
              <h5 className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.4em]">ISI ARTIKEL</h5>
              <ul className="space-y-4 text-left">
                {sections.map(s => (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollToSection(s.id)}
                      className="text-[10px] text-gray-500 hover:text-[#d4af37] transition-all flex items-center gap-4 group uppercase font-bold tracking-widest"
                    >
                      <div className="w-1.5 h-1.5 rounded-full border border-[#d4af37]/30 group-hover:bg-[#d4af37] transition-all"></div>
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
      <PublicFooter />
    </div>
  );
};

export default ArticleDetail;
