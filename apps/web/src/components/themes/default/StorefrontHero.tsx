'use client';

import { HeroProps } from '../types';

export function DefaultHero({ store }: HeroProps) {
    return (
        <div className="bg-gray-50 py-12 md:py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row items-stretch min-h-[500px] border border-gray-100">
                    {/* Content */}
                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center space-y-8 bg-gradient-to-br from-white to-gray-50">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block">
                                Welcome to {store.name}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">
                                {store.heroTitle || "New Season Arrivals"}
                            </h1>
                            <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
                                {store.heroSubtitle || "Shop our curated selection of high-quality products. Quality and style guaranteed."}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="px-8 py-4 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black hover:scale-105 transition-all">
                                Shop Collection
                            </button>
                            <button className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all">
                                View Details
                            </button>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="lg:w-1/2 relative bg-gray-100 min-h-[300px]">
                        <img
                            src={store.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"}
                            alt="Hero"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
