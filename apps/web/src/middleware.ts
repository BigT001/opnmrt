import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host');
    const searchParams = url.searchParams.toString();
    const path = url.pathname;

    // Skip internal paths, API, and already rewritten store paths
    if (path.startsWith('/api') || path.startsWith('/_next') || path.startsWith('/store') || path.includes('.')) {
        return NextResponse.next();
    }

    // Determine if we are on a subdomain
    const rawHostname = hostname || '';
    const cleanHostname = rawHostname.toLowerCase().split(':')[0]; // Force lowercase and strip port
    const baseDomain = (process.env.NEXT_PUBLIC_APP_BASE_DOMAIN || 'localhost:3000').toLowerCase().split(':')[0];

    // We only rewrite if the hostname ends with .baseDomain and is not just baseDomain or www.baseDomain
    if (cleanHostname !== baseDomain && cleanHostname.endsWith(`.${baseDomain}`)) {
        const subdomain = cleanHostname.replace(`.${baseDomain}`, '');

        // Skip 'www' and empty subdomains
        if (subdomain && subdomain !== 'www') {
            const rewriteUrl = `/store/${subdomain}${path}${searchParams ? `?${searchParams}` : ''}`;
            console.log(`[MIDDLEWARE] Subdomain rewrite: ${cleanHostname}${path} -> ${rewriteUrl}`);
            return NextResponse.rewrite(new URL(rewriteUrl, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
