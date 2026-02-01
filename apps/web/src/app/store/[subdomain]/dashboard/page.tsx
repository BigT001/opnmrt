'use client';

import React from 'react';

export default function BuyerDashboardPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
                <p className="text-gray-500 mt-1 text-sm">Track and manage your purchases in this store.</p>

                <div className="mt-8 overflow-hidden border border-dashed rounded-xl h-40 flex items-center justify-center text-gray-400">
                    No orders found yet. Start shopping!
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-lg mb-2">Total Spent</h3>
                    <p className="text-3xl font-bold text-indigo-600">$0.00</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-lg mb-2">Support</h3>
                    <p className="text-sm text-gray-600 mb-4">Need help with an order? Message the seller.</p>
                    <button className="text-indigo-600 font-bold hover:underline">Start Chat</button>
                </div>
            </div>
        </div>
    );
}
