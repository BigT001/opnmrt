'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Calculator, FileText, Download, Target, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function VatReportPage() {
    const { store } = useAuthStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [calcSubtotal, setCalcSubtotal] = useState<number>(0);

    useEffect(() => {
        if (!store) return;
        fetchOrders();
    }, [store]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('orders/seller');
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const isPro = store?.plan === 'PRO' || store?.plan === 'ENTERPRISE' || store?.plan === 'ASCEND' || store?.plan === 'APEX';

    if (!isPro) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                    <Target className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Ascend Pro Exclusive</h1>
                <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                    VAT compliance, calculation, and advanced reporting are only available on the Ascend Pro plan. Upgrade to unlock this and many other advanced commerce features.
                </p>
                <Link href="/dashboard/seller/settings?tab=payments" className="h-14 px-8 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm tracking-widest uppercase hover:bg-black transition-all shadow-lg shadow-slate-900/20">
                    Upgrade to Pro
                </Link>
            </div>
        );
    }

    const paidOrders = orders.filter(o => ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status));

    const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const totalVatCollected = paidOrders.reduce((sum, order) => sum + Number(order.vatAmount || 0), 0);

    const vatRate = Number((store as any)?.vatRate || 7.5);
    const calcVat = (calcSubtotal * vatRate) / 100;
    const calcTotal = calcSubtotal + calcVat;

    return (
        <div className="space-y-10 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">VAT Reports &amp; Calculator</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your tax compliance and calculate VAT accurately.</p>
                </div>
                {(store as any)?.vatEnabled ? (
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">VAT Collection Active ({vatRate}%)</span>
                    </div>
                ) : (
                    <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-amber-100">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">VAT Collection Paused</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calculator */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mx-20 -my-20 group-hover:bg-indigo-50/50 transition-colors" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Calculator className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Quick VAT Calculator</h2>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Based on {vatRate}% Rate</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Item Subtotal (Excl. VAT)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                                    <input
                                        type="number"
                                        value={calcSubtotal === 0 ? '' : calcSubtotal}
                                        onChange={(e) => setCalcSubtotal(Number(e.target.value))}
                                        className="w-full h-14 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all placeholder:text-slate-300"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">VAT Amount</span>
                                    <span className="font-bold text-indigo-600">{formatPrice(calcVat)}</span>
                                </div>
                                <div className="h-px w-full bg-slate-200" />
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Total Price (Incl. VAT)</span>
                                    <span className="text-2xl font-black text-slate-900">{formatPrice(calcTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Summary */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mx-20 -my-20" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white">VAT Collection Summary</h2>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Lifetime Overview</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <RefreshCw className="w-8 h-8 text-slate-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col justify-center space-y-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total VAT Collected</p>
                                    <p className="text-5xl font-black text-emerald-400 tracking-tighter">
                                        {formatPrice(totalVatCollected)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Gross Revenue</p>
                                        <p className="text-lg font-bold text-white">{formatPrice(totalRevenue)}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Taxable Sales</p>
                                        <p className="text-lg font-bold text-white">{paidOrders.length} Orders</p>
                                    </div>
                                </div>

                                <button className="w-full h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center font-black text-xs tracking-widest uppercase hover:bg-emerald-50 transition-all gap-2 mt-auto">
                                    <Download className="w-4 h-4" /> Download Full Report
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Disclaimer</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2 max-w-4xl">
                        The VAT amounts shown in this dashboard are estimates calculated based on your configured VAT rate and processed orders. This report does not constitute legal or tax advice. You are solely responsible for verifying your tax obligations, collecting the correct amounts, and remitting them to the relevant local tax authorities. We recommend consulting with a certified tax professional or accountant.
                    </p>
                </div>
            </div>
        </div>
    );
}
