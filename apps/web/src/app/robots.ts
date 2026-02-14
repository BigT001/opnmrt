import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',
                    '/login',
                    '/register',
                    '/checkout',
                    '*/customer/account',
                ],
            },
        ],
        sitemap: 'https://opnmart.com/sitemap.xml',
    };
}
