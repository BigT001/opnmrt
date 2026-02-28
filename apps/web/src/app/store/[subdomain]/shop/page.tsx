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

export default async function ShopPage({
    params,
    searchParams,
}: {
    params: Promise<{ subdomain: string }>;
    searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}) {
    const { subdomain } = await params;
    const { q, category, tag } = await searchParams;
    const store = await getStore(subdomain);
    let products = await getProducts(subdomain);

    if (!store) {
        notFound();
    }

    // Client-side filtering passed down to props
    if (q) {
        const query = q.toLowerCase();
        products = products.filter((p: any) =>
            p.name.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query)
        );
    }

    if (category) {
        products = products.filter((p: any) => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (tag) {
        products = products.filter((p: any) => p.tags?.includes(tag) || p.label?.toLowerCase() === tag.toLowerCase());
    }

    const { ShopPage } = await getThemeComponents(store.theme);

    return (
        <ShopPage
            store={store}
            products={products.map((p: any) => ({
                ...p,
                image: p.image || p.images?.[0] || 'https://via.placeholder.com/400'
            }))}
            subdomain={subdomain}
        />
    );
}
