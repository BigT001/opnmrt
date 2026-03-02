import React from 'react';
import { Metadata } from 'next';
import { getThemeLayout } from '@/components/themes/registry';
import { TrackSession } from '@/components/analytics/TrackSession';
import { CartSync } from '@/components/storefront/CartSync';

async function getStore(subdomain: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api';
    const url = `${apiUrl}/stores/resolve?subdomain=${subdomain}`;
    try {
        const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string }> }): Promise<Metadata> {
    const { subdomain } = await params;
    const store = await getStore(subdomain);

    if (!store) {
        return {
            title: 'Store Not Found | OPNMRT',
        };
    }

    return {
        title: `${store.name} | OPNMRT (OpenMart)`,
        description: store.biography || `Shop amazing products at ${store.name}, powered by OPNMRT (OpenMart).`,
        openGraph: {
            title: `${store.name} | OPNMRT`,
            description: store.biography,
            url: `https://${subdomain}.opnmrt.com`,
            siteName: 'OPNMRT (OpenMart)',
        },
    };
}

export default async function StoreLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ subdomain: string }>;
}) {
    try {
        const { subdomain } = await params;
        const store = await getStore(subdomain);

        if (!store) {
            return <div>Store not found: {subdomain}</div>;
        }

        console.log(`[STORE_LAYOUT] Rendering theme layout: ${store.theme}`);
        const ThemeLayout = await getThemeLayout(store.theme);
        console.log(`[STORE_LAYOUT] Resolved ThemeLayout. Rendering now...`);

        return (
            <ThemeLayout store={store}>
                <CartSync />
                <TrackSession storeId={store.id} />
                {children}
            </ThemeLayout>
        );
    } catch (error: any) {
        console.error('[STORE_LAYOUT_CRITICAL_ERROR]', error);
        return (
            <div style={{ padding: '50px', color: 'red', background: '#fff' }}>
                <h1>Critical Render Error</h1>
                <pre>{error?.message || 'Unknown Error'}</pre>
                <pre>{error?.stack || ''}</pre>
            </div>
        );
    }
}
