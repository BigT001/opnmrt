'use client';

import React from 'react';
import { PageProps } from '../types';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, Mail, ChevronRight, MapPin, Globe, Share2 } from 'lucide-react';

export function AppifyContactPage({ store }: PageProps) {
    return (
        <div className="bg-[#f2f2f7] min-h-screen pb-24">
            {/* Immersive Header */}
            <div className="bg-white px-6 pt-16 pb-8 rounded-b-[2.5rem] shadow-sm">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-extrabold text-black tracking-tight"
                >
                    Contact Support
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 mt-2 font-medium"
                >
                    How can we help you today?
                </motion.p>
            </div>

            <div className="px-5 mt-8 space-y-6">
                {/* Chat Section */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Live Chat</h3>
                                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online Now</p>
                            </div>
                        </div>
                        <button className="bg-blue-500 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                            Start Chat
                        </button>
                    </div>
                </div>

                {/* Contact List */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm">
                    <ContactRow
                        icon={<Phone className="w-5 h-5 text-gray-400" />}
                        label="Call Us"
                        val={store.whatsappNumber || "Not available"}
                    />
                    <ContactRow
                        icon={<Mail className="w-5 h-5 text-gray-400" />}
                        label="Email Support"
                        val={store.officialEmail || "Not available"}
                    />
                    <ContactRow
                        icon={<MapPin className="w-5 h-5 text-gray-400" />}
                        label="Store Address"
                        val="Oxford Street, London"
                        last
                    />
                </div>

                {/* Socials */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col items-center text-center">
                        <Share2 className="w-6 h-6 text-gray-400 mb-3" />
                        <h4 className="text-xs font-bold text-gray-900">Social Media</h4>
                        <p className="text-[10px] text-gray-400 mt-1">@AppifyOfficial</p>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col items-center text-center">
                        <Globe className="w-6 h-6 text-gray-400 mb-3" />
                        <h4 className="text-xs font-bold text-gray-900">Website</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Visit Store</p>
                    </div>
                </div>

                {/* Quick Message Form */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Message</h3>
                    <form className="space-y-4">
                        <input type="text" placeholder="Subject" className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
                        <textarea rows={4} placeholder="Your message..." className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"></textarea>
                        <button className="w-full h-14 bg-black text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function ContactRow({ icon, label, val, last }: { icon: React.ReactNode; label: string; val: string; last?: boolean }) {
    return (
        <div className={`flex items-center justify-between p-6 ${!last ? 'border-b border-gray-50' : ''}`}>
            <div className="flex items-center gap-4">
                {icon}
                <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</h4>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{val}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-200" />
        </div>
    );
}
