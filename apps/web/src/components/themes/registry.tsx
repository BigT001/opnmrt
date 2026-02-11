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
                {ProductGrid && <ProductGrid {...props} storeId={props.store.id} />}
            </div>
        </div>
    );

    const DynamicProductPage: React.FC<any> = (props) => (
        <div className="pb-20">
            {ProductDetail && <ProductDetail {...props} storeId={props.store.id} />}
        </div>
    );

    const DynamicAboutPage: React.FC<any> = (props) => (
        <div className="pb-32 pt-40 px-6 max-w-5xl mx-auto bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
            <div className="space-y-12">
                <header className="space-y-4">
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">Our Story</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">{props.store.name}</h1>
                    <div className="h-1.5 w-24 bg-blue-600 dark:bg-blue-400"></div>
                </header>
                <div className="prose prose-xl dark:prose-invert max-w-none">
                    <p className="text-2xl md:text-3xl font-light leading-relaxed text-gray-600 dark:text-gray-400">
                        {props.store.biography || `Welcome to ${props.store.name}. We are dedicated to providing the best quality products for our customers.`}
                    </p>
                </div>
            </div>
        </div>
    );

    const DynamicShopPage: React.FC<any> = (props) => (
        <div className="pb-32 pt-10 px-6 bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                    {/* Filters Sidebar - Desktop */}
                    <div className="hidden lg:block space-y-10">
                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4">Categories</h3>
                            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
                                <li className="text-blue-600 dark:text-blue-400 cursor-pointer flex items-center justify-between group">
                                    <span>All Products</span>
                                    <span className="h-[1px] w-4 bg-blue-600 dark:bg-blue-400"></span>
                                </li>
                                <li className="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">New Arrivals</li>
                                <li className="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Best Sellers</li>
                                <li className="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Exclusive Edit</li>
                            </ul>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4">Sort By</h3>
                            <select className="bg-transparent border-none text-[11px] font-bold text-gray-400 uppercase tracking-widest focus:ring-0 cursor-pointer w-full p-0">
                                <option>Recently Added</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </section>

                        <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300">
                                {props.products.length} Items Indexed
                            </span>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        {ProductGrid && <ProductGrid {...props} storeId={props.store.id} hideHeader={true} />}
                    </div>
                </div>
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
