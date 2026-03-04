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
            {/* Page Header - Desktop Only */}
            <div className="hidden sm:flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customers</h1>
                    <p className="text-slate-500 mt-1 uppercase text-[10px] font-bold tracking-widest">Manage and segment your storefront audience</p>
                </div>
            </div>

            {/* Page Header - Mobile Only (Subtle) */}
            <div className="sm:hidden mb-2">
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">CUSTOMER RELATIONS</p>
                <p className="text-slate-900 mt-1 font-black text-xl tracking-tight">Managing <span className="text-emerald-600 font-black">{customers.length} verified buyers</span></p>
            </div>

            {/* Customer Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                <HighlightCard label="Total Customers" value={stats?.totalCustomers?.toString() || "0"} icon="👥" description="All store buyers" />
                <HighlightCard label="Avg. Order" value={formatCurrency(Number(stats?.avgOrderValue || 0))} icon="🛒" description="Per sale average" />
                <HighlightCard label="Total LTV" value={formatCurrency(Number(stats?.customerLTV || 0))} icon="💎" description="Customer worth" />
                <HighlightCard label="Repeat Rate" value={`${stats?.retentionRate || 0}%`} icon="📈" description="Back for more" />
            </div>

            {/* Customers List/Table */}
            <div className="bg-white lg:rounded-[2.5rem] rounded-[2rem] lg:p-10 p-6 shadow-sm border border-slate-100 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
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
                                                    <CustomerDetailView details={details} loading={detailsLoading} formatCurrency={formatCurrency} />
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                    {customers.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest">
                            No customers yet
                        </div>
                    ) : (
                        customers.map((customer) => (
                            <div key={customer.id} className="border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                                <div
                                    onClick={() => toggleExpand(customer.id)}
                                    className={`flex items-center gap-4 p-2 rounded-2xl transition-all ${expandedId === customer.id ? 'bg-slate-50 shadow-sm' : ''}`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-sm shadow-sm text-slate-900 font-black overflow-hidden shrink-0">
                                        {customer.image ? (
                                            <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            customer.name.split(' ').map((n: string) => n[0]).join('')
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-900 text-sm truncate">{customer.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-primary font-black uppercase tracking-tight">{formatCurrency(Number(customer.totalSpent))}</span>
                                            <span className="text-[10px] text-slate-400 font-bold">• {customer.ordersCount} orders</span>
                                        </div>
                                    </div>
                                </div>
                                {expandedId === customer.id && (
                                    <div className="mt-1 px-0">
                                        <CustomerDetailView details={details} loading={detailsLoading} formatCurrency={formatCurrency} />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function CustomerDetailView({ details, loading, formatCurrency }: { details: any; loading: boolean; formatCurrency: any }) {
    if (loading || !details) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </div>
        );
    }

    return (
        <div className="lg:p-8 p-1 py-4 animate-in slide-in-from-top-2 duration-300 space-y-4 lg:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:gap-4 gap-2">
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/50">
                    <div className="flex items-center gap-2 mb-2 text-amber-600/60 text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> Awaiting
                    </div>
                    <div className="text-sm lg:text-xl font-black text-amber-900">{formatCurrency(details.stats.pending.value)}</div>
                    <div className="text-[8px] lg:text-xs font-bold text-amber-700/50 uppercase tracking-tighter">{details.stats.pending.count} orders</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50">
                    <div className="flex items-center gap-2 mb-2 text-emerald-600/60 text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle className="w-3 h-3" /> Paid
                    </div>
                    <div className="text-sm lg:text-xl font-black text-emerald-900">{formatCurrency(details.stats.paid.value)}</div>
                    <div className="text-[8px] lg:text-xs font-bold text-emerald-700/50 uppercase tracking-tighter">{details.stats.paid.count} orders</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 gap-4">
                {/* Personal Details */}
                <div className="bg-white rounded-[2rem] p-5 lg:p-6 border border-slate-100 lg:shadow-sm">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 lg:mb-6">Personal Details</h3>
                    <div className="space-y-4">
                        {details.profile.email && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Email Address</p>
                                    <p className="text-xs font-bold text-slate-900 break-all">{details.profile.email}</p>
                                </div>
                            </div>
                        )}
                        {details.profile.phone && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Phone Number</p>
                                    <p className="text-xs font-bold text-slate-900">{details.profile.phone}</p>
                                </div>
                            </div>
                        )}
                        {details.profile.shippingAddress && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Shipping Address</p>
                                    <p className="text-[11px] font-bold text-slate-900 leading-relaxed truncate lg:whitespace-normal">
                                        {details.profile.shippingAddress.address || 'N/A'}<br />
                                        {details.profile.shippingAddress.city}, {details.profile.shippingAddress.state}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity / Orders */}
                <div className="bg-white rounded-[2rem] p-5 lg:p-6 border border-slate-100 lg:shadow-sm lg:col-span-2 overflow-hidden">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 lg:mb-6">Recent Activity</h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-50">
                        <table className="w-full text-left bg-slate-50/50 border-separate border-spacing-0">
                            <thead className="bg-slate-50 shadow-sm sticky top-0">
                                <tr className="text-[8px] lg:text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                                    <th className="p-3 lg:p-4">ID</th>
                                    <th className="p-3 lg:p-4">Date</th>
                                    <th className="p-3 lg:p-4">Status</th>
                                    <th className="p-3 lg:p-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-[10px] lg:text-xs">
                                {details.recentOrders.length === 0 ? (
                                    <tr><td colSpan={4} className="p-6 text-center text-slate-400 font-bold uppercase tracking-widest text-[8px]">No activity recorded</td></tr>
                                ) : (
                                    details.recentOrders.map((order: any) => (
                                        <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-white bg-white/50 transition-colors">
                                            <td className="p-3 lg:p-4 font-mono text-slate-400">#{order.id.slice(-4)}</td>
                                            <td className="p-3 lg:p-4 font-bold text-slate-700 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3 lg:p-4">
                                                <div className="flex items-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider whitespace-nowrap ${order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                                                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {order.status === 'PENDING' ? 'AW-PAY' : order.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3 lg:p-4 font-black text-slate-900 text-right whitespace-nowrap">{formatCurrency(Number(order.totalAmount))}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HighlightCard({ label, value, icon, description }: { label: string; value: string; icon: string; description?: string }) {
    return (
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2 lg:mb-4">
                <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{label}</span>
                <span className="text-lg lg:text-xl grayscale opacity-30 shrink-0">{icon}</span>
            </div>
            <div>
                <p className="text-lg lg:text-2xl font-black text-slate-900 truncate tracking-tight">{value}</p>
                {description && (
                    <p className="text-[8px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1 opacity-60">{description}</p>
                )}
            </div>
        </div>
    );
}
