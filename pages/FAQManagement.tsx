
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, HelpCircle } from 'lucide-react';
import { FAQ } from '../types';
import { supabase } from '../services/supabase';

const FAQManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<FAQ>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load FAQs from Supabase
  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order', { ascending: true });

    if (data && data.length > 0) {
      setFaqs(data as FAQ[]);
    }
    setLoading(false);
  };

  const handleEdit = (item: FAQ) => {
    setCurrent(item);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrent({ order: faqs.length + 1 });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const faqData = {
        q: current.q,
        a: current.a || '',
        order: current.order || faqs.length + 1
      };

      if (current.id) {
        // Update existing FAQ
        const { error } = await supabase
          .from('faqs')
          .update(faqData)
          .eq('id', current.id);

        if (error) {
          alert('Error updating FAQ: ' + error.message);
        } else {
          await loadFAQs();
          setIsEditing(false);
        }
      } else {
        // Create new FAQ
        const { error } = await supabase
          .from('faqs')
          .insert([faqData]);

        if (error) {
          alert('Error creating FAQ: ' + error.message);
        } else {
          await loadFAQs();
          setIsEditing(false);
        }
      }
    } catch (err) {
      alert('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (faq: FAQ) => {
    if (!confirm(`Are you sure you want to delete this FAQ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', faq.id);

      if (error) {
        alert('Error deleting FAQ: ' + error.message);
      } else {
        await loadFAQs();
      }
    } catch (err) {
      alert('An unexpected error occurred');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-luxury font-bold">FAQ</h1>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 gold-gradient px-6 py-3 rounded-xl text-[#0a0a0a] font-bold text-sm hover:brightness-110 shadow-lg"
        >
          <Plus size={18} />
          Tambah FAQ
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
        </div>
      ) : faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-bold">No FAQs found</p>
          <p className="text-sm mt-2">Click "ADD FAQ" to create your first FAQ</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#d4af37]/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#d4af37]/10">
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-12">Order</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Question</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Answer</th>
                  <th className="text-right p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/5">
                {faqs.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <HelpCircle size={16} className="text-[#d4af37]" />
                        <span className="text-sm font-bold text-[#d4af37]">{item.order}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <h3 className="font-bold text-white group-hover:text-[#d4af37] transition-colors max-w-md">{item.q}</h3>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-400 text-sm line-clamp-2 max-w-xl">{item.a}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-[#0a0a0a] border border-[#d4af37]/20 rounded-lg text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 bg-[#0a0a0a] border border-red-500/20 rounded-lg text-red-400 hover:bg-red-400 hover:text-white transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0a0a]/95 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-[#d4af37]/20 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl my-auto">
            <div className="p-6 gold-gradient flex items-center justify-between">
              <h3 className="text-[#0a0a0a] font-bold uppercase tracking-widest">FAQ Details</h3>
              <button onClick={() => setIsEditing(false)} className="text-[#0a0a0a] hover:bg-black/10 rounded-full p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Question</label>
                <input
                  value={current.q || ''}
                  onChange={e => setCurrent({ ...current, q: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="Enter the question..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Answer</label>
                <textarea
                  value={current.a || ''}
                  onChange={e => setCurrent({ ...current, a: e.target.value })}
                  rows={6}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm resize-none focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="Enter the answer..."
                  required
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Display Order</label>
                <input
                  type="number"
                  value={current.order || ''}
                  onChange={e => setCurrent({ ...current, order: parseInt(e.target.value) })}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="1"
                  min="1"
                />
                <p className="text-[10px] text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
              <div className="flex gap-4 pt-4 border-t border-[#d4af37]/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 py-4 text-[#d4af37] border border-[#d4af37]/20 rounded-xl font-bold tracking-widest hover:bg-[#d4af37]/5 transition-all uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4 gold-gradient text-[#0a0a0a] rounded-xl font-bold tracking-widest hover:brightness-110 transition-all uppercase text-sm shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin"></div>
                      SAVING...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      SAVE FAQ
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;
