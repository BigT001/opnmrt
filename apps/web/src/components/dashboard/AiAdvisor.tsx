'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, Loader2, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export function AiAdvisor({ storeId }: { storeId: string }) {
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
        { role: 'ai', content: "Hello! I'm your OPNMRT AI Advisor. I've analyzed your store data. Ask me anything about your sales, inventory, or how to grow your business!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await api.post(`/analytics/ai-ask/${storeId}`, { question: userMsg });
            setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I'm having trouble connecting to my brain right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[600px] mb-8">
            <div className="bg-slate-950 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <BrainCircuit className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-white text-sm font-black uppercase tracking-widest">Conversational Advisor</h3>
                        <p className="text-primary text-[8px] font-black uppercase tracking-[0.2em]">Gemini 1.5 PRO Powered</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-emerald-500 font-black uppercase">Live Analysis</span>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/50">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                        >
                            <div className={`max-w-[80%] flex gap-3 ${msg.role === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary text-white shadow-lg shadow-emerald-200' : 'bg-slate-900 text-white'}`}>
                                    {msg.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className={`p-4 rounded-2xl text-[12.5px] font-medium leading-relaxed shadow-sm ${msg.role === 'ai' ? 'bg-white text-slate-700' : 'bg-primary text-white'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI is thinking...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your sales, inventory, or pricing strategies..."
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-6 pr-16 text-sm font-medium focus:ring-2 ring-primary/20 transition-all placeholder:text-slate-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 bottom-2 w-12 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
