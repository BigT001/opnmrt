'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface UserMenuProps {
    user: any;
    store: any;
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

export function UserMenu({ user, store, isOpen, onClose, onLogout }: UserMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[999]" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[1000] overflow-hidden"
                    >
                        <div className="p-6 pb-4 border-b border-slate-50">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden shadow-inner">
                                    {store?.logo ? (
                                        <img src={store.logo} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-black text-slate-900 truncate">{user?.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user?.email}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</span>
                                <span className="text-[9px] font-black bg-primary text-white px-2 py-0.5 rounded-full">{store?.plan || 'FREE'}</span>
                            </div>
                        </div>

                        <div className="p-2">
                            <MenuLink icon="👤" label="My Profile" href="/dashboard/seller/settings" onClick={onClose} />
                            <MenuLink icon="⚙️" label="Store Settings" href="/dashboard/seller/settings" onClick={onClose} />
                            <MenuLink icon="🎨" label="Themes & UI" href="/dashboard/seller/themes" onClick={onClose} />
                            <div className="my-2 h-px bg-slate-50 mx-2" />
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center space-x-3 p-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                            >
                                <span className="text-lg">🚪</span>
                                <span>Logout Session</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function MenuLink({ icon, label, href, onClick }: { icon: string; label: string; href: string; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center space-x-3 p-3 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm"
        >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
        </Link>
    );
}
