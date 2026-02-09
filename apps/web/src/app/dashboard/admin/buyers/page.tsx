'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function AdminBuyers() {
    const [buyers, setBuyers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const response = await api.get('admin/buyers');
                setBuyers(response.data);
            } catch (err) {
                console.error('Failed to fetch buyers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBuyers();
    }, []);

    if (loading) {
        return <div className="animate-pulse text-indigo-400 font-bold">Scanning Global Buyer Network...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-800/50">
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Buyer Details</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Registration Date</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Orders Handled</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {buyers.map((buyer: any) => (
                            <tr key={buyer.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 font-black text-sm border border-slate-700 shadow-inner">
                                            {buyer.name?.charAt(0) || 'B'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">{buyer.name || 'Incognito User'}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{buyer.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-slate-300">{new Date(buyer.createdAt).toLocaleDateString()}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Verified</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-emerald-400">{buyer.orders?.length || 0}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Total Purchases</p>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authenticated</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
