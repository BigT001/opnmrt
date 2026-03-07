'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Truck, CheckCircle2, Navigation, ChevronDown, ChevronUp, Mail, Phone, FileText, MapPin, Calendar, CheckCircle, Users, LayoutList, DollarSign, Clock, ArrowRight, ShieldAlert, BadgeCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function AdminLogistics() {
    const [dispatchers, setDispatchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedHub, setExpandedHub] = useState<string | null>(null);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'riders' | 'tasks'>('info');

    useEffect(() => {
        const fetchLogistics = async () => {
            try {
                const response = await api.get('admin/logistics');
                setDispatchers(response.data || []);
            } catch (err) {
                console.error('Failed to fetch logistics data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogistics();
    }, []);

    const handleApprove = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setApprovingId(id);

        try {
            await api.get(`admin/logistics/${id}/approve`);
            setDispatchers(prev => prev.map(d =>
                d.id === id
                    ? { ...d, dispatchProfile: { ...d.dispatchProfile, isVerified: true } }
                    : d
            ));
            toast.success('Logistics hub approved successfully');
        } catch (err) {
            toast.error('Failed to approve hub');
        } finally {
            setApprovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none italic">Updating Logistics Registry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Simple Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-900">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Logistics Management</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2 italic">
                        Oversee and manage registered logistics hubs
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <Navigation size={14} />
                    {dispatchers.length} Active Hubs
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-800/20">
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Hub Details</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Fleet</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Coverage</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">System Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {dispatchers.map((dispatcher: any) => (
                            <React.Fragment key={dispatcher.id}>
                                <tr
                                    onClick={() => {
                                        if (expandedHub === dispatcher.id) {
                                            setExpandedHub(null);
                                        } else {
                                            setExpandedHub(dispatcher.id);
                                            setActiveTab('info');
                                        }
                                    }}
                                    className="hover:bg-slate-800/10 transition-colors group cursor-pointer"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 font-extrabold text-lg uppercase overflow-hidden">
                                                {dispatcher.dispatchProfile?.logo ? (
                                                    <img src={dispatcher.dispatchProfile.logo} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    dispatcher.dispatchProfile?.companyName?.charAt(0) || dispatcher.name?.charAt(0) || 'H'
                                                )}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-black text-white">{dispatcher.dispatchProfile?.companyName || 'Unregistered Hub'}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID: {dispatcher.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-bold">
                                        {dispatcher.dispatchProfile?.isVerified ? (
                                            <div className="flex items-center gap-2 text-emerald-500 text-[10px] uppercase tracking-widest">
                                                <BadgeCheck size={14} /> Verified Hub
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-amber-500 text-[10px] uppercase tracking-widest">
                                                <Clock size={14} /> Pending Audit
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white uppercase italic">{dispatcher.dispatchProfile?.riders?.length || 0} Riders</span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Registered Fleet</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400`}>
                                            {dispatcher.dispatchProfile?.isInterstate ? 'Interstate' : 'Local'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-4">
                                            <div className="flex items-center space-x-2 text-emerald-500">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Online</span>
                                            </div>
                                            <div className="p-2 text-slate-600 bg-slate-950/40 rounded-lg border border-slate-800 transition-colors group-hover:bg-slate-800 group-hover:text-white">
                                                {expandedHub === dispatcher.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <AnimatePresence>
                                    {expandedHub === dispatcher.id && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-10 bg-slate-900/20 border-t border-slate-800">
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-8"
                                                >
                                                    {/* Internal Tabs */}
                                                    <div className="flex items-center gap-8 border-b border-slate-800/50 pb-4">
                                                        <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} label="Hub Information" />
                                                        <TabButton active={activeTab === 'riders'} onClick={() => setActiveTab('riders')} label="Fleet Personnel" />
                                                        <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} label="Delivery Ledger" />
                                                    </div>

                                                    {activeTab === 'info' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Contacts</h4>
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                                                        <Mail size={16} className="text-slate-600" />
                                                                        <a href={`mailto:${dispatcher.email}`} className="hover:text-emerald-400">{dispatcher.email}</a>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                                                        <Phone size={16} className="text-slate-600" />
                                                                        <span>{dispatcher.phone || 'No phone'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Address</h4>
                                                                <div className="flex items-start gap-3 text-slate-300 text-sm font-medium">
                                                                    <MapPin size={16} className="text-slate-600 mt-1 shrink-0" />
                                                                    <div className="space-y-1">
                                                                        <p className="text-white font-bold">{dispatcher.dispatchProfile?.address || 'N/A'}</p>
                                                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">
                                                                            {dispatcher.dispatchProfile?.lga} • {dispatcher.dispatchProfile?.state}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Compliance Documents</h4>
                                                                <div className="space-y-3">
                                                                    <DocItem label="CAC Business Profile" url={dispatcher.dispatchProfile?.cacDocument} />
                                                                    <DocItem label="Utility Verification" url={dispatcher.dispatchProfile?.utilityBill} />
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col items-center justify-center p-6 bg-slate-950/40 rounded-2xl border border-slate-800">
                                                                {dispatcher.dispatchProfile && !dispatcher.dispatchProfile.isVerified ? (
                                                                    <button
                                                                        onClick={(e) => handleApprove(e, dispatcher.id)}
                                                                        disabled={approvingId === dispatcher.id}
                                                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/10 active:scale-95 transition-all"
                                                                    >
                                                                        {approvingId === dispatcher.id ? 'VERIFYING...' : 'Verify Hub Now'}
                                                                    </button>
                                                                ) : (
                                                                    <div className="text-center">
                                                                        <BadgeCheck size={32} className="text-emerald-500 mx-auto mb-2" />
                                                                        <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest">Verified Hub</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeTab === 'riders' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                            {dispatcher.dispatchProfile?.riders?.length > 0 ? dispatcher.dispatchProfile.riders.map((rider: any) => (
                                                                <div key={rider.id} className="bg-slate-950 border border-slate-800 rounded-[2rem] p-6 relative group hover:border-emerald-500/30 transition-all">
                                                                    <div className="flex items-center gap-4 mb-4">
                                                                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-600 group-hover:text-emerald-500 transition-colors">
                                                                            <Users size={20} />
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="text-white font-bold text-sm truncate uppercase italic">{rider.name}</h5>
                                                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">ID: {rider.staffId || 'N/A'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between pt-4 border-t border-slate-800">
                                                                        <div>
                                                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Performance</p>
                                                                            <p className="text-xs font-black text-white">{rider.tasks?.length || 0} TASKS</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Hub Status</p>
                                                                            <p className={`text-xs font-black uppercase ${rider.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>{rider.status}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )) : (
                                                                <div className="col-span-full py-12 text-center text-slate-600 bg-slate-950/20 rounded-[2rem] border border-dashed border-slate-800">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest">No personnel registered for this hub</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {activeTab === 'tasks' && (
                                                        <div className="overflow-x-auto rounded-[2rem] border border-slate-800 bg-slate-950/40">
                                                            <table className="w-full">
                                                                <thead className="bg-slate-800/20">
                                                                    <tr className="border-b border-slate-800">
                                                                        <th className="px-6 py-4 text-left text-[9px] font-black text-slate-500 uppercase tracking-widest">Order ID</th>
                                                                        <th className="px-6 py-4 text-left text-[9px] font-black text-slate-500 uppercase tracking-widest">Staff Assigned</th>
                                                                        <th className="px-6 py-4 text-left text-[9px] font-black text-slate-500 uppercase tracking-widest">Route Info</th>
                                                                        <th className="px-6 py-4 text-left text-[9px] font-black text-slate-500 uppercase tracking-widest">Current Status</th>
                                                                        <th className="px-6 py-4 text-right text-[9px] font-black text-slate-500 uppercase tracking-widest">Last Update</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-800/40">
                                                                    {dispatcher.dispatchProfile.tasks?.length > 0 ? dispatcher.dispatchProfile.tasks.map((task: any) => (
                                                                        <tr key={task.id} className="hover:bg-slate-800/5 transition-colors">
                                                                            <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">#{task.id.slice(-6).toUpperCase()}</td>
                                                                            <td className="px-6 py-4">
                                                                                <span className="text-[11px] font-bold text-white uppercase italic">{task.rider?.name || 'UNASSIGNED'}</span>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <div className="flex items-center gap-2 overflow-hidden max-w-[150px]">
                                                                                    <span className="text-[10px] font-bold text-slate-400 truncate">{task.pickupAddress.split(',')[0]}</span>
                                                                                    <ArrowRight size={10} className="text-slate-700 shrink-0" />
                                                                                    <span className="text-[10px] font-bold text-slate-300 truncate">{task.dropoffAddress.split(',')[0]}</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${task.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                                                                    }`}>
                                                                                    {task.status.replace('_', ' ')}
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-6 py-4 text-right text-[10px] font-bold text-slate-600 uppercase">
                                                                                {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                                                                            </td>
                                                                        </tr>
                                                                    )) : (
                                                                        <tr>
                                                                            <td colSpan={5} className="py-12 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest">No delivery records found</td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`text-[10px] font-black uppercase tracking-widest pb-3 border-b-2 transition-all ${active ? 'text-emerald-500 border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-400'
                }`}
        >
            {label}
        </button>
    );
}

function DocItem({ label, url }: any) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <FileText size={14} className={url ? "text-emerald-500" : "text-slate-700"} />
            {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase truncate max-w-[120px]">{label}</a>
            ) : (
                <span className="text-[11px] font-bold text-slate-700 uppercase">{label} - NOT FOUND</span>
            )}
        </div>
    );
}

function Loader2({ ...props }) {
    return <Truck {...props} className={props.className || "animate-pulse"} />
}
