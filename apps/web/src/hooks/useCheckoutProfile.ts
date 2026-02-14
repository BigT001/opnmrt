import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface CheckoutFormData {
    email: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    address: string;
    city: string;
    postalCode?: string;
    postalKey?: string;
    [key: string]: any; // Allow for theme-specific fields
}

export const useCheckoutProfile = (initialData: CheckoutFormData) => {
    const [formData, setFormData] = useState<CheckoutFormData>(initialData);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
            setIsLoaded(true);
            return;
        }

        api.get('/users/profile').then(res => {
            const user = res.data;
            const splitName = user.name ? user.name.split(' ') : ['', ''];

            setFormData(prev => ({
                ...prev,
                email: user.email || prev.email,
                phone: user.phone || prev.phone || '',
                firstName: user.shippingAddress?.firstName || splitName[0] || prev.firstName || '',
                lastName: user.shippingAddress?.lastName || splitName.slice(1).join(' ') || prev.lastName || '',
                fullName: user.name || prev.fullName || '',
                address: user.shippingAddress?.address || prev.address || '',
                city: user.shippingAddress?.city || prev.city || '',
                postalCode: user.shippingAddress?.postalCode || prev.postalCode || '',
                postalKey: user.shippingAddress?.postalCode || prev.postalKey || '',
            }));
            setIsLoaded(true);
        }).catch(err => {
            console.debug("Checkout prefill: User not authenticated or profile fetch failed.");
            setIsLoaded(true);
        });
    }, []);

    const syncProfile = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        const name = formData.fullName || `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
        const splitName = name.split(' ');

        await api.patch('/users/profile-json', {
            shippingAddress: {
                firstName: formData.firstName || splitName[0] || '',
                lastName: formData.lastName || splitName.slice(1).join(' ') || '',
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode || formData.postalKey || '',
                country: 'Nigeria'
            },
            email: formData.email,
            phone: formData.phone,
            name: name
        });
    };

    return { formData, setFormData, syncProfile, isLoaded };
};
