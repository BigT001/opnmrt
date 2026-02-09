import { ThemeComponents, ThemeName, ThemeCategory } from './types';

// Importing all 9 independent themes
// Fashion
import * as MinimalLuxe from './fashion-accessories/minimal-luxe';
import * as GlamourEve from './fashion-accessories/glamour-eve';
import * as ChicUrban from './fashion-accessories/chic-urban';

// Beauty
import * as VintageCharm from './beauty-skincare/vintage-charm';
import * as PureBotanical from './beauty-skincare/pure-botanical';
import * as RadiantGlow from './beauty-skincare/radiant-glow';

// Gadgets
import * as StarkEdge from './gadgets-accessories/stark-edge';
import * as TechSpec from './gadgets-accessories/tech-spec';
import * as NeonStream from './gadgets-accessories/neon-stream';
import * as Default from './default';

// Helper to bundle theme components (assumes index.ts export structure)
const createBundle = (theme: any, prefix: string): ThemeComponents => {
    const Navbar = theme[`${prefix}Navbar`];
    const Footer = theme[`${prefix}Footer`];
    const StorefrontHero = theme[`${prefix}Hero`];
    const ProductGrid = theme[`${prefix}ProductGrid`];
    const ProductDetail = theme[`${prefix}ProductDetail`];
    const CartDrawer = theme[`${prefix}CartDrawer`];
    const CheckoutPage = theme[`${prefix}Checkout`];
    const Layout = theme[`${prefix}Layout`];

    // Create dynamic page components that use the theme's specific sub-components
    const DynamicStorefrontPage: React.FC<any> = (props) => (
        <div className="pb-20">
            {StorefrontHero && <StorefrontHero {...props} />}
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 mt-24">
                {ProductGrid && <ProductGrid {...props} />}
            </div>
        </div>
    );

    const DynamicProductPage: React.FC<any> = (props) => (
        <div className="pb-20">
            {ProductDetail && <ProductDetail {...props} />}
        </div>
    );

    const DynamicAboutPage: React.FC<any> = (props) => (
        <div className="pb-20 pt-32 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">About Us</h1>
            <div className="prose max-w-none">
                <p className="text-xl text-gray-600 leading-relaxed">
                    {props.store.biography || `Welcome to ${props.store.name}. We are dedicated to providing the best quality products for our customers.`}
                </p>
            </div>
        </div>
    );

    const DynamicShopPage: React.FC<any> = (props) => (
        <div className="pb-20 pt-32 px-6">
            <h1 className="text-4xl font-bold mb-12 text-center">Shop All</h1>
            <div className="max-w-[1400px] mx-auto">
                {ProductGrid && <ProductGrid {...props} />}
            </div>
        </div>
    );

    return {
        Navbar,
        Footer,
        StorefrontHero,
        ProductGrid,
        ProductDetail,
        CartDrawer,
        CheckoutPage,
        Layout,
        StorefrontPage: theme[`${prefix}StorefrontPage`] || DynamicStorefrontPage,
        ProductPage: theme[`${prefix}ProductPage`] || DynamicProductPage,
        AboutPage: theme[`${prefix}AboutPage`] || DynamicAboutPage,
        ShopPage: theme[`${prefix}ShopPage`] || DynamicShopPage,
    };
};

// Theme registry with all 9 themes
export const themeRegistry: Record<string, ThemeComponents> = {
    // Fashion
    MINIMAL_LUXE: createBundle(MinimalLuxe, 'MinimalLuxe'),
    GLAMOUR_EVE: createBundle(GlamourEve, 'GlamourEve'),
    CHIC_URBAN: createBundle(ChicUrban, 'ChicUrban'),

    // Beauty
    VINTAGE_CHARM: createBundle(VintageCharm, 'VintageCharm'),
    PURE_BOTANICAL: createBundle(PureBotanical, 'PureBotanical'),
    RADIANT_GLOW: createBundle(RadiantGlow, 'RadiantGlow'),

    // Gadgets
    STARK_EDGE: createBundle(StarkEdge, 'StarkEdge'),
    TECH_SPEC: createBundle(TechSpec, 'TechSpec'),
    NEON_STREAM: createBundle(NeonStream, 'NeonStream'),
    DEFAULT: {
        Navbar: Default.DefaultNavbar,
        Footer: Default.DefaultFooter,
        StorefrontHero: Default.DefaultHero,
        ProductGrid: Default.DefaultProductGrid,
        ProductDetail: Default.DefaultProductDetail,
        CartDrawer: Default.DefaultCartDrawer,
        CheckoutPage: Default.DefaultCheckout,
        Layout: Default.DefaultLayout,
        StorefrontPage: Default.DefaultStorefrontPage,
        ProductPage: Default.DefaultProductPage,
        AboutPage: Default.DefaultStorefrontPage, // Fallback to storefront page for now or create default
        ShopPage: Default.DefaultStorefrontPage,    // Fallback or create default
    },
};

// Aliases for backward compatibility
themeRegistry.MODERN = themeRegistry.MINIMAL_LUXE;
themeRegistry.CLASSIC = themeRegistry.VINTAGE_CHARM;
themeRegistry.BOLD = themeRegistry.STARK_EDGE;

// Theme metadata for selection UI
export interface ThemeMetadata {
    id: ThemeName;
    name: string;
    category: ThemeCategory;
    description: string;
}

export const themeMetadata: ThemeMetadata[] = [
    { id: 'MINIMAL_LUXE', name: 'Minimal Luxe', category: 'FASHION_ACCESSORIES', description: 'Clean, sophisticated, high-end minimal' },
    { id: 'GLAMOUR_EVE', name: 'Glamour Eve', category: 'FASHION_ACCESSORIES', description: 'High-fashion, dramatic and elegant' },
    { id: 'CHIC_URBAN', name: 'Chic Urban', category: 'FASHION_ACCESSORIES', description: 'Streetwear, modern and edgy' },

    { id: 'VINTAGE_CHARM', name: 'Vintage Charm', category: 'BEAUTY_SKINCARE', description: 'Timeless, elegant, handcrafted' },
    { id: 'PURE_BOTANICAL', name: 'Pure Botanical', category: 'BEAUTY_SKINCARE', description: 'Natural, organic aesthetic' },
    { id: 'RADIANT_GLOW', name: 'Radiant Glow', category: 'BEAUTY_SKINCARE', description: 'Bright, clean and refreshing' },

    { id: 'STARK_EDGE', name: 'Stark Edge', category: 'GADGETS_ACCESSORIES', description: 'Brutalist, industrial and bold' },
    { id: 'TECH_SPEC', name: 'Tech Spec', category: 'GADGETS_ACCESSORIES', description: 'Clean, data-driven and technical' },
    { id: 'NEON_STREAM', name: 'Neon Stream', category: 'GADGETS_ACCESSORIES', description: 'Cyberpunk, vibrant and futuristic' },
    { id: 'DEFAULT', name: 'System Default', category: 'FASHION_ACCESSORIES', description: 'Clean, versatile baseline storefront' },
];

export const getThemesByCategory = (category: ThemeCategory) => {
    return themeMetadata.filter(t => t.category === category);
};

export const getThemeComponents = (themeName: string = 'MINIMAL_LUXE'): ThemeComponents => {
    const normalizedName = themeName.toUpperCase().replace(/-/g, '_');
    return themeRegistry[normalizedName] || themeRegistry.DEFAULT || themeRegistry.MINIMAL_LUXE;
};

export const getThemeLayout = (themeName: string = 'MINIMAL_LUXE') => {
    return getThemeComponents(themeName).Layout;
};
