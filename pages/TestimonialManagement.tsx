
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Save } from 'lucide-react';
import { Testimonial } from '../types';
import { supabase } from '../services/supabase';

const TestimonialManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<Testimonial>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Load testimonials from Supabase
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setTestimonials(data as Testimonial[]);
    }
    setLoading(false);
  };

  const handleEdit = (item: Testimonial) => {
    setCurrent(item);
    setImagePreview(item.image);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!current.name) {
      alert('Name is required');
      return;
    }

    // Require image for new testimonial
    if (!current.id && !imageFile) {
      alert('Please upload a photo for the testimonial');
      return;
    }

    setIsSaving(true);

    try {
      let imagePath = current.image || '';

      // Upload image if new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `testimonials/${fileName}`;

        const { error: uploadError } = await supabase.storage
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
        if (current.id && current.image) {
          try {
            const oldPath = current.image.split('/').slice(-2).join('/');
            await supabase.storage.from('images').remove([oldPath]);
          } catch (deleteError) {
            console.warn('Could not delete old image:', deleteError);
          }
        }
      }

      const testimonialData = {
        name: current.name,
        role: current.role || '',
        company: current.company || '',
        content: current.content || '',
        image: imagePath
      };

      if (current.id) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', current.id);

        if (error) {
          alert('Error updating testimonial: ' + error.message);
        } else {
          await loadTestimonials();
          setIsEditing(false);
          setImageFile(null);
          setImagePreview('');
        }
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);

        if (error) {
          alert('Error creating testimonial: ' + error.message);
        } else {
          await loadTestimonials();
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

  const handleDelete = async (testimonial: Testimonial) => {
    if (!confirm(`Are you sure you want to delete testimonial from "${testimonial.name}"?`)) {
      return;
    }

    try {
      // Delete image from storage
      if (testimonial.image) {
        const imagePath = testimonial.image.split('/').slice(-2).join('/');
        await supabase.storage.from('images').remove([imagePath]);
      }

      // Delete testimonial from database
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonial.id);

      if (error) {
        alert('Error deleting testimonial: ' + error.message);
      } else {
        await loadTestimonials();
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
          <h1 className="text-2xl font-luxury font-bold">Testimoni</h1>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 gold-gradient px-6 py-3 rounded-xl text-[#0a0a0a] font-bold text-sm hover:brightness-110 shadow-lg"
        >
          <Plus size={18} />
          Tambah Testimoni
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-bold">No testimonials found</p>
          <p className="text-sm mt-2">Click "ADD TESTIMONIAL" to create your first testimonial</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#d4af37]/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#d4af37]/10">
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Photo</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role & Company</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Testimonial</th>
                  <th className="text-right p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/5">
                {testimonials.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4af37]/20">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <h3 className="font-bold text-white group-hover:text-[#d4af37] transition-colors">{item.name}</h3>
                    </td>
                    <td className="p-4">
                      <p className="text-[#d4af37] text-sm">
                        {item.role && item.company ? `${item.role} — ${item.company}` : item.role || item.company || '-'}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-400 text-sm line-clamp-2 italic max-w-lg">"{item.content}"</p>
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
              <h3 className="text-[#0a0a0a] font-bold uppercase tracking-widest">Testimonial Details</h3>
              <button onClick={() => setIsEditing(false)} className="text-[#0a0a0a] hover:bg-black/10 rounded-full p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      value={current.name || ''}
                      onChange={e => setCurrent({...current, name: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role / Position</label>
                    <input
                      value={current.role || ''}
                      onChange={e => setCurrent({...current, role: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company</label>
                    <input
                      value={current.company || ''}
                      onChange={e => setCurrent({...current, company: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Profile Photo</label>
                    <input
                      type="file"
                      id="testimonial-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="testimonial-image" className="border-2 border-dashed border-[#d4af37]/10 rounded-2xl p-6 flex flex-col items-center justify-center bg-[#0a0a0a] hover:bg-[#d4af37]/5 transition-colors cursor-pointer group block">
                      {imagePreview ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <ImageIcon size={32} className="text-[#d4af37] mb-2 group-hover:scale-110 transition-transform" />
                      )}
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{imagePreview ? 'Click to change' : 'Upload Photo'}</p>
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Testimonial Content</label>
                <textarea
                  value={current.content || ''}
                  onChange={e => setCurrent({...current, content: e.target.value})}
                  rows={5}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm resize-none focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                  placeholder="Write testimonial content here..."
                ></textarea>
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
                      SAVE TESTIMONIAL
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

export default TestimonialManagement;
