
import React, { useContext, useState } from 'react';
import { Send, MessageSquare, ShieldCheck, Headphones } from 'lucide-react';
import { LanguageContext } from '../../App';
import { translations } from '../../services/supabase';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const Contact: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];

  const DEPT_CONTACTS = [
    {
      title: 'General Enquiries',
      desc: 'Konsultasi proyek baru & penawaran harga.',
      wa: '+62 811102977',
      link: 'https://wa.me/62811102977',
      icon: <MessageSquare size={28} />
    },
    {
      title: 'After Sales Service Support',
      desc: 'Jadwal servis rutin & kontrak pemeliharaan.',
      wa: '+62 811102978',
      link: 'https://wa.me/62811102978',
      icon: <ShieldCheck size={28} />
    },
    {
      title: 'After Sales Technical Support',
      desc: 'Bantuan teknis darurat & solusi perbaikan.',
      wa: '+62 811102979',
      link: 'https://wa.me/62811102979',
      icon: <Headphones size={28} />
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    type: 'Komersial',
    location: '',
    message: ''
  });

  const handleSendEmail = () => {
    const subject = `Konsultasi Proyek: ${formData.type} - ${formData.company}`;
    const body = `Nama: ${formData.name}\nEmail: ${formData.email}\nTelepon: ${formData.phone}\nLokasi: ${formData.location}\n\nDetail Kebutuhan:\n${formData.message}`;
    window.location.href = `mailto:info@csl.co.id?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#d4af37] selection:text-[#0a0a0a]">
      <PublicNavbar />

      <section className="pt-48 pb-12 border-b border-white/5">
        <div className="w-[90%] md:w-[80%] mx-auto px-3 md:px-8 text-left">
          <div className="space-y-6 max-w-4xl">
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.5em] uppercase">KONTAK</p>
            <h1 className="text-5xl md:text-7xl font-luxury font-bold tracking-tighter leading-none uppercase">{t.contact.title}</h1>
            <p className="text-base md:text-lg text-gray-500 font-light leading-relaxed max-w-3xl">
              {t.contact.sub}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 w-[90%] md:w-[80%] mx-auto px-3 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

          {/* LEFT: DEPARTMENTS */}
          <div className="space-y-8 text-left">
            {DEPT_CONTACTS.map((dept, i) => (
              <div key={i} className="p-8 bg-[#111] border border-white/10 rounded-[32px] group hover:border-[#d4af37]/40 transition-all">
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-black border border-[#d4af37]/20 rounded-2xl flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#0a0a0a] transition-all shrink-0">
                    {dept.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-luxury font-bold uppercase tracking-widest">{dept.title}</h3>
                    <p className="text-sm text-gray-500 font-light">{dept.desc}</p>
                    <a href={dept.link} target="_blank" className="text-[#d4af37] font-bold text-lg block mt-2 hover:underline">{dept.wa}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: FORM - One Column Layout */}
          <div className="bg-[#111] border border-white/10 p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h3 className="text-2xl font-luxury font-bold uppercase tracking-widest mb-8 text-left border-b border-white/5 pb-6">Form</h3>
            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Jabatan & Nama Perusahaan</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="Manager - PT Jaya"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Alamat Email Bisnis</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="office@company.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nomor Telepon/WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="+62..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipe Proyek</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none appearance-none"
                >
                  <option>Komersial</option>
                  <option>Industri</option>
                  <option>Rumah Sakit</option>
                  <option>Hunian Mewah</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lokasi Proyek (Opsional)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="Kota/Provinsi"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pesan atau Detail Kebutuhan</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none resize-none"
                  placeholder="Jelaskan kebutuhan kapasitas, kendala teknis, dsb..."
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full gold-gradient py-5 rounded-2xl text-[#0a0a0a] font-bold uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
              >
                KIRIM PERMINTAAN KONSULTASI <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Contact;
