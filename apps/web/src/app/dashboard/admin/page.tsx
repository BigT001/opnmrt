'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function AdminOverview() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('admin/stats');
                setStats(response.data);
            } catch (err) {
                console.error('Failed to fetch admin stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-10 bg-slate-800 rounded-xl w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-800 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Sellers" value={stats?.totalSellers || 0} icon="👨‍💼" color="indigo" />
                <StatCard label="Active Buyers" value={stats?.totalBuyers || 0} icon="👥" color="emerald" />
                <StatCard label="Global Orders" value={stats?.totalOrders || 0} icon="📦" color="amber" />
                <StatCard label="Total Revenue" value={`$${Number(stats?.totalRevenue || 0).toLocaleString()}`} icon="💰" color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Placeholder for Growth Chart */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-lg font-bold text-white tracking-tight">Platform Growth</h3>
                        <div className="flex space-x-2">
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-lg uppercase tracking-widest">Revenue</span>
                            <span className="px-3 py-1 bg-slate-800 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-widest">Orders</span>
                        </div>
                    </div>
                    <div className="h-64 flex flex-col justify-end space-y-4">
                        <div className="flex items-end space-x-4 h-full px-2">
                            {[40, 65, 45, 90, 70, 85, 100].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.1, duration: 1 }}
                                    className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg relative group"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}%
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter pt-4 border-t border-slate-800">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Activity Feed */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col">
                    <h3 className="text-lg font-bold text-white tracking-tight mb-8">System Activity</h3>
                    <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
                        <ActivityItem icon="🎊" title="New Seller Registered" desc="EcoThreads Store just joined the platform" time="2 mins ago" />
                        <ActivityItem icon="💳" title="New Payment Received" desc="Order #4928 successfully processed" time="15 mins ago" />
                        <ActivityItem icon="👤" title="New Buyer" desc="samuel@gmail.com verified their account" time="45 mins ago" />
                        <ActivityItem icon="⚙️" title="System Update" desc="Platform migrated to high-availability cluster" time="2 hours ago" />
                    </div>
                </div>
            </div>

            {/* Server Status Indicators */}
            <div className="bg-indigo-600 py-4 px-10 rounded-2xl flex items-center justify-between shadow-lg shadow-indigo-900/20 ring-1 ring-white/10">
                <div className="flex items-center space-x-3">
                    <span className="text-xl">✨</span>
                    <span className="text-sm font-bold text-white">AI Engine currently optimizing search results for all 128 active storefronts.</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-900 bg-white px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                    View Logs
                </button>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
    const colors: any = {
        indigo: 'from-indigo-600/20 text-indigo-400 border-indigo-500/20',
        emerald: 'from-emerald-600/20 text-emerald-400 border-emerald-500/20',
        amber: 'from-amber-600/20 text-amber-400 border-amber-500/20',
        rose: 'from-rose-600/20 text-rose-400 border-rose-500/20',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-slate-900 border ${colors[color].split(' ')[2]} rounded-3xl p-8 relative overflow-hidden group shadow-xl`}
        >
            <div className={`absolute -right-4 -bottom-4 text-6xl opacity-10 transition-transform group-hover:scale-125 duration-500`}>
                {icon}
            </div>
            <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${colors[color].split(' ')[1]}`}>{label}</span>
                </div>
                <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
            </div>
        </motion.div>
    );
}

function ActivityItem({ icon, title, desc, time }: { icon: string; title: string; desc: string; time: string }) {
    return (
        <div className="flex items-start space-x-4 border-l-2 border-slate-800 pl-4 py-1 hover:border-indigo-500 transition-colors">
            <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-sm shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-bold text-slate-200 truncate">{title}</h4>
                    <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap ml-2">{time}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate">{desc}</p>
            </div>
        </div>
    );
}
