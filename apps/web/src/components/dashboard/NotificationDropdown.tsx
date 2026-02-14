'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    title: string;
    message: string;
    icon: string;
    link: string;
    createdAt: string;
}

export function NotificationDropdown({ storeId, isOpen, onClose }: { storeId: string; isOpen: boolean; onClose: () => void }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !storeId) return;

        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/analytics/notifications/${storeId}`);
                setNotifications(res.data);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [isOpen, storeId]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[999]" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-3 w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 z-[1000] overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Alerts</h3>
                            <button className="text-[10px] font-bold text-primary hover:underline">Mark all read</button>
                        </div>

                        <div className="max-h-[450px] overflow-y-auto no-scrollbar pb-4">
                            {loading ? (
                                <div className="p-10 text-center">
                                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing activity...</p>
                                </div>
                            ) : notifications.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {notifications.map((n) => (
                                        <Link
                                            key={n.id}
                                            href={n.link}
                                            onClick={onClose}
                                            className="flex items-start space-x-4 p-5 hover:bg-slate-50 transition-colors group"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                                                {n.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 mb-1">{n.title}</p>
                                                <p className="text-xs text-slate-500 leading-relaxed mb-2">{n.message}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-3xl mb-4">✨</p>
                                    <p className="text-sm font-bold text-slate-900 mb-1">All caught up!</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No new alerts for your store right now.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-5 bg-slate-50/50 border-t border-slate-50">
                            <button className="w-full py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                                View all notifications
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
