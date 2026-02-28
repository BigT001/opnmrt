'use client';

import React from 'react';
import { PageProps } from '../types';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function DefaultContactPage({ store }: PageProps) {
    return (
        <div className="bg-white min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-gray-600">Have a question or need assistance? We're here to help.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Information */}
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-gray-900" />
                                </div>
                                <h3 className="font-bold text-gray-900">Email</h3>
                                <p className="text-gray-600 text-sm">{store.officialEmail || 'support@example.com'}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-gray-900" />
                                </div>
                                <h3 className="font-bold text-gray-900">Phone</h3>
                                <p className="text-gray-600 text-sm">{store.whatsappNumber || '+1 234 567 890'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-gray-900" />
                            </div>
                            <h3 className="font-bold text-gray-900">Address</h3>
                            <p className="text-gray-600 text-sm italic">
                                Visit our physical store location or reach out via our digital channels.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                                    <input type="text" className="w-full h-12 border border-gray-200 rounded-lg px-4 outline-none focus:border-black transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                    <input type="email" className="w-full h-12 border border-gray-200 rounded-lg px-4 outline-none focus:border-black transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                                <input type="text" className="w-full h-12 border border-gray-200 rounded-lg px-4 outline-none focus:border-black transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                                <textarea rows={4} className="w-full border border-gray-200 rounded-lg p-4 outline-none focus:border-black transition-all resize-none"></textarea>
                            </div>
                            <button className="w-full h-12 bg-black text-white rounded-lg font-bold uppercase text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                                Send Message <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
