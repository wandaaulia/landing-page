
import React, { useState, useEffect } from 'react';
import { Save, History as HistoryIcon, Award, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AboutData {
  id?: number;
  content: string;
  vision: string;
  image_path: string;
  projects_count: string;
}

const AboutManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'history' | 'achievements'>('content');
  const [aboutData, setAboutData] = useState<AboutData>({
    content: '',
    vision: '',
    image_path: '',
    projects_count: '0'
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Load about data from Supabase
  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .single();

    if (data) {
      setAboutData(data as AboutData);
      setImagePreview(data.image_path || '');
    }
    setLoading(false);
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

  const handleSave = async () => {
    setIsSaving(true);

    try {
      let imagePath = aboutData.image_path || '';

      // Upload image if new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `about/${fileName}`;

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

        // Delete old image if exists
        if (aboutData.image_path) {
          try {
            const oldPath = aboutData.image_path.split('/').slice(-2).join('/');
            await supabase.storage.from('images').remove([oldPath]);
          } catch (deleteError) {
            console.warn('Could not delete old image:', deleteError);
          }
        }
      }

      const dataToSave = {
        ...aboutData,
        image_path: imagePath
      };

      if (aboutData.id) {
        // Update existing record
        const { error } = await supabase
          .from('about')
          .update(dataToSave)
          .eq('id', aboutData.id);

        if (error) {
          alert('Error updating about: ' + error.message);
        } else {
          alert('About page updated successfully!');
          await loadAboutData();
          setImageFile(null);
        }
      } else {
        // Create new record
        const { error } = await supabase
          .from('about')
          .insert([dataToSave]);

        if (error) {
          alert('Error creating about: ' + error.message);
        } else {
          alert('About page created successfully!');
          await loadAboutData();
          setImageFile(null);
        }
      }
    } catch (err) {
      alert('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-luxury font-bold">Company Profile</h1>
          <p className="text-gray-400 text-sm">Update how the world sees Daikin Proshop.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 gold-gradient px-6 py-3 rounded-xl text-[#0a0a0a] font-bold text-sm hover:brightness-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin"></div>
              SAVING...
            </>
          ) : (
            <>
              <Save size={18} />
              SAVE CHANGES
            </>
          )}
        </button>
      </div>

      <div className="flex border-b border-[#d4af37]/20 gap-8">
        {[
          { id: 'content', name: 'General Content', icon: <ImageIcon size={18} /> },
          { id: 'history', name: 'Our Journey', icon: <HistoryIcon size={18} /> },
          { id: 'achievements', name: 'Achievements', icon: <Award size={18} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-4 text-sm font-bold tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-[#d4af37]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.name.toUpperCase()}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] gold-gradient"></div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-[#141414] border border-[#d4af37]/10 p-8 rounded-3xl shadow-xl space-y-8">
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main About Text</label>
                <textarea
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-2xl p-6 text-sm text-gray-300 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#d4af37] min-h-[400px]"
                  value={aboutData.content}
                  onChange={(e) => setAboutData({...aboutData, content: e.target.value})}
                ></textarea>
              </div>
            </div>
            
            <div className="space-y-6">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Featured Profile Image</label>
              <input
                type="file"
                id="about-image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="about-image" className="relative group rounded-3xl overflow-hidden aspect-[4/5] border border-[#d4af37]/20 bg-[#0a0a0a] block cursor-pointer">
                <img
                  src={imagePreview || "https://picsum.photos/seed/daikin_about/800/1000"}
                  alt="Preview"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center text-[#0a0a0a] mb-4 shadow-xl">
                    <ImageIcon size={28} />
                  </div>
                  <span className="text-white font-bold tracking-widest text-sm bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                    CHANGE IMAGE
                  </span>
                </div>
              </label>
              <p className="text-[10px] text-center text-gray-500 tracking-wider">PREFER VERTICAL RATIO (4:5 OR 3:4) FOR BEST RESULTS.</p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[#d4af37] font-luxury font-bold tracking-widest">MILESTONES</h4>
              <button className="text-[10px] font-bold border border-[#d4af37]/50 text-[#d4af37] px-4 py-2 rounded-lg hover:bg-[#d4af37]/10 transition-all">
                ADD YEAR
              </button>
            </div>
            <div className="space-y-4">
              {[2024, 2022, 2018].map(year => (
                <div key={year} className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#d4af37]/10 flex items-start gap-8 group hover:border-[#d4af37]/40 transition-all">
                  <div className="text-3xl font-luxury font-bold gold-text opacity-50">{year}</div>
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      placeholder="Title of event" 
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-white font-bold text-lg" 
                      defaultValue={year === 2024 ? "National Recognition Excellence" : "Operational Expansion"}
                    />
                    <textarea 
                      placeholder="Detailed description..." 
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-400 text-sm resize-none"
                      rows={2}
                      defaultValue="Awarded by Daikin Global for exceptional service standards and customer satisfaction indices in the Southeast Asian region."
                    />
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:bg-red-400/10 p-2 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="border-2 border-dashed border-[#d4af37]/10 rounded-2xl flex items-center justify-center aspect-square text-[#d4af37]/40 hover:text-[#d4af37] hover:bg-[#d4af37]/5 transition-all cursor-pointer">
               <Plus size={48} />
             </div>
             {[1,2,3].map(i => (
               <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-[#d4af37]/10 bg-[#0a0a0a]">
                 <img src={`https://picsum.photos/seed/award${i}/400/400`} alt="Award" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                   <p className="text-xs text-[#d4af37] font-bold">202{i}</p>
                   <p className="text-sm font-bold uppercase tracking-widest mt-1">Elite Dealer Award</p>
                 </div>
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-red-500/20 text-red-400 p-2 rounded-full backdrop-blur-md">
                      <Trash2 size={16} />
                    </button>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Plus = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14m-7-7v14"/>
  </svg>
);

const Trash2 = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9v4m4-4v4"/>
  </svg>
);

export default AboutManagement;
