import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Define the base domain (e.g., opnmart.com or localhost:3000)
    const baseDomain = process.env.APP_BASE_DOMAIN || 'localhost:3000';

    // Skip middleware for internal paths, static files, and API
    if (
        url.pathname.startsWith('/_next') ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/static') ||
        url.pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    let subdomain: string | null = null;
    let customDomain: string | null = null;

    // Handle subdomain.localhost:3000 format
    if (hostname.includes('.localhost')) {
        const parts = hostname.split('.');
        if (parts.length >= 2 && parts[0] !== 'www') {
            subdomain = parts[0];
        }
    }
    // Handle subdomain.baseDomain format (production)
    else if (hostname.endsWith(`.${baseDomain}`)) {
        subdomain = hostname.replace(`.${baseDomain}`, '');
    }
    // Handle custom domains
    else if (hostname !== baseDomain && hostname !== 'localhost:3000' && hostname !== 'localhost') {
        customDomain = hostname;
    }

    // If no subdomain and no custom domain, it's the main landing page or admin/auth pages
    if (!subdomain && !customDomain) {
        // Check if we are on a reserved route that shouldn't be accessible via tenant domains
        return NextResponse.next();
    }

    // --- STORE RESOLUTION ---

    // In a high-performance app, we would use a cache (Edge Config / Redis) 
    // to avoid a DB hit for every single request.
    // For the MVP, we'll pass the context and let the page fetch the data,
    // or we could do a fetch here if needed.

    const targetPath = subdomain || customDomain;

    // Rewrite to the storefront path
    // This shifts /page to /store/[subdomain]/page
    // But we want to preserve the root for the storefront
    return NextResponse.rewrite(new URL(`/store/${targetPath}${url.pathname}${url.search}`, request.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
