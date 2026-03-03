'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '@/hooks/useSocket';
import { useAuthStore } from '@/store/useAuthStore';

interface Notification {
    id: string;
    title: string;
    message: string;
    icon: string;
    link: string;
    createdAt: string;
}

export function NotificationDropdown({ storeId, isOpen, onClose }: { storeId: string; isOpen: boolean; onClose: () => void }) {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket(user?.id, storeId);

    const fetchNotifications = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const res = await api.get(`/analytics/notifications/${storeId}`);
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!storeId || !isOpen) return;
        fetchNotifications();
    }, [isOpen, storeId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('notification_received', () => {
            console.log('[REALTIME] New activity detected, syncing dropdown...');
            fetchNotifications(true);
        });

        return () => {
            socket.off('notification_received');
        };
    }, [socket]);

    const handleNotificationClick = (link: string) => {
        if (link && link !== '#') {
            console.log('[NAV] Redirecting to:', link);
            // We use window.location.href to force a direct navigation that persists after unmount
            window.location.href = link;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Dark Overlay for closing */}
                    <div className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-x-4 bottom-10 sm:bottom-auto sm:top-20 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] bg-white rounded-[3.5rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.3)] border border-slate-100 z-[1000] overflow-hidden flex flex-col max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-8 pb-6 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2.5 mb-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" />
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Activity Feed</h3>
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-5">Global Stream Events</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-[1.75rem] bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 transform active:scale-90"
                            >
                                <span className="text-2xl font-light">✕</span>
                            </button>
                        </div>

                        {/* Notifications List - Explicitly scrollable with standard classes */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-4 scrollbar-hide">
                            {loading ? (
                                <div className="p-24 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mb-4" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing Engine...</p>
                                </div>
                            ) : notifications.length > 0 ? (
                                <div className="space-y-1">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => handleNotificationClick(n.link)}
                                            className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-[2rem] transition-all cursor-pointer group active:bg-slate-100 border border-transparent hover:border-slate-100/50"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                                                {n.icon}
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{n.title}</p>
                                                    <span className="text-[10px] text-slate-200 font-bold opacity-30">//</span>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 pr-4 font-medium italic transition-colors group-hover:text-slate-800">
                                                    "{n.message}"
                                                </p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-3 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all opacity-20 group-hover:opacity-100" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-24 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-4xl mb-6 mx-auto border border-slate-100 opacity-40">🚥</div>
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2">Workspace Quiet</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-relaxed max-w-[200px] mx-auto">All system signals are clear and synced.</p>
                                </div>
                            )}
                        </div>

                        {/* Extra Padding for better feel */}
                        <div className="h-8 bg-white shrink-0" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
