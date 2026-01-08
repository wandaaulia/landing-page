
import React, { useState, useEffect } from 'react';
import {
  Package,
  Briefcase,
  FileText,
  Award,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { supabase } from '../services/supabase';

const StatCard = ({ title, value, icon, color, loading }: any) => (
  <div className="bg-[#141414] border border-[#d4af37]/10 p-6 rounded-2xl flex items-center gap-6 group hover:border-[#d4af37]/30 transition-all">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} text-[#0a0a0a] group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-luxury mt-1">
        {loading ? (
          <span className="inline-block w-12 h-8 bg-[#d4af37]/20 rounded animate-pulse"></span>
        ) : (
          value
        )}
      </p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    portfolios: 0,
    articles: 0,
    awards: 0,
    testimonials: 0,
    faqs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [productsRes, portfoliosRes, articlesRes, awardsRes, testimonialsRes, faqsRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('portfolios').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('awards').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('faqs').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        products: productsRes.count || 0,
        portfolios: portfoliosRes.count || 0,
        articles: articlesRes.count || 0,
        awards: awardsRes.count || 0,
        testimonials: testimonialsRes.count || 0,
        faqs: faqsRes.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-luxury font-bold">Welcome back, Administrator.</h1>
          <p className="text-gray-400 mt-2">PT CSL content management.</p>
        </div>
        <div className="bg-[#141414] border border-[#d4af37]/20 px-4 py-2 rounded-lg flex items-center gap-2">
          <TrendingUp size={16} className="text-[#d4af37]" />
          <span className="text-xs font-bold text-[#d4af37]">SYSTEM ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Products" value={stats.products} icon={<Package />} color="bg-[#d4af37]" loading={loading} />
        <StatCard title="Portfolios" value={stats.portfolios} icon={<Briefcase />} color="bg-[#d4af37]" loading={loading} />
        <StatCard title="Articles" value={stats.articles} icon={<FileText />} color="bg-[#d4af37]" loading={loading} />
        <StatCard title="Awards" value={stats.awards} icon={<Award />} color="bg-[#d4af37]" loading={loading} />
        <StatCard title="Testimonials" value={stats.testimonials} icon={<MessageSquare />} color="bg-[#d4af37]" loading={loading} />
        <StatCard title="FAQs" value={stats.faqs} icon={<HelpCircle />} color="bg-[#d4af37]" loading={loading} />
      </div>

      <div className="bg-[#141414] border border-[#d4af37]/10 p-8 rounded-2xl max-w-md">
          <h3 className="text-lg font-luxury font-bold mb-6 flex items-center gap-2">
            <Users size={20} className="text-[#d4af37]" />
            Content Summary
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#d4af37]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 uppercase tracking-widest">Total Content Items</span>
                <span className="text-xl font-bold text-[#d4af37]">
                  {loading ? '...' : stats.products + stats.portfolios + stats.articles + stats.awards + stats.testimonials + stats.faqs}
                </span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Products</span>
                <span className="font-bold">{loading ? '...' : stats.products}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Portfolios</span>
                <span className="font-bold">{loading ? '...' : stats.portfolios}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Articles</span>
                <span className="font-bold">{loading ? '...' : stats.articles}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Awards</span>
                <span className="font-bold">{loading ? '...' : stats.awards}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Testimonials</span>
                <span className="font-bold">{loading ? '...' : stats.testimonials}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">FAQs</span>
                <span className="font-bold">{loading ? '...' : stats.faqs}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
