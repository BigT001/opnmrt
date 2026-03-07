'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { Package, DollarSign, Clock, MapPin, CheckCircle2, Navigation, Loader2, Users, Search, X, Check, ArrowRight, UserPlus, Info } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function DispatchDashboardPage() {
    const { user } = useAuthStore();

    const [radarTasks, setRadarTasks] = useState<any[]>([]);
    const [activeTasks, setActiveTasks] = useState<any[]>([]);
    const [riders, setRiders] = useState<any[]>([]);
    const [stats, setStats] = useState({ completedToday: 0, todayEarnings: 0, totalEarnings: 0 });
    const [loading, setLoading] = useState(true);

    const [assigningTaskId, setAssigningTaskId] = useState<string | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [radarRes, activeRes, statsRes, ridersRes] = await Promise.all([
                api.get('dispatch/radar'),
                api.get('dispatch/active'),
                api.get('dispatch/stats/earnings'),
                api.get('dispatch/riders')
            ]);
            setRadarTasks(radarRes.data || []);
            setActiveTasks(activeRes.data || []);
            setStats(statsRes.data || { completedToday: 0, todayEarnings: 0, totalEarnings: 0 });
            setRiders(ridersRes.data || []);
        } catch (error) {
            console.error('Failed to fetch dispatch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAcceptJob = async (taskId: string) => {
        try {
            await api.patch(`dispatch/task/${taskId}/accept`);
            toast.success('Job accepted! You can now assign a rider.');
            fetchData();
        } catch (error) {
            toast.error('Could not accept job.');
        }
    };

    const handleAssignRider = async (riderId: string) => {
        if (!assigningTaskId) return;
        try {
            await api.patch(`dispatch/task/${assigningTaskId}/assign`, { riderId });
            toast.success('Rider assigned successfully');
            setIsAssignModalOpen(false);
            fetchData();
        } catch (err) {
            toast.error('Failed to assign rider');
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-900">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Logistics Hub</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
                        {user?.dispatchProfile?.companyName || 'Hub Dashboard'} <span className="text-slate-700">/</span> Overview
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <MetricMini icon={<Navigation size={14} />} label="Active" value={activeTasks.length} />
                    <MetricMini icon={<CheckCircle2 size={14} />} label="Today" value={stats.completedToday} />
                    <MetricMini icon={<Users size={14} />} label="Riders" value={riders.length} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: New Requests */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">New Delivery Requests</h2>
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live Updates</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading && radarTasks.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center bg-slate-900/40 border border-slate-800 rounded-[2rem]">
                                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Checking for requests...</p>
                            </div>
                        ) : radarTasks.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center bg-slate-900/20 border border-slate-900 border-dashed rounded-[2rem]">
                                <Package className="w-10 h-10 text-slate-800 mb-4" />
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No new requests available</p>
                            </div>
                        ) : radarTasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-600 shrink-0">
                                        <Package size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-white">{task.order?.store?.name || 'Private Store'}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                            <span>{task.pickupAddress.split(',')[0]}</span>
                                            <ArrowRight size={10} />
                                            <span className="text-slate-400">{task.dropoffAddress.split(',')[0]}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 md:pl-6 md:border-l border-slate-800">
                                    <div className="text-right">
                                        <p className="text-xl font-black text-white">{formatPrice(Number(task.deliveryFee))}</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Fee</p>
                                    </div>
                                    <button
                                        onClick={() => handleAcceptJob(task.id)}
                                        className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                    >
                                        Accept Job
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Active Deliveries */}
                <div className="lg:col-span-4 space-y-6">
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Currently In Transit</h2>

                    <div className="space-y-4">
                        {activeTasks.length === 0 ? (
                            <div className="bg-slate-900/30 border border-slate-800/50 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                                <Clock size={24} className="text-slate-800 mb-4" />
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No active deliveries</p>
                            </div>
                        ) : activeTasks.map((task) => (
                            <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-5 space-y-4 hover:border-slate-700 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Order ID: #{task.id.slice(-6).toUpperCase()}</p>
                                        <h4 className="text-sm font-bold text-white truncate max-w-[150px]">{task.order?.store?.name || 'Private'}</h4>
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${task.status === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        task.status === 'AT_PICKUP' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        }`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-slate-800/60">
                                    {task.rider ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                                                    <Users size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Assigned Rider</p>
                                                    <p className="text-[11px] font-bold text-white">{task.rider.name}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setAssigningTaskId(task.id);
                                                    setIsAssignModalOpen(true);
                                                }}
                                                className="text-[9px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setAssigningTaskId(task.id);
                                                setIsAssignModalOpen(true);
                                            }}
                                            className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center gap-2 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all font-black text-[9px] uppercase tracking-widest"
                                        >
                                            <UserPlus size={14} />
                                            Assign a Rider
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Rider Assignment Modal */}
            <AnimatePresence>
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAssignModalOpen(false)}
                            className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Assign Rider</h3>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Select from your registered fleet</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAssignModalOpen(false)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                    {riders.filter(r => r.status === 'ACTIVE').length > 0 ? (
                                        riders.filter(r => r.status === 'ACTIVE').map((rider) => (
                                            <button
                                                key={rider.id}
                                                onClick={() => handleAssignRider(rider.id)}
                                                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all group text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-emerald-500">
                                                        <Users size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{rider.name}</p>
                                                        <p className="text-[9px] font-medium text-slate-500 uppercase">{rider.vehicleType} • {rider.staffId || 'ID: 000'}</p>
                                                    </div>
                                                </div>
                                                <Check size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center space-y-4">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No active riders available</p>
                                            <Link href="/dashboard/dispatch/riders" onClick={() => setIsAssignModalOpen(false)} className="text-[9px] font-black text-emerald-500 underline uppercase tracking-widest">
                                                Manage Your Fleet
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MetricMini({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="text-slate-500">{icon}</div>
            <div className="hidden sm:block">
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-[12px] font-black text-white tracking-tight leading-none">{value}</p>
            </div>
        </div>
    );
}
