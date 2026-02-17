'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Sparkles, Zap, Lightbulb, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export function AiAdvisor({ storeId, advices, notifications, onDiscuss }: { storeId: string; advices: string[]; notifications: any[]; onDiscuss: (advice: string) => void }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="bg-white border-l border-slate-100 flex flex-col h-full overflow-hidden">
            {/* Section 1: Actionable Advice - Independent Scroll */}
            <div className="flex-[1.2] flex flex-col min-h-0">
                <div className="p-4 border-b border-slate-100/50 bg-white relative z-20">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-800 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-primary animate-pulse" /> Actionable Advice
                    </h4>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
                    {advices.length === 0 ? (
                        <div className="p-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 m-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Analyzing store trends...</p>
                        </div>
                    ) : (
                        advices.map((advice, i) => (
                            <motion.div
                                key={`advice-${i}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-slate-50/30 border border-slate-100/50 p-4 rounded-xl hover:bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <Lightbulb className="w-3 h-3 text-primary" />
                                </div>
                                <p className="text-[11px] font-bold text-slate-700 leading-snug pr-4">
                                    {advice}
                                </p>
                                <button
                                    onClick={() => onDiscuss(advice)}
                                    className="mt-3 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary hover:text-emerald-600 transition-colors group/btn"
                                >
                                    Discuss with BigT <ArrowRight className="w-2.5 h-2.5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-slate-100" />

            {/* Section 2: Pulse Feed - Independent Scroll */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/20">
                <div className="p-4 border-b border-slate-100/50 bg-white relative z-20">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-800 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-emerald-500" /> Pulse Feed
                    </h4>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar">
                    {notifications.slice(0, 15).map((notif, i) => (
                        <motion.div
                            key={`notif-${i}`}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="group p-3 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 transition-all flex flex-col gap-2 shadow-sm shadow-transparent hover:shadow-slate-200/50"
                        >
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-base shrink-0 group-hover:border-primary/30 transition-all">
                                    {notif.icon || '🔔'}
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex justify-between items-start gap-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-900 truncate">{notif.title}</p>
                                        <span className="text-[7px] font-bold text-slate-300 whitespace-nowrap">
                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-500 leading-tight line-clamp-1">{notif.message}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onDiscuss(`Tell me more about this: ${notif.message}`)}
                                className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-[7px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-all ml-11"
                            >
                                Rub Minds <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
