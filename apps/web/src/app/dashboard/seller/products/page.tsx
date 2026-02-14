'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Plus, X, Upload, Loader2, Package } from 'lucide-react';
import api from '@/lib/api';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    category: string;
    images: string[];
    colors?: string[];
    sizes?: string[];
    status?: string; // Derived or stored
}

export default function ProductsPage() {
    const { store } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

    // Fetch Products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/products/seller');
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Products</h1>
                    <p className="text-slate-500 mt-1">Manage your store catalog and inventory</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-900/10 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Product
                    </button>
                </div>
            </div>

            {/* Product Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProductStatCard label="Total Products" value={products.length.toString()} />
                <ProductStatCard label="Live on Store" value={products.length.toString()} color="text-emerald-600" />
                <ProductStatCard label="Low Stock" value={products.filter(p => p.stock < 10).length.toString()} color="text-amber-600" />
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No products yet</h3>
                        <p className="text-slate-500">Add your first product to start selling.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-6 font-bold">Product</th>
                                <th className="pb-6 font-bold">Category</th>
                                <th className="pb-6 font-bold">Stock</th>
                                <th className="pb-6 font-bold">Price</th>
                                <th className="pb-6 font-bold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-bold text-slate-900">
                            {products.map((product) => (
                                <React.Fragment key={product.id}>
                                    <tr
                                        onClick={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                                        className={`border-t border-slate-50 group hover:bg-slate-50 transition-all cursor-pointer ${expandedProductId === product.id ? 'bg-slate-50' : ''}`}
                                    >
                                        <td className="py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-slate-200 group-hover:scale-105 transition-transform">
                                                    {product.images[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-slate-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900">{product.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">ID: {product.id.slice(-8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest leading-none">
                                                {product.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="py-5">
                                            <div className="flex flex-col">
                                                <span className={`${product.stock < 10 ? 'text-amber-500' : 'text-slate-900'}`}>{product.stock}</span>
                                                <span className="text-[9px] text-slate-400 uppercase font-black">Available</span>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 font-mono">₦{Number(product.price).toFixed(2)}</span>
                                                {product.discountPrice && product.discountPrice > 0 && (
                                                    <span className="text-[9px] text-primary font-black line-through opacity-50">
                                                        ₦{Number(product.discountPrice).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 text-right">
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                                {product.stock > 0 ? 'Active' : 'Stock Out'}
                                            </span>
                                        </td>
                                    </tr>
                                    {expandedProductId === product.id && (
                                        <tr>
                                            <td colSpan={5} className="pb-8 px-6">
                                                <ProductDetailView
                                                    product={product}
                                                    onClose={() => setExpandedProductId(null)}
                                                    onUpdate={fetchProducts}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <AddProductModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        fetchProducts();
                    }}
                    storeId={store?.id}
                />
            )}
        </div>
    );
}

function ProductStatCard({ label, value, color = 'text-slate-900' }: { label: string; value: string; color?: string }) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
            <span className={`text-3xl font-black ${color}`}>{value}</span>
        </div>
    );
}

function ProductDetailView({ product, onClose, onUpdate }: { product: Product; onClose: () => void; onUpdate: () => void }) {
    const [loading, setLoading] = useState(false);
    const [stock, setStock] = useState(product.stock);
    const [price, setPrice] = useState(product.price);
    const [discountPrice, setDiscountPrice] = useState(product.discountPrice || '');
    const [colors, setColors] = useState(product.colors?.join(', ') || '');
    const [sizes, setSizes] = useState(product.sizes?.join(', ') || '');
    const [existingImages, setExistingImages] = useState<string[]>(product.images);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);

    const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + existingImages.length + newFiles.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        setNewFiles(prev => [...prev, ...files]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleQuickUpdate = async () => {
        setLoading(true);
        const data = new FormData();
        data.append('stock', stock.toString());
        data.append('price', price.toString());
        if (discountPrice) data.append('discountPrice', discountPrice.toString());

        const colorsArray = colors.split(',').map(s => s.trim()).filter(Boolean);
        const sizesArray = sizes.split(',').map(s => s.trim()).filter(Boolean);
        data.append('colors', JSON.stringify(colorsArray));
        data.append('sizes', JSON.stringify(sizesArray));

        // Fix for image disappearance: send remaining existing images
        data.append('existingImages', JSON.stringify(existingImages));

        // Add new files
        newFiles.forEach(file => {
            data.append('images', file);
        });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`, {
                method: 'PATCH',
                body: data,
            });

            if (res.ok) {
                onUpdate();
                onClose();
                setNewFiles([]);
                setNewPreviews([]);
            } else {
                alert('Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Images Preview */}
                <div className="md:w-1/3">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Product Gallery</label>
                    <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((img, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm group relative">
                                <img src={img} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(i)}
                                    className="absolute top-1 right-1 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-rose-50"
                                >
                                    <X className="w-3 h-3 text-rose-500" />
                                </button>
                            </div>
                        ))}
                        {newPreviews.map((preview, i) => (
                            <div key={`new-${i}`} className="aspect-square rounded-xl overflow-hidden border border-primary/30 bg-emerald-50 shadow-sm relative group">
                                <img src={preview} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(i)}
                                    className="absolute top-1 right-1 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-rose-50"
                                >
                                    <X className="w-3 h-3 text-rose-500" />
                                </button>
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary/80 text-white text-[8px] font-black rounded uppercase">New</div>
                            </div>
                        ))}
                        {(existingImages.length + newFiles.length) < 5 && (
                            <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-white transition-all flex flex-col items-center justify-center cursor-pointer group relative">
                                <Upload className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                <span className="text-[8px] font-black text-slate-400 group-hover:text-primary mt-1 uppercase">Add</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleNewImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Form */}
                <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Inventory Stock</label>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setStock(Math.max(0, stock - 1))} className="w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center font-bold">-</button>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={e => setStock(Number(e.target.value))}
                                    className="w-full h-10 bg-white border border-slate-200 rounded-xl text-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <button onClick={() => setStock(stock + 1)} className="w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center font-bold">+</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Base Price (₦)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={e => setPrice(Number(e.target.value))}
                                className="w-full h-10 bg-white border border-slate-200 rounded-xl px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Sale Price (₦)</label>
                            <input
                                type="number"
                                value={discountPrice}
                                onChange={e => setDiscountPrice(e.target.value)}
                                className="w-full h-10 bg-emerald-50 border border-emerald-200 rounded-xl px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-primary"
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available Colors (Comma separated)</label>
                            <input
                                type="text"
                                value={colors}
                                onChange={e => setColors(e.target.value)}
                                className="w-full h-10 bg-white border border-slate-200 rounded-xl px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. Red, Blue, Green"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available Sizes (Comma separated)</label>
                            <input
                                type="text"
                                value={sizes}
                                onChange={e => setSizes(e.target.value)}
                                className="w-full h-10 bg-white border border-slate-200 rounded-xl px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. S, M, L, XL"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description Overview</span>
                            <p className="text-xs text-slate-600 line-clamp-2 max-w-md">{product.description}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleQuickUpdate}
                                disabled={loading}
                                className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                                Update Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddProductModal({ isOpen, onClose, onSuccess, storeId }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; storeId?: string }) {
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        category: '',
        colors: '',
        sizes: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + selectedFiles.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!storeId) return;

        setLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        if (formData.discountPrice) data.append('discountPrice', formData.discountPrice);
        data.append('stock', formData.stock);
        data.append('category', formData.category);
        data.append('storeId', storeId);

        const colorsArray = formData.colors.split(',').map(s => s.trim()).filter(Boolean);
        const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);

        data.append('colors', JSON.stringify(colorsArray));
        data.append('sizes', JSON.stringify(sizesArray));

        selectedFiles.forEach(file => {
            data.append('images', file);
        });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                onSuccess();
            } else {
                const errorText = await res.text();
                console.error('Failed to create product:', res.status, errorText);
                alert(`Error: ${res.status} - ${errorText}`);
            }
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200">
                <div className="px-10 py-8 flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Product</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Provide specific details to help your products appear in Google Search results</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all group">
                        <X className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto px-10 pb-10">
                        <div className="flex flex-col md:flex-row gap-12">
                            {/* Left Column: Images */}
                            <div className="md:w-1/3">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Product Gallery ({selectedFiles.length}/5)</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-[1.5rem] overflow-hidden border border-slate-100 group shadow-sm">
                                            <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-rose-50"
                                            >
                                                <X className="w-3 h-3 text-rose-500" />
                                            </button>
                                            {index === 0 && (
                                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">Primary</div>
                                            )}
                                        </div>
                                    ))}
                                    {selectedFiles.length < 5 && (
                                        <div className="relative aspect-square">
                                            <div className="w-full h-full rounded-[1.5rem] border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 flex flex-col items-center justify-center transition-all bg-slate-50 cursor-pointer group">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add Photo</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Middle Column: Core Info */}
                            <div className="flex-1 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
                                            placeholder="What are you selling?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Category <span className="text-emerald-500 ml-1 px-1.5 py-0.5 bg-emerald-50 rounded text-[8px]">SEO CRUCIAL</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
                                            placeholder="e.g. Summer Vintage Shirts"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Stock</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Description</label>
                                    <textarea
                                        rows={6}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none"
                                        placeholder="Detailed description for your customers..."
                                    />
                                </div>
                            </div>

                            {/* Right Column: Pricing */}
                            <div className="md:w-64 space-y-8">
                                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Base Price</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full pl-8 pr-5 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-900 focus:outline-none focus:border-primary transition-all shadow-sm"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-2">Offer Price</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">₦</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.discountPrice}
                                                onChange={e => setFormData({ ...formData, discountPrice: e.target.value })}
                                                className="w-full pl-8 pr-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-sm font-black text-primary focus:outline-none focus:border-primary transition-all placeholder:text-emerald-200"
                                                placeholder="Offer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Colors</label>
                                        <input
                                            type="text"
                                            value={formData.colors}
                                            onChange={e => setFormData({ ...formData, colors: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-primary transition-all shadow-sm"
                                            placeholder="Red, Blue..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Sizes</label>
                                        <input
                                            type="text"
                                            value={formData.sizes}
                                            onChange={e => setFormData({ ...formData, sizes: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-primary transition-all shadow-sm"
                                            placeholder="S, M, L..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-10 py-6 border-t border-slate-50 bg-white flex justify-end gap-4 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.name || !formData.price}
                            className="px-12 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-3"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Launch Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
