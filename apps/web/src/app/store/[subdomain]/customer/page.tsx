'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CustomerIndexPage() {
    const router = useRouter();
    const { subdomain } = useParams<{ subdomain: string }>();

    useEffect(() => {
        router.replace(`/store/${subdomain}/customer/orders`);
    }, [router, subdomain]);

    return null;
}
