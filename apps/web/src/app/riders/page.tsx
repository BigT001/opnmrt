'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Bike,
    TrendingUp,
    MapPin,
    Zap,
    ShieldCheck,
    DollarSign,
    Clock,
    Smartphone,
    CheckCircle2,
    Navigation,
    Package
} from 'lucide-react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingBackground } from '@/components/landing/LandingBackground';

export default function RiderLandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden relative">
            <LandingBackground />
            <LandingNavbar />

            <main className="relative pt-32">
                {/* Hero Section */}
                <section className="relative px-6 pt-20 pb-40 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
                            <Bike className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Logistic Partner Program</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8 uppercase italic text-foreground">
                            Earn as you <span className="text-emerald-500 emerald-text-glow">move.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed italic">
                            The central intelligence hub connecting OPNMRT merchants with the most reliable dispatchers in the region.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/register/rider" className="w-full sm:w-auto px-10 py-5 bg-emerald-500 text-[#030712] rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                Join the Hub
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/login/rider" className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-border text-foreground rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-emerald-500/5 transition-all">
                                Hub Login
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats/Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border-y border-border py-12"
                    >
                        <StatItem value="Free" label="To Join" />
                        <StatItem value="Direct" label="Seller Connection" />
                        <StatItem value="Secure" label="Hub Software" />
                        <StatItem value="Elite" label="Merchant Network" />
                    </motion.div>
                </section>

                {/* Value Propositions */}
                <section className="max-w-7xl mx-auto px-6 py-40">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase whitespace-pre-line text-foreground">
                                The Logistics <br />
                                <span className="text-emerald-500 italic">Interchange.</span>
                            </h2>
                            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl italic">
                                We bridge the gap between OPNMRT merchants and professional riders, providing the technical infrastructure to move goods faster.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Feature icon={<Zap />} title="Hyper-Local" desc="Get orders within your preferred radius only." />
                                <Feature icon={<TrendingUp />} title="High Earnings" desc="Optimized routes to maximize your drops per hour." />
                                <Feature icon={<ShieldCheck />} title="Verified Stores" desc="Deliver for trusted merchants on the OPNMRT network." />
                                <Feature icon={<Smartphone />} title="Elite Tech" desc="Our Dispatch Dashboard is fast, light, and smart." />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
                            <div className="relative glass-panel p-8 rounded-[4rem] aspect-square flex items-center justify-center overflow-hidden border border-emerald-500/20 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                                <div className="z-10 text-center">
                                    <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-12">
                                        <Navigation className="w-12 h-12 text-white -rotate-12" />
                                    </div>
                                    <p className="text-4xl font-black italic tracking-tighter text-foreground uppercase mb-2">Active Radar</p>
                                    <p className="text-emerald-500 font-black uppercase tracking-widest text-xs">AI Optimized Route</p>
                                </div>

                                {/* Orbital Icons */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-20 border border-dashed border-emerald-500/20 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-40 bg-muted/30 px-6 border-y border-border">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic text-foreground">The Path to <span className="text-emerald-500">Earnings</span></h2>
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">Three steps to your first delivery</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <StepCard
                                number="01"
                                title="Onboard"
                                desc="Sign up with your details and select your vehicle type."
                            />
                            <StepCard
                                number="02"
                                title="Authorize"
                                desc="Verify your identity and get instant access to the Dispatch Radar."
                            />
                            <StepCard
                                number="03"
                                title="Earn"
                                desc="Accept jobs, deliver packages, and watch your wallet grow."
                            />
                        </div>
                    </div>
                </section>

                {/* Vehicle Choice */}
                <section className="max-w-7xl mx-auto px-6 py-40 text-center">
                    <h2 className="text-5xl md:text-6xl font-black mb-20 tracking-tighter uppercase italic text-foreground">Your Wheels, <span className="text-emerald-500">Your Choice.</span></h2>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <VehicleCard icon={<Bike />} label="Motorcycle" desc="The agility of a ninja." />
                        <VehicleCard icon={<Package />} label="Van / Truck" desc="Large volume master." />
                        <VehicleCard icon={<Bike />} label="Bicycle" desc="Eco-friendly speed." />
                        <VehicleCard icon={<CheckCircle2 />} label="Car / Sedan" desc="Safe & Secure drops." />
                    </div>
                </section>

                {/* Final CTA */}
                <section className="max-w-7xl mx-auto px-6 pb-60">
                    <div className="relative glass-panel p-12 md:p-24 rounded-[4rem] overflow-hidden text-center border border-emerald-500/10">
                        <div className="absolute inset-0 bg-emerald-500 opacity-[0.02]" />
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none uppercase italic text-foreground">
                                Ready to <br />
                                <span className="text-emerald-500">Get Moving?</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 font-medium">
                                Join the team and start earning today. No hidden fees, no complex barriers.
                            </p>
                            <Link href="/register/rider" className="inline-flex px-12 py-6 bg-emerald-500 text-primary-foreground rounded-2xl text-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-emerald-500/40">
                                Enter the Hub
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}

function StatItem({ value, label }: { value: string; label: string }) {
    return (
        <div className="space-y-1">
            <p className="text-2xl md:text-4xl font-black tracking-tighter italic text-foreground">{value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
        </div>
    );
}

function Feature({ icon, title, desc }: { icon: any; title: string, desc: string }) {
    return (
        <div className="p-6 bg-card/50 border border-border rounded-3xl hover:border-emerald-500/20 transition-all group">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {React.cloneElement(icon, { className: "w-5 h-5 text-emerald-500" })}
            </div>
            <h4 className="font-black uppercase tracking-tight mb-1 text-sm text-foreground">{title}</h4>
            <p className="text-[11px] text-muted-foreground font-bold italic leading-tight">{desc}</p>
        </div>
    );
}

function StepCard({ number, title, desc }: { number: string; title: string; desc: string }) {
    return (
        <div className="relative p-10 glass-panel rounded-[3rem] border border-border hover:border-emerald-500/20 transition-all text-left group">
            <div className="text-6xl font-black text-emerald-500/10 absolute top-8 right-8 group-hover:text-emerald-500/20 transition-colors uppercase italic">{number}</div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-foreground">{title}</h3>
            <p className="text-muted-foreground font-medium italic leading-relaxed">{desc}</p>
        </div>
    );
}

function VehicleCard({ icon, label, desc }: { icon: any; label: string; desc: string }) {
    return (
        <div className="p-8 glass-panel rounded-3xl border border-border hover:border-emerald-500/20 transition-all group">
            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all">
                {React.cloneElement(icon, { className: "w-6 h-6 text-muted-foreground group-hover:text-emerald-500 transition-colors" })}
            </div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-2 text-foreground">{label}</h4>
            <p className="text-[10px] text-muted-foreground font-bold italic">{desc}</p>
        </div>
    );
}
