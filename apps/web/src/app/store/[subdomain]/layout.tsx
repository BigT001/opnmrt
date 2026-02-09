import React from 'react';
import { getThemeLayout } from '@/components/themes/registry';

async function getStore(subdomain: string) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/stores/resolve?subdomain=${subdomain}`;
    console.log(`Resolving store at: ${url}`);
    try {
        const res = await fetch(
            url,
            { cache: 'no-store' } // Disable cache for debugging
        );
        console.log(`Store resolve status: ${res.status}`);
        if (!res.ok) {
            console.error(`Store resolve failed: ${await res.text()}`);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('Failed to resolve store (FETCH ERROR):', error);
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
    const { subdomain } = await params;
    const store = await getStore(subdomain);

    if (!store) {
        return <div>Store not found</div>;
    }

    const ThemeLayout = getThemeLayout(store.theme);

    return (
        <ThemeLayout store={store}>
            {children}
        </ThemeLayout>
    );
}
