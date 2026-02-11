import { notFound } from 'next/navigation';
import { getThemeComponents } from '@/components/themes/registry';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getProduct(id: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
            { next: { revalidate: 60 } }
        );
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        return null;
    }
}

async function getStore(subdomain: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/stores/resolve?subdomain=${subdomain}`,
            { next: { revalidate: 60 } }
        );
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        return null;
    }
}

import { TrackProductView } from '@/components/analytics/TrackProductView';

export default async function ProductPage({
    params,
}: {
    params: Promise<{ subdomain: string; slug: string }>;
}) {
    const { subdomain, slug } = await params;
    const store = await getStore(subdomain);
    const product = await getProduct(slug);

    if (!store || !product) {
        notFound();
    }

    const { ProductPage: ThemeProductPage } = getThemeComponents(store.theme);

    return (
        <>
            <TrackProductView storeId={store.id} productId={product.id} />
            <ThemeProductPage
                store={store}
                product={{
                    ...product,
                    image: product.image || product.images?.[0] || 'https://via.placeholder.com/600'
                }}
                subdomain={subdomain}
            />
        </>
    );
}
