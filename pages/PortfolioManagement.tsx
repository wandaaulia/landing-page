
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, X, Image as ImageIcon } from 'lucide-react';
import { Portfolio } from '../types';
import { supabase } from '../services/supabase';

const PortfolioManagement: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<Portfolio>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Load portfolios from Supabase
  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setPortfolios(data as Portfolio[]);
    }
    setLoading(false);
  };

  const handleEdit = (item: Portfolio) => {
    setCurrent(item);
    setImagePreview(item.image_path);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrent({});
    setImageFile(null);
    setImagePreview('');
    setIsEditing(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!current.title) {
      alert('Title is required');
      return;
    }

    // Require image for new portfolio
    if (!current.id && !imageFile) {
      alert('Please upload an image for the portfolio');
      return;
    }

    setIsSaving(true);

    try {
      let imagePath = current.image_path || '';

      // Upload image if new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `portfolios/${fileName}`;

        // Upload with better error handling
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error details:', uploadError);
          alert('Error uploading image: ' + uploadError.message + '\n\nPastikan storage bucket "images" sudah dibuat di Supabase dan policies sudah diatur.');
          setIsSaving(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imagePath = urlData.publicUrl;

        // Delete old image if updating
        if (current.id && current.image_path) {
          try {
            const oldPath = current.image_path.split('/').slice(-2).join('/');
            await supabase.storage.from('images').remove([oldPath]);
          } catch (deleteError) {
            console.warn('Could not delete old image:', deleteError);
          }
        }
      }

      const slug = generateSlug(current.title || '');
      const portfolioData = {
        title: current.title,
        slug: slug,
        summary: current.summary || '',
        category: current.category || 'Residential',
        location: current.location || '',
        products_used: current.products_used || '',
        challenge: current.challenge || '',
        solution: current.solution || '',
        impact: current.impact || '',
        image_path: imagePath
      };

      if (current.id) {
        // Update existing portfolio
        const { error } = await supabase
          .from('portfolios')
          .update(portfolioData)
          .eq('id', current.id);

        if (error) {
          alert('Error updating portfolio: ' + error.message);
        } else {
          await loadPortfolios();
          setIsEditing(false);
          setImageFile(null);
          setImagePreview('');
        }
      } else {
        // Create new portfolio
        const { error } = await supabase
          .from('portfolios')
          .insert([portfolioData]);

        if (error) {
          alert('Error creating portfolio: ' + error.message);
        } else {
          await loadPortfolios();
          setIsEditing(false);
          setImageFile(null);
          setImagePreview('');
        }
      }
    } catch (err) {
      alert('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (portfolio: Portfolio) => {
    if (!confirm(`Are you sure you want to delete "${portfolio.title}"?`)) {
      return;
    }

    try {
      // Delete image from storage
      if (portfolio.image_path) {
        const imagePath = portfolio.image_path.split('/').slice(-2).join('/');
        await supabase.storage.from('images').remove([imagePath]);
      }

      // Delete portfolio from database
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolio.id);

      if (error) {
        alert('Error deleting portfolio: ' + error.message);
      } else {
        await loadPortfolios();
      }
    } catch (err) {
      alert('An unexpected error occurred');
      console.error(err);
    }
  };

  const filteredPortfolios = categoryFilter === 'All'
    ? portfolios
    : portfolios.filter(p => p.category === categoryFilter);

  // Get unique categories from portfolios
  const categories = ['All', ...Array.from(new Set(portfolios.map(p => p.category)))];

  // Count portfolios per category
  const getCategoryCount = (category: string) => {
    if (category === 'All') return portfolios.length;
    return portfolios.filter(p => p.category === category).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-luxury font-bold">Portfolio</h1>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 gold-gradient px-6 py-3 rounded-xl text-[#0a0a0a] font-bold text-sm hover:brightness-110 shadow-lg"
        >
          <Plus size={18} />
          Tambah Project
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-[#141414] border border-[#d4af37]/10 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter by Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-[#d4af37]/10 rounded-lg px-4 py-2 text-sm font-bold text-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat} ({getCategoryCount(cat)})
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500 ml-auto">
            Showing {filteredPortfolios.length} of {portfolios.length} projects
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-bold">No portfolios found</p>
          <p className="text-sm mt-2">{categoryFilter === 'All' ? 'Click "ADD PROJECT" to create your first portfolio' : `No projects in "${categoryFilter}" category`}</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#d4af37]/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#d4af37]/10">
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Image</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Title</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Location</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Products Used</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Created</th>
                  <th className="text-right p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/5">
                {filteredPortfolios.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#d4af37]/10">
                        <img src={item.image_path} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-white group-hover:text-[#d4af37] transition-colors">{item.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{item.summary}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-[#d4af37] border border-[#d4af37]/30 px-2 py-1 rounded uppercase tracking-widest">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin size={14} className="text-[#d4af37]" />
                        <span>{item.location || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {item.products_used || '-'}
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
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
          <div className="bg-[#141414] border border-[#d4af37]/20 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl my-auto">
            <div className="p-6 gold-gradient flex items-center justify-between">
              <h3 className="text-[#0a0a0a] font-bold uppercase tracking-widest">Project Details</h3>
              <button onClick={() => setIsEditing(false)} className="text-[#0a0a0a] hover:bg-black/10 rounded-full p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</label>
                  <input value={current.title || ''} onChange={e => setCurrent({...current, title: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                    <select value={current.category || ''} onChange={e => setCurrent({...current, category: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm">
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
                    <input value={current.location || ''} onChange={e => setCurrent({...current, location: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Summary</label>
                  <textarea value={current.summary || ''} onChange={e => setCurrent({...current, summary: e.target.value})} rows={4} className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm resize-none"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Products Used</label>
                  <input value={current.products_used || ''} onChange={e => setCurrent({...current, products_used: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm" placeholder="e.g., VRV A Series, AHU Custom" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Image</label>
                  <input
                    type="file"
                    id="portfolio-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="portfolio-image" className="border-2 border-dashed border-[#d4af37]/10 rounded-2xl p-6 flex flex-col items-center justify-center bg-[#0a0a0a] hover:bg-[#d4af37]/5 transition-colors cursor-pointer group block">
                    {imagePreview ? (
                      <div className="w-full aspect-video rounded-xl overflow-hidden mb-2">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <ImageIcon size={32} className="text-[#d4af37] mb-2 group-hover:scale-110 transition-transform" />
                    )}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{imagePreview ? 'Click to change' : 'Upload Project Visuals'}</p>
                  </label>
                </div>
              </div>
              <div className="lg:col-span-2 flex gap-4 pt-4 border-t border-[#d4af37]/10">
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
                    'SIMPAN'
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

export default PortfolioManagement;
