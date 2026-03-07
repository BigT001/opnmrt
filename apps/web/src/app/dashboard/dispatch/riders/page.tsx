'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Users, Phone, Mail, Bike, Truck, Car,
    MoreVertical, X, Check, Loader2, UserPlus, Edit,
    MapPin, ShieldAlert, BadgeCheck, Trash2, LayoutList,
    ArrowRight,
    TrendingUp
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

export default function DispatchRidersPage() {
    const [riders, setRiders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [viewingHistoryRider, setViewingHistoryRider] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [editingRider, setEditingRider] = useState<any>(null);

    const [formData, setFormData] = useState({
        staffId: '',
        name: '',
        email: '',
        phone: '',
        vehicleType: 'BIKE',
        address: '',
        emergencyName: '',
        emergencyPhone: ''
    });

    const fetchRiders = async () => {
        try {
            setLoading(true);
            const res = await api.get('dispatch/riders');
            setRiders(res.data || []);
        } catch (err) {
            console.error('Failed to fetch riders', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiders();
    }, []);

    const handleOpenEdit = (rider: any) => {
        setEditingRider(rider);
        setFormData({
            staffId: rider.staffId || '',
            name: rider.name || '',
            email: rider.email || '',
            phone: rider.phone || '',
            vehicleType: rider.vehicleType || 'BIKE',
            address: rider.address || '',
            emergencyName: rider.emergencyName || '',
            emergencyPhone: rider.emergencyPhone || ''
        });
        setIsEditModalOpen(true);
    };

    const handleAddRider = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('dispatch/riders', formData);
            toast.success('Staff member registered successfully');
            setIsAddModalOpen(false);
            resetForm();
            fetchRiders();
        } catch (err) {
            toast.error('Failed to register staff');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateRider = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.patch(`dispatch/riders/${editingRider.id}`, formData);
            toast.success('Staff records updated');
            setIsEditModalOpen(false);
            setEditingRider(null);
            resetForm();
            fetchRiders();
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            staffId: '',
            name: '',
            email: '',
            phone: '',
            vehicleType: 'BIKE',
            address: '',
            emergencyName: '',
            emergencyPhone: ''
        });
    };

    const toggleRiderStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            await api.patch(`dispatch/riders/${id}`, { status: newStatus });
            setRiders(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            toast.success(`Personnel marked as ${newStatus}`);
        } catch (err) {
            toast.error('Status update failed');
        }
    };

    const filteredRiders = riders.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.staffId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-900">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Fleet Registry</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2 italic flex items-center gap-2">
                        <TrendingUp size={12} className="text-emerald-500" />
                        INTERNAL MANAGEMENT: PERSONNEL & PERFORMANCE AUDIT
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-emerald-500" size={14} />
                        <input
                            type="text"
                            placeholder="Search staff ID or name..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-[11px] font-bold text-white uppercase focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                        className="w-full sm:w-auto h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        <UserPlus size={16} />
                        Register Staff
                    </button>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">UPDATING PERSONNEL RECORDS...</p>
                </div>
            ) : filteredRiders.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center bg-slate-900/20 border border-slate-800 border-dashed rounded-[3rem]">
                    <Users size={32} className="text-slate-800 mb-4" />
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">No personnel found in the registry</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRiders.map((rider) => (
                        <div
                            key={rider.id}
                            className={`group relative bg-slate-900/40 border transition-all duration-300 rounded-[2.5rem] overflow-hidden ${rider.status === 'ACTIVE' ? 'border-slate-800 hover:border-emerald-500/30' : 'border-rose-500/20 grayscale'}`}
                        >
                            <div className="p-8 pb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-950 border border-slate-800 shadow-inner ${rider.status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-600'}`}>
                                        <Users size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(rider)}
                                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-500 hover:text-white hover:border-slate-700 transition-all"
                                        >
                                            <Edit size={12} />
                                        </button>
                                        <button
                                            onClick={() => toggleRiderStatus(rider.id, rider.status)}
                                            className={`p-1.5 rounded-lg border transition-all ${rider.status === 'ACTIVE' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950'}`}
                                            title={rider.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                        >
                                            {rider.status === 'ACTIVE' ? <ShieldAlert size={12} /> : <BadgeCheck size={12} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-black text-white italic uppercase truncate tracking-tight">{rider.name}</h3>
                                            {rider.status === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest font-mono">STAFF ID: {rider.staffId || 'PENDING'}</p>
                                            <span className={`text-[8px] font-black uppercase tracking-[0.1em] ${rider.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>{rider.status}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-slate-800/50 text-[10px] font-bold text-slate-400">
                                        <div className="flex items-center gap-3">
                                            <Phone size={12} className="text-slate-600 shrink-0" />
                                            <span className="truncate">{rider.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail size={12} className="text-slate-600 shrink-0" />
                                            <span className="truncate">{rider.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin size={12} className="text-slate-600 shrink-0" />
                                            <span className="truncate uppercase italic text-[9px]">{rider.address || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Total Yield</p>
                                            <p className="text-base font-black text-white italic">{formatPrice(rider.tasks?.reduce((acc: any, t: any) => acc + (t.status === 'DELIVERED' ? Number(t.deliveryFee) : 0), 0) || 0)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Activities</p>
                                            <p className="text-base font-black text-slate-400 italic font-mono">{rider.tasks?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingHistoryRider(rider)}
                                className="w-full py-4 bg-slate-950 border-t border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-900 hover:text-emerald-500 transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                <LayoutList size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                Inspect Personnel Ledger
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Rider Ledger / History Modal */}
            <AnimatePresence>
                {viewingHistoryRider && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setViewingHistoryRider(null)}
                            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[85vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 md:p-10 border-b border-slate-800 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-500">
                                        <Users size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">{viewingHistoryRider.name}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">STAFF ID: {viewingHistoryRider.staffId || 'N/A'}</p>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{viewingHistoryRider.tasks?.length || 0} DELIVERIES LOGGED</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewingHistoryRider(null)}
                                    className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-inner"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable Ledger */}
                            <div className="flex-1 overflow-y-auto p-8 md:p-10 no-scrollbar space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-[2rem] space-y-2">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Total Earnings Generated</p>
                                        <p className="text-3xl font-black text-emerald-500 italic font-mono">
                                            {formatPrice(viewingHistoryRider.tasks?.reduce((acc: any, t: any) => acc + (t.status === 'DELIVERED' ? Number(t.deliveryFee) : 0), 0) || 0)}
                                        </p>
                                    </div>
                                    <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-[2rem] space-y-2">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Success Rate</p>
                                        <p className="text-3xl font-black text-white italic">100%</p>
                                    </div>
                                    <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-[2rem] space-y-2 text-right">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Personnel Status</p>
                                        <p className={`text-3xl font-black uppercase italic ${viewingHistoryRider.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {viewingHistoryRider.status}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic ml-1 flex items-center gap-2">
                                        <LayoutList size={14} className="text-emerald-500" />
                                        Activity Ledger
                                    </h4>
                                    <div className="border border-slate-800 rounded-[2.5rem] overflow-hidden bg-slate-950/20">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-950/60 border-b border-slate-800">
                                                <tr>
                                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Ref ID</th>
                                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Logistics Path</th>
                                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Yield</th>
                                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                                    <th className="px-6 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800/50 font-mono">
                                                {viewingHistoryRider.tasks?.length > 0 ? viewingHistoryRider.tasks.map((task: any) => (
                                                    <tr key={task.id} className="hover:bg-slate-800/10 transition-colors group">
                                                        <td className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase">#{task.id.slice(-6).toUpperCase()}</td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[11px] font-bold text-white uppercase italic truncate max-w-[120px]">{task.pickupAddress.split(',')[0]}</span>
                                                                <ArrowRight size={10} className="text-slate-700" />
                                                                <span className="text-[11px] font-bold text-slate-400 uppercase italic truncate max-w-[120px]">{task.dropoffAddress.split(',')[0]}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-[12px] font-black text-emerald-500 italic">{formatPrice(Number(task.deliveryFee))}</td>
                                                        <td className="px-6 py-5">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${task.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                                                                {task.status.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right text-[11px] font-bold text-slate-600 uppercase">
                                                            {new Date(task.createdAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={5} className="py-20 text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">No activities found in ledger</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 md:px-10 border-t border-slate-800 bg-slate-950/60 shrink-0 flex items-center justify-between">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">© OPNMRT LOGISTICS AUDIT SYSTEM v2.5</p>
                                <button
                                    onClick={() => setViewingHistoryRider(null)}
                                    className="px-8 h-12 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-white hover:bg-slate-800 uppercase tracking-[0.2em] transition-all active:scale-95"
                                >
                                    Dismiss Audit
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Registration Modal */}
            <AnimatePresence>
                {(isAddModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-2xl my-auto"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">
                                        {isEditModalOpen ? 'Update Personnel' : 'Staff Onboarding'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
                                        {isEditModalOpen ? 'Modify internal employee records' : 'Register a new employee into the dispatch registry'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-colors shadow-inner"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={isEditModalOpen ? handleUpdateRider : handleAddRider} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Staff ID / Payroll Code</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. HUB-420-X"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all uppercase font-mono"
                                            value={formData.staffId}
                                            onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Full Legal Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Primary Phone</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Work Email (Optional)</label>
                                        <input
                                            type="email"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Current Residential Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div className="bg-slate-950/40 border border-slate-800 rounded-[2rem] p-8 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <ShieldAlert size={16} className="text-slate-600" />
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Emergency Response Data</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 block">Contact Kin Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-rose-500/20 font-mono"
                                                value={formData.emergencyName}
                                                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 block">Kin Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-rose-500/20 font-mono"
                                                value={formData.emergencyPhone}
                                                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'PROCESSING LOGISTICS DATA...' : isEditModalOpen ? 'SYNCHRONIZE PERSONNEL RECORDS' : 'FINALIZE REGISTRATION'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
