'use client';

import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import {
    Loader2, Package, AlertTriangle, CheckCircle2, Search,
    History, TrendingUp, Plus, Minus, ArrowRight, Settings2,
    Calendar, ChevronDown, ChevronUp, DollarSign, BrainCircuit, Sparkles, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/useAuthStore';

interface Product {
    id: string;
    name: string;
    stock: number;
    category: string;
    price: number;
    images: string[];
}

export default function InventoryPage() {
    const { store } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [localStock, setLocalStock] = useState<number | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [productInsights, setProductInsights] = useState<Record<string, any>>({});
    const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await api.get('products/seller');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch inventory:', err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchInventory();
    }, [store?.id]);

    const fetchHistory = async (productId: string) => {
        try {
            setIsHistoryLoading(true);
            const res = await api.get(`inventory/history/${productId}`);
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
            setHistory([]);
            fetchHistory(product.id);
        }
    };

    const handleConfirmCount = async (productId: string) => {
        if (localStock === null) return;
        try {
            setIsUpdating(true);
            const res = await api.patch(`products/${productId}`, { stock: localStock });
            const updatedProduct = res.data;

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
        if (stock < 5) return 'text-rose-500 bg-rose-50';
        if (stock < 10) return 'text-amber-500 bg-amber-50';
        return 'text-emerald-600 bg-emerald-50';
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

    const handleAnalyzeProduct = async (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        if (analyzingIds.has(productId)) return;

        try {
            setAnalyzingIds(prev => new Set(prev).add(productId));
            const res = await api.get(`analytics/ai-inventory-insight/${productId}`);
            if (res.data) {
                setProductInsights(prev => ({ ...prev, [productId]: res.data }));
                if (expandedId !== productId) {
                    // Automatically expand to show results
                    setExpandedId(productId);
                    setLocalStock(products.find(p => p.id === productId)?.stock ?? null);
                    fetchHistory(productId);
                }
            }
        } catch (err) {
            console.error('Failed to analyze product:', err);
        } finally {
            setAnalyzingIds(prev => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        }
    };

    const inventoryAnalysis = useMemo(() => {
        if (!products.length) return "Scanning your SKUs for high-value opportunities...";

        if (stats.critical > 0) {
            return `I've flagged ${stats.critical} items as CRITICAL. They are nearly gone—restock these immediately to protect your shelf value.`;
        }

        if (stats.lowStock > 0) {
            return `You have ${stats.lowStock} items running low. A quick restock now will keep your sales momentum steady across your active categories.`;
        }

        if (stats.outOfStock > 0) {
            return `You have ${stats.outOfStock} items out of stock. You're losing potential revenue every hour they remain invisible to buyers.`;
        }

        const topProduct = [...products].sort((a, b) => (Number(b.price) * b.stock) - (Number(a.price) * a.stock))[0];
        if (topProduct) {
            return `Inventory is healthy. ${topProduct.name} is your lead asset, holding ${formatPrice(Number(topProduct.price) * topProduct.stock)} in current liquidity.`;
        }

        return "Your inventory is currently optimized. I'll alert you if any SKU movements require your attention.";
    }, [products, stats]);

    const getProductInsight = (productId: string) => {
        return productInsights[productId];
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
                <div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">INVENTORY TERMINAL</p>
                    <p className="text-slate-900 mt-1.5 font-black text-xl lg:text-2xl tracking-tight leading-none">
                        Precision tracking for <span className="text-emerald-600">{stats.totalSKUs} active SKUs</span>
                    </p>
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
                </div>
            </div>

            {/* Top AI Advisor Insight */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-slate-950 rounded-[2rem] p-6 text-white relative overflow-hidden border border-white/5 shadow-2xl group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-[11px] font-bold leading-relaxed text-slate-300 italic group-hover:text-white transition-colors">
                            "{inventoryAnalysis}"
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/dashboard/seller/analytics'}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-primary/20 flex items-center gap-2"
                    >
                        Detailed Analytics <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </motion.div>

            {/* Liquidity Stats */}
            <div className="bg-[#113225] rounded-[2rem] p-6 lg:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-12 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="space-y-1 relative z-10 w-full md:w-auto text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 mb-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Storefront Liquidity</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight">{formatPrice(stats.totalValue)}</h2>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Asset value on shelves</p>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-4 lg:gap-10 md:border-l md:border-white/10 md:pl-10 relative z-10 w-full">
                    <InvStat label="Total SKU" value={stats.totalSKUs.toString()} color="text-white" />
                    <InvStat label="Critical" value={stats.critical.toString()} color="text-rose-400" />
                    <InvStat label="Low Stock" value={stats.lowStock.toString()} color="text-amber-400" />
                </div>
            </div>

            {/* Inventory List */}
            <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden lg:block bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 min-h-[400px]">
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest px-4">
                                <th className="pb-4 pl-6 font-black">Item Details</th>
                                <th className="pb-4 font-black">Category Holding</th>
                                <th className="pb-4 font-black">Stock Units</th>
                                <th className="pb-4 font-black">Asset Value</th>
                                <th className="pb-4 pr-6 text-right font-black">AI Advisor Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((item) => (
                                <InventoryRow
                                    key={item.id}
                                    item={item}
                                    expandedId={expandedId}
                                    handleExpand={handleExpand}
                                    isAnalyzing={analyzingIds.has(item.id)}
                                    productInsight={getProductInsight(item.id)}
                                    handleAnalyzeProduct={handleAnalyzeProduct}
                                    isHistoryLoading={isHistoryLoading}
                                    history={history}
                                    localStock={localStock}
                                    setLocalStock={setLocalStock}
                                    isUpdating={isUpdating}
                                    handleConfirmCount={handleConfirmCount}
                                    getStockColor={getStockColor}
                                    getStockStatus={getStockStatus}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                    {filteredProducts.map((item) => (
                        <InventoryMobileCard
                            key={item.id}
                            item={item}
                            expandedId={expandedId}
                            handleExpand={handleExpand}
                            isAnalyzing={analyzingIds.has(item.id)}
                            productInsight={getProductInsight(item.id)}
                            handleAnalyzeProduct={handleAnalyzeProduct}
                            isHistoryLoading={isHistoryLoading}
                            history={history}
                            localStock={localStock}
                            setLocalStock={setLocalStock}
                            isUpdating={isUpdating}
                            handleConfirmCount={handleConfirmCount}
                            getStockColor={getStockColor}
                            getStockStatus={getStockStatus}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="bg-white rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center py-20 text-slate-400">
                        <Package className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold uppercase tracking-widest text-[10px]">Zero matches found in terminal</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function InventoryRow({
    item, expandedId, handleExpand, isAnalyzing, productInsight, handleAnalyzeProduct,
    isHistoryLoading, history, localStock, setLocalStock, isUpdating, handleConfirmCount,
    getStockColor, getStockStatus
}: any) {
    return (
        <React.Fragment>
            <tr
                onClick={() => handleExpand(item)}
                className={`group cursor-pointer transition-all duration-200 ${expandedId === item.id ? 'bg-slate-50 ring-1 ring-slate-200 shadow-inner rounded-2xl' : 'bg-white hover:bg-slate-50/80'}`}
            >
                <td className="py-4 pl-6 rounded-l-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 shrink-0">
                            {item.images?.[0] ? (
                                <img src={item.images[0]} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
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
                <td className="py-4 text-sm font-black">
                    <span className={item.stock < 5 ? 'text-rose-500' : item.stock < 10 ? 'text-amber-500' : 'text-slate-900'}>
                        {item.stock}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1 font-bold">units</span>
                </td>
                <td className="py-4 text-xs font-black text-emerald-600">
                    {formatPrice(Number(item.price) * item.stock)}
                </td>
                <td className="py-4 pr-6 text-right rounded-r-2xl">
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={(e) => handleAnalyzeProduct(e, item.id)}
                            disabled={isAnalyzing}
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${productInsight ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-900 text-white hover:bg-slate-800'
                                }`}
                        >
                            {isAnalyzing ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : productInsight ? (
                                <BrainCircuit className="w-3 h-3" />
                            ) : (
                                <Zap className="w-3 h-3" />
                            )}
                            <span className="hidden xl:inline">{isAnalyzing ? 'Thinking...' : productInsight ? 'Re-Analyze' : 'Analyze'}</span>
                        </button>
                        <span className={`hidden sm:inline-block px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${getStockColor(item.stock)}`}>
                            {getStockStatus(item.stock)}
                        </span>
                        {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                </td>
            </tr>

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
                                <InventoryDetailSection
                                    item={item}
                                    productInsight={productInsight}
                                    isHistoryLoading={isHistoryLoading}
                                    history={history}
                                    localStock={localStock}
                                    setLocalStock={setLocalStock}
                                    isUpdating={isUpdating}
                                    handleConfirmCount={handleConfirmCount}
                                />
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </React.Fragment>
    );
}

function InventoryMobileCard({
    item, expandedId, handleExpand, isAnalyzing, productInsight, handleAnalyzeProduct,
    isHistoryLoading, history, localStock, setLocalStock, isUpdating, handleConfirmCount,
    getStockColor, getStockStatus
}: any) {
    const isExpanded = expandedId === item.id;

    return (
        <div className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-primary shadow-xl ring-1 ring-primary/10' : 'border-slate-100 shadow-sm'}`}>
            <div className="p-4 flex items-center justify-between gap-4" onClick={() => handleExpand(item)}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                        {item.images?.[0] ? (
                            <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-slate-200" /></div>
                        )}
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-sm">{item.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded-md">{item.category}</span>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${getStockColor(item.stock)}`}>{getStockStatus(item.stock)}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-black text-slate-900 leading-none">{item.stock}<span className="text-[8px] text-slate-400 ml-0.5 uppercase tracking-tighter">Units</span></p>
                    <p className="text-[10px] font-black text-emerald-600 mt-1">{formatPrice(Number(item.price) * item.stock)}</p>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-50 bg-slate-50/30"
                    >
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleAnalyzeProduct(e, item.id); }}
                                    disabled={isAnalyzing}
                                    className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${productInsight ? 'bg-primary text-white' : 'bg-slate-900 text-white'}`}
                                >
                                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : productInsight ? <BrainCircuit className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                                    {isAnalyzing ? 'Thinking...' : productInsight ? 'Re-Analyze' : 'Analyze Item'}
                                </button>
                            </div>

                            <InventoryDetailSection
                                item={item}
                                productInsight={productInsight}
                                isHistoryLoading={isHistoryLoading}
                                history={history}
                                localStock={localStock}
                                setLocalStock={setLocalStock}
                                isUpdating={isUpdating}
                                handleConfirmCount={handleConfirmCount}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InventoryDetailSection({
    item, productInsight, isHistoryLoading, history, localStock, setLocalStock, isUpdating, handleConfirmCount
}: any) {
    return (
        <div className="p-4 lg:mx-6 lg:p-8 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col lg:flex-row gap-6 lg:gap-8 lg:mb-4">
            <div className="flex-1 space-y-6">
                {/* AI Proactive Suggestion */}
                {productInsight && (
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-primary" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Big T Growth Suggestion</h4>
                        </div>
                        <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                            {productInsight.description}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                                Impact: {productInsight.impact}
                            </span>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-slate-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Audit Log</h4>
                    </div>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                        {isHistoryLoading ? (
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-dashed border-slate-200">
                                <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />
                                <span className="text-[11px] font-bold text-slate-400">Tracking movements...</span>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-[11px] font-bold text-slate-400 p-4 border border-dashed border-slate-200 rounded-xl text-center">
                                No movement recorded
                            </div>
                        ) : (
                            history.map((log: any, i: number) => {
                                const isOrder = log.type === 'STOCK_REDUCED_BY_ORDER';
                                const adjustment = isOrder ? `-${log.payload.quantityReduced}` : (log.payload.adjustment > 0 ? `+${log.payload.adjustment}` : log.payload.adjustment);
                                const actionName = isOrder ? `Sale #${log.payload.orderId.slice(-4)}` : 'Manual Adjust';

                                return (
                                    <div key={log.id} className="flex items-center justify-between text-[11px] font-bold p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${isOrder ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                                            <span className="text-slate-900">{actionName}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={adjustment.toString().startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>{adjustment}</span>
                                            <span className="text-slate-400 font-medium">{format(new Date(log.date), 'MMM d, p')}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-80 space-y-6">
                <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-primary pb-1">Stock Control</h4>
                        <Settings2 className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                        <button
                            onClick={(e) => { e.stopPropagation(); setLocalStock((prev: any) => Math.max(0, (prev || 0) - 1)); }}
                            className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
                        >
                            <Minus className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="text-center">
                            <motion.p key={localStock} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-3xl font-black text-slate-900">
                                {localStock ?? item.stock}
                            </motion.p>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">In Stock</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setLocalStock((prev: any) => (prev || 0) + 1); }}
                            className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
                        >
                            <Plus className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    <button
                        disabled={isUpdating || localStock === item.stock}
                        onClick={(e) => { e.stopPropagation(); handleConfirmCount(item.id); }}
                        className="w-full h-14 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:brightness-110 active:scale-98 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-2"
                    >
                        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply Adjustment'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function InvStat({ label, value, color = "text-white" }: { label: string; value: string; color?: string }) {
    return (
        <div className="text-center md:text-left">
            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1.5">{label}</p>
            <p className={`text-xl lg:text-2xl font-black ${color}`}>{value}</p>
        </div>
    );
}
