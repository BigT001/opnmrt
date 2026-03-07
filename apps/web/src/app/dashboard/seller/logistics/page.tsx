'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Search, Package, Navigation, Activity, ChevronRight, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

export default function LogisticsHubPage() {
    const { store } = useAuthStore();
    const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]);
    const [dispatchCompanies, setDispatchCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActiveDeliveries = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('dispatch/store/active');
            setActiveDeliveries(data || []);
        } catch (error) {
            console.error('Failed to fetch active deliveries', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveDeliveries();
    }, []);

    // We derive dynamic stats
    const statsInfo = {
        totalSpent: activeDeliveries.filter((d: any) => d.status === 'DELIVERED').reduce((acc, d) => acc + Number(d.deliveryFee), 0),
        completedDeliveries: activeDeliveries.filter((d: any) => d.status === 'DELIVERED').length,
        activeRuns: activeDeliveries.filter((d: any) => d.status !== 'DELIVERED' && d.status !== 'CANCELLED').length,
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Logistics Hub</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Delivery Management & Dispatch Radar</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex gap-4">
                    <button className="h-12 px-6 bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Edit Address
                    </button>
                    <button className="h-12 px-8 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-2">
                        <Navigation className="w-4 h-4" /> Request Rider
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Runs</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{statsInfo.activeRuns}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Delivered</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{statsInfo.completedDeliveries}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <Package className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Spent on Delivery</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatPrice(statsInfo.totalSpent)}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Active Deliveries */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase relative">
                            Live Fleet
                            <span className="absolute -top-1 -right-3 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {loading && activeDeliveries.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-sm font-black uppercase tracking-widest">Loading fleet data...</div>
                        ) : activeDeliveries.filter(d => d.status !== 'DELIVERED').map((task) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={task.id}
                                className="bg-white border border-slate-100 rounded-3xl p-6 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm group"
                            >
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${task.status === 'IN_TRANSIT' ? 'bg-indigo-50 text-indigo-500' : 'bg-orange-50 text-orange-500'}`}>
                                                <Navigation size={14} className={task.status === 'IN_TRANSIT' ? 'animate-pulse' : ''} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order {task.orderId.slice(-6)}</p>
                                                <p className="text-sm font-black text-slate-900">{task.order?.customerName || 'Customer'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 border-l-2 border-slate-100 pl-3 ml-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full border border-slate-300" />
                                                Pickup: {task.pickupAddress}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-900">
                                                <MapPin size={12} className="text-emerald-500" />
                                                Dropoff: {task.dropoffAddress}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 bg-slate-50/50 sm:bg-transparent rounded-2xl p-4 sm:p-0">
                                    <div className="text-right w-full sm:w-auto">
                                        <div className="flex justify-between sm:justify-end items-center mb-1">
                                            <span className="sm:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status:</span>
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ${task.status === 'IN_TRANSIT' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
                                                }`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between sm:justify-end items-center">
                                            <span className="sm:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dispatcher:</span>
                                            <div className="flex items-center gap-2">
                                                {task.dispatch?.logo && (
                                                    <img src={task.dispatch.logo} alt="" className="w-5 h-5 rounded-full object-cover border border-slate-100" />
                                                )}
                                                <p className="text-[11px] font-bold text-slate-500 uppercase">{task.dispatch?.companyName || 'Looking for Rider'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between sm:justify-end items-center w-full">
                                        <span className="sm:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fee:</span>
                                        <p className="text-lg font-black text-slate-900">{formatPrice(Number(task.deliveryFee))}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {!loading && activeDeliveries.filter(d => d.status !== 'DELIVERED').length === 0 && (
                            <div className="py-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Truck className="w-6 h-6 text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">No active deliveries</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Request a rider to get started</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Local Dispatchers Directory */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase relative">
                        Local Dispatchers
                    </h2>

                    <div className="bg-white border border-slate-100 rounded-3xl p-2 shadow-sm space-y-1">
                        {/* Mock directory until directory API exists */}
                        {[
                            { id: 1, name: 'Flash Riders Logistics', rating: 4.8, vehicles: 'Bikes, Vans', baseFee: 1500, state: 'Lagos' },
                            { id: 2, name: 'Swift Move', rating: 4.5, vehicles: 'Bikes', baseFee: 1200, state: 'Lagos' },
                            { id: 3, name: 'Eagle Delivery Co', rating: 4.9, vehicles: 'Vans', baseFee: 5000, state: 'Abuja' }
                        ].map((company) => (
                            <div key={company.id} className="p-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{company.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold text-amber-500 flex items-center">
                                            ★ {company.rating}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">{company.vehicles}</span>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <div>
                                        <p className="text-xs font-black text-slate-900">{formatPrice(company.baseFee)}</p>
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Base Rate</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            </div>
                        ))}

                        <button className="w-full mt-2 py-4 text-center text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-colors">
                            Browse All Local Riders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
