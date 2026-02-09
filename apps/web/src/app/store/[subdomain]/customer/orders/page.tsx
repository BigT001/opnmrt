'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Package, ChevronRight, ExternalLink, Clock } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerOrdersPage() {
    const { subdomain } = useParams<{ subdomain: string }>();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await api.get('/orders/my-orders');
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white rounded-[2rem] border border-slate-100"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>
                    <p className="text-slate-500 mt-1">Track and manage your recent purchases</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Package className="w-8 h-8" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">No orders yet</h2>
                    <p className="text-xs text-slate-500 mt-2">When you make a purchase, it will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white rounded-[2.5rem] cursor-pointer p-6 border border-slate-100 hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-200 transition-all group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-sm font-black text-slate-900">Order #{order.id.slice(-8).toUpperCase()}</h3>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                                        <span className="flex items-center gap-1.5 font-bold">
                                            <Clock className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span className="font-bold">{order.items?.length || 0} Items</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-sm font-black text-slate-900">${Number(order.totalAmount).toFixed(2)}</p>
                                </div>
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Details Modal Overlay */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Order Details</span>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${selectedOrder.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">#{selectedOrder.id.toUpperCase()}</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                                {selectedOrder.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-50">
                                        <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0">
                                            {item.product?.images?.[0] ? (
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-6 h-6" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-slate-900">{item.product?.name || 'Unknown Product'}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-100">
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Order Total</span>
                                    <span className="text-2xl font-black text-slate-900">${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
