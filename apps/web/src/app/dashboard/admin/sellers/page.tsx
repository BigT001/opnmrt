'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminSellers() {
    const router = useRouter();
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await api.get('admin/sellers');
                setSellers(response.data);
            } catch (err) {
                console.error('Failed to fetch sellers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSellers();
    }, []);

    if (loading) {
        return <div className="animate-pulse text-indigo-400 font-bold">Accessing Global Seller Ledger...</div>;
    }

    return (
        <div className="space-y-4">

            <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-800/50">
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Merchant / Store</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Type</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Inventory</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Sales</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {sellers.map((seller: any) => (
                            <tr
                                key={seller.id}
                                onClick={() => router.push(`/dashboard/admin/sellers/${seller.id}`)}
                                className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-4 border-none outline-none">
                                        <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 font-black text-lg border border-indigo-500/20 shadow-inner overflow-hidden">
                                            {seller.managedStore?.logo ? (
                                                <img src={seller.managedStore.logo} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                seller.name?.charAt(0) || 'S'
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">{seller.name}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                                                {seller.managedStore?.name || 'No Store Assigned'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${seller.managedStore?.plan === 'PAID'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                                        }`}>
                                        {seller.managedStore?.plan || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-slate-300">{seller.managedStore?._count?.products || 0}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Active SKUs</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-indigo-400">{seller.managedStore?._count?.orders || 0}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Total Orders</p>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Active</span>
                                        </div>
                                        <div className="p-2 text-slate-500 group-hover:text-indigo-400 transition-colors bg-slate-800/50 rounded-lg border border-slate-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {sellers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest">
                                    No merchants currently registered on the platform.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
