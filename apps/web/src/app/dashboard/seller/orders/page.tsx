'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Order {
    id: string;
    createdAt: string;
    totalAmount: string;
    status: string;
    buyer: {
        name: string;
    };
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All Orders');

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
        if (filter === 'All Orders') return true;
        return order.status.toLowerCase() === filter.toLowerCase();
    });

    const counts = {
        'All Orders': orders.length,
        'Processing': orders.filter(o => o.status.toLowerCase() === 'processing').length,
        'Shipped': orders.filter(o => o.status.toLowerCase() === 'shipped').length,
        'Delivered': orders.filter(o => o.status.toLowerCase() === 'delivered' || o.status.toLowerCase() === 'paid').length,
        'Cancelled': orders.filter(o => o.status.toLowerCase() === 'cancelled').length,
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
            <div className="flex items-center space-x-2">
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
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 min-h-[400px]">
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
                                <th className="pb-6 font-bold">Order ID</th>
                                <th className="pb-6 font-bold">Customer</th>
                                <th className="pb-6 font-bold">Date</th>
                                <th className="pb-6 font-bold">Status</th>
                                <th className="pb-6 font-bold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-bold text-slate-900">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-t border-slate-50 group hover:bg-slate-50/50 transition-colors cursor-pointer">
                                    <td className="py-5 font-mono text-xs text-slate-500">
                                        #{order.id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] uppercase">
                                                {order.buyer.name ? order.buyer.name.charAt(0) : 'U'}
                                            </div>
                                            <span>{order.buyer.name || 'Unknown Customer'}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 text-slate-500 font-medium">
                                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${order.status.toLowerCase() === 'processing' || order.status.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600' :
                                            order.status.toLowerCase() === 'shipped' ? 'bg-blue-50 text-blue-600' :
                                                order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                    'bg-red-50 text-red-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-5 text-right font-black text-slate-950">
                                        {formatPrice(Number(order.totalAmount))}
                                    </td>
                                </tr>
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
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                }`}>
            {label} {count && <span className={`ml-2 ${active ? 'text-primary' : 'text-slate-400'}`}>({count})</span>}
        </button>
    );
}
