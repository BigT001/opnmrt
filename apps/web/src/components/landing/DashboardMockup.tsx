'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, ShoppingCart, Zap, TrendingUp } from 'lucide-react';

export function DashboardMockup() {
    return (
        <div className="w-full aspect-[16/10] bg-slate-900 border border-white/5 flex flex-col overflow-hidden text-left shadow-2xl">
            {/* Sidebar Overlay */}
            <div className="flex h-full">
                <div className="w-16 border-r border-white/5 bg-slate-950 flex flex-col items-center py-6 space-y-8">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg" />
                    <div className="w-8 h-8 bg-white/5 rounded-lg" />
                    <div className="w-8 h-8 bg-white/5 rounded-lg" />
                    <div className="w-8 h-8 bg-white/5 rounded-lg" />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="h-16 border-b border-white/5 px-8 flex items-center justify-between">
                        <div className="w-32 h-4 bg-white/10 rounded-full" />
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-white/5 rounded-full" />
                            <div className="w-24 h-8 bg-emerald-500/20 rounded-lg flex items-center px-3">
                                <div className="w-full h-2 bg-emerald-500/40 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Body */}
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 glass-panel border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                                    <div className="w-8 h-8 bg-white/5 rounded-lg" />
                                    <div className="w-16 h-3 bg-white/10 rounded-full" />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-6 h-64">
                            <div className="col-span-2 glass-panel border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-2">
                                        <div className="w-32 h-4 bg-white/10 rounded-full" />
                                        <div className="w-48 h-6 bg-white/20 rounded-full" />
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="w-16 h-6 bg-emerald-500/20 border border-emerald-500/30 rounded-full" />
                                    </div>
                                </div>
                                {/* Mock Chart Lines */}
                                <div className="absolute inset-x-6 bottom-6 top-24 flex items-end space-x-2">
                                    {[40, 60, 45, 80, 55, 90, 70, 85, 95, 60, 75, 100].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: i * 0.05 }}
                                            className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-500/40 rounded-t-sm"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="glass-panel border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="w-full h-4 bg-white/10 rounded-full" />
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-6 h-6 bg-white/5 rounded-lg" />
                                                    <div className="w-12 h-2 bg-white/10 rounded-full" />
                                                </div>
                                                <div className="w-8 h-2 bg-emerald-500/40 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full h-10 bg-emerald-500 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
