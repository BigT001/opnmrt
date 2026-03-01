'use client';

import React from 'react';
import { useTheme } from 'next-themes';

export function LandingBackground() {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Main Ambient Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-500/10 blur-[150px] rounded-full animate-pulse opacity-50" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/10 blur-[150px] rounded-full animate-pulse opacity-50"
                style={{ animationDelay: '3s' }}
            />

            {/* Interactive Grid System */}
            {mounted && (
                <>
                    <div
                        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.3]"
                        style={{
                            backgroundImage: theme === 'dark'
                                ? `linear-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px)`
                                : `linear-gradient(rgba(0, 0, 0, 0.03) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1.5px, transparent 1.5px)`,
                            backgroundSize: '100px 100px'
                        }}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.6]"
                        style={{
                            backgroundImage: theme === 'dark'
                                ? `radial-gradient(rgba(255, 255, 255, 0.1) 1.5px, transparent 1.5px)`
                                : `radial-gradient(rgba(0, 0, 0, 0.05) 1.5px, transparent 1.5px)`,
                            backgroundSize: '33.33px 33.33px'
                        }}
                    />
                </>
            )}

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Vignette effect for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
        </div>
    );
}
