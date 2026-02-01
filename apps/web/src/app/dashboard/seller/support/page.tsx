'use client';

import React from 'react';

export default function SupportPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner ring-1 ring-emerald-100">
                    🎧
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">How can we help?</h1>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">Our team and AI agents are 24/7 ready to support your business growth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <SupportCard
                    icon="📧"
                    title="Email Support"
                    desc="Open a ticket for technical issues or billing inquiries."
                    action="Send an Email"
                />
                <SupportCard
                    icon="💬"
                    title="Live AI Chat"
                    desc="Get instant answers from our trained documentation agent."
                    action="Start Chat"
                    primary
                />
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-8">Frequently Asked Questions</h3>
                <div className="space-y-6">
                    <FaqItem q="How do I connect my custom domain?" a="You can add your custom domain in the Settings > Domains section. Verification typically takes less than 24 hours." />
                    <FaqItem q="Can I use multiple Paystack accounts?" a="Currently, each workspace supports one primary Paystack integration for direct payouts." />
                    <FaqItem q="Is the AI Copilot included in all plans?" a="The basic AI insights are available on all plans, but the automated Customer Copilot requires a Pro subscription." />
                </div>
            </div>
        </div>
    );
}

function SupportCard({ icon, title, desc, action, primary = false }: { icon: string; title: string; desc: string; action: string; primary?: boolean }) {
    return (
        <div className={`p-8 rounded-[2rem] border transition-all hover:-translate-y-1 ${primary ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200' : 'bg-white text-slate-900 border-slate-100 shadow-sm hover:shadow-lg'}`}>
            <span className="text-3xl mb-6 block">{icon}</span>
            <h3 className="text-xl font-black mb-2">{title}</h3>
            <p className={`text-xs leading-relaxed mb-6 ${primary ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
            <button className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${primary ? 'bg-primary text-white hover:brightness-110' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}>
                {action}
            </button>
        </div>
    );
}

function FaqItem({ q, a }: { q: string; a: string }) {
    return (
        <div className="group cursor-pointer">
            <h4 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{q}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{a}</p>
        </div>
    );
}
