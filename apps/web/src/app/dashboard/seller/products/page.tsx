'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Plus, X, Upload, Loader2, Package, Sparkles, Wand2, ArrowRight, Download, ChevronDown, Search, Filter } from 'lucide-react';
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
    tags?: string[];
    status?: string; // Derived or stored
    storeId: string;
}

export default function ProductsPage() {
    const { store } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Parse store categories from settings
    const storeCategories: string[] = React.useMemo(() => {
        try {
            const raw = (store as any)?.categories;
            if (!raw) return [];
            return Array.isArray(raw) ? raw : JSON.parse(raw);
        } catch { return []; }
    }, [store]);

    const handleExportCSV = () => {
        if (products.length === 0) return;

        const headers = ['Product ID', 'Name', 'Price', 'Stock', 'Category', 'Status'];
        const rows = products.map(p => [
            p.id,
            p.name,
            p.price,
            p.stock,
            p.category,
            p.status || 'Active'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

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

    const filteredProducts = products.filter(p => {
        const query = (searchQuery || '').toLowerCase();
        return p.name.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query);
    });

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="hidden lg:flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex flex-col md:flex-row md:items-center gap-8 flex-1">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Products</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Master Catalog
                            </p>
                        </div>
                    </div>
                    {/* Desktop Global Search */}
                    <div className="max-w-md w-full relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find products by name or category..."
                            value={searchQuery || ''}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-500/5 transition-all text-slate-900"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex-1 sm:flex-none h-11 px-6 rounded-2xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export CSV</span>
                        <span className="sm:hidden">CSV</span>
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-[2] sm:flex-none h-11 px-8 rounded-2xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Product</span>
                    </button>
                </div>
            </div>

            {/* Mobile Actions Header - Clean, non-overlapping section */}
            <div className="lg:hidden flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">MASTER CATALOG</p>
                        <p className="text-slate-900 mt-1 font-black text-xl tracking-tight">Managing <span className="text-emerald-600 font-black">{products.length} live items</span></p>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="w-10 h-10 bg-white border border-slate-100 text-slate-600 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full h-14 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Record New Item
                </button>
            </div>

            {/* Product Stats Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-6">
                <ProductStatCard label="Total" value={products.length.toString()} />
                <ProductStatCard label="Active" value={products.length.toString()} color="text-emerald-600" />
                <ProductStatCard label="Critical" value={products.filter(p => p.stock < 10).length.toString()} color="text-rose-600" />
            </div>

            {/* List Section */}
            <div className="bg-white lg:rounded-[2.5rem] lg:p-10 lg:shadow-sm lg:border lg:border-slate-100 -mx-4 sm:mx-0 rounded-[1.5rem] overflow-hidden mt-2">
                <div className="px-6 py-6 border-b border-slate-50 lg:hidden bg-slate-50/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tighter">Catalog Overview</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{products.length} Items Live</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                <Filter className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    {/* Mobile Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search catalog..."
                            value={searchQuery || ''}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 bg-white border border-slate-100 rounded-xl pl-9 pr-4 text-base lg:text-[10px] font-bold uppercase tracking-widest text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Master Catalog is Empty</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Add your first product to start generating sales.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <table className="w-full hidden lg:table">
                            <thead>
                                <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-6 font-bold">Product Asset</th>
                                    <th className="pb-6 font-bold">Category</th>
                                    <th className="pb-6 font-bold">Inventory</th>
                                    <th className="pb-6 font-bold">Settlement Price</th>
                                    <th className="pb-6 font-bold text-right">Visibility</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold text-slate-900">
                                {filteredProducts.map((product) => (
                                    <React.Fragment key={product.id}>
                                        <tr
                                            onClick={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                                            className={`border-t border-slate-50 group hover:bg-slate-50 transition-all cursor-pointer ${expandedProductId === product.id ? 'bg-slate-50/50' : ''}`}
                                        >
                                            <td className="py-6">
                                                <div className="flex items-center space-x-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-slate-200 group-hover:scale-105 transition-transform duration-500">
                                                        {product.images[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-slate-50/50 flex items-center justify-center text-2xl">📦</div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-900 font-black uppercase tracking-tight text-sm">{product.name}</span>
                                                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 italic">#{product.id.slice(-8).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                                    {product.category || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-black ${product.stock < 10 ? 'text-rose-500' : 'text-slate-950'}`}>{product.stock}</span>
                                                    <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Available</span>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-950">₦{Number(product.price).toLocaleString()}</span>
                                                    {product.discountPrice && product.discountPrice > 0 && (
                                                        <span className="text-[9px] text-rose-500 font-black line-through opacity-60">
                                                            ₦{Number(product.discountPrice).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-6 text-right">
                                                <span className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-rose-50 text-rose-500 border-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]'}`}>
                                                    {product.stock > 0 ? 'Online' : 'Sold Out'}
                                                </span>
                                            </td>
                                        </tr>
                                        {expandedProductId === product.id && (
                                            <tr>
                                                <td colSpan={5} className="p-0">
                                                    <div className="bg-slate-50 px-8 py-10 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                                        <ProductDetailView
                                                            product={product}
                                                            onClose={() => setExpandedProductId(null)}
                                                            onUpdate={fetchProducts}
                                                            storeCategories={storeCategories}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile List View */}
                        <div className="lg:hidden divide-y divide-slate-50">
                            {filteredProducts.map((product) => (
                                <ProductListItem
                                    key={product.id}
                                    product={product}
                                    isExpanded={expandedProductId === product.id}
                                    onToggle={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                                    onUpdate={fetchProducts}
                                    storeCategories={storeCategories}
                                />
                            ))}
                        </div>
                    </>
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
                    storeCategories={storeCategories}
                />
            )}
        </div>
    );
}

function ProductStatCard({ label, value, color = 'text-slate-900', className = '' }: { label: string; value: string; color?: string; className?: string }) {
    return (
        <div className={`bg-white rounded-[1.5rem] md:rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center ${className}`}>
            <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
            <span className={`text-2xl md:text-3xl font-black tracking-tighter ${color}`}>{value}</span>
        </div>
    );
}

function ProductListItem({ product, isExpanded, onToggle, onUpdate, storeCategories }: any) {
    return (
        <div className="bg-white">
            <div
                onClick={onToggle}
                className="p-5 flex items-center gap-4 cursor-pointer active:bg-slate-50 transition-colors"
            >
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm shrink-0">
                    {product.images[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-xl">📦</div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{product.name}</p>
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest rounded-md">
                            {product.category || 'NO CATEGORY'}
                        </span>
                        <div className="w-px h-2 bg-slate-200" />
                        <span className={`text-[8px] font-black uppercase tracking-widest ${product.stock < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                            {product.stock} Units
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm font-black text-slate-900 tracking-tighter leading-none">₦{Number(product.price).toLocaleString()}</p>
                        {product.discountPrice && (
                            <p className="text-[9px] text-rose-500 font-black line-through opacity-50">₦{Number(product.discountPrice).toLocaleString()}</p>
                        )}
                    </div>
                </div>
                <div className={`w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center transition-all ${isExpanded ? 'rotate-180 bg-slate-900 text-white' : 'text-slate-300'}`}>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
            {isExpanded && (
                <div className="p-4 bg-slate-50/50 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                    <ProductDetailView
                        product={product}
                        onClose={onToggle}
                        onUpdate={onUpdate}
                        storeCategories={storeCategories}
                    />
                </div>
            )}
        </div>
    );
}

// ── Category Selector ────────────────────────────────────────────────
function CategorySelector({
    value, onChange, storeCategories = []
}: { value: string; onChange: (val: string) => void; storeCategories?: string[] }) {
    return (
        <div className="space-y-2">
            {storeCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {storeCategories.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => onChange(value === cat ? '' : cat)}
                            className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${value === cat
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-900 hover:text-slate-900'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all placeholder:text-slate-300"
                placeholder={storeCategories.length > 0 ? 'Or type a custom category...' : 'e.g. Fashion, Electronics'}
            />
        </div>
    );
}

function ProductDetailView({ product, onClose, onUpdate, storeCategories = [] }: { product: Product; onClose: () => void; onUpdate: () => void; storeCategories?: string[] }) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(product.name);
    const [stock, setStock] = useState(product.stock);
    const [price, setPrice] = useState(product.price);
    const [discountPrice, setDiscountPrice] = useState(product.discountPrice || '');
    const [colors, setColors] = useState(product.colors?.join(', ') || '');
    const [sizes, setSizes] = useState(product.sizes?.join(', ') || '');
    const [category, setCategory] = useState(product.category || '');
    const [tags, setTags] = useState(product.tags?.join(', ') || '');
    const [description, setDescription] = useState(product.description || '');
    const [existingImages, setExistingImages] = useState<string[]>(product.images);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<any>(null);

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

    const handleAiAnalyze = async () => {
        try {
            setAiLoading(true);
            const res = await api.post('/products/analyze', {
                name,
                category,
                description,
                imageUrls: [...existingImages, ...newPreviews],
                storeId: product.storeId
            });
            setAiSuggestion(res.data);
        } catch (error) {
            console.error('AI Analysis failed', error);
            alert('AI Analysis failed. Please try again.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleQuickUpdate = async () => {
        setLoading(true);
        const data = new FormData();
        data.append('name', name);
        data.append('stock', stock.toString());
        data.append('price', price.toString());
        if (discountPrice) data.append('discountPrice', discountPrice.toString());
        data.append('category', category);
        data.append('description', description);

        const colorsArray = colors.split(',').map(s => s.trim()).filter(Boolean);
        const sizesArray = sizes.split(',').map(s => s.trim()).filter(Boolean);
        const tagsArray = tags.split(',').map(s => s.trim()).filter(Boolean);
        data.append('colors', JSON.stringify(colorsArray));
        data.append('sizes', JSON.stringify(sizesArray));
        data.append('tags', JSON.stringify(tagsArray));

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
        <div className="bg-slate-50 rounded-3xl p-5 lg:p-10 border border-slate-200 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300 relative z-[600]">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-12">
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
                                <button type="button" onClick={() => setStock(Math.max(0, stock - 1))} className="w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center font-bold">-</button>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={e => setStock(Number(e.target.value))}
                                    className="w-full h-10 bg-white border border-slate-200 rounded-xl text-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <button type="button" onClick={() => setStock(stock + 1)} className="w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center font-bold">+</button>
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

                    <div className="pt-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Product Title</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 font-black text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                            placeholder="e.g. Vintage Silk Shirt"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                            <CategorySelector
                                value={category}
                                onChange={setCategory}
                                storeCategories={storeCategories}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Keywords (Tags)</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={e => setTags(e.target.value)}
                                className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="SEO keywords..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available Colors</label>
                            <input
                                type="text"
                                value={colors}
                                onChange={e => setColors(e.target.value)}
                                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Red, Blue..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available Sizes</label>
                            <input
                                type="text"
                                value={sizes}
                                onChange={e => setSizes(e.target.value)}
                                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="S, M, L..."
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description Overview</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            placeholder="Detailed description..."
                        />
                    </div>

                    {/* AI Suggestions Box */}
                    {aiSuggestion && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-emerald-600" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">BigT AI Suggestions</span>
                                </div>
                                <button type="button" onClick={() => setAiSuggestion(null)} className="text-emerald-400 hover:text-emerald-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Suggested Category</p>
                                        <button type="button" onClick={() => setCategory(aiSuggestion.suggestedCategory)} className="text-[8px] font-black text-emerald-600 underline">Apply</button>
                                    </div>
                                    <div className="p-3 bg-white/60 rounded-xl border border-emerald-100 text-xs font-bold text-slate-700 uppercase tracking-tight">
                                        {aiSuggestion.suggestedCategory}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Suggested Tags</p>
                                        <button type="button" onClick={() => setTags(aiSuggestion.tags?.join(', '))} className="text-[8px] font-black text-emerald-600 underline">Apply All</button>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {aiSuggestion.tags?.map((t: string) => (
                                            <span key={t} className="px-2 py-1 bg-white border border-emerald-100 text-emerald-600 text-[9px] font-bold rounded-lg">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Suggested SEO Description</p>
                                    <button
                                        type="button"
                                        onClick={() => setDescription(aiSuggestion.suggestedDescription)}
                                        className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-800"
                                    >
                                        Apply to Description <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="p-4 bg-white/60 rounded-xl border border-emerald-100 text-xs text-slate-600 leading-relaxed font-medium max-h-32 overflow-y-auto">
                                    {aiSuggestion.suggestedDescription}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 lg:gap-0 pt-6 border-t border-slate-100 mt-6">
                        <button
                            type="button"
                            onClick={handleAiAnalyze}
                            disabled={aiLoading || loading}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all group"
                        >
                            {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 group-hover:scale-110 transition-transform" />}
                            {aiLoading ? 'Generating...' : 'Generate Content'}
                        </button>
                        <div className="flex items-center gap-8 w-full sm:w-auto justify-center sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleQuickUpdate}
                                disabled={loading || aiLoading}
                                className="px-10 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-2 active:scale-95"
                            >
                                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddProductModal({ isOpen, onClose, onSuccess, storeId, storeCategories = [] }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; storeId?: string; storeCategories?: string[] }) {
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<any>(null);
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
        tags: '',
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

    const handleAiAnalyze = async () => {
        if (!formData.name) {
            alert('Please provide a Product Title first so BigT can understand what you are selling.');
            return;
        }
        try {
            setAiLoading(true);
            const res = await api.post('/products/analyze', {
                name: formData.name,
                category: formData.category,
                description: formData.description,
                imageUrls: imagePreviews,
                storeId
            });
            // Auto-fill logic
            if (res.data) {
                setFormData(prev => ({
                    ...prev,
                    category: res.data.suggestedCategory || prev.category,
                    description: res.data.suggestedDescription || prev.description,
                    tags: res.data.tags ? res.data.tags.join(', ') : prev.tags
                }));
            }
        } catch (error) {
            console.error('AI Analysis failed', error);
            alert('BigT analysis failed. Please try again.');
        } finally {
            setAiLoading(false);
        }
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
        const tagsArray = formData.tags.split(',').map(s => s.trim()).filter(Boolean);

        data.append('colors', JSON.stringify(colorsArray));
        data.append('sizes', JSON.stringify(sizesArray));
        data.append('tags', JSON.stringify(tagsArray));

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
                // Reset form
                setFormData({ name: '', description: '', price: '', discountPrice: '', stock: '', category: '', colors: '', sizes: '', tags: '' });
                setImagePreviews([]);
                setSelectedFiles([]);
                setAiSuggestion(null);
            } else {
                const errorText = await res.text();
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200">
                <div className="px-6 py-5 flex justify-between items-center bg-white border-b border-slate-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <Plus className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">Add New Product</h2>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-tight hidden sm:block">Fulfill specific details for Google SEO results</p>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-tight sm:hidden">SEO optimized product listing</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all group">
                        <X className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8">
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
                            {/* Left Column: Images & Pricing */}
                            <div className="lg:w-72 space-y-8 shrink-0">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Gallery ({selectedFiles.length}/5)</label>
                                    <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-2 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50">
                                                <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-rose-50"
                                                >
                                                    <X className="w-3 h-3 text-rose-500" />
                                                </button>
                                            </div>
                                        ))}
                                        {selectedFiles.length < 5 && (
                                            <div className="relative aspect-square">
                                                <div className="w-full h-full rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 flex flex-col items-center justify-center transition-all bg-slate-50 cursor-pointer group">
                                                    <Upload className="w-5 h-5 text-slate-300 group-hover:text-primary transition-all mb-1" />
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Price (₦)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                                            <input
                                                type="number"
                                                required
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full pl-8 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-base lg:text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300 shadow-inner"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sale Price (₦)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">₦</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.discountPrice}
                                                onChange={e => setFormData({ ...formData, discountPrice: e.target.value })}
                                                className="w-full pl-8 pr-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-base lg:text-sm font-black text-emerald-600 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-200 shadow-inner"
                                                placeholder="Offer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center Column: Core Info & AI */}
                            <div className="flex-1 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base lg:text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300 shadow-inner"
                                            placeholder="What are you selling?"
                                        />
                                    </div>

                                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                                                Category {storeCategories.length > 0 && <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md text-[8px]">FROM YOUR STORE</span>}
                                            </label>
                                            <CategorySelector
                                                value={formData.category}
                                                onChange={val => setFormData({ ...formData, category: val })}
                                                storeCategories={storeCategories}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inventory Stock</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.stock}
                                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base lg:text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2 space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                                                SEO Discovery Keywords (Tags) <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md text-[8px]">SEARCH OPTIMIZED</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.tags}
                                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base lg:text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                                                placeholder="e.g. Authentic Coral Beads, Edo Bride Attire..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Colors</label>
                                                <input
                                                    type="text"
                                                    value={formData.colors}
                                                    onChange={e => setFormData({ ...formData, colors: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-base lg:text-xs font-bold text-slate-500 shadow-sm"
                                                    placeholder="Red, Blue..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sizes</label>
                                                <input
                                                    type="text"
                                                    value={formData.sizes}
                                                    onChange={e => setFormData({ ...formData, sizes: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-base lg:text-xs font-bold text-slate-500 shadow-sm"
                                                    placeholder="S, M, L..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Description</label>
                                        <button
                                            type="button"
                                            onClick={handleAiAnalyze}
                                            disabled={aiLoading}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20"
                                        >
                                            {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                            {aiLoading ? 'Generating...' : 'Generate Content'}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            rows={5}
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-base lg:text-sm font-medium text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none shadow-inner"
                                            placeholder="Tell your customers about the magic of this product..."
                                        />
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-5 lg:px-10 lg:py-8 border-t border-slate-50 bg-white flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-8 py-3.5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                        >
                            Cancel Listing
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.name || !formData.price || aiLoading}
                            className="w-full sm:w-auto px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                            {loading ? 'Launching...' : 'Launch'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
