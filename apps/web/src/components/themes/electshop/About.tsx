'use client';

import React from 'react';
import { PageProps } from '../types';
import { motion } from 'framer-motion';
import { Award, Clock, Users, Zap, ChevronRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function ElectshopAboutPage({ store, subdomain }: PageProps) {
    return (
        <div className="bg-white min-h-screen">
            {/* Simple Hero */}
            <section className="relative h-[400px] lg:h-[500px] bg-black overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover opacity-40 grayscale"
                        alt="Office"
                    />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs lg:text-sm font-black text-brand uppercase tracking-[0.4em] mb-6"
                    >
                        Learn our culture
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic"
                    >
                        Redefining the <br />
                        Future of <span className="text-brand">Electronics</span>
                    </motion.h1>
                </div>
            </section>

            {/* Story */}
            <section className="max-w-7xl mx-auto px-4 py-24 lg:py-40">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000" alt="Tech" className="w-full h-auto aspect-[4/5] object-cover" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[20px] border-brand/10 rounded-[4rem] z-0 -rotate-3" />
                    </div>
                    <div className="lg:w-1/2 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter italic">Our Mission</h2>
                            <p className="text-xs font-black text-brand uppercase tracking-[0.3em]">Quality Gadgets for everyone</p>
                        </div>
                        <div className="space-y-6 text-gray-500 font-medium leading-[1.8] text-sm lg:text-base">
                            <p>
                                Founded in 2024, {store.name || 'Electshop'} was born out of a desire to make premium electronics accessible. We believe that technology should empower people to live more connected, efficient, and inspiring lives.
                            </p>
                            <p>
                                Every product in our catalog is hand-picked by our team of hardware geeks. We don't just sell gadgets; we test them, break them, and fall in love with them before they reach your doorstep.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-10 lg:pt-10">
                            <Stat label="Live Products" val="1.2k+" />
                            <Stat label="Happy Users" val="450k+" />
                            <Stat label="Store Rating" val="4.9/5" />
                            <Stat label="Years in Biz" val="08+" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-gray-50 py-24 lg:py-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
                        <h2 className="text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter italic">Modern Values</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">The principles that guide every decision we make at {store.name || 'Electshop'}.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ValueCard
                            icon={<Zap className="w-8 h-8 text-brand" />}
                            title="Instant Tech"
                            desc="We pride ourselves on being the first to bring cutting-edge releases to our customers."
                        />
                        <ValueCard
                            icon={<Award className="w-8 h-8 text-brand" />}
                            title="Gold Standard"
                            desc="If it's in our store, you can be certain it has passed our 50-point quality check."
                        />
                        <ValueCard
                            icon={<Users className="w-8 h-8 text-brand" />}
                            title="Community First"
                            desc="Our reviews are 100% verified. We listen, adapt, and grow based on your feedback."
                        />
                        <ValueCard
                            icon={<Clock className="w-8 h-8 text-brand" />}
                            title="Rapid Logistics"
                            desc="We operate our own fulfillment network to ensure your tech arrives in pristine condition."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 lg:py-40 px-4">
                <div className="max-w-7xl mx-auto bg-gray-950 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden flex flex-col items-center text-center border border-white/5 shadow-2xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic max-w-3xl mx-auto">Ready to upgrade <br /> your digital life?</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href={`/store/${subdomain}/shop`} className="px-12 py-5 bg-brand text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-brand/20 hover:scale-105 transition-all flex items-center gap-3">
                                Start Shopping <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="flex items-center gap-3 text-white/70 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">
                                <MessageCircle className="w-5 h-5 text-brand" /> Chat with Big T
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Stat({ label, val }: { label: string; val: string }) {
    return (
        <div className="space-y-1">
            <p className="text-3xl font-black text-gray-900 italic tracking-tighter">{val}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
    );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: string, desc: string }) {
    return (
        <div className="bg-white p-10 rounded-[2rem] border border-gray-100/50 shadow-sm hover:shadow-xl hover:border-brand/20 transition-all duration-500 group">
            <div className="w-16 h-16 rounded-2xl bg-brand/5 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic mb-4">{title}</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}
