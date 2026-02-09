import { notFound } from 'next/navigation';
import { getThemeComponents } from '@/components/themes/registry';

async function getStore(subdomain: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/stores/resolve?subdomain=${subdomain}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error('Failed to resolve store:', error);
        return null;
    }
}

async function getProducts(subdomain: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products?subdomain=${subdomain}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return [];
        const text = await res.text();
        if (!text || text.trim() === '') return [];
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse products JSON:', text);
            return [];
        }
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

export default async function AboutPage({
    params,
}: {
    params: Promise<{ subdomain: string }>;
}) {
    const { subdomain } = await params;
    const store = await getStore(subdomain);
    const products = await getProducts(subdomain);

    if (!store) {
        notFound();
    }

    const { AboutPage } = getThemeComponents(store.theme);

    return (
        <AboutPage
            store={store}
            products={products.map((p: any) => ({
                ...p,
                image: p.image || p.images?.[0] || 'https://via.placeholder.com/400'
            }))}
            subdomain={subdomain}
        />
    );
}
