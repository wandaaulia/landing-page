
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { Product } from '../types';
import { supabase } from '../services/supabase';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Load products from Supabase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setImagePreview(product.image_path);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentProduct({});
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
    if (!currentProduct.name) {
      alert('Product name is required');
      return;
    }

    // Require image for new product
    if (!currentProduct.id && !imageFile) {
      alert('Please upload an image for the product');
      return;
    }

    setIsSaving(true);

    try {
      let imagePath = currentProduct.image_path || '';

      // Upload image if new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

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
        if (currentProduct.id && currentProduct.image_path) {
          try {
            const oldPath = currentProduct.image_path.split('/').slice(-2).join('/');
            await supabase.storage.from('images').remove([oldPath]);
          } catch (deleteError) {
            console.warn('Could not delete old image:', deleteError);
          }
        }
      }

      const slug = generateSlug(currentProduct.name || '');
      const productData = {
        name: currentProduct.name,
        slug: slug,
        description: currentProduct.description || '',
        category: currentProduct.category || 'Single-Split',
        image_path: imagePath,
        features: currentProduct.features || []
      };

      if (currentProduct.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', currentProduct.id);

        if (error) {
          alert('Error updating product: ' + error.message);
        } else {
          await loadProducts();
          setIsEditing(false);
          setImageFile(null);
          setImagePreview('');
        }
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) {
          alert('Error creating product: ' + error.message);
        } else {
          await loadProducts();
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

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      // Delete image from storage
      if (product.image_path) {
        const imagePath = product.image_path.split('/').slice(-2).join('/');
        await supabase.storage.from('images').remove([imagePath]);
      }

      // Delete product from database
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) {
        alert('Error deleting product: ' + error.message);
      } else {
        await loadProducts();
      }
    } catch (err) {
      alert('An unexpected error occurred');
      console.error(err);
    }
  };

  const filteredProducts = categoryFilter === 'All'
    ? products
    : products.filter(p => p.category === categoryFilter);

  // Get unique categories from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Count products per category
  const getCategoryCount = (category: string) => {
    if (category === 'All') return products.length;
    return products.filter(p => p.category === category).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-luxury font-bold">Katalog Produk</h1>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 gold-gradient px-6 py-3 rounded-xl text-[#0a0a0a] font-bold text-sm hover:brightness-110 shadow-lg"
        >
          <Plus size={18} />
          Tambah Produk
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
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#d4af37]/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-lg font-bold">No products found</p>
              <p className="text-sm mt-2">{categoryFilter === 'All' ? 'Click "ADD NEW PRODUCT" to create your first product' : `No products in "${categoryFilter}" category`}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#d4af37]/10">
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Image</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date Created</th>
                  <th className="text-right p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#d4af37]/10">
                        <img src={product.image_path} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-white group-hover:text-[#d4af37] transition-colors">{product.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-[#d4af37] border border-[#d4af37]/30 px-2 py-1 rounded uppercase tracking-widest">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-[#0a0a0a] border border-[#d4af37]/20 rounded-lg text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
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
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0a0a]/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-[#d4af37]/20 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl my-auto">
            <div className="p-6 border-b border-[#d4af37]/10 flex items-center justify-between gold-gradient">
              <h3 className="text-[#0a0a0a] font-bold uppercase tracking-widest">{currentProduct.id ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setIsEditing(false)} className="text-[#0a0a0a] hover:bg-[#0a0a0a]/10 rounded-full p-1 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name</label>
                  <input
                    type="text"
                    value={currentProduct.name || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                  <select
                    value={currentProduct.category || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial Cooling">Industrial Cooling</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Description</label>
                <textarea
                  rows={5}
                  value={currentProduct.description || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#d4af37] resize-none"
                  placeholder="Enter product description..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Features (comma separated)</label>
                <input
                  type="text"
                  value={currentProduct.features?.join(', ') || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, features: e.target.value.split(',').map(f => f.trim()).filter(Boolean) })}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                  placeholder="e.g., VRT Technology, BACnet Integration, Auto-Refill"
                />
                <p className="text-[10px] text-gray-500 mt-1">Separate features with commas</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Image</label>
                <input
                  type="file"
                  id="product-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="product-image" className="mt-2 border-2 border-dashed border-[#d4af37]/20 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-[#d4af37]/5 transition-colors cursor-pointer group block">
                  {imagePreview ? (
                    <div className="w-full aspect-video rounded-xl overflow-hidden mb-3">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform mb-3">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <p className="text-sm font-bold">{imagePreview ? 'Click to change image' : 'Drop files here or click to upload'}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Recommended size: 1200 x 900 px</p>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-transparent border border-[#d4af37]/30 rounded-xl text-[#d4af37] font-bold tracking-widest hover:bg-[#d4af37]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4 gold-gradient rounded-xl text-[#0a0a0a] font-bold tracking-widest hover:brightness-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin"></div>
                      SAVING...
                    </>
                  ) : (
                    'PUBLISH CHANGES'
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

export default ProductManagement;
