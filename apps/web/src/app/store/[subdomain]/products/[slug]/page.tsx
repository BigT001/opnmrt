import { notFound } from 'next/navigation';
import { getThemeComponents } from '@/components/themes/registry';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getProduct(id: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
            { next: { revalidate: 60 } }
        );
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
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
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        return null;
    }
}

import { TrackProductView } from '@/components/analytics/TrackProductView';

import { Metadata } from 'next';

async function getReviewStats(productId: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/reviews/rating/${productId}`,
            { next: { revalidate: 60 } }
        );
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string; slug: string }> }): Promise<Metadata> {
    const { subdomain, slug } = await params;
    const store = await getStore(subdomain);
    const product = await getProduct(slug);

    if (!store || !product) {
        return {
            title: 'Product Not Found',
        };
    }

    const shareUrl = `https://${subdomain}.opnmart.com/products/${slug}`;
    const productImg = product.images?.[0] || 'https://via.placeholder.com/1200x630';

    return {
        title: `${product.name} | ${store.name}`,
        description: product.description || `Buy ${product.name} from ${store.name}. High quality gadgets and accessories.`,
        openGraph: {
            title: `${product.name} | ${store.name}`,
            description: product.description,
            url: shareUrl,
            siteName: store.name,
            images: [
                {
                    url: productImg,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                }
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} | ${store.name}`,
            description: product.description,
            images: [productImg],
        },
    };
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ subdomain: string; slug: string }>;
}) {
    const { subdomain, slug } = await params;
    const store = await getStore(subdomain);
    const product = await getProduct(slug);
    const reviewStats = await getReviewStats(slug);

    if (!store || !product) {
        notFound();
    }

    const { ProductPage: ThemeProductPage } = getThemeComponents(store.theme);

    const jsonLd: any = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image || product.images || [],
        description: product.description,
        sku: product.id,
        brand: {
            '@type': 'Brand',
            name: store.name,
        },
        offers: {
            '@type': 'Offer',
            url: `https://${subdomain}.opnmart.com/products/${slug}`,
            priceCurrency: 'NGN',
            price: product.price,
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
        },
    };

    if (reviewStats && reviewStats.totalReviews > 0) {
        jsonLd.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: reviewStats.averageRating,
            reviewCount: reviewStats.totalReviews,
            bestRating: '5',
            worstRating: '1',
        };
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <TrackProductView storeId={store.id} productId={product.id} productName={product.name} />
            <ThemeProductPage
                store={store}
                product={{
                    ...product,
                    image: product.image || product.images?.[0] || 'https://via.placeholder.com/600'
                }}
                subdomain={subdomain}
            />
        </>
    );
}
