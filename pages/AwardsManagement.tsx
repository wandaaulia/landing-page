
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Award as AwardIcon } from 'lucide-react';
import { Award } from '../types';
import { supabase } from '../services/supabase';

const AwardsManagement: React.FC = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<Award>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load awards from Supabase
  useEffect(() => {
    loadAwards();
  }, []);

  const loadAwards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('awards')
      .select('*')
      .order('year', { ascending: false });

    if (data && data.length > 0) {
      setAwards(data as Award[]);
    }
    setLoading(false);
  };

  const handleEdit = (item: Award) => {
    setCurrent(item);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrent({ year: new Date().getFullYear().toString() });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!current.year || !current.name || !current.institution) {
      alert('Year, Award Name, and Institution are required');
      return;
    }

    setIsSaving(true);

    try {
      const awardData = {
        year: current.year,
        name: current.name,
        institution: current.institution
      };

      if (current.id) {
        // Update existing award
        const { error } = await supabase
          .from('awards')
          .update(awardData)
          .eq('id', current.id);

        if (error) {
          alert('Error updating award: ' + error.message);
        } else {
          await loadAwards();
          setIsEditing(false);
        }
      } else {
        // Create new award
        const { error } = await supabase
          .from('awards')
          .insert([awardData]);

        if (error) {
          alert('Error creating award: ' + error.message);
        } else {
          await loadAwards();
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

  const handleDelete = async (award: Award) => {
    if (!confirm(`Are you sure you want to delete "${award.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('awards')
        .delete()
        .eq('id', award.id);

      if (error) {
        alert('Error deleting award: ' + error.message);
      } else {
        await loadAwards();
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
          <h1 className="text-2xl font-luxury font-bold">Awards</h1>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 gold-gradient px-6 py-3 rounded-xl text-[#0a0a0a] font-bold text-sm hover:brightness-110 shadow-lg"
        >
          <Plus size={18} />
          Tambah Award
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
        </div>
      ) : awards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-bold">No awards found</p>
          <p className="text-sm mt-2">Click "ADD AWARD" to create your first award</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#d4af37]/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#d4af37]/10">
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-20">Icon</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Year</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Award Name</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Institution</th>
                  <th className="text-right p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/5">
                {awards.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
                        <AwardIcon size={20} className="text-[#d4af37]" />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[#d4af37] text-sm font-bold">{item.year}</span>
                    </td>
                    <td className="p-4">
                      <h3 className="font-bold text-white group-hover:text-[#d4af37] transition-colors uppercase tracking-wide">{item.name}</h3>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">{item.institution}</span>
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
          <div className="bg-[#141414] border border-[#d4af37]/20 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl my-auto">
            <div className="p-6 gold-gradient flex items-center justify-between">
              <h3 className="text-[#0a0a0a] font-bold uppercase tracking-widest">Award Details</h3>
              <button onClick={() => setIsEditing(false)} className="text-[#0a0a0a] hover:bg-black/10 rounded-full p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Year</label>
                <input
                  type="text"
                  value={current.year || ''}
                  onChange={e => setCurrent({ ...current, year: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="e.g., 2024"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Award Name</label>
                <input
                  value={current.name || ''}
                  onChange={e => setCurrent({ ...current, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="e.g., Million Dollar Award"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Institution</label>
                <input
                  value={current.institution || ''}
                  onChange={e => setCurrent({ ...current, institution: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="e.g., Daikin Indonesia"
                  required
                />
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
                      MENYIMPAN...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      SIMPAN
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

export default AwardsManagement;
