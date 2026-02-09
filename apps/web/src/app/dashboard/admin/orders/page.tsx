'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('admin/orders');
                setOrders(response.data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="animate-pulse text-indigo-400 font-bold">Synchronizing Global Transaction Hub...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-800/50">
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Order ID / Date</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Merchant</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Buyer</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Amount</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {orders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black text-white">#{order.id.slice(-8).toUpperCase()}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-slate-300">{order.store?.name || 'Unknown Store'}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{order.store?.subdomain}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-slate-300">{order.buyer?.name || 'Buyer'}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{order.buyer?.email}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black text-emerald-400">${Number(order.totalAmount).toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Paid via Paystack</p>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${order.status === 'PAID' || order.status === 'COMPLETED'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : order.status === 'PENDING'
                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest">
                        No transactions found on the platform yet
                    </div>
                )}
            </div>
        </div>
    );
}
