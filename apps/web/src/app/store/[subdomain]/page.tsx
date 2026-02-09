import { notFound } from 'next/navigation';
import { getThemeComponents } from '@/components/themes/registry';

async function getStore(subdomain: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    try {
        const res = await fetch(
            `${apiUrl}/stores/resolve?subdomain=${subdomain}`,
            {
                cache: 'no-store',
                next: { revalidate: 0 }
            }
        );
        if (!res.ok) {
            console.error(`Store resolve failed for ${subdomain}: ${res.status}`);
            return null;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Failed to resolve store ${subdomain} at ${apiUrl}:`, error);
        return null;
    }
}

async function getProducts(subdomain: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    try {
        const res = await fetch(
            `${apiUrl}/products?subdomain=${subdomain}`,
            {
                cache: 'no-store',
                next: { revalidate: 0 }
            }
        );
        if (!res.ok) {
            console.error(`Products fetch failed for ${subdomain}: ${res.status}`);
            return [];
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch products for ${subdomain} at ${apiUrl}:`, error);
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
