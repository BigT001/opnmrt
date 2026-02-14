import { MetadataRoute } from 'next';

async function getStores() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    try {
        const res = await fetch(`${apiUrl}/stores`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error('Sitemap: Failed to fetch stores', err);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const stores = await getStores();

    // Base URLs
    const routes = ['', '/login', '/register'].map((route) => ({
        url: `https://opnmart.com${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
    }));

    // Dynamic Store URLs (including all brand variations like opnmrt)
    const storeRoutes = stores.map((store: any) => ({
        url: `https://${store.subdomain}.opnmart.com`,
        lastModified: new Date(store.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...storeRoutes];
}
