'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export function AppifyNotification() {
    const { notification, error, clearNotification } = useCartStore();

    return (
        <AnimatePresence>
            {(notification || error) && (
                <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[3000] w-fit pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: -40, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -40, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className={`pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] border ${error
                                ? 'bg-[#ff4d4d] border-white/20 text-white'
                                : 'bg-[#0a0a0a] border-white/10 text-white'
                            }`}
                    >
                        <div className={`shrink-0 flex items-center justify-center ${error ? 'text-white' : 'text-orange-500'
                            }`}>
                            {error ? <X className="w-5 h-5" /> : <Check className="w-5 h-5 stroke-[3]" />}
                        </div>

                        <span className="text-[12px] font-black uppercase tracking-wider whitespace-nowrap">
                            {error || notification}
                        </span>

                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <button
                            onClick={clearNotification}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors pointer-events-auto"
                        >
                            <X className="w-4 h-4 text-white/40" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
