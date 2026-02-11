'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, ShieldCheck, CheckCircle2, Loader2, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';

export default function SellerPaymentsPage() {
    const { store, user, setStore } = useAuthStore();
    const [connecting, setConnecting] = useState(false);
    const [copied, setCopied] = useState(false);

    const [formData, setFormData] = useState({
        publicKey: '',
        secretKey: '',
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only populate public key from store data
        // Secret key is NEVER sent to frontend for security
        //@ts-ignore
        if (store?.paystackPublicKey) {
            setFormData(prev => ({
                ...prev,
                //@ts-ignore
                publicKey: store.paystackPublicKey || '',
                // secretKey remains empty - user must re-enter it to update
            }));
        }
    }, [store]);

    const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
    // Always force https for Paystack's UI validation
    const webhookUrl = `${apiBase.replace('http://', 'https://')}/payments/webhook/${store?.id}`;

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.publicKey || !formData.secretKey) return;

        setConnecting(true);
        setError(null);
        try {
            const res = await api.post('/payments/connect', {
                storeId: store?.id,
                ...formData,
            });
            setStore(res.data); // Update local store state
            alert('Paystack account connected successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Connection failed. Please check your keys.');
        } finally {
            setConnecting(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    //@ts-ignore
    const isConnected = !!store?.paystackPublicKey;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Direct Payment Logic</h1>
                <p className="text-slate-500 font-medium text-lg">Connect your personal Paystack account. Money goes directly to you.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={`p-6 rounded-[2rem] border-2 transition-all ${isConnected ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${isConnected ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                {isConnected ? <ShieldCheck className="w-8 h-8" /> : <Key className="w-8 h-8" />}
                            </div>
                            <div>
                                <h3 className={`font-black text-sm uppercase tracking-widest ${isConnected ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {isConnected ? 'Fully Direct' : 'Needs Config'}
                                </h3>
                                <p className="text-[11px] font-bold text-slate-500 mt-1">
                                    {isConnected ? 'Connected to your Paystack dashboard.' : 'Enter your API keys to get started.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Why Direct?</h4>
                        <div className="space-y-4">
                            {[
                                { text: 'Platform never touches your money', done: true },
                                { text: 'You receive 100% of sales', done: true },
                                { text: 'Paystack handles your settlements', done: true },
                                { text: 'Instant access to funds', done: true },
                            ].map((step, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[11px] font-bold text-slate-600">{step.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Setup Column */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleConnect} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 lg:p-12 space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-900">API Credentials</h2>
                                <a
                                    href="https://dashboard.paystack.com/#/settings/developer"
                                    target="_blank"
                                    className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                                >
                                    Get Keys <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Test/Live Public Key</label>
                                    <input
                                        type="text"
                                        value={formData.publicKey}
                                        onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                                        placeholder="pk_live_..."
                                        className="w-full h-14 bg-slate-50 border border-slate-50 rounded-2xl px-6 text-sm font-bold outline-none focus:bg-white focus:border-slate-200 transition-all text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Test/Live Secret Key</label>
                                    <input
                                        type="password"
                                        value={formData.secretKey}
                                        onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                                        placeholder="sk_live_..."
                                        className="w-full h-14 bg-slate-50 border border-slate-50 rounded-2xl px-6 text-sm font-bold outline-none focus:bg-white focus:border-slate-200 transition-all text-slate-900"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-xs font-bold leading-relaxed">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={connecting || !formData.publicKey || !formData.secretKey}
                                className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {connecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                {isConnected ? 'Update Keys' : 'Link Paystack Account'}
                            </button>
                        </div>
                    </form>

                    {isConnected && (
                        <div className="bg-emerald-900 rounded-[2.5rem] p-8 lg:p-10 text-white space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-widest opacity-60">Webhook Setup</h3>
                                <p className="text-xs font-bold leading-relaxed opacity-90">Paste this URL into your Paystack Dashboard under <span className="underline italic">Settings → API Keys & Webhooks</span> to enable automated order updates.</p>
                            </div>

                            <div className="bg-emerald-950/50 rounded-2xl p-4 flex items-center justify-between border border-emerald-800/50">
                                <code className="text-[10px] lg:text-[11px] font-mono truncate mr-4 text-emerald-100">{webhookUrl}</code>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all shrink-0"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
