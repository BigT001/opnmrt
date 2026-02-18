import React from 'react';
import { getThemeComponents } from '@/components/themes/registry';

async function getStore(subdomain: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores/resolve?subdomain=${subdomain}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}

async function getProducts(storeId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/store/${storeId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export default async function FavoritesPage({
    params,
}: {
    params: Promise<{ subdomain: string }>;
}) {
    const { subdomain } = await params;
    const store = await getStore(subdomain);

    if (!store) return <div>Store not found</div>;

    const products = await getProducts(store.id);
    const { FavoritesPage: ThemeFavoritesPage } = getThemeComponents(store.theme);

    return <ThemeFavoritesPage store={store} products={products} subdomain={subdomain} />;
}
