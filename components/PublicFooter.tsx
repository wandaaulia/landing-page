
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';
import { translations } from '../services/supabase';

const PublicFooter: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];

  return (
    <footer className="bg-black pt-32 pb-16 border-t border-white/5">
      <div className="max-w-[80%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-[#0a0a0a] font-bold font-luxury text-2xl">D</div>
              <div>
                 <h4 className="font-luxury font-bold tracking-[0.2em] text-xl">DAIKIN PROSHOP</h4>
                 <p className="text-[8px] text-[#d4af37] uppercase tracking-[0.3em] font-bold">PT. CIPTA SEJAHTERA LESTARI</p>
              </div>
            </div>
            <p className="text-gray-500 text-base max-w-sm font-light leading-relaxed">
              Dealer Daikin Proshop pertama di Indonesia. Melayani kebutuhan HVAC residensial, komersial, dan industri dengan standar engineering kelas dunia.
            </p>
            <p className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase">
              {t.footer.businessHours}
            </p>
          </div>
          <div className="space-y-8 text-left">
            <h5 className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.4em]">{t.footer.navigasi}</h5>
            <ul className="space-y-4 text-gray-500 text-[10px] font-bold tracking-[0.2em]">
              <li><Link to="/about" className="hover:text-[#d4af37] transition-colors">{lang === 'ID' ? 'TENTANG CSL' : 'ABOUT CSL'}</Link></li>
              <li><Link to="/products" className="hover:text-[#d4af37] transition-colors">{lang === 'ID' ? 'KATALOG UNIT' : 'UNIT CATALOG'}</Link></li>
              <li><Link to="/portfolio" className="hover:text-[#d4af37] transition-colors">PORTOFOLIO</Link></li>
              <li><Link to="/articles" className="hover:text-[#d4af37] transition-colors">ARTIKEL</Link></li>
              <li><Link to="/awards" className="hover:text-[#d4af37] transition-colors">{lang === 'ID' ? 'PENGHARGAAN' : 'AWARDS'}</Link></li>
            </ul>
          </div>
          <div className="space-y-8 text-left">
            <h5 className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.4em]">{lang === 'ID' ? 'HUBUNGI KAMI' : 'CONTACT US'}</h5>
            <p className="text-gray-500 text-[10px] leading-relaxed font-bold tracking-widest uppercase">
              SCBD DISTRICT 8, TREASURY TOWER<br />
              JAKARTA SELATAN, 12190<br /><br />
              INFO@CSL.CO.ID<br />
              +62 811 102 977
            </p>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[8px] text-gray-600 tracking-[0.3em] uppercase font-bold">© 2025 PT. Cipta Sejahtera Lestari. Official Daikin Elite Partner.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
