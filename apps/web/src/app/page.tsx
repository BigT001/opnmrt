'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3, Globe, Sparkles, Layout, Store, Cpu, Rocket } from 'lucide-react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingBackground } from '@/components/landing/LandingBackground';
import { DashboardMockup } from '@/components/landing/DashboardMockup';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative transition-colors duration-500">
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

            <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tight leading-[0.9] mb-8">
              Build your <span className="text-emerald-500 emerald-text-glow italic">Digital Legacy</span> in minutes.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              The world's first independent commerce engine with built-in AI.
              Own your brand, own your customers, and let our tools handle the complexity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-emerald-500 text-white dark:text-[#030712] rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all flex items-center justify-center space-x-3">
                <span>Start Selling Now</span>
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
              <div className="bg-card rounded-[2.5rem] overflow-hidden">
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
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Sales Boost</p>
                    <p className="text-2xl font-black text-foreground">+12,482%</p>
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
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">AI Guardian</p>
                    <p className="text-2xl font-black text-foreground italic">Active</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Intelligence Section - Simple Language */}
        <section className="max-w-7xl mx-auto px-6 py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-5xl md:text-7xl font-black text-foreground leading-[0.9] tracking-tighter uppercase whitespace-pre-line">
                The Brain <br />
                <span className="text-emerald-500">Behind Your Brand.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                We didn't just build a shop. We built a smart engine that learns what your customers like and helps you grow without the stress.
              </p>

              <div className="space-y-6">
                <IntelligenceItem
                  title="Smart Suggestions"
                  desc="Tells you exactly what's selling and what to buy next."
                  icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
                />
                <IntelligenceItem
                  title="Auto-Pilot Mode"
                  desc="Fixes pricing and stock levels so you don't have to."
                  icon={<Cpu className="w-5 h-5 text-indigo-400" />}
                />
                <IntelligenceItem
                  title="Safe & Secure"
                  desc="Keeps your data private and your money safe."
                  icon={<Shield className="w-5 h-5 text-amber-400" />}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
              <div className="relative glass-panel p-8 rounded-[4rem] aspect-square flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border-2 border-dashed border-emerald-500/20 rounded-full flex items-center justify-center"
                >
                  <div className="w-3/4 h-3/4 border-2 border-dashed border-indigo-500/20 rounded-full flex items-center justify-center" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.4)]">
                    <Cpu className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-40 bg-slate-900/5 dark:bg-slate-950 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tighter uppercase">Results you can <span className="text-emerald-500">Feel</span></h2>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm italic">Tested by real merchants, driving real growth</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <ResultCard
                value="2 Minutes"
                label="Average Set-Up Time"
                desc="Go from zero to selling faster than you can make a cup of coffee."
              />
              <ResultCard
                value="35%"
                label="Sales Increase"
                desc="Our AI insights help you put the right products in front of the right buyers."
              />
              <ResultCard
                value="0.00$"
                label="Hidden Fees"
                desc="Keep what you earn. Transparent pricing with no surprises at the end of the month."
              />
            </div>
          </div>
        </section>

        {/* Features Grid Refined */}
        <section className="max-w-7xl mx-auto px-6 py-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-black text-foreground leading-none tracking-tighter uppercase">Everything you <br /><span className="text-emerald-500 italic">Actually Need.</span></h2>
            </div>
            <p className="text-muted-foreground font-medium max-w-sm">No bloat. Just the tools that make your business move faster and look better.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Store className="w-6 h-6" />}
              title="Your Unique Home"
              description="Beautiful store themes that make your brand look like a million bucks instantly."
              color="emerald"
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Sell Anywhere"
              description="One dashboard to rule them all. Reach customers wherever they are browsing."
              color="indigo"
            />
            <FeatureCard
              icon={<Layout className="w-6 h-6" />}
              title="Drag & Drop Ease"
              description="No coding required. If you can use a smartphone, you can build a store here."
              color="amber"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Lightning Speed"
              description="Your customers won't wait. Our stores load in the blink of an eye."
              color="rose"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Total Control"
              description="You own your domain, your data, and your customer list. Forever."
              color="teal"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Simple Stats"
              description="Clean charts that show you exactly how much money you're making."
              color="blue"
            />
          </div>
        </section>

        {/* Visual Call to Action */}
        <section className="max-w-7xl mx-auto px-6 pb-60">
          <div className="relative glass-panel p-12 md:p-24 rounded-[4rem] overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full -mr-48 -mt-48" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-center lg:text-left">
                <h2 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tighter leading-none uppercase">
                  Ready to <br />
                  <span className="text-emerald-500">Go Live?</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-12 font-medium max-w-xl mx-auto lg:mx-0">
                  Join thousands of merchants building the future of commerce on OPNMRT.
                  Start your 14-day free journey today.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  <Link href="/register" className="px-10 py-5 bg-emerald-500 text-white dark:text-[#030712] rounded-2xl text-lg font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                    Get Started Free
                  </Link>
                  <Link href="/pricing" className="px-10 py-5 bg-transparent border-2 border-border text-foreground rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                    View Pricing
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block w-72 h-72 relative">
                <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full animate-ping" />
                <div className="absolute inset-4 border-4 border-indigo-500/20 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-emerald-500 rounded-3xl flex items-center justify-center transform rotate-12 shadow-2xl">
                    <Rocket className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

function IntelligenceItem({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="flex items-start space-x-4 p-4 rounded-3xl hover:bg-emerald-500/5 transition-colors cursor-default"
    >
      <div className="mt-1 w-8 h-8 rounded-xl bg-white/5 dark:bg-card flex items-center justify-center shrink-0 border border-border">
        {icon}
      </div>
      <div>
        <h4 className="font-black text-foreground uppercase tracking-tight">{title}</h4>
        <p className="text-muted-foreground text-sm font-medium leading-tight">{desc}</p>
      </div>
    </motion.div>
  );
}

function ResultCard({ value, label, desc }: { value: string; label: string; desc: string }) {
  return (
    <div className="glass-panel p-10 rounded-[3rem] text-center border-none shadow-none bg-transparent hover:bg-white/5 transition-colors group">
      <div className="text-6xl md:text-7xl font-black text-emerald-500 mb-4 tracking-tighter group-hover:scale-110 transition-transform duration-500">{value}</div>
      <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tighter">{label}</h3>
      <p className="text-muted-foreground font-medium italic">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string, description: string, color: string }) {
  const colors: any = {
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500 dark:text-emerald-400",
    indigo: "border-indigo-500/20 bg-indigo-500/5 text-indigo-500 dark:text-indigo-400",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-500 dark:text-amber-400",
    rose: "border-rose-500/20 bg-rose-500/5 text-rose-500 dark:text-rose-400",
    teal: "border-teal-500/20 bg-teal-500/5 text-teal-500 dark:text-teal-400",
    blue: "border-blue-500/20 bg-blue-500/5 text-blue-500 dark:text-blue-400",
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`glass-panel p-10 rounded-[3rem] border ${colors[color]} hover:border-emerald-500/40 transition-all group`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 dark:bg-card flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tighter">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed italic">{description}</p>
    </motion.div>
  );
}

