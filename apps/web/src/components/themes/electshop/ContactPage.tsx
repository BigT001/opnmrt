'use client';

import React from 'react';
import { PageProps } from '../types';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook, Youtube, Clock, ShieldCheck, MessageCircle } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export function ElectshopContactPage({ store, subdomain }: PageProps) {
    const { toggleDrawer } = useChatStore();
    const { user } = useAuthStore();

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            {/* Minimalist Tech Hero */}
            <section className="relative pt-20 pb-12 lg:pt-32 lg:pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full mb-8"
                        >
                            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">Support Hub</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl lg:text-8xl font-black text-gray-950 leading-[0.9] tracking-tighter uppercase italic mb-8"
                        >
                            How can we <br />
                            <span className="text-brand">Help you?</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-500 font-medium max-w-xl leading-relaxed"
                        >
                            Questions about your order, technical specifications, or shipping status? Our specialist team is ready to assist you.
                        </motion.p>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Contact Pillars */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ContactCard
                            icon={<Mail className="w-6 h-6 text-brand" />}
                            title="Direct Email"
                            val={store.officialEmail || "support@electshop.com"}
                            desc="Average response time: 2-4 hours during business days."
                        />
                        <ContactCard
                            icon={<Phone className="w-6 h-6 text-brand" />}
                            title="Voice Support"
                            val={store.whatsappNumber || "+234 800 123 4567"}
                            desc="Available Mon-Fri, 9am - 6pm (GMT +1)."
                        />
                        <ContactCard
                            icon={<MapPin className="w-6 h-6 text-brand" />}
                            title="Global HQ"
                            val="Oxford St, London, UK"
                            desc="Visit our showroom to experience the latest tech."
                        />
                        <ContactCard
                            icon={<Clock className="w-6 h-6 text-brand" />}
                            title="Service Hours"
                            val="24/7 Digital Support"
                            desc="Automated assistance is always live for quick info."
                        />
                    </div>

                    {/* Live Support Portal */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col h-full sticky top-32">
                            <div className="flex items-center justify-between mb-12">
                                <div className="w-14 h-14 bg-brand/5 rounded-2xl flex items-center justify-center">
                                    <MessageCircle className="w-7 h-7 text-brand" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Online Now</span>
                                    <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1" />
                                </div>
                            </div>

                            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic mb-6">Meet Big T</h3>
                            <p className="text-sm text-gray-500 font-medium mb-12 leading-relaxed">
                                Need expert advice? Chat instantly with Big T, our dedicated store manager. Big T has all the information about our products and is ready to assist you right now.
                            </p>

                            <div className="space-y-4 mb-12">
                                <div className="flex items-center gap-4 py-3 border-b border-gray-50">
                                    <ShieldCheck className="w-4 h-4 text-brand" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Conversation</span>
                                </div>
                                <p className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Priority status for logged-in users</p>
                            </div>

                            <button
                                onClick={() => {
                                    if (!user) {
                                        toast.error('Please login to start a live chat');
                                        return;
                                    }
                                    toggleDrawer();
                                }}
                                className="w-full h-16 bg-gray-950 text-white rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                Open Live Chat <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Connect */}
                <div className="mt-32 pt-20 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-2 text-center md:text-left">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Join the Community</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Tag us to get featured in our daily tech spotlight</p>
                        </div>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Instagram className="w-5 h-5" />} color="#E4405F" />
                            <SocialIcon icon={<Twitter className="w-5 h-5" />} color="#000000" />
                            <SocialIcon icon={<Facebook className="w-5 h-5" />} color="#1877F2" />
                            <SocialIcon icon={<Youtube className="w-5 h-5" />} color="#FF0000" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ContactCard({ icon, title, val, desc }: { icon: React.ReactNode; title: string; val: string; desc: string }) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all group text-left">
            <div className="w-14 h-14 rounded-2xl bg-brand/5 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">{title}</h4>
                <p className="text-xl lg:text-2xl font-black text-gray-950 break-all uppercase tracking-tighter italic mb-4">{val}</p>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function SocialIcon({ icon, color }: { icon: React.ReactNode; color: string }) {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-14 h-14 rounded-[1.25rem] border border-gray-200 flex items-center justify-center text-gray-400 cursor-pointer transition-all hover:scale-110 active:scale-95 relative overflow-hidden"
            style={{
                backgroundColor: isHovered ? color : 'transparent',
                borderColor: isHovered ? color : '#e5e7eb',
                color: isHovered ? 'white' : '#9ca3af'
            }}
        >
            {icon}
        </div>
    );
}
