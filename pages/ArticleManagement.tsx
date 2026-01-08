
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Calendar, Sparkles, X, FileText } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Article } from '../types';
import { generateContentHelp } from '../services/geminiService';
import { supabase } from '../services/supabase';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'blockquote'],
    ['clean']
  ],
};

const ArticleManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<Article>>({});
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Load articles from Supabase
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setArticles(data as Article[]);
    }
    setLoading(false);
  };

  const handleEdit = (item: Article) => {
    setCurrent(item);
    setImagePreview(item.image_path);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrent({
      category: 'Education',
      published_at: new Date().toISOString().split('T')[0],
      author: 'Admin'
    });
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

  const calculateReadTime = (content: string) => {
    // Remove HTML tags for word count
    const cleanContent = content.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const words = cleanContent.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!current.title) {
      alert('Title is required');
      return;
    }

    // Require image for new article
    if (!current.id && !imageFile) {
      alert('Please upload an image for the article');
      return;
    }

    setIsSaving(true);

    try {
      let imagePath = current.image_path || '';

      // Upload image if new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `articles/${fileName}`;

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
      const readTime = calculateReadTime(current.content || '');
      const articleData = {
        title: current.title,
        slug: slug,
        excerpt: current.excerpt || '',
        content: current.content || '',
        category: current.category || 'Education',
        author: current.author || 'Admin',
        read_time: readTime,
        image_path: imagePath
      };

      if (current.id) {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', current.id);

        if (error) {
          alert('Error updating article: ' + error.message);
        } else {
          await loadArticles();
          setIsEditing(false);
          setImageFile(null);
          setImagePreview('');
        }
      } else {
        // Create new article
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);

        if (error) {
          alert('Error creating article: ' + error.message);
        } else {
          await loadArticles();
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

  const handleDelete = async (article: Article) => {
    if (!confirm(`Are you sure you want to delete "${article.title}"?`)) {
      return;
    }

    try {
      // Delete image from storage
      if (article.image_path) {
        const imagePath = article.image_path.split('/').slice(-2).join('/');
        await supabase.storage.from('images').remove([imagePath]);
      }

      // Delete article from database
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', article.id);

      if (error) {
        alert('Error deleting article: ' + error.message);
      } else {
        await loadArticles();
      }
    } catch (err) {
      alert('An unexpected error occurred');
      console.error(err);
    }
  };

  const handleAIWriter = async () => {
    if (!current.title) return alert("Please enter an article title first");
    setIsAIGenerating(true);
    const result = await generateContentHelp('Article Content', current.title, current.content);
    setCurrent({ ...current, content: result || "" });
    setIsAIGenerating(false);
  };

  return (
    <div className="space-y-6">
      <style>{`
          .ql-toolbar {
            border-color: rgba(212, 175, 55, 0.1) !important;
            background: #0a0a0a;
            border-top-left-radius: 0.75rem;
            border-top-right-radius: 0.75rem;
          }
          .ql-container {
            border-color: rgba(212, 175, 55, 0.1) !important;
            border-bottom-left-radius: 0.75rem;
            border-bottom-right-radius: 0.75rem;
            background: #0a0a0a;
            font-size: 1rem;
          }
          .ql-editor {
            min-height: 300px;
            color: #ccc;
          }
          .ql-snow .ql-stroke {
            stroke: #aaa;
          }
          .ql-snow .ql-fill {
            fill: #aaa;
          }
          .ql-snow .ql-picker {
            color: #aaa;
          }
        `}</style>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-luxury font-bold"> Artikel </h1>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 gold-gradient px-6 py-3 rounded-xl text-[#0a0a0a] font-bold text-sm hover:brightness-110 shadow-lg"
        >
          <Plus size={18} />
          Tulis Artikel
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-bold">No articles found</p>
          <p className="text-sm mt-2">Click "WRITE ARTICLE" to create your first article</p>
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
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Author</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Published</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Read Time</th>
                  <th className="text-right p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/5">
                {articles.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#d4af37]/10">
                        <img src={item.image_path} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 max-w-md">
                        <h3 className="font-bold text-white group-hover:text-[#d4af37] transition-colors">{item.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{item.excerpt}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-[#d4af37] border border-[#d4af37]/30 px-2 py-1 rounded uppercase tracking-widest">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <User size={14} className="text-[#d4af37]" />
                        <span>{item.author}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Calendar size={14} className="text-[#d4af37]" />
                        <span>{new Date(item.published_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {item.read_time}
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
          <div className="bg-[#141414] border border-[#d4af37]/20 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl my-auto">
            <div className="p-6 border-b border-[#d4af37]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-[#0a0a0a]">
                  <FileText size={20} />
                </div>
                <h3 className="font-luxury text-lg font-bold uppercase tracking-widest">Article Editor</h3>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Headline</label>
                    <input value={current.title || ''} onChange={e => setCurrent({ ...current, title: e.target.value })} className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-4 text-lg font-bold focus:ring-1 focus:ring-[#d4af37] focus:outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Short Excerpt</label>
                    <textarea value={current.excerpt || ''} onChange={e => setCurrent({ ...current, excerpt: e.target.value })} rows={2} className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none"></textarea>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Content</label>
                      <button type="button" onClick={handleAIWriter} disabled={isAIGenerating} className="text-[10px] font-bold text-[#d4af37] bg-[#d4af37]/10 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#d4af37]/20 transition-all border border-[#d4af37]/20 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                        <Sparkles size={14} className="animate-pulse" /> {isAIGenerating ? 'WRITING MASTERPIECE...' : 'AI CO-WRITER'}
                      </button>
                    </div>
                    <div className="bg-[#0a0a0a] rounded-xl overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={current.content || ''}
                        onChange={(content) => setCurrent({ ...current, content: content })}
                        modules={quillModules}
                        className="text-white"
                        placeholder="Write your article content here..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cover Image</label>
                    <input
                      type="file"
                      id="article-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="article-image" className="block">
                      {imagePreview ? (
                        <div className="rounded-xl overflow-hidden border border-[#d4af37]/20 aspect-video cursor-pointer hover:opacity-80 transition-opacity">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-[#d4af37]/10 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#d4af37]/5 transition-colors aspect-video">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Click to upload</p>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category Tag</label>
                    <select value={current.category || ''} onChange={e => setCurrent({ ...current, category: e.target.value })} className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:outline-none">
                      <option value="Education">Education</option>
                      <option value="Technology">Technology</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="News">Corporate News</option>
                    </select>
                  </div>
                  <div className="p-6 bg-[#0a0a0a] border border-[#d4af37]/10 rounded-2xl space-y-4">
                    <h4 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">Publishing Details</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Visibility</span>
                      <span className="text-xs font-bold text-green-400 uppercase">Public</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Author</span>
                      <span className="text-xs font-bold text-white uppercase">{current.author || 'Admin'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#d4af37]/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 py-4 text-gray-400 font-bold tracking-widest hover:text-white transition-all uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Discard Draft
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4 gold-gradient text-[#0a0a0a] rounded-xl font-bold tracking-widest hover:brightness-110 transition-all uppercase text-sm shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin"></div>
                      PUBLISHING...
                    </>
                  ) : (
                    'Publish Artikel'
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

export default ArticleManagement;
