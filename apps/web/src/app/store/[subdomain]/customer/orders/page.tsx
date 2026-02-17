'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, ChevronRight, ExternalLink, Clock, CreditCard, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerOrdersPage() {
    const { subdomain } = useParams<{ subdomain: string }>();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [retryingPayment, setRetryingPayment] = useState<string | null>(null);

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

    const handleCompletePayment = async (orderId: string) => {
        setRetryingPayment(orderId);
        // Redirect to checkout with this order
        router.push(`/store/${subdomain}/checkout?orderId=${orderId}`);
    };

    const getStatusConfig = (status: string) => {
        if (status === 'PENDING') {
            return {
                label: 'AWAITING PAYMENT',
                className: 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400',
                badgeColor: 'bg-orange-500'
            };
        } else if (status === 'PAID' || status === 'COMPLETED') {
            return {
                label: 'PAID',
                className: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
                badgeColor: 'bg-emerald-500'
            };
        } else {
            return {
                label: status,
                className: 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400',
                badgeColor: 'bg-slate-400'
            };
        }
    };

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
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Orders</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-widest">
                        Track and manage your recent purchases
                    </p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-20 border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
                        <Package className="w-8 h-8" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">No orders yet</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">When you make a purchase, it will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const isPending = order.status === 'PENDING';

                        return (
                            <div
                                key={order.id}
                                className={`bg-white dark:bg-slate-950 rounded-[2.5rem] p-6 border transition-all duration-300 ${isPending
                                    ? 'border-orange-200 dark:border-orange-900/30 shadow-lg shadow-orange-100 dark:shadow-none'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-none'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div
                                        onClick={() => setSelectedOrder(order)}
                                        className="flex items-center gap-6 flex-1 cursor-pointer"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isPending
                                            ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-500'
                                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500'
                                            }`}>
                                            {isPending ? <AlertCircle className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white">Order #{order.id.slice(-8).toUpperCase()}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusConfig.className}`}>
                                                    {statusConfig.label}
                                                </span>
                                                {isPending && order.retryCount > 0 && (
                                                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                                                        💳 Attempted {order.retryCount + 1}x
                                                    </span>
                                                )}
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

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">₦{Number(order.totalAmount).toLocaleString()}</p>
                                        </div>

                                        {isPending ? (
                                            <button
                                                onClick={() => handleCompletePayment(order.id)}
                                                disabled={retryingPayment === order.id}
                                                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                {retryingPayment === order.id ? 'Loading...' : 'Complete Payment'}
                                            </button>
                                        ) : (
                                            <div
                                                onClick={() => setSelectedOrder(order)}
                                                className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all cursor-pointer"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white dark:bg-slate-950 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden transition-colors duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Order Details</span>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusConfig(selectedOrder.status).className}`}>
                                            {getStatusConfig(selectedOrder.status).label}
                                        </span>
                                        {selectedOrder.status === 'PENDING' && selectedOrder.retryCount > 0 && (
                                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-[8px] font-black uppercase">
                                                Attempted {selectedOrder.retryCount + 1}x
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">#{selectedOrder.id.slice(-8).toUpperCase()}</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                                {selectedOrder.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-800">
                                        <div className="w-16 h-16 bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
                                            {item.product?.images?.[0] ? (
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-6 h-6" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white">{item.product?.name || 'Unknown Product'}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity} × ₦{Number(item.price).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900 dark:text-white">₦{(Number(item.price) * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Order Total</span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">₦{Number(selectedOrder.totalAmount).toLocaleString()}</span>
                                </div>
                            </div>

                            {selectedOrder.status === 'PENDING' && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => handleCompletePayment(selectedOrder.id)}
                                        className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        Complete Payment Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
