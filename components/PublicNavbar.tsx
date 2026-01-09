
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { LanguageContext } from '../App';
import { translations } from '../services/supabase';

const PublicNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang } = useContext(LanguageContext);
  const t = translations[lang];
  const location = useLocation();
  const navigate = useNavigate();
  const WA_LINK = "https://wa.me/62811102977";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#d4af37]/20 py-3' : 'bg-transparent py-8'
      }`}>
      <div className="max-w-[85%] mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-[#0a0a0a] font-bold font-luxury text-xl">D</div>
          <div className="hidden sm:block">
            <h1 className="font-luxury text-sm font-bold tracking-[0.3em] group-hover:gold-text transition-all">DAIKIN PROSHOP</h1>
            <p className="text-[9px] text-gray-500 font-bold uppercase">PT. Cipta Sejahtera Lestari</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-8 items-center border-r border-white/10 pr-8">
            <button onClick={() => handleLinkClick('/')} className={`text-[10px] font-bold tracking-[0.2em] transition-colors uppercase ${location.pathname === '/' ? 'text-[#d4af37]' : 'text-gray-400 hover:text-[#d4af37]'}`}>
              {t.nav.home}
            </button>

            {/* Direct Link to About - Dropdown Removed */}
            <button onClick={() => handleLinkClick('/about')} className={`text-[10px] font-bold tracking-[0.2em] transition-colors uppercase ${location.pathname.includes('/about') ? 'text-[#d4af37]' : 'text-gray-400 hover:text-[#d4af37]'}`}>
              {t.nav.about}
            </button>

            <button onClick={() => handleLinkClick('/products')} className={`text-[10px] font-bold tracking-[0.2em] transition-colors uppercase ${location.pathname.includes('/product') ? 'text-[#d4af37]' : 'text-gray-400 hover:text-[#d4af37]'}`}>
              {t.nav.products}
            </button>
            <button onClick={() => handleLinkClick('/portfolio')} className={`text-[10px] font-bold tracking-[0.2em] transition-colors uppercase ${location.pathname.includes('/portfolio') ? 'text-[#d4af37]' : 'text-gray-400 hover:text-[#d4af37]'}`}>
              {t.nav.portfolio}
            </button>
            <button onClick={() => handleLinkClick('/articles')} className={`text-[10px] font-bold tracking-[0.2em] transition-colors uppercase ${location.pathname.includes('/article') ? 'text-[#d4af37]' : 'text-gray-400 hover:text-[#d4af37]'}`}>
              {t.nav.articles}
            </button>
            <button onClick={() => handleLinkClick('/contact')} className={`text-[10px] font-bold tracking-[0.2em] transition-colors uppercase ${location.pathname === '/contact' ? 'text-[#d4af37]' : 'text-gray-400 hover:text-[#d4af37]'}`}>
              {t.nav.contact}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setLang('ID')} className={`text-[10px] font-bold ${lang === 'ID' ? 'text-[#d4af37]' : 'text-gray-500'}`}>ID</button>
              <span className="text-gray-700 text-[10px]">|</span>
              <button onClick={() => setLang('EN')} className={`text-[10px] font-bold ${lang === 'EN' ? 'text-[#d4af37]' : 'text-gray-500'}`}>EN</button>
            </div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="gold-gradient px-8 py-3 rounded-full text-[#0a0a0a] text-[9px] font-bold tracking-[0.2em] uppercase hover:scale-105 transition-all">
              {lang === 'ID' ? 'KONSULTASI' : 'CONSULTATION'}
            </a>
          </div>
        </div>

        <button className="lg:hidden text-[#d4af37]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-white/5 p-8 flex flex-col gap-6">
          <div className="flex gap-4 mb-4">
            <button onClick={() => setLang('ID')} className={`text-sm font-bold ${lang === 'ID' ? 'text-[#d4af37]' : 'text-gray-500'}`}>ID</button>
            <button onClick={() => setLang('EN')} className={`text-sm font-bold ${lang === 'EN' ? 'text-[#d4af37]' : 'text-gray-500'}`}>EN</button>
          </div>
          <button onClick={() => handleLinkClick('/')} className="text-lg font-luxury font-bold uppercase text-left">{t.nav.home}</button>
          <button onClick={() => handleLinkClick('/about')} className="text-lg font-luxury font-bold uppercase text-left">{t.nav.about}</button>
          <button onClick={() => handleLinkClick('/products')} className="text-lg font-luxury font-bold uppercase text-left">{t.nav.products}</button>
          <button onClick={() => handleLinkClick('/portfolio')} className="text-lg font-luxury font-bold uppercase text-left">{t.nav.portfolio}</button>
          <button onClick={() => handleLinkClick('/articles')} className="text-lg font-luxury font-bold uppercase text-left">{t.nav.articles}</button>
          <button onClick={() => handleLinkClick('/contact')} className="text-lg font-luxury font-bold uppercase text-left">{t.nav.contact}</button>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
