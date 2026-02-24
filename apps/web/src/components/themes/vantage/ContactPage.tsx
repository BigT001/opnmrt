'use client';

import React from 'react';
import { PageProps } from '../types';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';

export const VantageContactPage: React.FC<PageProps> = ({ store, isPreview }) => {
    const [formStatus, setFormStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        setTimeout(() => setFormStatus('sent'), 1500);
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-40">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* ═══ EDITORIAL HEADER ═══ */}
                <div className="mb-24 lg:mb-40">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <span className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.6em] block mb-2">Inquiries</span>
                        <h1 className="text-4xl md:text-7xl font-black text-neutral-900 tracking-tighter uppercase leading-[0.8] max-w-4xl">
                            Connect <br />
                            <span className="text-neutral-200 italic">With </span>
                            Vantage.
                        </h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 120 }}
                            className="h-2 bg-[#fef08a] rounded-full mt-10"
                        />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20 lg:gap-40 items-start">
                    {/* ═══ CONTACT FORM ═══ */}
                    <div className="space-y-16">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Message Us</span>
                            <h2 className="text-4xl font-black uppercase tracking-tighter text-black">Direct Inquiry</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10 group">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Alexander West"
                                        className="w-full bg-white border-b-2 border-neutral-100 py-4 focus:border-black outline-none transition-all text-sm font-bold placeholder:text-neutral-200"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="alex@vantage.shop"
                                        className="w-full bg-white border-b-2 border-neutral-100 py-4 focus:border-black outline-none transition-all text-sm font-bold placeholder:text-neutral-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Your Message</label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Tell us about your style journey or inquiry..."
                                    className="w-full bg-white border-b-2 border-neutral-100 py-4 focus:border-black outline-none transition-all text-sm font-bold placeholder:text-neutral-200 resize-none overflow-hidden"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formStatus !== 'idle'}
                                className="w-full md:w-auto px-16 py-6 bg-black text-white rounded-full font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 group"
                            >
                                {formStatus === 'idle' ? (
                                    <>Send Message <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                ) : formStatus === 'sending' ? (
                                    'Transmitting...'
                                ) : (
                                    'Message Received'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* ═══ INFO PANEL ═══ */}
                    <aside className="sticky top-32 space-y-20">
                        <div className="space-y-12">
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-neutral-900 uppercase tracking-[0.5em] border-b border-neutral-100 pb-6 w-full">Quick Access.</h3>

                                <div className="space-y-10">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-black" />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest block mb-1">Email</span>
                                            <p className="font-black text-neutral-900 uppercase tracking-tight">{store.officialEmail || 'connect@vantage.shop'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-black" />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest block mb-1">Our Base</span>
                                            <p className="font-black text-neutral-900 uppercase tracking-tight leading-snug">Oxford St, London <br /> W1D 1BS, UK</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-neutral-900 rounded-[3rem] p-10 relative overflow-hidden group">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200')] bg-cover" />
                                <div className="relative z-10">
                                    <h4 className="text-white text-2xl font-black uppercase tracking-tighter mb-4 italic">Social Concierge</h4>
                                    <p className="text-neutral-500 font-bold uppercase text-[9px] tracking-widest leading-relaxed mb-8">DM us on social platforms <br /> for instant style advice.</p>
                                    <div className="flex gap-4">
                                        {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                            <button key={i} className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all">
                                                <Icon className="w-5 h-5" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
