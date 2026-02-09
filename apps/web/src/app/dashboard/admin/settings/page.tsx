'use client';

import React from 'react';

export default function AdminSettings() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                    <h3 className="text-lg font-black text-white tracking-tight mb-8">General Configuration</h3>
                    <div className="space-y-6">
                        <SettingsField label="Platform Name" value="Open Mart" />
                        <SettingsField label="Support Email" value="support@opnmart.com" />
                        <SettingsField label="Base Domain" value="opnmart.com" />
                        <div className="pt-4 flex items-center justify-between">
                            <div>
                                <h5 className="text-xs font-bold text-slate-200">Maintenance Mode</h5>
                                <p className="text-[10px] text-slate-500 mt-0.5 uppercase font-bold tracking-widest">Disable storefront access globally</p>
                            </div>
                            <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer p-1">
                                <div className="w-4 h-4 bg-slate-600 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                    <h3 className="text-lg font-black text-white tracking-tight mb-8">Security & Access</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl">
                            <div>
                                <h5 className="text-xs font-bold text-indigo-400">Two-Factor Auth</h5>
                                <p className="text-[10px] text-indigo-500/60 mt-0.5 uppercase font-bold tracking-widest">Enforced for all Admin accounts</p>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                        </div>
                        <SettingsField label="Admin Password" value="********" action="Change" />
                        <SettingsField label="IP Whitelist" value="2 active IPs" action="Manage" />
                    </div>
                </div>

                {/* System Logs / Maintenance */}
                <div className="lg:col-span-2 bg-rose-950/20 border border-rose-900/30 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-rose-500 tracking-tight">Danger Zone</h3>
                        <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-rose-500/20">Authorized Personnel Only</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-rose-900/20">
                            <h5 className="text-xs font-bold text-white mb-1">Clear Cache</h5>
                            <p className="text-[10px] text-slate-500 mb-4 uppercase font-bold tracking-widest line-clamp-2">Wipe all globally cached storefront data and AI pre-computations.</p>
                            <button className="px-4 py-2 bg-rose-600 text-white text-[9px] font-black rounded-xl uppercase tracking-widest hover:brightness-110 transition-all">Wipe Cache</button>
                        </div>
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-rose-900/20">
                            <h5 className="text-xs font-bold text-white mb-1">Backup Database</h5>
                            <p className="text-[10px] text-slate-500 mb-4 uppercase font-bold tracking-widest line-clamp-2">Force a full system state backup to secure cloud storage.</p>
                            <button className="px-4 py-2 bg-slate-800 text-slate-300 text-[9px] font-black rounded-xl uppercase tracking-widest hover:bg-slate-700 transition-all">Run Backup</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsField({ label, value, action = 'Edit' }: any) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
            <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-white mt-1">{value}</p>
            </div>
            <button className="text-[10px] font-black text-indigo-400 uppercase hover:text-indigo-300 transition-colors">{action}</button>
        </div>
    );
}
