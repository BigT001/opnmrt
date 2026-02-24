import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

async function getStore(subdomain: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/stores/resolve?subdomain=${subdomain}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string }> }): Promise<Metadata> {
    const { subdomain } = await params;
    const store = await getStore(subdomain);
    return { title: `Privacy Policy | ${store?.name || subdomain}` };
}

export default async function PrivacyPage({ params }: { params: Promise<{ subdomain: string }> }) {
    const { subdomain } = await params;
    const store = await getStore(subdomain);
    if (!store) notFound();

    const storeName = store.name;
    const year = new Date().getFullYear();

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                {/* Header */}
                <div className="mb-12 pb-8 border-b border-gray-100">
                    <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.4em] mb-4">Legal</p>
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-tight">
                        Privacy Policy
                    </h1>
                    <p className="mt-4 text-sm text-gray-400">Last updated: February {year}</p>
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none space-y-10 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">1. Information We Collect</h2>
                        <p>
                            When you visit {storeName}, we may collect information you provide directly such as your name,
                            email address, shipping address, and payment information when you place an order. We also
                            automatically collect certain technical information including your IP address, browser type,
                            and pages visited to help us improve our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">2. How We Use Your Information</h2>
                        <p>
                            We use your information to process your orders, communicate with you about your purchases,
                            send you updates or promotional offers (only with your consent), and improve our website
                            and customer experience. We never sell your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">3. Cookies</h2>
                        <p>
                            We use cookies to keep items in your cart, remember your preferences, and understand how
                            visitors use our site. You can disable cookies in your browser settings, though some features
                            of the site may not function correctly without them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">4. Data Sharing</h2>
                        <p>
                            We share your data only with trusted third-party service providers necessary to operate our store,
                            such as payment processors and shipping carriers. These parties are bound by strict confidentiality
                            agreements and may not use your data for any other purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">5. Your Rights</h2>
                        <p>
                            You have the right to access, update, or delete the personal information we hold about you.
                            To exercise these rights, please contact us. We will respond to your request within 30 days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">6. Security</h2>
                        <p>
                            We take data security seriously and employ industry-standard measures to protect your information.
                            However, no method of transmission over the internet is 100% secure and we cannot guarantee
                            absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">7. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please reach out through our store's
                            contact page or by emailing us directly. We're happy to help.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    © {year} {storeName} · All Rights Reserved
                </div>
            </div>
        </div>
    );
}
