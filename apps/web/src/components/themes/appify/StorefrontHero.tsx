'use client';

import React from 'react';
import { HeroProps } from '../types';

export function AppifyHero({ store }: HeroProps) {
    return (
        <div className="px-5 py-4">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-8 min-h-[180px] flex flex-col justify-end shadow-lg shadow-orange-500/20">
                {/* Background image */}
                {store.heroImage && (
                    <img
                        src={store.heroImage}
                        alt=""
                        className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-center opacity-40 mix-blend-overlay"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 via-orange-500/40 to-transparent" />

                <div className="relative z-10">
                    <h2 className="text-[22px] font-bold text-white leading-tight max-w-[65%]">
                        {store.heroTitle || 'Get your special sale up to 50%'}
                    </h2>
                    <button
                        onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
                        className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] text-white text-[11px] font-bold rounded-full hover:bg-[#0f0f1e] transition-colors"
                    >
                        Shop Now
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17L17 7" />
                            <path d="M7 7h10v10" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
