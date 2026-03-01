'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
    const iconSizes = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
        xl: 'w-14 h-14'
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-2xl',
        xl: 'text-4xl'
    };

    return (
        <div className={`flex items-center space-x-2.5 group cursor-pointer ${className}`}>
            <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
                {/* Outer decorative ring */}
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-[1.5px] border-dashed border-emerald-500/30 rounded-full"
                />

                {/* Main Logo Symbol: A sleek, geometric 'O' as a portal */}
                <div className="relative w-[85%] h-[85%] bg-emerald-500 rounded-[35%] flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                    {/* Inner light/glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 opacity-90" />

                    {/* The 'O' character symbol - using a high-end minimalist font style */}
                    <span className="relative text-white dark:text-[#030712] font-black italic transform -skew-x-6 text-[115%] select-none">
                        O
                    </span>

                    {/* Reflection overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none" />
                </div>

                {/* Pulse ring on hover */}
                <div className="absolute -inset-1 border border-emerald-500/0 rounded-full group-hover:border-emerald-500/20 group-hover:scale-110 transition-all duration-500" />
            </div>

            {showText && (
                <div className="flex flex-col">
                    <span className={`${textSizes[size]} font-black tracking-[-0.05em] text-foreground leading-none flex items-baseline`}>
                        OPN
                        <span className="text-emerald-500 italic ml-0.5">MRT</span>
                    </span>
                    {size === 'lg' || size === 'xl' ? (
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 -mt-0.5">
                            Digital Commerce Engine
                        </span>
                    ) : null}
                </div>
            )}
        </div>
    );
}
