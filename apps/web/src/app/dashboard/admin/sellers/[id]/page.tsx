'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';

export default function SellerDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [seller, setSeller] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'buyers' | 'products'>('overview');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await api.get(`admin/sellers/${id}`);
                setSeller(response.data);
            } catch (err) {
                console.error('Failed to fetch seller details:', err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetail();
    }, [id]);

    if (loading) return <div className="p-10 text-indigo-400 font-bold animate-pulse">Decrypting Merchant Datastream...</div>;
    if (!seller) return <div className="p-10 text-rose-500">Seller not found.</div>;

    const store = seller.managedStore;

    if (!store) {
        return (
            <div className="p-10 space-y-6">
                <button onClick={() => router.back()} className="px-4 py-2 bg-slate-800 text-white rounded-lg">← Back</button>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
                    <p className="text-xl font-bold text-amber-500">Merchant has no active store setup.</p>
                    <p className="text-slate-500 mt-2">This account exists but hasn't initialized their tenant storefront yet.</p>
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Revenue', value: `$${(store.orders || []).reduce((acc: number, o: any) => acc + Number(o.totalAmount), 0).toLocaleString()}`, icon: '💰' },
        { label: 'Orders', value: store._count?.orders || 0, icon: '📦' },
        { label: 'Buyers', value: (seller.buyers || []).length, icon: '👥' },
        { label: 'Inventory', value: store._count?.products || 0, icon: '🏷️' },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header / HUD */}
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-6">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        ←
                    </button>
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-3xl font-black text-white tracking-tighter">{store.name}</h1>
                            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">
                                {store.plan}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium text-sm mt-1">Managed by {seller.name} • {seller.email}</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <Link
                        href={`http://${store.subdomain}.localhost:3000`}
                        target="_blank"
                        className="px-6 py-2.5 bg-slate-900 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700 hover:bg-slate-800 transition-all"
                    >
                        Visit Storefront
                    </Link>
                    <button className="px-6 py-2.5 bg-rose-600/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500/20 transition-all">
                        Restrict Account
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-2 -bottom-2 text-5xl opacity-5 group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-2xl border border-slate-800 w-fit">
                {['overview', 'orders', 'buyers', 'products'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="min-h-[500px]"
                >
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                                    <h3 className="text-lg font-black text-white mb-8 tracking-tight">Recent Performance</h3>
                                    <div className="h-64 flex items-end space-x-3 px-4">
                                        {[60, 40, 75, 50, 90, 65, 80].map((h, i) => (
                                            <div key={i} className="flex-1 bg-indigo-600/20 rounded-t-xl group relative overflow-hidden border-t border-indigo-500/20">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: i * 0.1, duration: 1 }}
                                                    className="w-full bg-indigo-500 absolute bottom-0"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-6 pt-6 border-t border-slate-800/50">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                                    <h3 className="text-lg font-black text-white mb-6 tracking-tight">Store Logistics</h3>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Subdomain</p>
                                            <p className="text-sm font-bold text-indigo-400">{store.subdomain}.opnmart.com</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Theme</p>
                                            <p className="text-sm font-bold text-white transition-colors">{store.theme || 'DEFAULT'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Joined</p>
                                            <p className="text-sm font-bold text-white transition-colors">{new Date(seller.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">WhatsApp Status</p>
                                            <p className="text-sm font-bold text-emerald-400">{store.useWhatsAppCheckout ? 'Active' : 'Disabled'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                                    <h3 className="text-lg font-black text-white mb-8 tracking-tight">Recent Activity</h3>
                                    <div className="space-y-6">
                                        {store.orders.slice(0, 4).map((order: any, i: number) => (
                                            <div key={i} className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-lg">📦</div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black text-white">Order #{order.id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{order.buyer?.name || 'Guest'}</p>
                                                </div>
                                                <span className="text-[10px] font-black text-emerald-400">${Number(order.totalAmount).toFixed(0)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                    <tr>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Order ID / Date</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Buyer</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Items</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</th>
                                        <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {store.orders.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-white">#{order.id.slice(-8).toUpperCase()}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-slate-300">{order.buyer?.name || 'Guest'}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{order.buyer?.email || 'N/A'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-slate-300">{order.items?.length || 0} product(s)</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-indigo-400">${Number(order.totalAmount).toLocaleString()}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'buyers' && (
                        <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                    <tr>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Buyer Details</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Spent</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Orders</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Activity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {seller.buyers.map((buyer: any) => (
                                        <tr key={buyer.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-6 text-left">
                                                <div className="flex items-center space-x-4 outline-none">
                                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 font-black text-sm border border-slate-700 shadow-inner">
                                                        {buyer.name?.charAt(0) || 'B'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white">{buyer.name || 'Anonymous'}</p>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{buyer.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-indigo-400">
                                                    ${buyer.orders.reduce((acc: number, o: any) => acc + Number(o.totalAmount), 0).toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-slate-300">{buyer.orders.length}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-slate-300">{new Date(buyer.updatedAt).toLocaleDateString()}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {seller.buyers.length === 0 && <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest">No buyers recorded for this storefront.</div>}
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {store.products.map((product: any) => (
                                <div key={product.id} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/50 transition-all">
                                    <div className="aspect-square bg-slate-800 rounded-2xl mb-4 overflow-hidden shadow-inner border border-slate-700">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600 font-black">NO IMAGE</div>
                                        )}
                                    </div>
                                    <h5 className="text-sm font-black text-white mb-1 truncate">{product.name}</h5>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 line-clamp-1">{product.category || 'General'}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-black text-indigo-400">${Number(product.price).toFixed(2)}</span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stock: {product.stock}</span>
                                    </div>
                                </div>
                            ))}
                            {store.products.length === 0 && <div className="col-span-full py-20 text-center text-slate-500 font-bold uppercase tracking-widest">No products in inventory.</div>}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
