import { MetadataRoute } from 'next';
import { APP_URL } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = APP_URL;

    // List main public routes here
    const routes = [
        '',
        '/register',
        '/login',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));
}
