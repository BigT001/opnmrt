import React from 'react';
import { getThemeLayout } from '@/components/themes/registry';
import { TrackSession } from '@/components/analytics/TrackSession';
import { CartSync } from '@/components/storefront/CartSync';

async function getStore(subdomain: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api';
    const url = `${apiUrl}/stores/resolve?subdomain=${subdomain}`;
    console.log(`[STORE_LAYOUT] Starting resolve for: ${subdomain}`);
    try {
        const res = await fetch(url, { cache: 'no-store' });
        console.log(`[STORE_LAYOUT] Resolve status for ${subdomain}: ${res.status}`);
        if (!res.ok) {
            return null;
        }
        const text = await res.text();
        if (!text || text.trim() === '') {
            console.warn(`[STORE_LAYOUT] Empty response from server for subdomain: ${subdomain}`);
            return null;
        }
        return JSON.parse(text);
    } catch (error) {
        console.error('[STORE_LAYOUT] Resolve error:', error);
        return null;
    }
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
