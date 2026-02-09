'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3, Globe, Sparkles, Layout, Store, Cpu } from 'lucide-react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingBackground } from '@/components/landing/LandingBackground';
import { DashboardMockup } from '@/components/landing/DashboardMockup';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden relative">
      <LandingBackground />
      <LandingNavbar />

      <main className="relative pt-32">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">V1.0 Engine Live</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[0.9] mb-8">
              Build your <span className="text-emerald-500 emerald-text-glow italic">Digital Legacy</span> in minutes.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              The world's first multi-tenant commerce engine with built-in AI insights.
              Own your brand, own your customers, and let AI handle the heavy lifting.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-emerald-500 text-[#030712] rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all flex items-center justify-center space-x-3">
                <span>Create Your Store Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Hero Image Mockup Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-32 max-w-6xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative glass-panel rounded-[3rem] p-4 p-2-gradient overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)]">
              <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden">
                <DashboardMockup />
              </div>

              {/* Floating UI Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 hidden lg:block glass-panel p-6 rounded-3xl border border-emerald-500/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                    <Zap className="text-emerald-400 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Store Performance</p>
                    <p className="text-2xl font-black text-white">+12,482%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 hidden lg:block glass-panel p-6 rounded-3xl border border-indigo-500/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <Shield className="text-indigo-400 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">AI Protection</p>
                    <p className="text-2xl font-black text-white italic">Active</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 py-40">
          <div className="text-center mb-32">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Engineered for <span className="text-emerald-500">Scale</span></h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Empowering merchants with sovereign commerce tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Cpu className="w-6 h-6" />}
              title="AI Neural Core"
              description="Deep insights into customer behavior and automatic inventory optimization."
              color="emerald"
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Global Scalability"
              description="Multi-tenant architecture that handles millions of storefronts seamlessly."
              color="indigo"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Instant Liquidity"
              description="Real-time settlement and advanced financial reporting for every merchant."
              color="amber"
            />
            <FeatureCard
              icon={<Layout className="w-6 h-6" />}
              title="Curated Themes"
              description="Ultra-premium, high-conversion themes designed by retail experts."
              color="rose"
            />
            <FeatureCard
              icon={<Store className="w-6 h-6" />}
              title="Tenant Sovereignty"
              description="Your data, your customers, your brand. Completely isolated and secure."
              color="teal"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Bank-Grade Security"
              description="Encrypted transactions and advanced fraud detection out of the box."
              color="blue"
            />
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="bg-emerald-500 py-24 mb-40 overflow-hidden relative">
          <div className="absolute inset-0 bg-slate-950/10 mix-blend-overlay" />
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-12 relative z-10">
            <StatItem label="Launch Ready" value="< 2 Mins" />
            <StatItem label="Uptime Record" value="99.99%" />
            <StatItem label="Market Capacity" value="Unlimited" />
            <StatItem label="Data Sovereignty" value="100%" />
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-4xl mx-auto px-6 py-60 text-center">
          <div className="glass-panel p-20 rounded-[4rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                Ready to own your <br />
                <span className="text-emerald-500">Future?</span>
              </h2>
              <p className="text-slate-400 mb-12 text-lg font-medium">
                Join the elite circle of merchants building on OPNMRT.
                No credit card required to start your journey.
              </p>
              <Link href="/register" className="px-12 py-6 bg-white text-[#030712] rounded-3xl text-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl inline-block">
                Begin Activation
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string, description: string, color: string }) {
  const colors: any = {
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 shadow-emerald-500/5",
    indigo: "border-indigo-500/20 bg-indigo-500/5 text-indigo-400 shadow-indigo-500/5",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400 shadow-amber-500/5",
    rose: "border-rose-500/20 bg-rose-500/5 text-rose-400 shadow-rose-500/5",
    teal: "border-teal-500/20 bg-teal-500/5 text-teal-400 shadow-teal-500/5",
    blue: "border-blue-500/20 bg-blue-500/5 text-blue-400 shadow-blue-500/5",
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`glass-panel p-10 rounded-[3rem] border ${colors[color]} hover:border-white/20 transition-all group`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed italic">{description}</p>
    </motion.div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center group">
      <p className="text-xs font-black uppercase tracking-[0.4em] text-[#030712]/60 mb-2">{label}</p>
      <p className="text-5xl font-black text-[#030712] tracking-tighter group-hover:scale-110 transition-transform">{value}</p>
    </div>
  );
}
