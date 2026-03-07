'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, TrendingUp, Calendar, ArrowUpRight,
    ArrowDownLeft, Clock, CheckCircle2, Loader2,
    BarChart3, PieChart
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function EarningsPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            // In a real app, this would be a dedicated ledger/earnings endpoint
            const res = await api.get('dispatch/active');
            // Mocking delivered tasks as history for now
            setHistory(res.data.filter((t: any) => t.status === 'DELIVERED'));
        } catch (error) {
            console.error('Failed to fetch earnings history', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalEarnings = history.reduce((acc, curr) => acc + Number(curr.deliveryFee), 0);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compiling Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">Earnings & Ledger</h1>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">
                    Financial performance and payout history
                </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={formatPrice(totalEarnings)}
                    icon={<DollarSign className="text-emerald-400" />}
                    detail="All-time earnings"
                />
                <StatCard
                    title="Completed Jobs"
                    value={history.length}
                    icon={<CheckCircle2 className="text-blue-400" />}
                    detail="Successfully delivered"
                />
                <StatCard
                    title="Pending Settlement"
                    value={formatPrice(0)}
                    icon={<Clock className="text-amber-400" />}
                    detail="Available for withdrawal"
                />
            </div>

            {/* Main Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
                            <BarChart3 size={18} />
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Transaction History</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/50">
                                <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Vendor</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Reference</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">No financial history yet</p>
                                    </td>
                                </tr>
                            ) : history.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-black text-white uppercase">{format(new Date(item.updatedAt), 'MMM dd, yyyy')}</p>
                                        <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase">{format(new Date(item.updatedAt), 'HH:mm')}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-tight">{item.order?.store?.name || 'Local Store'}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-[10px] font-mono text-slate-500 uppercase">TXN_{item.id.slice(-8).toUpperCase()}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-black text-emerald-400 tracking-tight">+{formatPrice(Number(item.deliveryFee))}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                                            SETTLED
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, detail }: any) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                {icon}
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{title}</p>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-4">{value}</h3>
            <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{detail}</p>
            </div>
        </div>
    );
}
