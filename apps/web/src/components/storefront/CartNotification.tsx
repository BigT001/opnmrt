'use client';

import React, { useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

export function CartNotification() {
    const { notification, error, clearNotification } = useCartStore();

    const show = !!(notification || error);
    const isError = !!error;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -20, x: '-50%' }}
                    className="fixed top-24 left-1/2 z-[100] w-full max-w-md px-4"
                >
                    <div className={`${isError ? 'bg-rose-950 border-rose-500/50' : 'bg-slate-900 border-white/10'} text-white rounded-2xl shadow-2xl p-4 border flex items-center justify-between gap-4 transition-colors`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${isError ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full flex items-center justify-center transition-colors`}>
                                {isError ? (
                                    <X className="w-5 h-5 text-rose-950" />
                                ) : (
                                    <CheckCircle2 className="w-5 h-5 text-slate-900" />
                                )}
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest">{error || notification}</span>
                        </div>
                        <button
                            onClick={clearNotification}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
