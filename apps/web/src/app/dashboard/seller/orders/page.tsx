'use client';

import React, { useEffect, useState, Fragment } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';
import { Loader2, ChevronDown, Package, CheckCircle, XCircle, Clock, ShoppingBag, Search, Filter, Download, Plus } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';

interface Order {
    id: string;
    createdAt: string;
    totalAmount: string; // serialized Decimal
    status: string;
    buyer: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
    type?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    paymentMethod?: string;
    discount?: string;
    items: {
        id: string;
        quantity: number;
        price: string;
        product: {
            name: string;
            images: string[];
        };
    }[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All Orders');
    const [viewMode, setViewMode] = useState<'ALL' | 'ONLINE' | 'OFFLINE'>('ALL');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders/seller');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleExportCSV = () => {
        if (orders.length === 0) return;
        const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Type', 'Method', 'Discount', 'Total', 'Status'];
        const rows = orders.map(order => [
            order.id.toUpperCase(),
            format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm'),
            order.customerName || order.buyer?.name || 'N/A',
            order.customerEmail || order.buyer?.email || 'N/A',
            order.type || 'ONLINE',
            order.paymentMethod || 'N/A',
            order.discount || '0',
            order.totalAmount,
            order.status
        ]);
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_${format(new Date(), 'yyyyMMdd')}.csv`);
        link.click();
    };

    const filteredOrders = orders.filter(order => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            order.id.toLowerCase().includes(query) ||
            (order.customerName || '').toLowerCase().includes(query) ||
            (order.customerEmail || '').toLowerCase().includes(query) ||
            (order.buyer?.name || '').toLowerCase().includes(query) ||
            (order.buyer?.email || '').toLowerCase().includes(query);

        if (!matchesSearch) return false;
        if (viewMode === 'ONLINE' && order.type === 'OFFLINE') return false;
        if (viewMode === 'OFFLINE' && order.type !== 'OFFLINE') return false;

        const s = order.status.toLowerCase();
        if (filter === 'All Orders') return true;
        if (filter === 'Processing') return ['processing', 'paid', 'pending'].includes(s);
        if (filter === 'Delivered') return ['delivered', 'completed'].includes(s);
        return s === filter.toLowerCase();
    });

    const getCustomerHistory = (currentOrder: Order) => {
        if (!currentOrder.buyer) return [];
        return orders
            .filter(o => o.buyer?.id === currentOrder.buyer?.id && o.id !== currentOrder.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            setLoading(true);
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setLoading(false);
        }
    };

    const counts = {
        'All Orders': orders.filter(o => {
            if (viewMode === 'ONLINE') return o.type !== 'OFFLINE';
            if (viewMode === 'OFFLINE') return o.type === 'OFFLINE';
            return true;
        }).length,
        'Processing': orders.filter(o => {
            const match = ['processing', 'paid', 'pending'].includes(o.status.toLowerCase());
            if (viewMode === 'ONLINE') return match && o.type !== 'OFFLINE';
            if (viewMode === 'OFFLINE') return match && o.type === 'OFFLINE';
            return match;
        }).length,
        'Shipped': orders.filter(o => {
            const match = o.status.toLowerCase() === 'shipped';
            if (viewMode === 'ONLINE') return match && o.type !== 'OFFLINE';
            if (viewMode === 'OFFLINE') return match && o.type === 'OFFLINE';
            return match;
        }).length,
        'Delivered': orders.filter(o => {
            const match = ['delivered', 'completed'].includes(o.status.toLowerCase());
            if (viewMode === 'ONLINE') return match && o.type !== 'OFFLINE';
            if (viewMode === 'OFFLINE') return match && o.type === 'OFFLINE';
            return match;
        }).length,
        'Cancelled': orders.filter(o => {
            const match = o.status.toLowerCase() === 'cancelled';
            if (viewMode === 'ONLINE') return match && o.type !== 'OFFLINE';
            if (viewMode === 'OFFLINE') return match && o.type === 'OFFLINE';
            return match;
        }).length,
    };

    if (loading && orders.length === 0) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Orders...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/30 -m-4 sm:m-0">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-100 px-6 sm:px-10 py-6 sm:py-8 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Orders</h1>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live Fulfillment Stream
                                </p>
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
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex-[2] sm:flex-none h-11 px-8 rounded-2xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Record Sale</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Only Header */}
                    <div className="sm:hidden flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                FULFILLMENT MASTER
                            </p>
                            <p className="text-slate-900 mt-1 font-black text-xl tracking-tight">Active Stream</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleExportCSV} className="w-10 h-10 bg-white border border-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                                <Download className="w-4 h-4" />
                            </button>
                            <button onClick={() => setIsCreateModalOpen(true)} className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center pt-2">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by ID, name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-emerald-500 rounded-[1.25rem] py-3.5 pl-12 pr-4 text-base sm:text-[11px] font-bold uppercase tracking-wider text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-50/50 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                                {['ALL', 'ONLINE', 'OFFLINE'].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode as any)}
                                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                            <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />
                            {Object.entries(counts).map(([label, count]) => (
                                <button
                                    key={label}
                                    onClick={() => setFilter(label)}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2 ${filter === label ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'}`}
                                >
                                    {label}
                                    {count > 0 && <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${filter === label ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>{count}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="flex-1 px-6 sm:px-10 py-8">
                <div className="max-w-7xl mx-auto">
                    {filteredOrders.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-5xl mb-6 opacity-40">🛒</div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">No orders found</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Try adjusting your filters or search</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {/* Table Headers - Desktop Only */}
                            <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-100/50 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <div className="col-span-2">Reference</div>
                                <div className="col-span-4">Client Detail</div>
                                <div className="col-span-2">Timestamp</div>
                                <div className="col-span-2">Fulfillment</div>
                                <div className="col-span-2 text-right">Settlement</div>
                            </div>

                            {/* Orders List */}
                            {filteredOrders.map((order) => (
                                <OrderListItem
                                    key={order.id}
                                    order={order}
                                    loading={loading}
                                    isExpanded={expandedOrderId === order.id}
                                    onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                    onStatusUpdate={handleStatusUpdate}
                                    customerHistory={getCustomerHistory(order)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateOrderModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        setIsCreateModalOpen(false);
                        fetchOrders();
                    }}
                />
            )}
        </div>
    );
}

function OrderListItem({ order, isExpanded, onToggle, onStatusUpdate, customerHistory, loading }: any) {
    return (
        <div className={`bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-slate-900 shadow-2xl ring-4 ring-slate-100 ring-opacity-50' : 'border-slate-100 hover:border-slate-200 hover:shadow-xl'}`}>
            {/* Header / Summary Row */}
            <div
                onClick={onToggle}
                className="p-4 sm:p-6 cursor-pointer flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 items-start lg:items-center relative"
            >
                {/* Top Row: ID & Date (Mobile Optimized) */}
                <div className="lg:col-span-2 flex items-center justify-between w-full lg:w-auto gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all ${isExpanded ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">#{order.id.slice(-6).toUpperCase()}</p>
                        </div>
                    </div>
                    {/* Date - Mobile Only (at Top Right) */}
                    <div className="lg:hidden text-right">
                        <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight">{format(new Date(order.createdAt), 'MMM dd')}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{format(new Date(order.createdAt), 'HH:mm')}</p>
                    </div>
                </div>

                {/* Buyer Info & Type */}
                <div className="lg:col-span-4 flex items-center gap-3 w-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black uppercase text-slate-400 overflow-hidden shrink-0">
                        {order.buyer?.image ? (
                            <img src={order.buyer.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            order.customerName?.[0] || order.buyer?.name?.[0] || 'U'
                        )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
                                {order.customerName || order.buyer?.name || 'Walk-In Customer'}
                            </p>
                            {order.type === 'OFFLINE' && <span className="px-1 py-0.5 bg-slate-900 text-white rounded-[4px] text-[6px] font-black tracking-widest uppercase">OFFLINE</span>}
                        </div>
                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 truncate mt-0.5 italic">
                            {order.customerEmail || order.buyer?.email || 'OFFLINE TRANSACTION'}
                        </p>
                    </div>
                </div>

                {/* Date - Desktop Only */}
                <div className="hidden lg:block lg:col-span-2 text-left">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{format(new Date(order.createdAt), 'HH:mm')}</p>
                </div>

                {/* Status - Desktop Only Section (Mobile uses Bottom Right for Price) */}
                <div className="lg:col-span-2 hidden lg:flex items-center gap-3">
                    <StatusBadge status={order.status} />
                </div>

                {/* Price (Mobile: Bottom Right, Desktop: Right Column) */}
                <div className="lg:col-span-2 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-end w-full lg:w-auto border-t border-slate-50 pt-3 lg:border-t-0 lg:pt-0">
                    <div className="lg:hidden">
                        <StatusBadge status={order.status} size="sm" />
                    </div>
                    <div className="text-right">
                        <p className="text-sm sm:text-lg font-black text-slate-950 tracking-tighter leading-none">{formatPrice(Number(order.totalAmount))}</p>
                        {Number(order.discount) > 0 && (
                            <p className="text-[8px] text-rose-500 font-black uppercase tracking-widest mt-1">-{formatPrice(Number(order.discount))}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="border-t border-slate-50 bg-slate-50/30 p-4 sm:p-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                        {/* Order Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 flex items-center gap-3">
                                    <ShoppingBag className="w-5 h-5" /> Itemized Bill
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">{order.items.length} positions</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{order.paymentMethod || 'CASH'}</span>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-5 p-4 sm:p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl shrink-0 overflow-hidden relative border border-slate-100/50">
                                            {item.product?.images?.[0] ? (
                                                <Image src={item.product.images[0]} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="font-black text-slate-900 uppercase text-xs sm:text-sm tracking-tight truncate">{item.product.name}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Qty: <span className="text-slate-900">{item.quantity}</span></p>
                                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatPrice(Number(item.price))} each</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-slate-950 text-base sm:text-lg tracking-tighter">{formatPrice(Number(item.price) * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Payment Summary Box */}
                            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <CheckCircle className="w-24 h-24" />
                                </div>
                                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Total Settlement</p>
                                        <p className="text-4xl font-black tracking-tighter">{formatPrice(Number(order.totalAmount))}</p>
                                    </div>
                                    {Number(order.discount) > 0 && (
                                        <div className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 self-start sm:self-auto">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Discount applied</p>
                                            <p className="text-sm font-black text-emerald-400 mt-0.5">-{formatPrice(Number(order.discount))}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions Sidebar */}
                        <div className="space-y-10">
                            {/* Fulfillment Actions */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 flex items-center gap-3 border-b border-slate-200/60 pb-4">
                                    <Filter className="w-5 h-5 focus:animate-spin" /> Control Center
                                </h3>
                                <div className="grid grid-cols-1 gap-2.5">
                                    {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((action) => (
                                        <button
                                            key={action}
                                            onClick={() => onStatusUpdate(order.id, action)}
                                            disabled={loading || order.status === action}
                                            className={`px-6 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all flex items-center justify-between border shadow-sm active:scale-95 ${order.status === action
                                                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-900 hover:text-slate-900 hover:shadow-xl'
                                                }`}
                                        >
                                            {action}
                                            {order.status === action && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Customer History */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 flex items-center gap-3 border-b border-slate-200/60 pb-4">
                                    <Clock className="w-5 h-5" /> Buyer History
                                </h3>
                                <div className="space-y-3">
                                    {customerHistory.length === 0 ? (
                                        <div className="py-8 text-center bg-white rounded-3xl border border-slate-100/50">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">First time buyer</p>
                                        </div>
                                    ) : (
                                        customerHistory.map((hist: any) => (
                                            <div key={hist.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-slate-900 transition-colors">
                                                <div>
                                                    <p className="font-black text-slate-950 text-[10px] uppercase tracking-tighter">#{hist.id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-[8px] text-slate-400 font-black uppercase mt-1 tracking-widest">{format(new Date(hist.createdAt), 'MMM dd')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-slate-900 text-xs tracking-tighter">{formatPrice(Number(hist.totalAmount))}</p>
                                                    <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${hist.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{hist.status}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status, size = 'default' }: { status: string; size?: 'sm' | 'default' }) {
    const s = status.toLowerCase();
    let styles = 'bg-slate-100 text-slate-400 border-slate-100';
    if (['processing', 'pending', 'paid'].includes(s)) styles = 'bg-amber-50 text-amber-600 border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
    if (s === 'shipped') styles = 'bg-blue-50 text-blue-600 border-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.15)]';
    if (['delivered', 'completed'].includes(s)) styles = 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
    if (s === 'cancelled') styles = 'bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.15)]';

    return (
        <span className={`${size === 'sm' ? 'px-2 py-0.5 text-[7px]' : 'px-2.5 py-1.5 text-[9px]'} rounded-xl font-black tracking-widest uppercase border transition-all ${styles}`}>
            {status}
        </span>
    );
}

// ... CreateOrderModal stays the same but maybe wrapped in better mobile styling ...
function CreateOrderModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<{ id: string; name: string; price: number; quantity: number; stock: number }[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [discount, setDiscount] = useState('0');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'MARKET' | 'CHECKOUT'>('MARKET');
    const { store } = useAuthStore() as any;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products/seller');
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch products', err);
            }
        };
        if (isOpen) fetchProducts();
    }, [isOpen]);

    const addProduct = (product: any) => {
        if (product.stock <= 0) return alert('Out of stock');
        setSelectedProducts(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev;
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { id: product.id, name: product.name, price: Number(product.price), quantity: 1, stock: product.stock }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setSelectedProducts(prev => prev.map(p => {
            if (p.id === productId) {
                const newQty = p.quantity + delta;
                if (newQty > p.stock) return p;
                return { ...p, quantity: Math.max(1, newQty) };
            }
            return p;
        }));
    };

    const removeProduct = (productId: string) => setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    const totalSub = selectedProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    const total = Math.max(0, totalSub - Number(discount));

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            setLoading(true);
            await api.post('/orders/offline', {
                storeId: store.id,
                customerName,
                customerEmail,
                customerPhone,
                paymentMethod,
                discount: Number(discount),
                totalAmount: total,
                items: selectedProducts.map(p => ({ productId: p.id, quantity: p.quantity, price: p.price }))
            });
            onSuccess();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onClose} />
            <div className="bg-white w-full h-full sm:h-auto sm:max-w-6xl sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative">
                {/* Header */}
                <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-30">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Manual Entry</h2>
                        <div className="flex items-center gap-2 mt-1.5 ">
                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Recording Offline Sale</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">{selectedProducts.length} Items in cart</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile Tab Switcher */}
                <div className="lg:hidden flex border-b border-slate-50 bg-white sticky top-[84px] z-20">
                    <button
                        onClick={() => setActiveTab('MARKET')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${activeTab === 'MARKET' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-300'}`}
                    >
                        Market
                    </button>
                    <button
                        onClick={() => setActiveTab('CHECKOUT')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${activeTab === 'CHECKOUT' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-300'}`}
                    >
                        Checkout
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-50/20">
                    <div className="grid grid-cols-1 lg:grid-cols-5 min-h-full">
                        {/* Inventory Section */}
                        <div className={`lg:col-span-2 border-r border-slate-100 p-6 sm:p-8 space-y-6 bg-white ${activeTab === 'MARKET' ? 'block' : 'hidden lg:block'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Browse Catalog</h3>
                                <span className="text-[10px] font-black text-slate-900 px-2 py-1 bg-slate-50 rounded-lg">{filteredProducts.length} Results</span>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] py-4 pl-12 pr-4 text-[11px] font-bold uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-slate-100/50 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pb-20">
                                {filteredProducts.map(product => (
                                    <div key={product.id} onClick={() => addProduct(product)} className={`p-3 bg-white rounded-[2rem] border border-slate-100 cursor-pointer shadow-sm hover:shadow-xl hover:border-slate-900 transition-all group scale-100 active:scale-95 ${product.stock <= 0 ? 'opacity-30' : ''}`}>
                                        <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-4 relative">
                                            {product.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>}
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl shadow-lg border border-white/50">
                                                <p className="text-[8px] font-black text-slate-900">{product.stock} UNIT</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black uppercase truncate px-1 text-slate-950 tracking-tight">{product.name}</p>
                                        <p className="text-xs font-black px-1 mt-2 text-slate-900">{formatPrice(Number(product.price))}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details & Cart Section */}
                        <div className={`lg:col-span-3 p-6 sm:p-10 lg:space-y-12 space-y-8 ${activeTab === 'CHECKOUT' ? 'block' : 'hidden lg:block'}`}>
                            {/* Customer Data */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    Customer Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="FULL NAME *" required value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-6 py-4.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-slate-50 focus:border-slate-200 outline-none transition-all shadow-sm" />
                                    <input type="email" placeholder="EMAIL ADDRESS" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full px-6 py-4.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-slate-50 focus:border-slate-200 outline-none transition-all shadow-sm" />
                                </div>
                            </div>

                            {/* Payment Choice */}
                            <div className="space-y-5">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    Payment Method
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {['CASH', 'TRANSFER', 'POS', 'CARD'].map(m => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setPaymentMethod(m)}
                                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${paymentMethod === m ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-y-[-2px]' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cart List */}
                            <div className="space-y-6 pb-24">
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Current Cart</h3>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedProducts.length} ARTICLES SELECTED</span>
                                </div>

                                {selectedProducts.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-white">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Cart is Empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedProducts.map(item => (
                                            <div key={item.id} className="flex items-center gap-5 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-black text-slate-950 uppercase tracking-tight truncate">{item.name}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{formatPrice(item.price)} PER UNIT</p>
                                                </div>
                                                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-1.5">
                                                    <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-950 font-black hover:bg-white rounded-xl transition-colors">-</button>
                                                    <span className="text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
                                                    <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-950 font-black hover:bg-white rounded-xl transition-colors">+</button>
                                                </div>
                                                <button type="button" onClick={() => removeProduct(item.id)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Sticky Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-40">
                    <div className="flex flex-col text-center sm:text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-1.5">Final Settlement</p>
                        <p className="text-4xl font-black text-slate-950 tracking-tighter leading-none">{formatPrice(total)}</p>
                    </div>

                    {/* Multi-action button for mobile */}
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                        {activeTab === 'MARKET' ? (
                            <button
                                type="button"
                                onClick={() => setActiveTab('CHECKOUT')}
                                className="lg:hidden w-full px-12 py-4.5 bg-slate-900 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                Continue to Checkout
                                <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center text-[10px]">
                                    {selectedProducts.length}
                                </div>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setActiveTab('MARKET')}
                                className="lg:hidden w-full px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-900 transition-all mb-2"
                            >
                                Back to Catalog
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => handleSubmit()}
                            disabled={loading || selectedProducts.length === 0 || !customerName.trim()}
                            className={`${activeTab === 'MARKET' ? 'hidden lg:flex' : 'flex'} w-full sm:w-auto px-12 py-4.5 bg-emerald-600 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-emerald-700 disabled:opacity-30 shadow-xl shadow-emerald-100 transition-all active:scale-95 items-center justify-center gap-3`}
                        >
                            {loading ? 'PROCESSING...' : 'Record Transaction'}
                            <CheckCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
