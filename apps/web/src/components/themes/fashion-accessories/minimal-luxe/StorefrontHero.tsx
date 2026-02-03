'use client';

import { HeroProps } from '../../types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export function MinimalLuxeHero({ store }: HeroProps) {
    const { subdomain } = useParams<{ subdomain: string }>();

    return (
        <div className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-white">
            {/* Background Image with Reveal Animation */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-l from-white/20 via-transparent to-black/10 z-10" />
                <img
                    src={store.heroImage || "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=2000"}
                    alt="Fashion Hero"
                    className="w-full h-full object-cover object-center"
                />
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 w-full flex justify-end">
                <div className="max-w-2xl text-right">
                    {/* Floating Accent */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex items-center justify-end space-x-4 mb-6"
                    >
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.5em]">
                            Est. {new Date().getFullYear()}
                        </span>
                        <div className="w-12 h-[1px] bg-gray-900"></div>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 1, ease: [0.19, 1, 0.22, 1] }}
                        className="text-7xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.85] uppercase mb-8"
                    >
                        {store.heroTitle?.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        )) || (
                                <>
                                    <span className="block italic font-light serif text-primary">Luxury</span>
                                    <span className="block">Minimal</span>
                                </>
                            )}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-lg md:text-xl font-medium text-gray-500 tracking-tight max-w-md ml-auto"
                    >
                        {store.heroSubtitle || "Curated collections for the modern aesthetic. Experience luxury in every thread."}
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="pt-12"
                    >
                        <Link
                            href={`/store/${subdomain}/shop`}
                            className="group relative inline-flex items-center px-12 py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:bg-black"
                        >
                            <span className="relative z-10">Shop Collection</span>
                            <div className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover:w-full opacity-10" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Aesthetic Decorative Elements */}
            <div className="absolute bottom-10 left-10 z-10 hidden lg:block">
                <div className="flex flex-col space-y-4">
                    <div className="w-px h-24 bg-gray-100 relative overflow-hidden">
                        <motion.div
                            animate={{ y: [0, 96] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 w-full h-1/3 bg-gray-900/20"
                        />
                    </div>
                    <span className="text-[8px] font-bold text-gray-400 rotate-90 origin-left translate-x-1 uppercase tracking-widest">
                        Scroll
                    </span>
                </div>
            </div>
        </div>
    );
}

