'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Cpu, Zap, Search, BarChart3, Sparkles, MessageSquare, Workflow, Layout } from 'lucide-react';

export function FeatureIllustration({ type }: { type: 'ai' | 'arch' | 'ui' }) {
    if (type === 'ai') {
        return (
            <div className="relative w-full aspect-video bg-slate-900 border border-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/5" />
                <div className="relative z-10 w-32 h-32 flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-emerald-500/20 rounded-full"
                    />
                    <Cpu size={64} className="text-emerald-500 animate-pulse" />
                </div>
                <div className="absolute bottom-8 left-8 right-8 flex space-x-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                className="w-full h-full bg-emerald-500/40"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'arch') {
        return (
            <div className="relative w-full aspect-video bg-slate-900 border border-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-500/5" />
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                            className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center"
                        >
                            <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        </motion.div>
                    ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-40 border border-indigo-500/20 rounded-full animate-ping opacity-20" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-video bg-slate-900 border border-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-500/5" />
            <div className="w-48 h-32 glass-panel border border-white/10 rounded-2xl p-4 flex flex-col space-y-4">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="space-y-2">
                    <div className="w-full h-2 bg-white/10 rounded-full" />
                    <div className="w-2/3 h-2 bg-white/10 rounded-full" />
                </div>
                <div className="flex-1 bg-white/5 rounded-lg border border-white/5 border-dashed" />
            </div>
        </div>
    );
}
