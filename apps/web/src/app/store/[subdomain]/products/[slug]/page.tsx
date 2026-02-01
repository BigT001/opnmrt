import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductDetailClient from './ProductDetailClient';
import { headers } from 'next/headers';

async function getProduct(id: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
            { next: { revalidate: 60 } }
        );
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

async function getStore(subdomain: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/stores/resolve?subdomain=${subdomain}`,
            { next: { revalidate: 60 } }
        );
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ subdomain: string; slug: string }>;
}) {
    const { subdomain, slug } = await params;
    const store = await getStore(subdomain);
    const product = await getProduct(slug);

    if (!store || !product) {
        notFound();
    }

    const headersList = await headers();
    const hostname = headersList.get('host') || '';

    // Check if we are on a subdomain (e.g., samstar.localhost or samstar.opnmart.com)
    // AND ensure it matches the current store's subdomain
    const isSubdomain = hostname.includes(subdomain) && (hostname.includes('localhost') || hostname.includes('opnmart.com'));
    const backLink = isSubdomain ? '/' : `/store/${subdomain}`;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link href={backLink} className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-8 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Store
                </Link>

                <ProductDetailClient product={product} store={store} subdomain={subdomain} />
            </div>
        </div>
    );
}
