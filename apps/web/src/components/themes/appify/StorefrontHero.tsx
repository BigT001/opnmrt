'use client';

import React from 'react';
import { HeroProps } from '../types';
import { EditableText, EditableImage } from '../EditableContent';

export function AppifyHero({ store, isPreview, onConfigChange }: HeroProps) {
    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    return (
        <div className="px-5 py-4">
            <div
                className="relative overflow-hidden rounded-[32px] p-8 md:p-16 min-h-[220px] md:min-h-[450px] flex flex-col justify-end shadow-lg shadow-black/5"
                style={{ backgroundColor: store.primaryColor || '#f97316' }}
            >
                {/* Background image */}
                <EditableImage
                    src={store.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"}
                    onSave={(url) => handleSave('heroImage', url)}
                    isPreview={isPreview}
                    className="absolute inset-0 w-full h-full object-cover"
                    aspectRatio="aspect-video"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-4">
                    <EditableText
                        value={store.heroTitle || 'Get your special sale up to 50%'}
                        onSave={(val) => handleSave('heroTitle', val)}
                        isPreview={isPreview}
                        className="text-[28px] md:text-[56px] font-black text-white leading-[1.1] max-w-[85%] md:max-w-[70%] tracking-tight uppercase italic"
                        label="Hero Title"
                    />

                    <div>
                        <button
                            onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-[12px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl"
                        >
                            Shop Now
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 17L17 7" />
                                <path d="M7 7h10v10" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
