import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export interface CheckoutItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface CheckoutOptions {
    storeId: string;
    items: CheckoutItem[];
    amount: number;
    email: string;
    customerName?: string;
    customerEmail?: string;
    onSuccess?: (reference: string) => void;
    onCancel?: () => void;
    metadata?: Record<string, any>;
}

export const useCheckoutPayment = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pre-load Paystack script on mount
    useEffect(() => {
        const scriptId = 'paystack-script';
        if (!document.getElementById(scriptId) && !(window as any).PaystackPop) {
            console.log('[CHECKOUT_DEBUG] 🌐 Pre-loading Paystack script...');
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

    const loadPaystackScript = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if ((window as any).PaystackPop) {
                resolve();
                return;
            }
            const scriptId = 'paystack-script';
            let script = document.getElementById(scriptId) as HTMLScriptElement;

            if (!script) {
                script = document.createElement('script');
                script.id = scriptId;
                script.src = 'https://js.paystack.co/v1/inline.js';
                script.async = true;
                document.head.appendChild(script);
            }

            const timeout = setTimeout(() => {
                reject(new Error('Payment gateway took too long to load.'));
            }, 10000);

            script.onload = () => {
                clearTimeout(timeout);
                resolve();
            };
            script.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Payment gateway failed to load. Check your internet or ad-blocker.'));
            };
        });
    };

    const processCheckout = async (options: CheckoutOptions) => {
        const { storeId, items, amount, email, onSuccess, onCancel, metadata = {} } = options;

        if (isSubmitting) return;

        setIsSubmitting(true);
        setError(null);
        const loadToast = toast.loading('Initializing order...');

        try {
            // 1. Create Order
            console.log('[CHECKOUT_DEBUG] 📦 Creating order...');
            const orderRes = await api.post('orders', {
                storeId,
                totalAmount: amount,
                customerName: options.customerName,
                customerEmail: options.customerEmail || email,
                items: items.map(p => ({
                    productId: p.id,
                    quantity: p.quantity,
                    price: p.price
                }))
            });

            const orderId = orderRes.data.id;
            toast.loading('Preparing payment gateway...', { id: loadToast });

            // 2. Initialize Payment
            console.log('[CHECKOUT_DEBUG] 💳 Initializing payment...');
            const payRes = await api.post('payments/initialize', {
                email,
                amount: Math.round(amount * 100), // convert to kobo for Paystack
                orderId,
                storeId,
                metadata
            });

            const { access_code, reference, publicKey, authorizationUrl } = payRes.data;
            console.log('[CHECKOUT_DEBUG] ✅ Payment details received', { reference });

            // 3. Load Paystack
            await loadPaystackScript().catch(err => {
                console.warn('[CHECKOUT_DEBUG] ⚠️ Script load failed, falling back to redirect');
                if (authorizationUrl) {
                    window.location.href = authorizationUrl;
                }
                throw err;
            });

            const PaystackPop = (window as any).PaystackPop;
            if (!PaystackPop) {
                if (authorizationUrl) {
                    toast.loading('Redirecting to secure payment page...', { id: loadToast });
                    window.location.href = authorizationUrl;
                    return;
                }
                throw new Error('Payment gateway failed to initialize.');
            }

            toast.dismiss(loadToast);

            console.log('[CHECKOUT_DEBUG] 🛠️ Opening Paystack popup with ref:', reference);

            // Refined setup: If we have access_code, we use it as the primary param.
            // Some versions of Paystack Inline use 'callback', some use 'onSuccess'. We'll provide both.
            const paystackConfig: any = {
                key: publicKey,
                email,
                amount: Math.round(amount * 100),
                ref: reference,
                onClose: () => {
                    console.log('%c[CHECKOUT_TRACE] 🚪 Paystack modal closed by user', 'color: #f59e0b;');
                    setIsSubmitting(false);
                    if (onCancel) onCancel();
                },
                // Use a standard function to ensure compatibility with Paystack's internls
                callback: (txn: any) => handlePaystackSuccess(txn),
                onSuccess: (txn: any) => handlePaystackSuccess(txn),
            };

            // If backend gave us an access_code, it's safer to use it
            if (access_code) {
                paystackConfig.access_code = access_code;
            }

            const handlePaystackSuccess = async (txn: any) => {
                const timestamp = new Date().toLocaleTimeString();
                console.log(`%c[CHECKOUT_TRACE] [${timestamp}] 🎉 Paystack SUCCESS callback fired`, 'color: #10b981; font-weight: bold; font-size: 14px;');
                console.log('[CHECKOUT_TRACE] Transaction Data:', txn);

                const verificationToast = toast.loading('Payment successful! Verifying with server...');
                const finalRef = txn.reference || reference;

                try {
                    console.log(`%c[CHECKOUT_TRACE] 📡 Initiating server-side verification: Order ${orderId} | Ref ${finalRef}`, 'color: #3b82f6;');

                    const verifyStart = Date.now();
                    const verifyRes = await api.post('payments/verify', {
                        reference: finalRef,
                        orderId,
                    }, { timeout: 40000 }); // 40s timeout for safety

                    const verifyEnd = Date.now();
                    console.log(`%c[CHECKOUT_TRACE] ✅ Verification COMPLETED in ${verifyEnd - verifyStart}ms`, 'color: #10b981; font-weight: bold;');

                    toast.success('Order confirmed!', { id: verificationToast });

                    if (onSuccess) {
                        console.log('[CHECKOUT_TRACE] 🏁 Triggering app success state...');
                        onSuccess(finalRef);
                    }
                } catch (err: any) {
                    const timestampErr = new Date().toLocaleTimeString();
                    console.error(`%c[CHECKOUT_TRACE] [${timestampErr}] ❌ VERIFICATION FAILED`, 'color: #ef4444; font-weight: bold;', err);

                    const errorMsg = err.response?.data?.message || (err.code === 'ECONNABORTED'
                        ? 'Verification timed out. Check your order history.'
                        : 'Something went wrong while confirming your payment.');

                    toast.error(errorMsg, { id: verificationToast });
                } finally {
                    setIsSubmitting(false);
                    console.log('[CHECKOUT_TRACE] 🧹 Submitting state cleared.');
                }
            };

            const handler = PaystackPop.setup(paystackConfig);
            handler.openIframe();

            // Safety fallback: if iframe doesn't appear in 5 seconds, redirect
            setTimeout(() => {
                const iframe = document.querySelector('iframe[name="paystack-iframe"]');
                if (!iframe && isSubmitting) {
                    console.warn('[CHECKOUT_DEBUG] ⚠️ Modal failed to open. Redirecting...');
                    if (authorizationUrl) {
                        toast('Opening payment page directly...');
                        window.location.href = authorizationUrl;
                    }
                }
            }, 5000);

        } catch (err: any) {
            toast.dismiss(loadToast);
            console.error('[CHECKOUT_DEBUG] ❌ Checkout failed:', err);
            const msg = err.message || err.response?.data?.message || 'Checkout failed. Please try again.';
            setError(msg);
            toast.error(msg);
            setIsSubmitting(false);
        }
    };

    return { processCheckout, isSubmitting, error, setError };
};
