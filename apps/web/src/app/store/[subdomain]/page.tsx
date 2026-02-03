import { notFound } from 'next/navigation';
import { getThemeComponents } from '@/components/themes/registry';

async function getStore(subdomain: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/stores/resolve?subdomain=${subdomain}`,
            { next: { revalidate: 0 } }
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
            { next: { revalidate: 0 } }
        );
        if (!res.ok) return [];
        const text = await res.text();
        return text ? JSON.parse(text) : [];
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

export default async function StorefrontPage({
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

    const { StorefrontPage } = getThemeComponents(store.theme);

    return (
        <StorefrontPage
            store={store}
            products={products.map((p: any) => ({
                ...p,
                image: p.image || p.images?.[0] || 'https://via.placeholder.com/400'
            }))}
            subdomain={subdomain}
        />
    );
}
