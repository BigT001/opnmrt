'use client';

import React from 'react';
import { themeRegistry } from './registry';
import { StoreData } from './types';

interface ThemeMiniPreviewProps {
    themeId: string;
    store: StoreData;
}

export function ThemeMiniPreview({ themeId, store }: ThemeMiniPreviewProps) {
    const components = themeRegistry[themeId] || themeRegistry.DEFAULT;
    const { Navbar, StorefrontHero } = components;

    if (!Navbar || !StorefrontHero) return null;

    // We use a fixed width/height for the internal "canvas" and scale it down
    // to fit the parent container. This ensures the layout is consistent.
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-white">
            <div
                className="origin-top-left"
                style={{
                    width: '1440px',
                    height: '900px',
                    transform: 'scale(0.25)', // 1440 * 0.25 = 360px (approx card width)
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}
            >
                <div className="w-full h-full border-[10px] border-slate-900/5 rounded-[40px] overflow-hidden shadow-2xl bg-white">
                    <Navbar storeName={store.name} logo={store.logo} />
                    <div className="flex-1 overflow-hidden">
                        <StorefrontHero store={store} />
                    </div>
                </div>
            </div>

            {/* Subtle Overlay to make it look more like a card */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
        </div>
    );
}
