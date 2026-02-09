import { ReactNode } from 'react';

// Theme categories
export type ThemeCategory = 'FASHION_ACCESSORIES' | 'BEAUTY_SKINCARE' | 'GADGETS_ACCESSORIES';

// Theme names
export type ThemeName =
    | 'MINIMAL_LUXE' | 'GLAMOUR_EVE' | 'CHIC_URBAN' // Fashion
    | 'VINTAGE_CHARM' | 'PURE_BOTANICAL' | 'RADIANT_GLOW' // Beauty
    | 'STARK_EDGE' | 'TECH_SPEC' | 'NEON_STREAM' // Gadgets
    | 'DEFAULT' | 'MODERN' | 'CLASSIC' | 'BOLD'; // Aliases and Defaults

// Store data structure
export interface StoreData {
    id: string;
    name: string;
    subdomain: string;
    logo?: string | null;
    heroImage?: string | null;
    heroTitle?: string | null;
    heroSubtitle?: string | null;
    primaryColor?: string | null;
    theme?: string;
    themeConfig?: any;
    biography?: string | null;
    officialEmail?: string | null;
    whatsappNumber?: string | null;
    useWhatsAppCheckout?: boolean;
}

// Product data structure
export interface ProductData {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    price: number;
    image?: string | null;
    images?: string[];
    stock: number;
    storeId: string;
}

// Component Props
export interface NavbarProps {
    storeName: string;
    logo?: string | null;
    subdomain?: string;
    storeId?: string;
}

export interface FooterProps {
    storeName: string;
}

export interface HeroProps {
    store: StoreData;
}

export interface ProductGridProps {
    products: ProductData[];
    subdomain: string;
    storeId: string;
}

export interface ProductDetailProps {
    product: ProductData;
    store: StoreData;
    subdomain: string;
}

export interface CartDrawerProps {
    storeId?: string;
}

export interface CheckoutProps {
    store: StoreData;
    subdomain: string;
}

export interface StoreThemeProps {
    store: StoreData;
    children: ReactNode;
}

export interface PageProps {
    store: StoreData;
    products: ProductData[];
    subdomain: string;
}

export interface ProductPageProps {
    store: StoreData;
    product: ProductData;
    subdomain: string;
}

// Theme component bundle
export interface ThemeComponents {
    Navbar: React.FC<NavbarProps>;
    Footer: React.FC<FooterProps>;
    StorefrontHero: React.FC<HeroProps>;
    ProductGrid: React.FC<ProductGridProps>;
    ProductDetail: React.FC<ProductDetailProps>;
    CartDrawer: React.FC<CartDrawerProps>;
    CheckoutPage: React.FC<CheckoutProps>;
    Layout: React.FC<StoreThemeProps>;
    StorefrontPage: React.FC<PageProps>;
    ProductPage: React.FC<ProductPageProps>;
    AboutPage: React.FC<PageProps>;
    ShopPage: React.FC<PageProps>;
}
