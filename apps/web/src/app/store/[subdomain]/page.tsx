import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/storefront/ProductCard';

async function getStore(subdomain: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/stores/resolve?subdomain=${subdomain}`,
            { next: { revalidate: 60 } }
        );
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Failed to resolve store:', error);
        return null;
    }
}

async function getProducts(subdomain: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products?subdomain=${subdomain}`,
            { next: { revalidate: 0 } }
        );
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error('Failed to fetch products:', error);
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

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white py-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />
                    <img
                        src={store.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3"}
                        alt="Store Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-6">
                        Welcome to {store.name}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        {store.heroTitle || "Curated Excellence"}
                    </h1>
                    <p className="mt-4 text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        {store.heroSubtitle || "Discover products that elevate your lifestyle. Quality, design, and passion in every item."}
                    </p>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">Featured Collection</h2>
                    {/* Placeholder for filters */}
                    <div className="flex gap-2">
                        <button className="text-sm font-medium text-gray-600 hover:text-black">All</button>
                        <button className="text-sm font-medium text-gray-400 hover:text-black">New Arrivals</button>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500">No products available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8">
                        {products.map((product: any) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                storeId={store.id}
                                subdomain={subdomain}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
