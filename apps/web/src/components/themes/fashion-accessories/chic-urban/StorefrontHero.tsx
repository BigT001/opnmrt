'use client';

import { HeroProps } from '../../types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ChicUrbanHero({ store }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

    return (
        <section ref={containerRef} className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-black pt-24 select-none">
            {/* Industrial Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle, #CCFF00 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* VHS Scanline Overlay */}
            <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }} />

            {/* Main Imagery */}
            <motion.div style={{ y: y1, rotate }} className="absolute inset-0 z-10 p-10 lg:p-24">
                <div className="relative w-full h-full border-4 border-[#CCFF00] overflow-hidden group">
                    <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-transparent transition-all duration-700" />
                    <img
                        src={store.heroImage || "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&q=80&w=2940"}
                        alt="Hero"
                        className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-110 group-hover:scale-100"
                    />
                    {/* Corner Widgets */}
                    <div className="absolute top-4 left-4 z-20 font-mono text-[10px] text-[#CCFF00] bg-black px-2 py-1">
                        REC [00:45:22:01]
                    </div>
                    <div className="absolute bottom-4 right-4 z-20 font-mono text-[10px] text-[#CCFF00] bg-black px-2 py-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-600 animate-pulse rounded-full" />
                        LIVE SIGNAL // GRID_01
                    </div>
                </div>
            </motion.div>

            {/* Shifting Outlined Typography */}
            <div className="relative z-30 flex flex-col items-center">
                <motion.div style={{ x: y2 }} className="mb-[-2vw]">
                    <h1 className="text-[12vw] font-black uppercase italic leading-none tracking-tighter text-transparent stroke-2 stroke-white flex"
                        style={{ WebkitTextStroke: '2px white' }}>
                        {store.heroTitle?.split(' ')[0] || "URBAN"}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-[15vw] font-black uppercase leading-none tracking-tighter text-[#CCFF00] drop-shadow-[10px_10px_0_rgba(0,0,0,1)]">
                        {store.heroTitle?.split(' ')[1] || "SYSTEM"}
                    </h1>
                </motion.div>

                <motion.div style={{ x: y1 }} className="mt-[-2vw]">
                    <h1 className="text-[12vw] font-black uppercase italic leading-none tracking-tighter text-transparent stroke-2 stroke-white"
                        style={{ WebkitTextStroke: '2px white' }}>
                        {store.heroSubtitle?.split(' ')[0] || "PULSE"}
                    </h1>
                </motion.div>
            </div>

            {/* Scroll Inducer */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.4em] animate-pulse">Enter Archive</span>
                <div className="w-10 h-1 bg-white/20 overflow-hidden">
                    <motion.div
                        animate={{ x: [-40, 40] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full bg-[#CCFF00]"
                    />
                </div>
            </div>

            {/* Tactical Sidebar Metadata */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 text-white/20 font-mono text-[9px] uppercase tracking-widest vertical-text select-none">
                <p>LAT: 35.6895° N // LONG: 139.6917° E</p>
                <p>OS: CHIC_URBAN_KERNEL_v4.2</p>
                <p>SECURE: AES-256-GCM</p>
            </div>
        </section>
    );
}

const styles = `
.vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
}
`;

