'use client';

import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import {
    Loader2, Package, AlertTriangle, CheckCircle2, Search,
    History, TrendingUp, Plus, Minus, ArrowRight, Settings2,
    Calendar, ChevronDown, ChevronUp, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

interface Product {
    id: string;
    name: string;
    stock: number;
    category: string;
    price: number;
    images: string[];
}

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [localStock, setLocalStock] = useState<number | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true);
                const res = await api.get('/products/seller');
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch inventory:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const fetchHistory = async (productId: string) => {
        try {
            setIsHistoryLoading(true);
            const res = await api.get(`/inventory/history/${productId}`);
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    const handleExpand = (product: Product) => {
        if (expandedId === product.id) {
            setExpandedId(null);
            setLocalStock(null);
            setHistory([]);
        } else {
            setExpandedId(product.id);
            setLocalStock(product.stock);
            setHistory([]); // Clear previous
            fetchHistory(product.id);
        }
    };

    const handleConfirmCount = async (productId: string) => {
        if (localStock === null) return;
        try {
            setIsUpdating(true);
            const res = await api.patch(`/products/${productId}`, { stock: localStock });
            const updatedProduct = res.data;

            // Update local state with the actual backend response
            setProducts(prev => prev.map(p =>
                p.id === productId ? updatedProduct : p
            ));

            setExpandedId(null);
            setLocalStock(null);
        } catch (err) {
            console.error('Failed to update stock:', err);
            alert('Failed to update stock. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const getStockColor = (stock: number) => {
        if (stock === 0) return 'text-rose-600 bg-rose-50';
        if (stock < 5) return 'text-rose-500 bg-rose-50'; // Red for < 5
        if (stock < 10) return 'text-amber-500 bg-amber-50'; // Orange for 5-9
        return 'text-emerald-600 bg-emerald-50'; // Green for 10+
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return 'Out of Stock';
        if (stock < 5) return 'Critical';
        if (stock < 10) return 'Low Stock';
        return 'Healthy';
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const stats = useMemo(() => {
        const totalValue = products.reduce((acc, p) => acc + (Number(p.price) * p.stock), 0);
        const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const critical = products.filter(p => p.stock > 0 && p.stock < 5).length;
        return { totalValue, lowStock, outOfStock, totalSKUs: products.length, critical };
    }, [products]);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Terminal</h1>
                    <p className="text-slate-500 mt-1 font-medium">Precision tracking for your {stats.totalSKUs} active SKUs</p>
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search SKU or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-900/10 shrink-0">
                        Update Stock
                    </button>
                </div>
            </div>

            {/* Expert Stats Bar */}
            <div className="bg-[#1A4331] rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Storefront Liquidity</span>
                    </div>
                    <h2 className="text-4xl font-black">{formatPrice(stats.totalValue)}</h2>
                    <p className="opacity-60 text-xs font-bold">Total asset value currently on shelves</p>
                </div>
                <div className="grid grid-cols-3 gap-8 border-l border-white/10 pl-8">
                    <InvStat label="Total SKU" value={stats.totalSKUs.toString()} color="text-white" />
                    <InvStat label="Critical" value={stats.critical.toString()} color="text-rose-400" />
                    <InvStat label="Low Stock" value={stats.lowStock.toString()} color="text-amber-400" />
                </div>
            </div>

            {/* Inventory List */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 min-h-[400px]">
                <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest px-4">
                            <th className="pb-4 pl-6 font-black">Item Details</th>
                            <th className="pb-4 font-black">Category</th>
                            <th className="pb-4 font-black">Unit Price</th>
                            <th className="pb-4 font-black">Holdings</th>
                            <th className="pb-4 font-black">Asset Value</th>
                            <th className="pb-4 pr-6 text-right font-black">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr
                                    onClick={() => handleExpand(item)}
                                    className={`group cursor-pointer transition-all duration-200 ${expandedId === item.id ? 'bg-slate-50 ring-1 ring-slate-200 shadow-inner rounded-2xl' : 'bg-white hover:bg-slate-50/80'}`}
                                >
                                    <td className="py-4 pl-6 rounded-l-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 shrink-0">
                                                {item.images?.[0] ? (
                                                    <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-slate-300" /></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900">{item.name}</p>
                                                <p className="text-[10px] font-mono text-slate-400 uppercase">#{item.id.slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded-lg">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="py-4 text-xs font-bold text-slate-600">{formatPrice(item.price)}</td>
                                    <td className="py-4 text-sm font-black">
                                        <span className={item.stock < 5 ? 'text-rose-500' : item.stock < 10 ? 'text-amber-500' : 'text-slate-900'}>
                                            {item.stock}
                                        </span>
                                        <span className="text-[10px] text-slate-400 ml-1 font-bold">units</span>
                                    </td>
                                    <td className="py-4 text-xs font-black text-primary">
                                        {formatPrice(Number(item.price) * item.stock)}
                                    </td>
                                    <td className="py-4 pr-6 text-right rounded-r-2xl">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${getStockColor(item.stock)}`}>
                                                {getStockStatus(item.stock)}
                                            </span>
                                            {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </div>
                                    </td>
                                </tr>

                                {/* Professional Expansion Area */}
                                <AnimatePresence mode="wait">
                                    {expandedId === item.id && (
                                        <tr>
                                            <td colSpan={6} className="p-0">
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden mb-4"
                                                >
                                                    <div className="mx-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-8">
                                                        {/* Activity History (Expert Mock) */}
                                                        <div className="flex-1 space-y-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <History className="w-4 h-4 text-slate-400" />
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Movement (7d)</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {isHistoryLoading ? (
                                                                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-dashed border-slate-200">
                                                                        <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />
                                                                        <span className="text-[11px] font-bold text-slate-400">Loading audit trail...</span>
                                                                    </div>
                                                                ) : history.length === 0 ? (
                                                                    <div className="text-[11px] font-bold text-slate-400 p-4 border border-dashed border-slate-200 rounded-xl text-center">
                                                                        No recent movements recorded
                                                                    </div>
                                                                ) : (
                                                                    history.map((log, i) => {
                                                                        const isOrder = log.type === 'STOCK_REDUCED_BY_ORDER';
                                                                        const adjustment = isOrder ? `-${log.payload.quantityReduced}` : (log.payload.adjustment > 0 ? `+${log.payload.adjustment}` : log.payload.adjustment);
                                                                        const actionName = isOrder ? `Order Fulfilled #${log.payload.orderId.slice(-4)}` : 'Manual Adjustment';

                                                                        return (
                                                                            <div key={log.id} className="flex items-center justify-between text-[11px] font-bold p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className={`w-1.5 h-1.5 rounded-full ${isOrder ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                                                                                    <span className="text-slate-900">{actionName}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-4">
                                                                                    <span className={adjustment.toString().startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>{adjustment}</span>
                                                                                    <span className="text-slate-400 font-medium">{format(new Date(log.date), 'MMM d, h:mm a')}</span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Quick Control Center */}
                                                        <div className="w-full md:w-72 space-y-6">
                                                            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                                    <Settings2 className="w-3.5 h-3.5" /> Rapid Adjust
                                                                </h4>
                                                                <div className="flex items-center justify-between">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); setLocalStock(prev => Math.max(0, (prev || 0) - 1)); }}
                                                                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
                                                                    >
                                                                        <Minus className="w-4 h-4 text-slate-600" />
                                                                    </button>
                                                                    <div className="text-center">
                                                                        <p className="text-2xl font-black text-slate-900">{localStock ?? item.stock}</p>
                                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Adjust</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); setLocalStock(prev => (prev || 0) + 1); }}
                                                                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
                                                                    >
                                                                        <Plus className="w-4 h-4 text-slate-600" />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    disabled={isUpdating || localStock === item.stock}
                                                                    onClick={(e) => { e.stopPropagation(); handleConfirmCount(item.id); }}
                                                                    className="w-full h-12 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                                >
                                                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Count'}
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center justify-between px-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                                    <span className="text-[10px] font-bold text-slate-400">Restock Alert: <span className="text-slate-900">10 units</span></span>
                                                                </div>
                                                                <button className="text-[10px] font-black text-primary uppercase hover:underline">Edit Hub</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                        <Package className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold">No results found for "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function InvStat({ label, value, color = "text-white" }: { label: string; value: string; color?: string }) {
    return (
        <div className="text-center md:text-left">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
        </div>
    );
}
