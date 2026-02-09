'use client';

import React from 'react';
import { FooterProps } from '../types';

export function DefaultFooter({ storeName }: FooterProps) {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">{storeName}</h3>
                        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                            Established to provide the finest selection of premium products.
                            We believe in quality, durability, and timeless design.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Shopping</h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-600">
                            <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Collections</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Support</h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-600">
                            <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} {storeName}. Built with OPNMRT.
                    </p>
                    <div className="flex gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
