import { notFound } from 'next/navigation';
import { getThemeComponents } from '@/components/themes/registry';

async function getStore(subdomain: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api';
    const url = `${apiUrl}/stores/resolve?subdomain=${subdomain}`;
    console.log(`[STORE_PAGE] Resolving store: ${subdomain}`);
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error(`[STORE_PAGE] Resolve error:`, error);
        return null;
    }
}

async function getProducts(subdomain: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api';
    const url = `${apiUrl}/products?subdomain=${subdomain}`;
    console.log(`[STORE_PAGE] Fetching products for: ${subdomain}`);
    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const text = await res.text();
        return text ? JSON.parse(text) : [];
    } catch (error) {
        console.error(`[STORE_PAGE] Products error:`, error);
        return [];
    }
}

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string }> }): Promise<Metadata> {
    const { subdomain } = await params;
    const store = await getStore(subdomain);

    if (!store) {
        return {
            title: 'Store Not Found',
        };
    }

    return {
        title: store.name,
        description: store.description || `Welcome to ${store.name}. Discover our unique collection.`,
        openGraph: {
            title: store.name,
            description: store.description || `Welcome to ${store.name}. Discover our unique collection.`,
            images: store.heroImage ? [store.heroImage] : [],
            type: 'website',
        },
    };
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
        return <div>Page Content: Store not found</div>;
    }

    const { StorefrontPage } = await getThemeComponents(store.theme);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Store',
                        name: store.name,
                        description: store.description,
                        url: `https://${subdomain}.opnmrt.com`,
                        image: store.logo,
                    }),
                }}
            />
            <StorefrontPage
                store={store}
                products={products}
                subdomain={subdomain}
            />
        </>
    );
}
