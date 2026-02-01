'use client';

import React from 'react';

export default function OrdersPage() {
    const orders = [
        { id: '#1289', customer: 'Sarah Jenkins', date: 'Oct 24, 2024', status: 'Processing', total: '$120.50' },
        { id: '#1288', customer: 'Michael Chen', date: 'Oct 23, 2024', status: 'Shipped', total: '$85.00' },
        { id: '#1287', customer: 'Emma Wilson', date: 'Oct 23, 2024', status: 'Delivered', total: '$210.20' },
        { id: '#1286', customer: 'David Miller', date: 'Oct 22, 2024', status: 'Processing', total: '$45.99' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Orders</h1>
                    <p className="text-slate-500 mt-1">Manage and track your storefront sales</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        Export CSV
                    </button>
                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-900/10">
                        Create New Order
                    </button>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center space-x-2">
                <FilterChip label="All Orders" active />
                <FilterChip label="Processing" count="12" />
                <FilterChip label="Shipped" count="5" />
                <FilterChip label="Delivered" />
                <FilterChip label="Cancelled" />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="pb-6 font-bold">Order ID</th>
                            <th className="pb-6 font-bold">Customer</th>
                            <th className="pb-6 font-bold">Date</th>
                            <th className="pb-6 font-bold">Status</th>
                            <th className="pb-6 font-bold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-bold text-slate-900">
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                <td className="py-5 font-mono text-xs text-slate-500">{order.id}</td>
                                <td className="py-5">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
                                            {order.customer.charAt(0)}
                                        </div>
                                        <span>{order.customer}</span>
                                    </div>
                                </td>
                                <td className="py-5 text-slate-500">{order.date}</td>
                                <td className="py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${order.status === 'Processing' ? 'bg-amber-50 text-amber-600' :
                                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                                'bg-emerald-50 text-emerald-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-5 text-right">{order.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function FilterChip({ label, active = false, count }: { label: string; active?: boolean; count?: string }) {
    return (
        <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
            }`}>
            {label} {count && <span className={`ml-2 ${active ? 'text-primary' : 'text-slate-400'}`}>({count})</span>}
        </button>
    );
}
