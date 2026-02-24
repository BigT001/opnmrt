'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-[52px] h-7 rounded-full bg-gray-100 opacity-0 shrink-0" />
        );
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`relative inline-flex items-center w-[52px] h-7 rounded-full transition-colors duration-300 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary
                ${isDark
                    ? 'bg-gray-800 focus-visible:ring-offset-gray-950'
                    : 'bg-gray-200 focus-visible:ring-offset-white'
                }`}
        >
            {/* Track icons */}
            <Sun className={`absolute left-1.5 w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-50 text-amber-500'}`} />
            <Moon className={`absolute right-1.5 w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-70 text-indigo-300' : 'opacity-0'}`} />

            {/* Thumb */}
            <span
                className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-all duration-300
                    ${isDark
                        ? 'left-[calc(100%-1.625rem)] bg-gray-950'
                        : 'left-0.5 bg-white'
                    }`}
            >
                {isDark
                    ? <Moon className="w-3 h-3 text-indigo-300" />
                    : <Sun className="w-3 h-3 text-amber-500" />
                }
            </span>
        </button>
    );
}
