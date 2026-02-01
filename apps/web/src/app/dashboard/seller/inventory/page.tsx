'use client';

import React from 'react';

export default function InventoryPage() {
    const inventory = [
        { sku: 'CLO-WT-001', name: 'Classic White Tee', location: 'Warehouse A', available: 142, incoming: 50, status: 'Healthy' },
        { sku: 'STA-MJ-002', name: 'Minimalist Journal', location: 'Warehouse A', available: 56, incoming: 0, status: 'Healthy' },
        { sku: 'ACC-LK-003', name: 'Leather Keychain', location: 'Warehouse B', available: 0, incoming: 100, status: 'Restocking' },
        { sku: 'ELE-WE-004', name: 'Wireless Earbuds', location: 'Warehouse A', available: 24, incoming: 20, status: 'Low Stock' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory</h1>
                    <p className="text-slate-500 mt-1">Track stock levels and warehouse operations</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        Inventory Audit
                    </button>
                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-900/10">
                        Update Stock
                    </button>
                </div>
            </div>

            {/* Inventory Overview */}
            <div className="bg-[#2D6A4F] rounded-[2.5rem] p-10 text-white flex items-center justify-between">
                <div className="space-y-4">
                    <div className="bg-white/10 w-fit px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Global Status</div>
                    <h2 className="text-4xl font-black">94% Capacity</h2>
                    <p className="opacity-70 text-sm max-w-sm">Inventory is moving efficiently. 4 items currently flagged for low stock levels.</p>
                </div>
                <div className="flex space-x-8">
                    <InvStat label="Total SKUs" value="124" />
                    <InvStat label="Warehouse" value="2" />
                    <InvStat label="Dead Stock" value="0%" />
                </div>
            </div>

            {/* Inventory List */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="pb-6 font-bold">SKU</th>
                            <th className="pb-6 font-bold">Item Name</th>
                            <th className="pb-6 font-bold">Location</th>
                            <th className="pb-6 font-bold">In Stock</th>
                            <th className="pb-6 font-bold">Incoming</th>
                            <th className="pb-6 font-bold text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-bold text-slate-900">
                        {inventory.map((item, idx) => (
                            <tr key={idx} className="border-t border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                <td className="py-5 font-mono text-[10px] text-slate-400">{item.sku}</td>
                                <td className="py-5">{item.name}</td>
                                <td className="py-5 text-slate-500">{item.location}</td>
                                <td className="py-5">{item.available}</td>
                                <td className="py-5 text-emerald-500">+{item.incoming}</td>
                                <td className="py-5 text-right">
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' :
                                            item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' :
                                                'bg-blue-50 text-blue-600'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function InvStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-center">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-black">{value}</p>
        </div>
    );
}
