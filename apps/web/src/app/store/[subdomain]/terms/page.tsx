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
    return { title: `Terms & Conditions | ${store?.name || subdomain}` };
}

export default async function TermsPage({ params }: { params: Promise<{ subdomain: string }> }) {
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
                        Terms &amp; Conditions
                    </h1>
                    <p className="mt-4 text-sm text-gray-400">Last updated: February {year}</p>
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none space-y-10 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using {storeName}'s website and purchasing our products, you agree to be bound
                            by these Terms and Conditions. If you do not agree, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">2. Products & Pricing</h2>
                        <p>
                            We reserve the right to modify or discontinue any product at any time without notice.
                            Prices are subject to change. We make every effort to display accurate product information,
                            but we do not warrant that descriptions or prices are error-free. We reserve the right to
                            cancel orders placed with incorrect pricing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">3. Orders & Payment</h2>
                        <p>
                            By placing an order, you represent that you are legally capable of entering into binding
                            contracts. Full payment is required before orders are processed. We accept major credit cards
                            and other payment methods as displayed at checkout.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">4. Shipping & Delivery</h2>
                        <p>
                            Delivery times are estimates and not guaranteed. We are not responsible for delays caused
                            by third-party carriers, customs, or other factors outside our control. Risk of loss passes
                            to you upon delivery to the carrier.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">5. Returns & Refunds</h2>
                        <p>
                            We offer a 7-day return policy for unused items in their original condition and packaging.
                            To initiate a return, contact us within 7 days of receiving your order. Refunds will be
                            processed within 5-10 business days after we receive the returned item.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">6. Intellectual Property</h2>
                        <p>
                            All content on this website including images, text, logos, and designs are the exclusive
                            property of {storeName} and may not be copied, reproduced, or used without prior written
                            permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">7. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, {storeName} shall not be liable for any indirect,
                            incidental, special, or consequential damages arising from your use of our products or services.
                            Our total liability shall not exceed the amount paid for the order in question.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">8. Governing Law</h2>
                        <p>
                            These Terms are governed by and construed in accordance with applicable laws. Any disputes
                            shall be resolved through good-faith negotiation, and if necessary, through binding arbitration.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">9. Changes to Terms</h2>
                        <p>
                            We reserve the right to update these Terms at any time. Changes will be posted on this page
                            with an updated revision date. Continued use of our services after changes constitutes
                            acceptance of the new terms.
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
