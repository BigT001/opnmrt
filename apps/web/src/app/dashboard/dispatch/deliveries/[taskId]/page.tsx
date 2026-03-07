'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Navigation, Clock, CheckCircle2, Package,
    ChevronLeft, Phone, User, Store, DollarSign,
    AlertCircle, Loader2, ArrowRight, Scan, Users, UserPlus, X, Check, ShieldCheck, Map
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function DeliveryDetailPage() {
    const { taskId } = useParams();
    const router = useRouter();
    const [task, setTask] = useState<any>(null);
    const [riders, setRiders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const fetchTask = async () => {
        try {
            const res = await api.get(`dispatch/task/${taskId}`);
            if (!res.data) {
                toast.error('Delivery record not found');
                router.push('/dashboard/dispatch/deliveries');
                return;
            }
            setTask(res.data);
        } catch (error) {
            console.error('Failed to fetch task details', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRiders = async () => {
        try {
            const res = await api.get('dispatch/riders');
            setRiders(res.data || []);
        } catch (err) {
            console.error('Failed to fetch riders', err);
        }
    };

    useEffect(() => {
        fetchTask();
        fetchRiders();
    }, [taskId]);

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setUpdating(true);
            await api.patch(`dispatch/task/${taskId}/status`, { status: newStatus });
            toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
            fetchTask();
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const handleAssignRider = async (riderId: string) => {
        try {
            await api.patch(`dispatch/task/${taskId}/assign`, { riderId });
            toast.success('Rider assigned successfully');
            setIsAssignModalOpen(false);
            fetchTask();
        } catch (err) {
            toast.error('Assignment failure');
        }
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">Loading delivery details...</p>
            </div>
        );
    }

    if (!task) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-900">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-4 text-slate-500 hover:text-white transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition-all">
                        <ChevronLeft size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-widest">Back to Hub</p>
                    </div>
                </button>

                <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 px-5 py-2.5 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Order ID:</span>
                    <span className="text-[10px] font-mono font-bold text-white tracking-wider leading-none">#{task.id.slice(-8).toUpperCase()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content (L) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Status & Progress */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
                        <div className="relative z-10 space-y-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1">Current Status</p>
                                    <h2 className="text-4xl font-black text-white tracking-tight uppercase italic leading-none">{task.status.replace('_', ' ')}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Earnings</p>
                                    <p className="text-3xl font-black text-emerald-400 italic leading-none">{formatPrice(Number(task.deliveryFee))}</p>
                                </div>
                            </div>

                            {/* Delivery Progress */}
                            <div className="flex items-center justify-between relative px-2">
                                <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800/50" />
                                <ProgressNode label="Accept" active={['ACCEPTED', 'AT_PICKUP', 'IN_TRANSIT', 'DELIVERED'].includes(task.status)} />
                                <ProgressNode label="Pickup" active={['AT_PICKUP', 'IN_TRANSIT', 'DELIVERED'].includes(task.status)} />
                                <ProgressNode label="Transit" active={['IN_TRANSIT', 'DELIVERED'].includes(task.status)} />
                                <ProgressNode label="Success" active={task.status === 'DELIVERED'} />
                            </div>

                            {/* Action Controls */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                {task.status === 'ACCEPTED' && (
                                    <ActionButton onClick={() => handleStatusUpdate('AT_PICKUP')} loading={updating} label="Mark as Picked Up" />
                                )}
                                {task.status === 'AT_PICKUP' && (
                                    <ActionButton onClick={() => handleStatusUpdate('IN_TRANSIT')} loading={updating} label="Start Delivery" />
                                )}
                                {task.status === 'IN_TRANSIT' && (
                                    <ActionButton onClick={() => handleStatusUpdate('DELIVERED')} loading={updating} label="Confirm Delivery" />
                                )}
                                {task.status === 'DELIVERED' && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl text-center flex items-center justify-center gap-3 col-span-2">
                                        <CheckCircle2 size={24} />
                                        <p className="text-[11px] font-black uppercase tracking-widest">Delivery Completed Successfully</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Route Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-800/50 pb-6">
                            <Map className="text-emerald-500" size={20} />
                            <h3 className="text-sm font-black text-white uppercase tracking-tight">Route Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8 relative">
                                <div className="absolute left-3 top-8 bottom-0 w-px border-l border-dashed border-slate-800" />

                                <div className="flex gap-6 items-start relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-500 shrink-0 mt-1" />
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pickup Location</p>
                                        <p className="text-sm font-black text-white italic uppercase">{task.order?.store?.name || 'Local Store'}</p>
                                        <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase">{task.pickupAddress}</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-rose-500 shrink-0 mt-1" />
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dropoff Location</p>
                                        <p className="text-sm font-black text-white italic uppercase">{task.order?.customerName || 'Customer'}</p>
                                        <p className="text-[11px] font-black text-slate-300 leading-relaxed uppercase">{task.dropoffAddress}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Delivery Notes</h4>
                                <div className="space-y-3">
                                    <ProtocolItem text="Ensure recipient signs off upon delivery." />
                                    <ProtocolItem text="Verify payment status before handing over." />
                                    <ProtocolItem text="Check package for external damage." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (R) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Assigned Rider */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Assigned Rider</h3>
                            <Users size={16} className="text-slate-600" />
                        </div>

                        {task.rider ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="text-md font-black text-white italic uppercase">{task.rider.name}</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">
                                            {task.rider.vehicleType} • {task.rider.staffId || 'ID: PENDING'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAssignModalOpen(true)}
                                    className="w-full py-2.5 text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors border-t border-slate-800/50 pt-4"
                                >
                                    Reassign Personnel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAssignModalOpen(true)}
                                className="w-full h-12 bg-emerald-500 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-emerald-400 transition-all"
                            >
                                Assign Personnel
                            </button>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Recipient Info</h3>
                            <User size={16} className="text-slate-600" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Full Name</p>
                                <p className="text-md font-black text-white italic truncate uppercase">{task.order?.customerName || 'N/A'}</p>
                            </div>

                            <a
                                href={`tel:${task.order?.customerPhone}`}
                                className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl group hover:bg-emerald-500 transition-all"
                            >
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-emerald-500 group-hover:text-slate-950 uppercase tracking-widest">Phone</p>
                                    <p className="text-xs font-black text-white group-hover:text-slate-950 tracking-wider font-mono">{task.order?.customerPhone || 'N/A'}</p>
                                </div>
                                <Phone size={16} className="text-emerald-500 group-hover:text-slate-950" />
                            </a>
                        </div>
                    </div>

                    {/* Transfer Auth */}
                    <div className="bg-slate-950 border border-slate-800 rounded-[1.5rem] p-5">
                        <div className="flex items-center gap-2 text-emerald-500 mb-4">
                            <ShieldCheck size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Verification PIN</span>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                            <p className="text-2xl font-black text-emerald-500 tracking-[0.4em] italic">{task.deliveryPin || '####'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rider Selection Modal */}
            <AnimatePresence>
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAssignModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Select Personnel</h3>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Assign a staff member to this delivery</p>
                                </div>
                                <button
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                {riders.filter(r => r.status === 'ACTIVE').length > 0 ? (
                                    riders.filter(r => r.status === 'ACTIVE').map((rider) => (
                                        <button
                                            key={rider.id}
                                            onClick={() => handleAssignRider(rider.id)}
                                            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all group text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-colors shadow-inner">
                                                    <Users size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white italic uppercase">{rider.name}</p>
                                                    <p className="text-[9px] font-black text-slate-600 uppercase">ID: {rider.staffId || 'PENDING'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                                                <Check size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">No available personnel found in registry</div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ProgressNode({ label, active }: { label: string, active: boolean }) {
    return (
        <div className="flex flex-col items-center gap-3 relative z-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${active ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' : 'bg-slate-900 border-slate-800 text-slate-700'
                }`}>
                {active ? <Check size={20} className="font-black" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest italic transition-colors ${active ? 'text-white' : 'text-slate-600'}`}>{label}</span>
        </div>
    );
}

function ActionButton({ onClick, loading, label }: { onClick: () => void, loading: boolean, label: string }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="w-full h-14 bg-white hover:bg-emerald-500 text-slate-950 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                    {label} <ArrowRight size={14} />
                </>
            )}
        </button>
    );
}

function ProtocolItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-slate-500">
            <div className="w-1 h-1 rounded-full bg-slate-700 shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-tight leading-tight">{text}</p>
        </div>
    );
}
