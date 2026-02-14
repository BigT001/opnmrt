'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    storeId: string;
}

export function SearchModal({ isOpen, onClose, storeId }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ products: any[], orders: any[], customers: any[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        } else {
            setQuery('');
            setResults(null);
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults(null);
                return;
            }
            setLoading(true);
            try {
                const res = await api.get(`/search/global?storeId=${storeId}&q=${query}`);
                setResults(res.data);
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query, storeId]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-start justify-center pt-20 px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative z-[1000] border border-slate-100"
                    >
                        <div className="p-4 border-b border-slate-50 flex items-center space-x-3">
                            <span className="text-xl">🔍</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products, orders, customers..."
                                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium py-2"
                            />
                            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                                ✕
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto no-scrollbar pb-4 p-2">
                            {loading && (
                                <div className="p-8 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest text-[10px]">
                                    Searching records...
                                </div>
                            )}

                            {!loading && query.length >= 2 && results && (
                                <div className="space-y-6 p-2">
                                    {/* Products */}
                                    {results.products.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Products</p>
                                            <div className="grid grid-cols-1 gap-1">
                                                {results.products.map(p => (
                                                    <Link
                                                        key={p.id}
                                                        href={`/dashboard/seller/products?id=${p.id}`}
                                                        onClick={onClose}
                                                        className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                                                    >
                                                        <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                                            {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{p.category || 'No Category'}</p>
                                                        </div>
                                                        <span className="text-sm font-black text-primary">{formatPrice(Number(p.price))}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Orders */}
                                    {results.orders.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Orders</p>
                                            <div className="grid grid-cols-1 gap-1">
                                                {results.orders.map(o => (
                                                    <Link
                                                        key={o.id}
                                                        href={`/dashboard/seller/orders?id=${o.id}`}
                                                        onClick={onClose}
                                                        className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors"
                                                    >
                                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-lg shrink-0">📦</div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-900 truncate">Order #{o.id.slice(-6).toUpperCase()}</p>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{o.buyer?.name || o.buyer?.email}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-black text-slate-900">{formatPrice(Number(o.totalAmount))}</p>
                                                            <p className={`text-[9px] font-bold px-1.5 rounded-full inline-block ${o.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                                {o.status}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Customers */}
                                    {results.customers.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Customers</p>
                                            <div className="grid grid-cols-1 gap-1">
                                                {results.customers.map(c => (
                                                    <Link
                                                        key={c.id}
                                                        href={`/dashboard/seller/customers?id=${c.id}`}
                                                        onClick={onClose}
                                                        className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors"
                                                    >
                                                        <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                                                            {c.image ? <img src={c.image} alt="" className="w-full h-full object-cover" /> : <span className="text-lg">👤</span>}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-900 truncate">{c.name || 'Anonymous'}</p>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{c.email}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {results.products.length === 0 && results.orders.length === 0 && results.customers.length === 0 && (
                                        <div className="p-8 text-center text-slate-400 italic">
                                            No results found for "{query}"
                                        </div>
                                    )}
                                </div>
                            )}

                            {query.length < 2 && (
                                <div className="p-8 text-center text-slate-400">
                                    <p className="text-lg mb-2">👋</p>
                                    <p className="text-sm font-bold">Start typing to search...</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
