
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  Zap,
  CheckCircle2,
  Plus,
  Minus,
  Award,
  Star
} from 'lucide-react';
import {
  translations,
  fetchProducts,
  fetchPortfolios,
  fetchAwards,
  fetchTestimonials,
  fetchFAQs,
  fetchArticles,
  type Product,
  type Portfolio,
  type Award as AwardType,
  type Testimonial,
  type FAQ,
  type Article
} from '../../services/supabase';
import { LanguageContext } from '../../App';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const Home: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];
  const [heroSlide, setHeroSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [testiIndex, setTestiIndex] = useState(0);

  // State untuk data dari Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
  ];

  // Fetch data dari Supabase saat component mount
  useEffect(() => {
    async function loadAllData() {
      setLoading(true);

      const [productsRes, portfoliosRes, awardsRes, testimonialsRes, faqsRes, articlesRes] = await Promise.all([
        fetchProducts(),
        fetchPortfolios(),
        fetchAwards(),
        fetchTestimonials(),
        fetchFAQs(),
        fetchArticles()
      ]);

      // Update state dengan data dari Supabase
      if (productsRes.data) {
        setProducts(productsRes.data);
      }
      if (portfoliosRes.data) {
        setPortfolios(portfoliosRes.data);
      }
      if (awardsRes.data) {
        setAwards(awardsRes.data);
      }
      if (testimonialsRes.data) {
        setTestimonials(testimonialsRes.data);
      }
      if (faqsRes.data) {
        setFaqs(faqsRes.data);
      }
      if (articlesRes.data) {
        setArticles(articlesRes.data);
      }

      setLoading(false);
    }

    loadAllData();
  }, []);

  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(prev => (prev + 1) % heroImages.length), 5000);

    const handleResize = () => {
      setItemsToShow(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const brandLogos = [
    "/images/brandHonda.png",
    "/images/brandAlfa.png",
    "/images/brandBahtera.png",
    "/images/brandBimantara.png",
    "/images/brandCarefour.png",
    "/images/brandHK.png",
    "/images/brandMuhammadiyah.png",
    "/images/brandSumberWaras.png",
    "/images/brandSummarecon.png",
    "/images/brandTata.png",
  ];

  const visibleTestimonials = testimonials.slice(testiIndex, testiIndex + itemsToShow);

  const nextTesti = () => {
    if (testiIndex + itemsToShow < testimonials.length) {
      setTestiIndex(testiIndex + 1);
    }
  };

  const prevTesti = () => {
    if (testiIndex > 0) {
      setTestiIndex(testiIndex - 1);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden pb-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          {heroImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ${heroSlide === idx ? 'opacity-40 scale-105' : 'opacity-0'}`}
              style={{ transition: 'opacity 1.5s ease-in-out, transform 12s linear' }}
              alt="Hero"
            />
          ))}
        </div>
        <div className="relative z-20 w-[90%] md:w-[80%] mx-auto px-3 md:px-8 pt-32 md:pt-40 pb-8">
          <div className="max-w-4xl space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-4">
              <div className="h-[1px] w-12 bg-[#d4af37]"></div>
              <p className="text-[#d4af37] text-[10px] font-bold tracking-[0.6em] uppercase">Million Dollar Award</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-luxury font-bold tracking-tighter leading-[1.1] uppercase">
              Daikin Proshop <span className="gold-text">Expertise.</span>
            </h1>
            <p className="max-w-xl text-gray-400 text-lg font-light leading-relaxed">{t.hero.sub}</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="https://wa.me/62811102977" className="text-center gold-gradient px-12 py-4 rounded-full text-[#0a0a0a] font-bold text-[11px] tracking-[0.2em] uppercase shadow-2xl hover:scale-105 transition-all">
                {lang === 'ID' ? 'MULAI KONSULTASI' : 'START CONSULTING'}
              </a>
              <Link to="/portfolio" className="px-12 py-4 rounded-full border border-white/20 text-white font-bold text-[11px] tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center uppercase">
                PORTFOLIO PROYEK
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="bg-black py-8 border-b border-[#d4af37]/10 overflow-hidden relative">
        <div className="flex animate-brand-scroll whitespace-nowrap items-center">
          {[...brandLogos, ...brandLogos].map((logo, idx) => (
            <div key={idx} className="mx-16 flex items-center justify-center h-10 w-32 shrink-0">
              <img src={logo} className="max-h-full max-w-full object-contain brightness-0 invert" alt="Brand" />
            </div>
          ))}
        </div>
      </section>

      {/* TENTANG KAMI */}
      <section id="about" className="py-12 w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <p className="text-[#d4af37] text-[10px] font-bold tracking-[0.4em] uppercase">{t.nav.about}</p>
              <h2 className="normal-case text-4xl md:text-5xl font-luxury font-bold leading-tight">Pengalaman & Kredibilitas</h2>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              Sebagai dealer Daikin Proshop pertama di Indonesia, PT Cipta Sejahtera Lestari telah mendedikasikan lebih dari tiga dekade untuk merancang solusi tata udara yang meningkatkan efisiensi operasional dan kualitas hidup di berbagai sektor industri.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-4">
              <div className="text-left">
                <p className="text-3xl font-luxury font-bold gold-text">30+</p>
                <p className="text-[8px] text-gray-500 font-bold tracking-widest uppercase mt-2">Years of Trust</p>
              </div>
              <div className="text-left">
                <p className="text-3xl font-luxury font-bold gold-text">1000+</p>
                <p className="text-[8px] text-gray-500 font-bold tracking-widest uppercase mt-2">Project Installed</p>
              </div>
              <div className="text-left">
                <p className="text-3xl font-luxury font-bold gold-text">#1</p>
                <p className="text-[8px] text-gray-500 font-bold tracking-widest uppercase mt-2">Daikin Partner</p>
              </div>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-video border border-[#d4af37]/20 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale" alt="Expertise" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* PRODUK UNGGULAN */}
      <section id="products" className="py-12 bg-black/50 border-y border-[#d4af37]/5">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2 text-left">
              <p className="text-[#d4af37] text-[10px] font-bold tracking-[0.5em] uppercase">{lang === 'ID' ? 'KATALOG' : 'CATALOG'}</p>
              <h2 className="normal-case text-4xl md:text-5xl font-luxury font-bold">{t.products.title}</h2>
            </div>
            <Link to="/products" className="text-[10px] font-bold tracking-[0.3em] text-[#d4af37] border-b border-[#d4af37]/30 pb-1 uppercase">
              {t.products.viewAll} <ChevronRight size={14} className="inline" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((p) => (
              <div key={p.id} className="group bg-[#0a0a0a] border border-white/5 rounded-[40px] p-6 hover:border-[#d4af37]/40 transition-all flex flex-col h-full">
                <div className="relative h-80 bg-[#111] rounded-[32px] overflow-hidden flex items-center justify-center p-4 mb-8">
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-black/80 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/20 px-3 py-1 text-[8px] font-bold uppercase tracking-widest rounded-full">{p.category}</span>
                  </div>
                  <img src={p.image_path} className="h-full w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                </div>
                <div className="space-y-4 flex-1 flex flex-col text-left">
                  <h3 className="text-2xl font-luxury font-bold group-hover:gold-text transition-colors uppercase leading-tight">{p.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 flex-1">{p.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.features.slice(0, 3).map(f => <span key={f} className="text-[9px] font-bold text-gray-500 border border-white/10 px-3 py-1 rounded-full uppercase">{f}</span>)}
                  </div>
                  <Link to={`/product/${p.slug}`} className="block text-center py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all mt-6">
                    {lang === 'ID' ? 'LIHAT DETAIL' : 'VIEW DETAILS'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAYANAN KAMI */}
      <section className="py-12 bg-[#050505] border-b border-white/5">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-left">
            <div className="space-y-4">
              <p className="text-[#d4af37] text-[10px] font-bold tracking-[0.5em] uppercase">{t.layanan.title}</p>
              <h2 className="normal-case text-4xl md:text-5xl font-luxury font-bold leading-tight">{t.layanan.sub}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.layanan.items.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <CheckCircle2 size={18} className="text-[#d4af37] shrink-0 mt-1" />
                  <p className="text-sm text-gray-400 font-light">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[40px] overflow-hidden border border-[#d4af37]/20 aspect-video relative group">
            <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Service" />
          </div>
        </div>
      </section>

      {/* PORTOFOLIO */}
      <section id="portfolio" className="py-12 w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2 text-left">
            <p className="text-[#d4af37] text-[10px] font-bold tracking-[0.5em] uppercase">{t.portfolio.title}</p>
            <h2 className="normal-case text-4xl md:text-5xl font-luxury font-bold">{t.portfolio.sub}</h2>
          </div>
          <Link to="/portfolio" className="text-[10px] font-bold tracking-[0.3em] text-[#d4af37] border-b border-[#d4af37]/30 pb-1 uppercase">
            {lang === 'ID' ? 'LIHAT SEMUA' : 'VIEW ALL'}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          {portfolios.slice(0, 3).map((item) => (
            <Link to={`/portfolio/${item.slug}`} key={item.id} className="group flex flex-col h-full">
              <div className="aspect-[16/11] overflow-hidden rounded-3xl mb-8 w-full border border-white/5 bg-[#111]">
                <img src={item.image_path} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-1000" alt={item.title} />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl md:text-2xl font-luxury font-bold group-hover:gold-text uppercase leading-tight line-clamp-2">{item.title}</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase opacity-80 mt-auto pt-2">{item.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AWARDS */}
      <section className="py-12 bg-black/50 border-y border-[#d4af37]/10">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2 text-left">
              <p className="text-[#d4af37] text-[10px] font-bold tracking-[0.5em] uppercase">AWARDS</p>
              <h2 className="normal-case text-4xl md:text-5xl font-luxury font-bold">{t.awards.sub}</h2>
            </div>
            <Link to="/awards" className="text-[10px] font-bold tracking-[0.3em] text-[#d4af37] border-b border-[#d4af37]/30 pb-1 uppercase">
              {lang === 'ID' ? 'LIHAT SEMUA' : 'VIEW ALL'}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.slice(0, 3).map(a => (
              <div key={a.id} className="p-10 bg-[#111] rounded-[32px] border border-white/5 group hover:border-[#d4af37]/40 transition-all text-left">
                <Award size={40} className="text-[#d4af37] mb-8" />
                <p className="text-sm font-bold gold-text mb-2">{a.year}</p>
                <h4 className="text-xl font-luxury font-bold uppercase mb-4">{a.name}</h4>
                <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">{a.institution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONI - Manual Slider */}
      <section className="py-12 w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-12 gap-6 md:gap-0">
          <div className="space-y-2 text-left">
            <p className="text-[#d4af37] text-[10px] font-bold tracking-[0.5em] uppercase">{t.testi.title}</p>
            <h2 className="normal-case text-4xl md:text-5xl font-luxury font-bold">{t.testi.sub}</h2>
          </div>
          {testimonials.length > itemsToShow && (
            <div className="flex gap-4">
              <button onClick={prevTesti} disabled={testiIndex === 0} className="w-12 h-12 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37]/10 disabled:opacity-30 transition-all">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextTesti} disabled={testiIndex + itemsToShow >= testimonials.length} className="w-12 h-12 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37]/10 disabled:opacity-30 transition-all">
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {visibleTestimonials.map((item) => {
            return (
              <div key={item.id} className="flex flex-col text-left group bg-[#0a0a0a] md:bg-[#111] p-8 md:p-10 rounded-3xl border border-white/5 h-full transition-all hover:border-[#d4af37]/20">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="#d4af37" className="text-[#d4af37]" />)}
                </div>
                <blockquote className="text-base md:text-lg font-light leading-relaxed text-gray-300 italic mb-8 flex-1 line-clamp-6">
                  "{item.content}"
                </blockquote>
                <div className="w-full h-[1px] bg-[#d4af37] opacity-20 mb-8"></div>
                <div className="flex items-center gap-3 md:gap-5 mt-auto">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-bold text-white uppercase tracking-widest truncate">{item.name}</p>
                    <p className="text-[10px] md:text-[12px] text-[#d4af37] italic mt-0.5 truncate">{item.role} — {item.company}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ - 2 COLUMN GRID */}
      <section className="py-12 w-[90%] md:w-[80%] mx-auto px-3 md:px-8 border-b border-white/5">
        <div className="text-center mb-12 space-y-4">
          <p className="text-[#d4af37] text-xs font-thin tracking-[0.5em] uppercase">{t.faq.title}</p>
          <h2 className="normal-case text-3xl md:text-4xl font-luxury font-bold">{t.faq.sub}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {faqs.map((f, i) => (
            <div key={f.id} className="border border-white/10 rounded-2xl overflow-hidden h-fit">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 bg-[#111] hover:bg-[#161616] transition-all text-left"
              >
                <span className="font-semibold text-lg md:text-xl normal-case tracking-tight">{f.q}</span>
                {openFaq === i ? <Minus size={20} className="text-[#d4af37]" /> : <Plus size={20} className="text-[#d4af37]" />}
              </button>
              {openFaq === i && (
                <div className="p-6 bg-black text-gray-400 text-base font-light leading-relaxed border-t border-white/5">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ARTIKEL */}
      <section id="insights" className="py-12 w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2 text-left">
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">{t.articleList.title}</p>
            <h2 className="normal-case text-4xl md:text-5xl font-luxury font-bold">{t.articleList.sub}</h2>
          </div>
          <Link to="/articles" className="text-[10px] font-bold tracking-[0.3em] text-[#d4af37] border-b border-[#d4af37]/30 pb-1 uppercase">
            {lang === 'ID' ? 'LIHAT SEMUA' : 'VIEW ALL'}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
          {articles.slice(0, 3).map((article) => (
            <Link to={`/article/${article.slug}`} key={article.id} className="group block">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#d4af37] font-bold tracking-widest uppercase">{new Date(article.created_at).toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <h3 className="text-2xl font-luxury text-white group-hover:text-[#d4af37] transition-colors leading-snug normal-case">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-base font-light line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#d4af37] border-b border-[#d4af37]/30 pb-1 uppercase group-hover:border-[#d4af37] transition-all">
                    {lang === 'ID' ? 'BACA SELENGKAPNYA' : 'READ MORE'}
                  </span>
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

export default Home;
