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
    const baseDomain = process.env.NEXT_PUBLIC_APP_BASE_DOMAIN || 'localhost:3000';

    if (hostname && hostname !== baseDomain) {
        const subdomain = hostname.replace(`.${baseDomain}`, '');

        // Rewrite to store path
        if (subdomain && subdomain !== hostname) {
            console.log(`[MIDDLEWARE] Rewriting ${hostname}${path} to /store/${subdomain}${path}`);
            return NextResponse.rewrite(
                new URL(`/store/${subdomain}${path}${searchParams ? `?${searchParams}` : ''}`, request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
