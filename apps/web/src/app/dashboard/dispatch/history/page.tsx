'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { MapPin, Navigation, Clock, CheckCircle2, Package, Search, ChevronRight, Loader2, Users, Receipt, Calendar } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function DispatchHistoryPage() {
    const { user } = useAuthStore();
    const [historyTasks, setHistoryTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get('dispatch/history');
            setHistoryTasks(res.data || []);
        } catch (error) {
            console.error('Failed to fetch dispatch history', error);
            setHistoryTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Accessing delivery records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-900/50">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">Delivery Ledger</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3 flex items-center gap-2 italic">
                        <Receipt size={12} className="text-emerald-500/50" />
                        Comprehensive Record of Completed Deliveries
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {historyTasks.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
                        <Receipt className="w-12 h-12 text-slate-800 mb-6" />
                        <h3 className="text-lg font-black text-slate-600 uppercase tracking-tight italic">Registry Empty</h3>
                        <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest mt-2">Completed deliveries will appear here.</p>
                    </div>
                ) : (
                    historyTasks.map((task, idx) => (
                        <div
                            key={task.id}
                            className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 group"
                        >
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center justify-between lg:justify-start lg:gap-6">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${task.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                            }`}>
                                            {task.status}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-slate-600">ID: #{task.id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <Calendar size={12} className="text-slate-700" />
                                        {format(new Date(task.updatedAt), 'MMM dd, yyyy • HH:mm')}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-tight truncate">{task.pickupAddress}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                            <p className="text-[11px] font-black text-white uppercase tracking-tight truncate">{task.dropoffAddress}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800 group-hover:border-emerald-500/20 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-colors shadow-inner">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Personnel Detail</p>
                                            <p className="text-xs font-black text-slate-300 italic uppercase">{task.rider?.name || 'PRIVATE RIDER'}</p>
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-0.5 font-mono">{task.rider?.staffId || 'ID: UNKNOWN'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:border-l border-slate-800 lg:pl-10 text-right flex items-center justify-between lg:block shrink-0 min-w-[200px]">
                                <div className="space-y-1">
                                    <p className="text-3xl font-black text-white tracking-tighter italic font-mono">{formatPrice(Number(task.deliveryFee))}</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Yield Generated</p>
                                </div>
                                <div className="lg:mt-4">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${task.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-950 text-slate-600 border-slate-800'
                                        }`}>
                                        <CheckCircle2 size={12} /> {task.paymentStatus || 'SETTLED'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
