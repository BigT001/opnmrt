'use client';

import React from 'react';
import { useTheme } from 'next-themes';

export function LandingBackground() {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 dark:bg-emerald-600/10 blur-[120px] rounded-full animate-pulse-emerald" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 dark:bg-indigo-600/10 blur-[120px] rounded-full animate-pulse-emerald" style={{ animationDelay: '2s' }} />
            {mounted && (
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: theme === 'dark'
                            ? `radial-gradient(#ffffff 1px, transparent 1px)`
                            : `radial-gradient(#000000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            )}
        </div>
    );
}
