'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, Loader2, User, Sparkles, X, MessageSquare, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export function FloatingAiAdvisor({ storeId }: { storeId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
        { role: 'ai', content: "Hello! I'm BigT, your Personal Store Assistant. I've analyzed your data and I'm ready to help you manage your store. Ask me anything about your sales or inventory!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

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
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col w-[400px] h-[550px] mb-4"
                    >
                        <div className="bg-slate-950 p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                    <BrainCircuit className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-white text-xs font-black uppercase tracking-widest leading-none">BigT - Assistant</h3>
                                    <p className="text-primary text-[7px] font-black uppercase tracking-[0.2em] mt-1">Store Manager</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-slate-50/50">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] flex gap-2 ${msg.role === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'ai' ? '' : 'bg-slate-900 text-white'}`}>
                                            {msg.role === 'ai' ? <img src="/bigt-avatar.svg" className="w-full h-full rounded-lg object-cover shadow-sm" alt="BigT" /> : <User className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-[12px] font-medium leading-relaxed ${msg.role === 'ai' ? 'bg-white text-slate-700 shadow-sm' : 'bg-primary text-white shadow-md shadow-emerald-200'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl flex items-center gap-2 shadow-sm">
                                        <Loader2 className="w-3 h-3 text-primary animate-spin" />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything..."
                                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-4 pr-12 text-xs font-medium focus:ring-2 ring-primary/20 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-primary text-white rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <Send className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${isOpen ? 'bg-slate-900 text-white' : 'bg-primary text-white'}`}
            >
                {isOpen ? <Minimize2 className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
}
