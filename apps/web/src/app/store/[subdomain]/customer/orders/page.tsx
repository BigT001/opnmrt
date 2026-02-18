'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, ChevronRight, Clock, CreditCard, AlertCircle, CheckCircle2, ShoppingBag, ArrowLeft, MessagesSquare } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreCart } from '@/store/useStoreCart';
import { useChatStore } from '@/store/useChatStore';

export default function CustomerOrdersPage() {
    const { subdomain } = useParams<{ subdomain: string }>();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [retryingPayment, setRetryingPayment] = useState<string | null>(null);

    // Integrated Action State
    const { toggleCart, totalCount: itemCount } = useStoreCart();
    const { toggleDrawer: toggleChat, unreadCount } = useChatStore();

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
        router.push(`/store/${subdomain}/checkout?orderId=${orderId}`);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PENDING':
                return {
                    label: 'Awaiting Payment',
                    className: 'bg-orange-50 text-orange-600 border-orange-100',
                    icon: AlertCircle,
                    color: '#f97316'
                };
            case 'PAID':
            case 'COMPLETED':
                return {
                    label: 'Paid & Confirmed',
                    className: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                    icon: CheckCircle2,
                    color: '#10b981'
                };
            case 'SHIPPED':
                return {
                    label: 'On Its Way',
                    className: 'bg-blue-50 text-blue-600 border-blue-100',
                    icon: Package,
                    color: '#3b82f6'
                };
            default:
                return {
                    label: status,
                    className: 'bg-slate-50 text-slate-500 border-slate-100',
                    icon: Clock,
                    color: '#64748b'
                };
        }
    };

    if (loading) {
        return (
            <div className="space-y-4 px-6 pt-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fb]">
            {/* Autonomous Immersive Header */}
            <div className="sticky top-0 z-[150] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 pt-2 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[34px] font-black text-[#1a1a2e] tracking-tighter leading-none mb-1">My Orders</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-0.5 leading-none">Management Dashboard</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleChat}
                            className="w-15 h-15 rounded-[24px] bg-white border border-gray-100 flex items-center justify-center text-orange-500 relative shadow-2xl shadow-orange-500/15 active:scale-95 transition-all"
                        >
                            <MessagesSquare className="w-7.5 h-7.5" />
                            {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-lg">{unreadCount}</span>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6">

                {orders.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-[35px] flex items-center justify-center text-gray-200">
                            <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#1a1a2e] uppercase italic tracking-tighter">No orders yet</h3>
                            <p className="text-[12px] font-bold text-gray-400 max-w-[200px] mx-auto leading-relaxed mt-2 uppercase tracking-wide">
                                Start your style journey today.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push(`/store/${subdomain}/shop`)}
                            className="bg-[#0a0a0a] text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all active:scale-95"
                        >
                            Explore Shop
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orders.map((order, idx) => {
                            const config = getStatusConfig(order.status);
                            const isPending = order.status === 'PENDING';

                            return (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="group relative bg-white border border-gray-100 rounded-[35px] p-5 cursor-pointer hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-400 overflow-hidden active:scale-[0.98]"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm shrink-0 ${isPending ? 'bg-orange-50 border-orange-100 text-orange-500' : 'bg-gray-50 border-gray-100 text-gray-400'
                                                    }`}>
                                                    <config.icon className="w-7 h-7" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1 leading-none">Transaction ID</p>
                                                    <h3 className="text-[17px] font-black text-[#1a1a2e] tracking-tighter truncate leading-none">#{order.id.slice(-8).toUpperCase()}</h3>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border mb-2 inline-block ${config.className}`}>
                                                    {config.label}
                                                </div>
                                                <p className="text-[20px] font-black text-[#1a1a2e] tracking-tighter leading-none">₦{Number(order.totalAmount).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                            <span>{order.items?.length || 0} Products</span>
                                        </div>

                                        {isPending && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCompletePayment(order.id);
                                                }}
                                                className="w-full max-w-[280px] py-4.5 bg-orange-500 text-white rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-1"
                                            >
                                                <CreditCard className="w-5 h-5" />
                                                Complete Payment
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Order Details 'Slide-Over' View */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] flex justify-end"
                    >
                        {/* Blur Backdrop - Total Immersion Mask */}
                        <div
                            className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-3xl"
                            onClick={() => setSelectedOrder(null)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                            className="relative w-full sm:max-w-xl h-full bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col"
                        >
                            {/* Sticky Drawer Header - Professional & Functional */}
                            <div className="px-6 pt-12 pb-6 flex items-center gap-6 bg-white border-b border-gray-50">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1a1a2e] active:scale-90 transition-all border border-gray-100 shadow-sm"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Order Details</p>
                                    <h2 className="text-xl font-black text-[#1a1a2e] tracking-tight">#{selectedOrder.id.slice(-8).toUpperCase()}</h2>
                                </div>
                                <div className={`px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border ${getStatusConfig(selectedOrder.status).className}`}>
                                    {getStatusConfig(selectedOrder.status).label}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
                                <div className="space-y-6">
                                    {/* Order Summary Row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-[2rem] bg-gray-50/50 border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Items</p>
                                            <p className="text-sm font-black text-[#1a1a2e]">{selectedOrder.items?.length || 0} Products</p>
                                        </div>
                                        <div className="p-4 rounded-[2rem] bg-gray-50/50 border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                            <p className="text-sm font-black text-[#1a1a2e]">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a2e] pl-2 drop-shadow-sm">Basket Content</h4>
                                        {selectedOrder.items?.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-4 p-3.5 rounded-[2rem] bg-white border border-gray-100 shadow-sm transition-all">
                                                <div className="w-16 h-16 bg-gray-50 rounded-[1.25rem] overflow-hidden border border-gray-50 shrink-0">
                                                    {item.product?.images?.[0] ? (
                                                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-200"><Package className="w-6 h-6" /></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-[13px] font-black text-[#1a1a2e] leading-tight mb-0.5 truncate">{item.product?.name || 'Unknown Item'}</h5>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Qty: {item.quantity} × ₦{Number(item.price).toLocaleString()}</p>
                                                </div>
                                                <p className="text-[14px] font-black text-[#1a1a2e] tracking-tight shrink-0">₦{(Number(item.price) * item.quantity).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Summary Bottom - Optimized pb to clear Global Bottom Nav */}
                            <div className="p-6 pb-32 border-t border-gray-100 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Purchase</span>
                                    <span className="text-2xl font-black text-[#1a1a2e] tracking-tighter">₦{Number(selectedOrder.totalAmount).toLocaleString()}</span>
                                </div>

                                {selectedOrder.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleCompletePayment(selectedOrder.id)}
                                        className="w-full py-4.5 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.75rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        Complete Payment
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
