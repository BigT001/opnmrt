'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { MapPin, Navigation, Clock, CheckCircle2, Package, Search, ChevronRight, Loader2, Users, Receipt } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function ActiveDeliveriesPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get('dispatch/active');
            setTasks(res.data || []);
        } catch (error) {
            console.error('Failed to fetch active deliveries', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(task => {
        const matchesSearch =
            task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.order?.store?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.rider?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;
        if (filter === 'ALL') return true;
        return task.status === filter;
    });

    if (loading && tasks.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Synchronizing Fleet Nodes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Fleet Operations</h1>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                        <Navigation size={12} className="text-emerald-500/50" />
                        Monitoring {tasks.length} Live Mission Nodes
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-emerald-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH NODES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-[10px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 w-full md:w-auto overflow-x-auto no-scrollbar">
                        {['ALL', 'ACCEPTED', 'AT_PICKUP', 'IN_TRANSIT'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-white text-slate-950 shadow-xl shadow-white/5' : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredTasks.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center bg-slate-900/40 border border-dashed border-slate-800 rounded-[3rem]">
                        <Package className="w-12 h-12 text-slate-800 mb-6" />
                        <h3 className="text-lg font-black text-slate-600 uppercase tracking-tight italic">Operational Silence</h3>
                        <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest mt-2">No active missions matching current filters.</p>
                    </div>
                ) : (
                    filteredTasks.map((task, idx) => (
                        <Link
                            href={`/dashboard/dispatch/deliveries/${task.id}`}
                            key={task.id}
                            className="block group"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/10 group-hover:bg-emerald-500/40 transition-all" />

                                <div className="flex-1 min-w-0 space-y-6">
                                    <div className="flex items-center justify-between lg:justify-start lg:gap-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                                                <Package className={`w-5 h-5 ${task.status === 'IN_TRANSIT' ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Mission Node</p>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-white font-black text-lg uppercase italic tracking-tight">{task.order?.store?.name || 'PRIVATE STORE'}</h4>
                                                    <span className="text-[10px] font-mono font-bold text-slate-600">#{task.id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lg:ml-auto">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-[0.2em] uppercase border transition-all ${task.status === 'IN_TRANSIT' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                    task.status === 'ACCEPTED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                        'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                                }`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                                <p className="text-[10px] font-bold text-slate-400 truncate uppercase">{task.pickupAddress}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                                                <p className="text-[10px] font-black text-white truncate uppercase">{task.dropoffAddress}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800 group-hover:border-emerald-500/20 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-emerald-500 transition-colors">
                                                <Users size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Personnel</p>
                                                <p className="text-xs font-black text-slate-300 italic uppercase truncate max-w-[120px]">{task.rider?.name || 'UNASSIGNED'}</p>
                                            </div>
                                        </div>

                                        <div className="hidden lg:flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800 group-hover:border-emerald-500/20 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                                                <Clock size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Time Elapsed</p>
                                                <p className="text-xs font-black text-slate-300 italic uppercase">{formatDistanceToNowStrict(new Date(task.createdAt))} ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:border-l border-slate-800 lg:pl-10 text-right flex items-center justify-between lg:block shrink-0 min-w-[180px]">
                                    <div className="space-y-1">
                                        <p className="text-3xl font-black text-white tracking-tighter italic">{formatPrice(Number(task.deliveryFee))}</p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fee Node</p>
                                    </div>
                                    <div className="lg:mt-6">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all ml-auto">
                                            <ChevronRight size={24} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

function formatDistanceToNowStrict(date: Date) {
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}
