'use client';

import React from 'react';

export default function CustomersPage() {
    const customers = [
        { name: 'Sarah Jenkins', email: 's.jenkins@gmail.com', orders: 12, totalSpend: '$1,420.00', lastSeen: '2 hours ago' },
        { name: 'Michael Chen', email: 'mchen.tech@outlook.com', orders: 4, totalSpend: '$345.50', lastSeen: '1 day ago' },
        { name: 'Emma Wilson', email: 'emma_wil@icloud.com', orders: 24, totalSpend: '$4,520.20', lastSeen: '3 days ago' },
        { name: 'David Miller', email: 'd.miller@gmail.com', orders: 1, totalSpend: '$45.99', lastSeen: '5 days ago' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customers</h1>
                    <p className="text-slate-500 mt-1">Manage and segment your storefront audience</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-6 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all">
                        Segment with AI
                    </button>
                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-900/10">
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Customer Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <HighlightCard label="Total Customers" value="842" icon="👥" />
                <HighlightCard label="Avg. Order Value" value="$45.80" icon="🛒" />
                <HighlightCard label="Customer LTV" value="$1,290" icon="💎" />
                <HighlightCard label="Retention Rate" value="68%" icon="📈" />
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="pb-6 font-bold">Customer Name</th>
                            <th className="pb-6 font-bold">Orders</th>
                            <th className="pb-6 font-bold">Total Spent</th>
                            <th className="pb-6 font-bold text-right">Last Seen</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-bold text-slate-900">
                        {customers.map((customer, idx) => (
                            <tr key={idx} className="border-t border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                <td className="py-5">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-sm shadow-inner text-slate-400 font-black">
                                            {customer.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p>{customer.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{customer.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 text-slate-600">{customer.orders} orders</td>
                                <td className="py-5 text-primary">{customer.totalSpend}</td>
                                <td className="py-5 text-right text-slate-400 text-xs font-medium">{customer.lastSeen}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function HighlightCard({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                <span className="text-xl grayscale opacity-40">{icon}</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{value}</p>
        </div>
    );
}
