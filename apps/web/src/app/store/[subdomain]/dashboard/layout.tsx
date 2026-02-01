'use client';

import React from 'react';
import Link from 'next/link';

export default async function BuyerLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ subdomain: string }>;
}) {
    const { subdomain } = await params;
    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b px-8 h-16 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-8">
                    <Link href={`/`} className="text-xl font-bold text-gray-900 border-r pr-8">
                        {subdomain.toUpperCase()}
                    </Link>
                    <div className="space-x-4 flex text-sm">
                        <Link href={`/dashboard`} className="text-primary font-bold">My Orders</Link>
                        <Link href={`/`} className="text-slate-500 hover:text-slate-900 transition-colors">Storefront</Link>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Account</span>
                    <div className="h-8 w-8 rounded-full bg-slate-200" />
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
