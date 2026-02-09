import React from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function CustomersPage() {
    const { user, store } = useAuthStore();
    const [customers, setCustomers] = React.useState<any[]>([]);
    const [stats, setStats] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
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
                <HighlightCard label="Total Customers" value={stats?.totalCustomers?.toString() || "0"} icon="👥" />
                <HighlightCard label="Avg. Order Value" value={`$${Number(stats?.avgOrderValue || 0).toFixed(2)}`} icon="🛒" />
                <HighlightCard label="Customer LTV" value={`$${Number(stats?.customerLTV || 0).toFixed(2)}`} icon="💎" />
                <HighlightCard label="Retention Rate" value={`${stats?.retentionRate || 0}%`} icon="📈" />
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
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
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-slate-400 font-medium">
                                        No customers found yet.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer, idx) => (
                                    <tr key={customer.id || idx} className="border-t border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-sm shadow-inner text-slate-400 font-black">
                                                    {customer.name.split(' ').map((n: any) => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p>{customer.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 text-slate-600">{customer.ordersCount} orders</td>
                                        <td className="py-5 text-primary">${Number(customer.totalSpent).toFixed(2)}</td>
                                        <td className="py-5 text-right text-slate-400 text-xs font-medium">
                                            {customer.lastSeen ? new Date(customer.lastSeen).toLocaleDateString() : 'Never'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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
