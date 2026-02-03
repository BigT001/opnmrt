'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export function MinimalLuxeTopBar() {
    return (
        <div className="bg-white border-b border-gray-100 py-2 hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center cursor-pointer hover:text-gray-900 transition-colors">
                        English <ChevronDown className="ml-1 w-3 h-3" />
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-gray-900 transition-colors">
                        NGN <ChevronDown className="ml-1 w-3 h-3" />
                    </div>
                    <div>
                        Call Us: +234 800 OPNMART
                    </div>
                </div>
                <div className="text-gray-400">
                    Free delivery on order over <span className="text-primary font-bold">₦50,000</span>
                </div>
            </div>
        </div>
    );
}
