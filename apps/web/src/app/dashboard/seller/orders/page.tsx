'use client';

import React, { useEffect, useState, Fragment } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';
import { Loader2, ChevronDown, ChevronUp, Package, AlertCircle, CheckCircle, XCircle, Clock, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface Order {
    id: string;
    createdAt: string;
    totalAmount: string; // serialized Decimal
    status: string;
    buyer: {
        id: string;
        name: string;
        email: string;
    };
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
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    useEffect(() => {
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

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const s = order.status.toLowerCase();
        if (filter === 'All Orders') return true;

        // Custom mapping for tabs
        if (filter === 'Processing') return ['processing', 'paid', 'pending'].includes(s);
        if (filter === 'Delivered') return ['delivered', 'completed'].includes(s);

        return s === filter.toLowerCase();
    });

    const getCustomerHistory = (currentOrder: Order) => {
        if (!currentOrder.buyer) return [];
        // Find other orders by this buyer
        return orders
            .filter(o => o.buyer?.id === currentOrder.buyer?.id && o.id !== currentOrder.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5); // Show last 5
    };

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const s = status.toLowerCase();
        let styles = 'bg-slate-100 text-slate-600';
        if (s === 'processing' || s === 'pending') styles = 'bg-amber-50 text-amber-600';
        if (s === 'shipped') styles = 'bg-blue-50 text-blue-600';
        if (s === 'paid' || s === 'delivered' || s === 'completed') styles = 'bg-emerald-50 text-emerald-600';
        if (s === 'cancelled') styles = 'bg-red-50 text-red-600';

        return (
            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${styles}`}>
                {status}
            </span>
        );
    };

    const counts = {
        'All Orders': orders.length,
        'Processing': orders.filter(o => ['processing', 'paid', 'pending'].includes(o.status.toLowerCase())).length,
        'Shipped': orders.filter(o => o.status.toLowerCase() === 'shipped').length,
        'Delivered': orders.filter(o => ['delivered', 'completed'].includes(o.status.toLowerCase())).length,
        'Cancelled': orders.filter(o => o.status.toLowerCase() === 'cancelled').length,
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            setLoading(true);
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            // Update local state
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
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Orders</h1>
                    <p className="text-slate-500 mt-1">Manage and track your storefront sales</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        Export CSV
                    </button>
                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-900/10">
                        Create New Order
                    </button>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
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

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 min-h-[400px] overflow-hidden">
                {filteredOrders.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="text-4xl mb-4">📦</div>
                        <p className="font-bold">No orders found</p>
                        <p className="text-sm">When you receive orders, they will appear here.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-6 font-bold pl-4">Order ID</th>
                                <th className="pb-6 font-bold">Customer</th>
                                <th className="pb-6 font-bold">Date</th>
                                <th className="pb-6 font-bold">Status</th>
                                <th className="pb-6 font-bold text-right pr-4">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-bold text-slate-900">
                            {filteredOrders.map((order) => (
                                <Fragment key={order.id}>
                                    <tr
                                        onClick={() => toggleExpand(order.id)}
                                        className={`border-t border-slate-50 group hover:bg-slate-50/50 transition-colors cursor-pointer ${expandedOrderId === order.id ? 'bg-slate-50/80' : ''}`}
                                    >
                                        <td className="py-5 pl-4 font-mono text-xs text-slate-500 flex items-center gap-2">
                                            {expandedOrderId === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                                            #{order.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="py-5">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] uppercase shrink-0">
                                                    {order.buyer?.name ? order.buyer.name.charAt(0) : 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>{order.buyer?.name || 'Unknown Customer'}</span>
                                                    <span className="text-[10px] text-slate-400 font-normal">{order.buyer?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 text-slate-500 font-medium">
                                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="py-5">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="py-5 pr-4 text-right font-black text-slate-950">
                                            {formatPrice(Number(order.totalAmount))}
                                        </td>
                                    </tr>

                                    {/* Expanded Details */}
                                    {expandedOrderId === order.id && (
                                        <tr>
                                            <td colSpan={5} className="p-0">
                                                <div className="bg-slate-50/50 border-b border-slate-100 p-6 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                                        {/* Product Details */}
                                                        <div className="lg:col-span-2 space-y-4">
                                                            <h3 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4 flex items-center gap-2">
                                                                <ShoppingBag className="w-4 h-4" /> Order Items
                                                            </h3>
                                                            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                                                                {order.items.map((item) => (
                                                                    <div key={item.id} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                                                        <div className="w-12 h-12 bg-slate-100 rounded-lg shrink-0 overflow-hidden relative">
                                                                            {item.product?.images?.[0] && (
                                                                                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                                                                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="font-bold text-slate-900">{formatPrice(Number(item.price) * item.quantity)}</p>
                                                                            <p className="text-[10px] text-slate-400">{formatPrice(Number(item.price))} each</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Context / History */}
                                                        <div className="space-y-4">
                                                            <h3 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4 flex items-center gap-2">
                                                                <Clock className="w-4 h-4" /> Customer History
                                                            </h3>
                                                            <div className="bg-white/50 rounded-xl border border-slate-100 p-4 space-y-3">
                                                                {getCustomerHistory(order).length === 0 ? (
                                                                    <p className="text-xs text-slate-400 italic">No other recent orders</p>
                                                                ) : (
                                                                    getCustomerHistory(order).map(hist => (
                                                                        <div key={hist.id} className="flex items-center justify-between text-xs p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className={`w-2 h-2 rounded-full ${hist.status === 'CANCELLED' ? 'bg-red-400' :
                                                                                    hist.status === 'PAID' ? 'bg-emerald-400' : 'bg-slate-300'
                                                                                    }`} />
                                                                                <div className="flex flex-col">
                                                                                    <span className="font-bold text-slate-700">#{hist.id.slice(-6).toUpperCase()}</span>
                                                                                    <span className="text-[10px] text-slate-400">{format(new Date(hist.createdAt), 'MMM dd, HH:mm')}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <p className="font-bold text-slate-900">{formatPrice(Number(hist.totalAmount))}</p>
                                                                                <StatusBadge status={hist.status} />
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                            {getCustomerHistory(order).some(h => h.status === 'CANCELLED') && (
                                                                <div className="bg-amber-50 text-amber-700 text-xs p-3 rounded-lg flex items-start gap-2 border border-amber-100">
                                                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                                    <p>
                                                                        This customer has recent cancelled orders. Check history to contextualize this purchase.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Management Actions */}
                                                        <div>
                                                            <h3 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4 flex items-center gap-2">
                                                                <Package className="w-4 h-4" /> Manage Order
                                                            </h3>
                                                            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
                                                                <p className="text-xs text-slate-500 font-medium">Update Order Status</p>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((action) => (
                                                                        <button
                                                                            key={action}
                                                                            onClick={() => handleStatusUpdate(order.id, action)}
                                                                            disabled={order.status === action}
                                                                            className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${order.status === action
                                                                                ? 'bg-slate-100 text-slate-400 border-transparent cursor-default'
                                                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                                                }`}
                                                                        >
                                                                            {action}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                <p className="text-[10px] text-slate-400 leading-relaxed pt-2">
                                                                    Manually updating the status will notify the customer via email (if configured).
                                                                </p>
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
                )}
            </div>
        </div>
    );
}

function FilterChip({ label, active = false, count, onClick }: { label: string; active?: boolean; count?: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                }`}>
            {label} {count && <span className={`ml-2 ${active ? 'text-primary' : 'text-slate-400'}`}>({count})</span>}
        </button>
    );
}
