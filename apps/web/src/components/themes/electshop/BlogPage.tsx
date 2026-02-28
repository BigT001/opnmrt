'use client';

import React from 'react';
import { PageProps } from '../types';
import { Calendar, User, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
    {
        id: 1,
        title: "The Future of Smart Home Technology in 2026",
        excerpt: "Discover the latest trends in home automation and how AI is transforming our living spaces...",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop",
        author: "Alex Rivera",
        date: "Feb 24, 2026",
        category: "Smart Home"
    },
    {
        id: 2,
        title: "Top 5 Smartphones for Professional Photography",
        excerpt: "We compare the camera systems of this year's flagship devices to help you choose your next mobile studio...",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop",
        author: "Sarah Chen",
        date: "Feb 20, 2026",
        category: "Mobile"
    },
    {
        id: 3,
        title: "Why High-Fidelity Audio is Making a Massive Comeback",
        excerpt: "Audiophiles rejoice as record sales soar and digital platforms embrace lossless streaming quality...",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
        author: "Marcus Thorne",
        date: "Feb 15, 2026",
        category: "Audio"
    }
];

export function ElectshopBlogPage({ store, subdomain }: PageProps) {
    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <section className="bg-gray-50 py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl text-left">
                        <span className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-4 block border-l-4 border-brand pl-4">Insights & Updates</span>
                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter italic mb-8">
                            Knowledge <br /> Base
                        </h1>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed">
                            Stay updated with the latest in technology, product reviews, and trends from our expert contributors.
                        </p>
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {blogPosts.map((post) => (PostCard(post)))}
                </div>

                {/* Newsletter */}
                <div className="mt-32 bg-gray-950 rounded-[2.5rem] p-12 lg:p-24 text-white flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative border border-white/5">
                    <div className="relative z-10 max-w-xl text-left">
                        <span className="text-brand text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Exclusive Content</span>
                        <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic mb-6">Stay in the Loop</h2>
                        <p className="text-gray-400 font-medium">Subscribe to our newsletter to receive weekly tech updates and exclusive member deals.</p>
                    </div>
                    <form className="relative z-10 w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 w-full lg:w-80 outline-none focus:border-brand/50 transition-all placeholder:text-gray-500 font-bold text-sm"
                        />
                        <button className="bg-brand text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand/20">
                            Submit
                        </button>
                    </form>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>
            </section>
        </div>
    );
}

function PostCard(post: any) {
    return (
        <div key={post.id} className="group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-8 shadow-xl">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{post.category}</span>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> {post.author}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic group-hover:text-brand transition-colors leading-tight">
                    {post.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {post.excerpt}
                </p>
                <div className="pt-4 flex items-center gap-2 text-gray-950 font-black uppercase tracking-widest text-[10px] group-hover:text-brand transition-colors">
                    Read Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform text-brand" />
                </div>
            </div>
        </div>
    );
}
