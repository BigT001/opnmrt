'use client';

import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function CheckoutPage() {
    const params = useParams<{ subdomain: string }>();
    const { items, totalPrice, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (items.length === 0 && !isSuccess && params?.subdomain) {
            router.push(`/store/${params.subdomain}`);
        }
    }, [items.length, params?.subdomain, router, isSuccess]);

    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                    <p className="text-gray-500 mb-8">
                        Thank you for your purchase. We've sent a confirmation email with your order details.
                    </p>
                    <Link
                        href={`/store/${params.subdomain}`}
                        className="block w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) return null; // Redirect handled in useEffect

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href={`./`} className="text-sm text-gray-500 hover:text-gray-900 flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Store
                    </Link>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Checkout Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Contact Info */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                                <div className="grid grid-cols-1 gap-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                        <input type="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border" />
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="newsletter" className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                                        <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-500">Email me with news and offers</label>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping address</h2>
                                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                                    <div className="sm:col-span-1">
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                                        <input type="text" id="firstName" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border" />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                                        <input type="text" id="lastName" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                        <input type="text" id="address" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border" />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                        <input type="text" id="city" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border" />
                                    </div>
                                    <div>
                                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal code</label>
                                        <input type="text" id="postalCode" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center p-4 border rounded-lg bg-gray-50">
                                        <input id="card" name="payment-type" type="radio" defaultChecked className="h-4 w-4 border-gray-300 text-black focus:ring-black" />
                                        <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">Credit Card (Simulated)</label>
                                    </div>
                                    <div className="grid grid-cols-1 gap-y-4">
                                        <div>
                                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card number</label>
                                            <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry</label>
                                                <input type="text" id="expiry" placeholder="MM / YY" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border" />
                                            </div>
                                            <div>
                                                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                                                <input type="text" id="cvc" placeholder="123" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black border border-transparent rounded-lg py-4 px-8 text-base font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay $${totalPrice().toFixed(2)}`
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5 mt-10 lg:mt-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <ul className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <li key={item.id} className="flex py-4">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-16 w-16 rounded-md object-cover object-center border border-gray-200"
                                            />
                                        )}
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>{item.name}</h3>
                                                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <dl className="space-y-4 border-t border-gray-200 pt-6 mt-6">
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Subtotal</dt>
                                    <dd className="text-sm font-medium text-gray-900">${totalPrice().toFixed(2)}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Shipping</dt>
                                    <dd className="text-sm font-medium text-gray-900">Free</dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <dt className="text-base font-bold text-gray-900">Total</dt>
                                    <dd className="text-base font-bold text-gray-900">${totalPrice().toFixed(2)}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
