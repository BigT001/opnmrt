'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Shield, BarChart3, Globe, Sparkles, Layout, Store, Search, MessageSquare, Workflow } from 'lucide-react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingBackground } from '@/components/landing/LandingBackground';
import { FeatureIllustration } from '@/components/landing/FeatureIllustration';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden relative">
            <LandingBackground />
            <LandingNavbar />

            <main className="relative pt-32">
                {/* Hero Section */}
                <section className="px-6 py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase">
                            The Engine of <span className="text-emerald-500 italic">Tomorrow.</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            OPNMRT isn't just a platform; it's a high-performance commerce engine driven by neural intelligence and sovereign architecture.
                        </p>
                    </motion.div>
                </section>

                {/* Deep Dive Features */}
                <section className="max-w-7xl mx-auto px-6 py-24 space-y-40">
                    <FeatureSection
                        title="AI Neural Core"
                        subtitle="INTELLIGENCE"
                        description="Our native AI engine analyzes every interaction in real-time, providing merchants with predictive insights that traditional platforms can't touch."
                        items={[
                            { icon: <Search />, title: "Predictive Search", desc: "Intent-based results that convert visitors faster." },
                            { icon: <BarChart3 />, title: "Demand Forecasting", desc: "Know what will sell before you even stock it." },
                            { icon: <Sparkles />, title: "Auto-Copywriting", desc: "High-conversion product descriptions generated instantly." }
                        ]}
                        illustration="ai"
                        reversed={false}
                    />

                    <FeatureSection
                        title="Multi-Tenant Sovereignty"
                        subtitle="ARCHITECTURE"
                        description="Complete isolation. Your data never touches another merchant's database. OPNMRT provides true enterprise-grade security for businesses of all sizes."
                        items={[
                            { icon: <Shield />, title: "Data Isolation", desc: "Independent database schemas for every tenant." },
                            { icon: <Globe />, title: "Domain Mastery", desc: "Zero-latency custom domain mapping and routing." },
                            { icon: <Workflow />, title: "API-First", desc: "Connect your existing stack with our robust GraphQL API." }
                        ]}
                        illustration="arch"
                        reversed={true}
                    />

                    <FeatureSection
                        title="Kinetic Storefronts"
                        subtitle="EXPERIENCE"
                        description="High-performance themes that don't just look good—they feel alive. Optimized for 100/100 Lighthouse scores and maximum mobility."
                        items={[
                            { icon: <Zap />, title: "Edge Rendering", desc: "Static content served from 200+ global locations." },
                            { icon: <Layout />, title: "Visual Builder", desc: "Intuitive drag-and-drop with professional constraints." },
                            { icon: <MessageSquare />, title: "Direct Connect", desc: "Built-in customer engagement and loyalty tools." }
                        ]}
                        illustration="ui"
                        reversed={false}
                    />
                </section>

                {/* Technical Specs Grid */}
                <section className="bg-slate-900/50 py-40 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-black text-white mb-20 tracking-tighter uppercase text-center">Technical Specifications</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                            <SpecItem label="Core Runtime" value="Next.js 15" />
                            <SpecItem label="Database" value="Postgres" />
                            <SpecItem label="Security" value="AES-256" />
                            <SpecItem label="Latency" value="< 50ms" />
                            <SpecItem label="Availability" value="99.99%" />
                            <SpecItem label="Tenant Limit" value="∞" />
                            <SpecItem label="AI Model" value="Custom LLM" />
                            <SpecItem label="Edge Nodes" value="250+" />
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}

function FeatureSection({ title, subtitle, description, items, illustration, reversed }: any) {
    return (
        <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-20`}>
            <div className="flex-1 space-y-8">
                <div>
                    <span className="text-emerald-500 font-black tracking-[0.3em] text-[10px] uppercase">{subtitle}</span>
                    <h2 className="text-4xl font-black text-white tracking-tighter mt-2 uppercase">{title}</h2>
                </div>
                <p className="text-slate-400 font-medium leading-relaxed italic">{description}</p>
                <div className="space-y-6 pt-4">
                    {items.map((item: any, i: number) => (
                        <div key={i} className="flex items-start space-x-4 group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-[#030712] transition-colors">
                                {React.cloneElement(item.icon, { size: 18 })}
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h4>
                                <p className="text-xs text-slate-500 font-bold">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 w-full text-left">
                <FeatureIllustration type={illustration} />
            </div>
        </div>
    );
}

function SpecItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-l-2 border-emerald-500/30 pl-6 space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
        </div>
    );
}
