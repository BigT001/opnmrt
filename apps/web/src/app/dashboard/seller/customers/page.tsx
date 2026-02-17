'use client';

import { useState, useEffect, Fragment } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, Clock, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function CustomersPage() {
    const { user, store } = useAuthStore();
    const [customers, setCustomers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [details, setDetails] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (!store?.id) return;
            try {
                const [customersRes, statsRes] = await Promise.all([
                    api.get(`/stores/${store.id}/customers`),
                    api.get(`/stores/${store.id}/customer-stats`),
                ]);
                setCustomers(customersRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Failed to fetch customer data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [store?.id]);

    const toggleExpand = async (customerId: string) => {
        if (expandedId === customerId) {
            setExpandedId(null);
            setDetails(null);
            return;
        }

        setExpandedId(customerId);
        setDetailsLoading(true);
        try {
            const res = await api.get(`/stores/${store!.id}/customers/${customerId}`);
            setDetails(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setDetailsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customers</h1>
                    <p className="text-slate-500 mt-1 uppercase text-[10px] font-bold tracking-widest">Manage and segment your storefront audience</p>
                </div>
            </div>

            {/* Customer Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <HighlightCard label="Total Customers" value={stats?.totalCustomers?.toString() || "0"} icon="👥" description="All buyers in your store" />
                <HighlightCard label="Avg. Spend Per Order" value={formatCurrency(Number(stats?.avgOrderValue || 0))} icon="🛒" description="How much each order is worth" />
                <HighlightCard label="Avg. Customer Worth" value={formatCurrency(Number(stats?.customerLTV || 0))} icon="💎" description="How much each customer spends in total" />
                <HighlightCard label="Repeat Buyers" value={`${stats?.retentionRate || 0}%`} icon="📈" description="Customers who bought more than once" />
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-0 text-left">
                        <thead>
                            <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-6 font-bold pl-4">Customer Name</th>
                                <th className="pb-6 font-bold">Orders</th>
                                <th className="pb-6 font-bold">Total Spent</th>
                                <th className="pb-6 font-bold text-right pr-4">Last Seen</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-bold text-slate-900">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-slate-400 font-medium">
                                        No customers found yet.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <Fragment key={customer.id}>
                                        <tr
                                            key={customer.id}
                                            onClick={() => toggleExpand(customer.id)}
                                            className={`border-b border-slate-50 group hover:bg-slate-50/50 transition-colors cursor-pointer ${expandedId === customer.id ? 'bg-slate-50/80' : ''}`}
                                        >
                                            <td className="py-5 pl-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-sm shadow-sm text-slate-900 font-black overflow-hidden shrink-0">
                                                        {customer.image ? (
                                                            <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            customer.name.split(' ').map((n: string) => n[0]).join('')
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900">{customer.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{customer.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 text-slate-600">{customer.ordersCount} orders</td>
                                            <td className="py-5 text-primary">{formatCurrency(Number(customer.totalSpent))}</td>
                                            <td className="py-5 text-right text-slate-400 text-xs font-medium pr-4">
                                                {customer.lastSeen ? new Date(customer.lastSeen).toLocaleDateString() : 'Never'}
                                            </td>
                                        </tr>
                                        {expandedId === customer.id && (
                                            <tr className="bg-slate-50/30">
                                                <td colSpan={4} className="p-0">
                                                    <div className="p-8 animate-in slide-in-from-top-2 duration-300">
                                                        {detailsLoading || !details ? (
                                                            <div className="flex justify-center py-10">
                                                                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-8">
                                                                {/* Stats Grid */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100/50">
                                                                        <div className="flex items-center gap-2 mb-2 text-amber-600/60 text-[10px] font-black uppercase tracking-widest">
                                                                            <Clock className="w-3 h-3" /> Awaiting Payment
                                                                        </div>
                                                                        <div className="text-xl font-black text-amber-900">{formatCurrency(details.stats.pending.value)}</div>
                                                                        <div className="text-xs font-bold text-amber-700/50">{details.stats.pending.count} orders</div>
                                                                    </div>
                                                                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100/50">
                                                                        <div className="flex items-center gap-2 mb-2 text-emerald-600/60 text-[10px] font-black uppercase tracking-widest">
                                                                            <CheckCircle className="w-3 h-3" /> Paid
                                                                        </div>
                                                                        <div className="text-xl font-black text-emerald-900">{formatCurrency(details.stats.paid.value)}</div>
                                                                        <div className="text-xs font-bold text-emerald-700/50">{details.stats.paid.count} orders</div>
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-3 gap-8">
                                                                    {/* Personal Details */}
                                                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm col-span-1">
                                                                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Personal Details</h3>
                                                                        <div className="space-y-4">
                                                                            {details.profile.email && (
                                                                                <div className="flex items-start gap-3">
                                                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                                                                        <Mail className="w-4 h-4 text-slate-400" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                                                                                        <p className="text-sm font-bold text-slate-900 break-all">{details.profile.email}</p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {details.profile.phone && (
                                                                                <div className="flex items-start gap-3">
                                                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                                                                        <Phone className="w-4 h-4 text-slate-400" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                                                                                        <p className="text-sm font-bold text-slate-900">{details.profile.phone}</p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {details.profile.shippingAddress && (
                                                                                <div className="flex items-start gap-3">
                                                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Shipping Address</p>
                                                                                        <p className="text-sm font-bold text-slate-900 leading-relaxed">
                                                                                            {details.profile.shippingAddress.address || 'N/A'}<br />
                                                                                            {details.profile.shippingAddress.city}, {details.profile.shippingAddress.state}, {details.profile.shippingAddress.zip}<br />
                                                                                            {details.profile.shippingAddress.country}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Recent Activity / Orders */}
                                                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm col-span-2">
                                                                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Recent Orders</h3>
                                                                        <div className="overflow-y-auto max-h-[400px] rounded-xl border border-slate-100 relative custom-scrollbar">
                                                                            <table className="w-full text-left bg-slate-50/50">
                                                                                <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                                                                                    <tr className="text-[9px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100">
                                                                                        <th className="p-4 bg-slate-50">Order ID</th>
                                                                                        <th className="p-4 bg-slate-50">Date</th>
                                                                                        <th className="p-4 bg-slate-50">Status</th>
                                                                                        <th className="p-4 bg-slate-50 text-right">Amount</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="text-xs bg-white">
                                                                                    {details.recentOrders.length === 0 ? (
                                                                                        <tr><td colSpan={4} className="p-4 text-center text-slate-400">No orders found</td></tr>
                                                                                    ) : (
                                                                                        details.recentOrders.map((order: any) => (
                                                                                            <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                                                                                <td className="p-4 font-mono text-slate-500">#{order.id.slice(-6)}</td>
                                                                                                <td className="p-4 font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                                                                <td className="p-4">
                                                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                                                                                                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                                                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                                                                                'bg-slate-100 text-slate-600'
                                                                                                        }`}>
                                                                                                        {order.status === 'PENDING' ? 'Awaiting Payment' : order.status}
                                                                                                    </span>
                                                                                                </td>
                                                                                                <td className="p-4 font-black text-slate-900 text-right">{formatCurrency(Number(order.totalAmount))}</td>
                                                                                            </tr>
                                                                                        ))
                                                                                    )}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function HighlightCard({ label, value, icon, description }: { label: string; value: string; icon: string; description?: string }) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                <span className="text-xl grayscale opacity-40">{icon}</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{value}</p>
            {description && (
                <p className="text-[10px] text-slate-400 font-medium mt-2">{description}</p>
            )}
        </div>
    );
}
