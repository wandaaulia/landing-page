
import React, { useState, useContext, useEffect } from 'react';
import { Award, PlusCircle } from 'lucide-react';
import { translations, fetchAwards } from '../../services/supabase';
import { LanguageContext } from '../../App';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import { Award as AwardType } from '../../types';

const AwardsList: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];
  const [visibleCount, setVisibleCount] = useState(12);
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAwards = async () => {
      const { data } = await fetchAwards();
      if (data) {
        setAwards(data);
      }
      setLoading(false);
    };
    loadAwards();
  }, []);

  const paginatedAwards = awards.slice(0, visibleCount);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />

      <section className="pt-48 pb-12 border-b border-[#d4af37]/10">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 text-left">
          <div className="space-y-4 max-w-4xl">

            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">RECOGNITION</p>
            <h1 className="text-4xl md:text-6xl font-luxury font-bold tracking-tighter uppercase leading-tight max-w-4xl">
              PENGHARGAAN
            </h1>

            <p className="text-xl text-gray-500 font-light leading-relaxed">
              Awards represent our recognition of quality, professionalism, and strict compliance with global Daikin standards.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {paginatedAwards.map((a) => (
                <div key={a.id} className="p-12 bg-[#111] rounded-[40px] border border-white/5 text-left group hover:border-[#d4af37]/40 transition-all">
                  <div className="w-16 h-16 bg-black border border-[#d4af37]/20 rounded-2xl flex items-center justify-center text-[#d4af37] mb-10 group-hover:bg-[#d4af37] group-hover:text-[#0a0a0a] transition-all">
                    <Award size={32} />
                  </div>
                  <p className="text-lg font-bold gold-text mb-4">{a.year}</p>
                  <h3 className="text-2xl font-luxury font-bold uppercase mb-4">{a.name}</h3>
                  <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">{a.institution}</p>
                  <div className="mt-10 h-[1px] bg-white/5 group-hover:bg-[#d4af37]/40 transition-all"></div>
                </div>
              ))}
            </div>

            {awards.length > visibleCount && (
              <div className="mt-20 flex justify-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="flex items-center gap-3 px-12 py-5 bg-[#111] border border-[#d4af37]/30 text-[#d4af37] font-bold text-xs tracking-widest rounded-full hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all uppercase"
                >
                  <PlusCircle size={18} /> LOAD MORE AWARDS
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <PublicFooter />
    </div>
  );
};

export default AwardsList;
