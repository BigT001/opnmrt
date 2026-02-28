'use client';

import React, { useEffect, useState, Fragment } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';
import { Loader2, ChevronDown, ChevronUp, Package, AlertCircle, CheckCircle, XCircle, Clock, ShoppingBag, Search } from 'lucide-react';
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
    const dashboardHeaderRef = React.useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(140); // Default estimate

    useEffect(() => {
        if (dashboardHeaderRef.current) {
            setHeaderHeight(dashboardHeaderRef.current.offsetHeight);
        }
    }, [orders.length]); // Recalculate if something shifts

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

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_${format(new Date(), 'yyyyMMdd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const StatusBadge = ({ status, type }: { status: string; type?: string }) => {
        const s = status.toLowerCase();
        let styles = 'bg-slate-100 text-slate-600';
        if (s === 'processing' || s === 'pending') styles = 'bg-amber-50/50 text-amber-600 border border-amber-100';
        if (s === 'shipped') styles = 'bg-blue-50/50 text-blue-600 border border-blue-100';
        if (s === 'paid' || s === 'delivered' || s === 'completed') styles = 'bg-emerald-50/50 text-emerald-600 border border-emerald-100';
        if (s === 'cancelled') styles = 'bg-rose-50/50 text-rose-600 border border-rose-100';

        return (
            <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${styles}`}>
                    {status}
                </span>
                {type === 'OFFLINE' && (
                    <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded-[4px] text-[7px] font-black tracking-widest uppercase">OFF</span>
                )}
            </div>
        );
    };

    const PaymentMethodDisplay = ({ method, type }: { method?: string; type?: string }) => {
        const m = (method || (type === 'OFFLINE' ? 'CASH' : 'ONLINE')).toUpperCase();
        let icon = '🏛️';
        if (m.includes('CASH')) icon = '💵';
        if (m.includes('BANK')) icon = '🏦';
        if (m.includes('CARD') || m.includes('POS')) icon = '💳';

        return (
            <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-xs grayscale opacity-70">{icon}</span>
                <span className="text-[9px] font-black uppercase tracking-widest">
                    {m.replace('_', ' ')}
                </span>
            </div>
        );
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

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            setLoading(true);
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-slate-900 selection:text-white">
            {/* Sticky Dashboard Header */}
            <div
                ref={dashboardHeaderRef}
                className="sticky top-0 z-50 bg-white/95 backdrop-blur-md -mx-6 md:-mx-8 lg:-mx-10 -mt-6 md:-mt-8 lg:-mt-10 px-6 md:px-8 lg:px-10 border-b border-slate-100 shadow-sm"
            >
                <div className="flex flex-col">
                    {/* Row 1: Title + Universal Search + Actions */}
                    <div className="flex items-center justify-between py-2 gap-10">
                        <div className="flex items-center gap-4 shrink-0">
                            <h1 className="text-xl font-black text-slate-950 tracking-tight uppercase">Orders</h1>
                            <button
                                onClick={fetchOrders}
                                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-950 rounded-full transition-all active:rotate-180 duration-500"
                                title="Refresh Data"
                            >
                                <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-slate-950' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 max-w-sm relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="SEARCH..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 group-focus-within:border-emerald-500 rounded-xl py-2 pl-9 pr-4 text-[11px] font-black uppercase tracking-widest text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={handleExportCSV}
                                className="h-9 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 transition-colors flex items-center gap-2 border border-transparent hover:border-slate-100 rounded-xl"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                CSV
                            </button>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="h-10 px-6 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                            >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                Record Sale
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between h-12 border-t border-slate-50">
                        <div className="flex items-center gap-8">
                            {[
                                { id: 'ALL', label: 'All' },
                                { id: 'ONLINE', label: 'Online' },
                                { id: 'OFFLINE', label: 'Offline' }
                            ].map(mode => (
                                <button
                                    key={mode.id}
                                    onClick={() => {
                                        setViewMode(mode.id as any);
                                        setFilter('All Orders');
                                    }}
                                    className={`relative h-12 flex items-center text-[10px] font-black uppercase tracking-[0.2em] transition-all ${viewMode === mode.id ? 'text-slate-950' : 'text-slate-300 hover:text-slate-600'}`}
                                >
                                    {mode.label}
                                    {viewMode === mode.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 rounded-full" />}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                            {Object.entries(counts).map(([label, count]) => (
                                <FilterChip
                                    key={label}
                                    label={label}
                                    active={filter === label}
                                    count={count > 0 ? count.toString() : undefined}
                                    onClick={() => setFilter(label)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Row 3: Integrated Table Headers — visually part of the table */}
                    <div className="h-10 border-t border-slate-200 bg-slate-50 -mx-6 md:-mx-8 lg:-mx-10 px-6 md:px-8 lg:px-10 border-b-2 border-b-slate-200 flex items-center">
                        <table className="w-full table-fixed border-collapse">
                            <thead>
                                <tr className="text-left text-[9px] text-slate-500 uppercase tracking-[0.4em] font-black border-none">
                                    <th className="pl-10 w-[15%]">REFID</th>
                                    <th className="w-[30%]">Client Identity</th>
                                    <th className="w-[15%]">Timestamp</th>
                                    <th className="w-[15%]">Fulfillment</th>
                                    <th className="w-[10%]">System</th>
                                    <th className="pr-10 text-right w-[15%]">Settlement</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white">
                {/* Create Order Modal */}
                {isCreateModalOpen && (
                    <CreateOrderModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={() => {
                            setIsCreateModalOpen(false);
                            fetchOrders(); // Refetch instead of reload
                        }}
                    />
                )}

                {/* Orders Body - Data Rows Only */}
                <div className="px-0 pb-20">
                    {filteredOrders.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-40 text-slate-200">
                            <div className="text-6xl mb-8 grayscale opacity-20">📦</div>
                            <p className="font-black uppercase tracking-[0.4em] text-[12px]">No matching records found</p>
                        </div>
                    ) : (
                        <div className="bg-white">
                            <table className="w-full table-fixed border-collapse">
                                <tbody className="text-sm font-bold text-slate-900 border-x border-slate-50">
                                    {filteredOrders.map((order) => (
                                        <Fragment key={order.id}>
                                            <tr
                                                onClick={() => toggleExpand(order.id)}
                                                className={`group hover:bg-slate-50/50 transition-all cursor-pointer border-b border-slate-100/60 ${expandedOrderId === order.id ? 'bg-slate-50/80 shadow-inner' : 'bg-transparent'}`}
                                            >
                                                <td className="py-4 pl-10 w-[15%] font-mono text-[11px] text-slate-400 group-hover:text-slate-950">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-5 h-5 flex items-center justify-center rounded-full transition-all ${expandedOrderId === order.id ? 'bg-slate-950 text-white rotate-180' : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200'}`}>
                                                            <ChevronDown className="w-3 h-3" />
                                                        </div>
                                                        <span className="font-black tracking-tight">#{order.id.slice(-6).toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 w-[30%]">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[11px] font-black uppercase shrink-0 overflow-hidden shadow-sm border-2 border-white">
                                                            {order.buyer?.image ? (
                                                                <img src={order.buyer.image} alt={order.buyer.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                order.buyer?.name ? order.buyer.name.charAt(0) : 'U'
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="truncate pr-4 text-slate-950 text-xs font-black uppercase tracking-tight">{order.customerName || order.buyer?.name || 'Walk-In Customer'}</span>
                                                            <span className="text-[10px] text-slate-300 font-bold truncate uppercase pr-4 tracking-tighter">{order.customerEmail || order.buyer?.email || 'OFFLINE TRANSACTION'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 w-[15%] text-slate-950">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                                                        <span className="text-[9px] text-slate-300 font-black uppercase mt-1 tracking-widest">{format(new Date(order.createdAt), 'HH:mm')}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 w-[15%]">
                                                    <StatusBadge status={order.status} type={order.type} />
                                                </td>
                                                <td className="py-4 w-[10%]">
                                                    <PaymentMethodDisplay method={order.paymentMethod} type={order.type} />
                                                </td>
                                                <td className="py-4 pr-10 text-right w-[15%]">
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-black text-slate-950 text-base tracking-tighter">{formatPrice(Number(order.totalAmount))}</span>
                                                        {Number(order.discount) > 0 && (
                                                            <span className="text-[9px] text-rose-500 font-black uppercase mt-1 tracking-[0.2em] opacity-60">-{formatPrice(Number(order.discount))}</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded Details Row */}
                                            {expandedOrderId === order.id && (
                                                <tr>
                                                    <td colSpan={6} className="p-0">
                                                        <div className="bg-slate-50/50 border-b border-slate-100 p-10 animate-in slide-in-from-top-2 duration-300">
                                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 max-w-7xl mx-auto">
                                                                {/* Order Items */}
                                                                <div className="lg:col-span-2 space-y-8">
                                                                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                                                        <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-900 flex items-center gap-3">
                                                                            <ShoppingBag className="w-5 h-5 text-slate-900" /> Itemized Bill
                                                                        </h3>
                                                                        <span className="text-[10px] font-black text-slate-400 uppercase">{order.items.length} items</span>
                                                                    </div>
                                                                    <div className="space-y-4">
                                                                        {order.items.map((item) => (
                                                                            <div key={item.id} className="flex items-center gap-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                                                <div className="w-16 h-16 bg-slate-50 rounded-xl shrink-0 overflow-hidden relative border border-slate-100">
                                                                                    {item.product?.images?.[0] && (
                                                                                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="font-black text-slate-900 uppercase text-sm tracking-tight">{item.product.name}</p>
                                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Qty Ordered: <span className="text-slate-900">{item.quantity}</span></p>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <p className="font-black text-slate-900 text-lg">{formatPrice(Number(item.price) * item.quantity)}</p>
                                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatPrice(Number(item.price))} each</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Sidebar Actions */}
                                                                <div className="space-y-12">
                                                                    <div className="space-y-6">
                                                                        <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-900 flex items-center gap-3 border-b border-slate-200 pb-4">
                                                                            <Package className="w-5 h-5" /> Fulfillment
                                                                        </h3>
                                                                        <div className="grid grid-cols-1 gap-3">
                                                                            {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((action) => (
                                                                                <button
                                                                                    key={action}
                                                                                    onClick={() => handleStatusUpdate(order.id, action)}
                                                                                    disabled={order.status === action}
                                                                                    className={`px-5 py-4 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border ${order.status === action
                                                                                        ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed grayscale'
                                                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 hover:shadow-lg active:scale-95'
                                                                                        }`}
                                                                                >
                                                                                    MARK AS {action}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-6">
                                                                        <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-900 flex items-center gap-3 border-b border-slate-200 pb-4">
                                                                            <Clock className="w-5 h-5" /> RECENT HISTORY
                                                                        </h3>
                                                                        <div className="space-y-4">
                                                                            {getCustomerHistory(order).length === 0 ? (
                                                                                <p className="text-[10px] text-slate-300 font-bold uppercase py-4 italic">No other records</p>
                                                                            ) : (
                                                                                getCustomerHistory(order).map(hist => (
                                                                                    <div key={hist.id} className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-slate-100">
                                                                                        <div className="flex flex-col">
                                                                                            <span className="font-black text-slate-950 text-[11px]">#{hist.id.slice(-6).toUpperCase()}</span>
                                                                                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{format(new Date(hist.createdAt), 'MMM dd')}</span>
                                                                                        </div>
                                                                                        <div className="text-right">
                                                                                            <p className="font-black text-slate-900 text-[11px]">{formatPrice(Number(hist.totalAmount))}</p>
                                                                                            <span className="text-[8px] font-black uppercase text-slate-400">{hist.status}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

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
    const { store } = useAuthStore() as any;

    if (!store) return null;

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
                if (existing.quantity >= product.stock) {
                    alert(`Maximum stock reached (${product.stock} available)`);
                    return prev;
                }
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { id: product.id, name: product.name, price: Number(product.price), quantity: 1, stock: product.stock }];
        });
    };

    const removeProduct = (productId: string) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setSelectedProducts(prev => prev.map(p => {
            if (p.id === productId) {
                const newQty = p.quantity + delta;
                if (newQty > p.stock) {
                    alert(`Limit reached: only ${p.stock} in stock`);
                    return p;
                }
                return { ...p, quantity: Math.max(1, newQty) };
            }
            return p;
        }));
    };

    const totalSub = selectedProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    const total = Math.max(0, totalSub - Number(discount));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProducts.length === 0) return alert('Select at least one product');
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
                items: selectedProducts.map(p => ({
                    productId: p.id,
                    quantity: p.quantity,
                    price: p.price
                }))
            });
            onSuccess();
        } catch (err) {
            console.error('Failed to create offline order', err);
            alert('Failed to record sale');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/20">
                <div className="px-10 py-3.5 flex justify-between items-center bg-white shrink-0 border-b border-slate-50">
                    <div className="flex items-center gap-5">
                        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                            <ShoppingBag className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase leading-none">Manual Order Entry</h2>
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mt-1">Recording offline transaction</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all group">
                        <XCircle className="w-6 h-6 text-slate-400 group-hover:text-rose-500 transition-colors" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
                        {/* Product Picker */}
                        <div className="lg:col-span-2 border-r border-slate-50 flex flex-col overflow-hidden bg-slate-50/20">
                            <div className="p-6 space-y-6 flex flex-col h-full overflow-hidden">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 shrink-0">1. Browse Inventory</h3>
                                    <div className="relative flex-1 max-w-[180px]">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <Search className="w-3 h-3 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="SEARCH..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] shadow-sm focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-8">
                                    {filteredProducts.map(product => (
                                        <div
                                            key={product.id}
                                            onClick={() => addProduct(product)}
                                            className={`flex flex-col p-3 bg-white rounded-3xl cursor-pointer transition-all border border-slate-100 hover:border-slate-950 group relative shadow-sm hover:shadow-2xl hover:-translate-y-1 ${product.stock <= 0 ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                                        >
                                            <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-4 relative">
                                                {product.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-slate-200">📦</div>}
                                                <div className="absolute top-3 right-3">
                                                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full shadow-lg backdrop-blur-md ${product.stock <= 10 ? 'bg-rose-600 text-white' : 'bg-slate-950 text-white'}`}>
                                                        {product.stock} IN STOCK
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="min-w-0 px-1 pb-1">
                                                <p className="font-black text-[10px] truncate text-slate-900 uppercase tracking-tight">{product.name}</p>
                                                <p className="text-xs font-black text-slate-950 mt-1.5">{formatPrice(Number(product.price))}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Customer & Order Details */}
                        <div className="lg:col-span-3 flex flex-col overflow-hidden bg-white">
                            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600">2. Customer Info</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="FULL NAME *"
                                            required
                                            value={customerName}
                                            onChange={e => setCustomerName(e.target.value)}
                                            className="col-span-1 md:col-span-2 w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all text-slate-900 placeholder:text-slate-400"
                                        />
                                        <input
                                            type="email"
                                            placeholder="EMAIL ADDRESS"
                                            value={customerEmail}
                                            onChange={e => setCustomerEmail(e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all text-slate-900 placeholder:text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="PHONE NUMBER"
                                            value={customerPhone}
                                            onChange={e => setCustomerPhone(e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all text-slate-900 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600">3. Checkout Context</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black uppercase text-slate-600 tracking-[0.3em]">Payment System</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['CASH', 'TRANSFER', 'POS', 'CARD'].map(m => (
                                                    <button
                                                        key={m}
                                                        type="button"
                                                        onClick={() => setPaymentMethod(m)}
                                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${paymentMethod === m ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}`}
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black uppercase text-slate-600 tracking-[0.3em]">Adjustment (₦)</label>
                                            <input
                                                type="number"
                                                value={discount}
                                                onChange={e => setDiscount(e.target.value)}
                                                className="w-full px-4 py-2 bg-rose-50 border-none rounded-xl text-xs font-black text-rose-600 focus:ring-2 focus:ring-rose-100 transition-all text-right uppercase"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600">4. Selected Items</h3>
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">{selectedProducts.length} ARTICLES</span>
                                    </div>
                                    <div className="space-y-3">
                                        {selectedProducts.length === 0 && (
                                            <div className="text-center py-16 border-2 border-dashed border-slate-50 rounded-[2.5rem]">
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">Cart is currently empty</p>
                                            </div>
                                        )}
                                        {selectedProducts.map(item => (
                                            <div key={item.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <p className="text-[11px] font-black text-slate-950 uppercase tracking-tight truncate">{item.name}</p>
                                                    <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5">{formatPrice(item.price)} PER UNIT</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-3 bg-white rounded-lg px-2 py-1 shadow-sm border border-slate-50">
                                                        <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors font-black">-</button>
                                                        <span className="text-xs font-black text-slate-950 min-w-[20px] text-center">{item.quantity}</span>
                                                        <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors font-black">+</button>
                                                    </div>
                                                    <button type="button" onClick={() => removeProduct(item.id)} className="w-9 h-9 flex items-center justify-center bg-white text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-10 py-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Final Settlement</span>
                            <span className="text-3xl font-black text-slate-950 tracking-tighter leading-none">{formatPrice(total)}</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-rose-500 transition-all pr-4"
                            >
                                Void Order
                            </button>
                            <button
                                type="submit"
                                disabled={loading || selectedProducts.length === 0 || !customerName.trim()}
                                className="px-10 py-3.5 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 active:scale-95 disabled:opacity-20 disabled:grayscale transition-all shadow-2xl flex items-center gap-4"
                            >
                                <CheckCircle className="w-4 h-4" />
                                {loading ? 'UPDATING...' : 'Record Transaction'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FilterChip({ label, active = false, count, onClick }: { label: string; active?: boolean; count?: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}>
            {label} {count && <span className={`ml-1 ${active ? 'text-primary' : 'text-slate-300'}`}>({count})</span>}
        </button>
    );
}
