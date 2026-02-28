import { ReactNode } from 'react';

// Theme categories
export type ThemeCategory = 'FASHION_ACCESSORIES' | 'BEAUTY_SKINCARE' | 'GADGETS_ACCESSORIES';

// Theme names
export type ThemeName =
    | 'MINIMAL_LUXE' | 'GLAMOUR_EVE' | 'CHIC_URBAN' // Fashion
    | 'VINTAGE_CHARM' | 'PURE_BOTANICAL' | 'RADIANT_GLOW' // Beauty
    | 'STARK_EDGE' | 'TECH_SPEC' | 'NEON_STREAM' // Gadgets
    | 'DEFAULT' | 'MODERN' | 'CLASSIC' | 'BOLD' | 'APPIFY' | 'VANTAGE' | 'ELECTSHOP'; // Aliases and Defaults

// Store data structure
export interface ThemeConfig {
    headerVariant?: string;
    heroVariant?: string;
    productCardVariant?: string;
    primaryFont?: string;
    secondaryFont?: string;
    primaryColor?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: string;
    hiddenSections?: string[];
    footerVariant?: string;
    borderRadius?: string;
    name?: string;
    logo?: string;
    navHome?: string;
    navShop?: string;
    navAbout?: string;
    [key: string]: any;
}

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
    themeConfig?: ThemeConfig | null;
    biography?: string | null;
    officialEmail?: string | null;
    whatsappNumber?: string | null;
    address?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    useWhatsAppCheckout?: boolean;
    paystackSubaccountCode?: string | null;
    subaccountStatus?: string | null;
    bankName?: string | null;
    bankCode?: string | null;
    accountNumber?: string | null;
    ninBvn?: string | null;
    cacNumber?: string | null;
    utilityBill?: string | null;
    verificationStatus?: string | null;
    hiddenSections?: string[];
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
    category?: string | null;
    colors?: string[];
    sizes?: string[];
    reviews?: {
        id: string;
        rating: number;
        comment?: string | null;
        createdAt: string;
        user?: {
            name?: string;
            image?: string;
        };
    }[];
}

// Component Props
export interface NavbarProps {
    storeName: string;
    logo?: string | null;
    subdomain?: string;
    storeId?: string;
    isPreview?: boolean;
    onConfigChange?: (config: any) => void;
    navHome?: string;
    navShop?: string;
    navAbout?: string;
    onNavigate?: (path: string) => void;
    greeting?: string;
    primaryColor?: string;
    themeConfig?: ThemeConfig | null;
}

export interface FooterProps {
    storeName: string;
    subdomain?: string;
    isPreview?: boolean;
    onConfigChange?: (config: any) => void;
    primaryColor?: string;
    themeConfig?: ThemeConfig | null;
    // Social media links
    instagram?: string | null;
    twitter?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
}

export interface HeroProps {
    store: StoreData;
    isPreview?: boolean;
    onConfigChange?: (config: any) => void;
}

export interface ProductGridProps {
    products: ProductData[];
    subdomain: string;
    storeId: string;
    store: StoreData;
    hideHeader?: boolean;
    hideControls?: boolean;
    isPreview?: boolean;
    onConfigChange?: (config: any) => void;
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
    isPreview?: boolean;
    onConfigChange?: (config: any) => void;
    onNavigate?: (path: string) => void;
    virtualPath?: string;
}

export interface PageProps {
    store: StoreData;
    products: ProductData[];
    subdomain: string;
    isPreview?: boolean;
    onConfigChange?: (config: any) => void;
}

export interface ProductPageProps {
    store: StoreData;
    product: ProductData;
    subdomain: string;
}

// Theme component bundle
export interface ThemeComponents {
    Navbar: React.ComponentType<NavbarProps>;
    Footer: React.ComponentType<FooterProps>;
    StorefrontHero: React.ComponentType<HeroProps>;
    ProductGrid: React.ComponentType<ProductGridProps>;
    ProductDetail: React.ComponentType<ProductDetailProps>;
    CartDrawer: React.ComponentType<CartDrawerProps>;
    CheckoutPage: React.ComponentType<CheckoutProps>;
    Layout: React.ComponentType<StoreThemeProps>;
    StorefrontPage: React.ComponentType<PageProps>;
    ProductPage: React.ComponentType<ProductPageProps>;
    AboutPage: React.ComponentType<PageProps>;
    ShopPage: React.ComponentType<PageProps>;
    FavoritesPage: React.ComponentType<PageProps>;
    ContactPage?: React.ComponentType<PageProps>;
    BlogPage?: React.ComponentType<PageProps>;
}
