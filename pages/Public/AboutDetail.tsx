
import React, { useContext, useEffect, useState } from 'react';
import { Shield, Settings, ArrowUpRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../App';
import { translations, fetchAwards } from '../../services/supabase';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import { Award as AwardType } from '../../types';

const AboutDetail: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [loadingAwards, setLoadingAwards] = useState(true);

  useEffect(() => {
    const loadAwards = async () => {
      const { data } = await fetchAwards();
      if (data) {
        setAwards(data);
      }
      setLoadingAwards(false);
    };
    loadAwards();
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />

      <section className="pt-32 pb-12 w-[90%] md:w-[80%] mx-auto px-3 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6 text-left">
          <div className="space-y-4">
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">{lang === 'ID' ? 'TENTANG KAMI' : 'ABOUT US'}</p>
            <h1 className="text-5xl md:text-7xl font-luxury font-bold leading-[0.9] tracking-tighter"> VISI KAMI</h1>
          </div>
          <p className="text-lg text-gray-400 font-light leading-relaxed border-l-4 border-[#d4af37]/40 pl-8 italic max-w-xl">
            "Didirikan dengan visi untuk merevolusi standar kenyamanan termal, PT Cipta Sejahtera Lestari hadir bukan hanya untuk menginstalasi unit, melainkan merancang ekosistem udara yang mendukung kesuksesan bisnis Anda."
          </p>
          <div className="pt-4">
            <a href="https://wa.me/62811102977" className="inline-block gold-gradient px-12 py-4 rounded-full text-[#0a0a0a] font-bold text-[11px] tracking-[0.3em] uppercase">
              {lang === 'ID' ? 'KONSULTASI TEKNIS' : 'TECHNICAL CONSULTATION'}
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-[#d4af37]/30">
          <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale opacity-80" alt="About" />
          <div className="absolute bottom-10 left-10 text-left">
            <p className="text-4xl font-luxury font-bold gold-text">SINCE 2008</p>
            <p className="text-[10px] font-bold tracking-[0.5em] uppercase mt-2">Pioneering HVAC Excellence</p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-black/30 border-y border-[#d4af37]/10">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 md:mb-16 gap-6 md:gap-0">
            <div className="space-y-2 text-left">
              <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">{lang === 'ID' ? 'PENGHARGAAN' : 'AWARDS'}</p>
              <h2 className="text-4xl md:text-5xl font-luxury font-bold normal-case">{lang === 'ID' ? 'Bukti Komitmen Kami' : 'Proof of Our Commitment'}</h2>
            </div>
            <Link to="/awards" className="gold-gradient px-8 py-3 rounded-full text-[#0a0a0a] text-[10px] font-bold uppercase tracking-widest text-center w-fit md:w-auto">
              {t.awards.viewAll} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingAwards ? (
              <div className="col-span-3 flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
              </div>
            ) : (
              awards.slice(0, 3).map(a => (
                <div key={a.id} className="p-8 bg-[#111] rounded-[32px] border border-white/5 text-left group hover:border-[#d4af37]/40 transition-all">
                  <Award size={32} className="text-[#d4af37] mb-6" />
                  <p className="text-xs font-bold gold-text mb-2">{a.year}</p>
                  <h4 className="text-lg font-luxury font-bold uppercase mb-2">{a.name}</h4>
                  <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">{a.institution}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Pillar Kami */}
      <section className="py-20 w-[90%] md:w-[80%] mx-auto px-3 md:px-8 text-center space-y-16">
        <div className="space-y-4">
          <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">{lang === 'ID' ? 'PILLAR KAMI' : 'OUR PILLARS'}</p>
          <h2 className="text-4xl md:text-5xl font-luxury font-bold normal-case tracking-widest">Why PT CSL?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Settings size={32} />, title: "Engineering Excellence", desc: "Setiap proyek melalui fase simulasi Heat Load yang presisi untuk menjamin efisiensi energi." },
            { icon: <Award size={32} />, title: "Official Partnership", desc: "Status Dealer Utama memastikan Anda mendapatkan akses prioritas ke teknologi terbaru." },
            { icon: <Shield size={32} />, title: "Safety & Compliance", desc: "Kepatuhan total pada standar HSE/K3 dalam setiap tahap instalasi." }
          ].map((p, i) => (
            <div key={i} className="p-10 bg-[#111] border border-white/5 rounded-[40px] text-left group hover:border-[#d4af37]/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-black border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] mb-8 group-hover:bg-[#d4af37] group-hover:text-[#0a0a0a] transition-all">
                {p.icon}
              </div>
              <h3 className="text-xl font-luxury font-bold uppercase tracking-tight mb-4">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cara Kerja Kami */}
      <section className="bg-[#050505] py-20 border-t border-[#d4af37]/5">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
          <div className="mb-12 space-y-4 text-left">
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">{lang === 'ID' ? 'CARA KERJA KAMI' : 'OUR WORKFLOW'}</p>
            <h2 className="text-4xl md:text-5xl font-luxury font-bold normal-case tracking-widest">{lang === 'ID' ? 'Proses Kerja' : 'Our Process'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="absolute top-8 left-0 right-0 h-[1px] bg-[#d4af37]/20 hidden md:block"></div>
            {[
              { name: "Consultation", desc: "Audit energi gratis dan survei kelayakan teknis." },
              { name: "Engineering", desc: "Perancangan sistem HVAC detail oleh tim senior." },
              { name: "Deployment", desc: "Instalasi profesional dengan monitoring ketat." },
              { name: "Maintenance", desc: "Dukungan perawatan berkelanjutan." }
            ].map((p, i) => (
              <div key={i} className="space-y-4 relative z-10 group text-left">
                <div className="w-16 h-16 bg-black border border-[#d4af37]/20 rounded-full flex items-center justify-center text-2xl font-luxury font-bold gold-text group-hover:bg-[#d4af37] group-hover:text-[#0a0a0a] transition-all">
                  {i + 1}
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-luxury font-bold normal-case tracking-tight">{p.name}</h4>
                  <p className="text-gray-500 text-base leading-relaxed font-light">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default AboutDetail;
