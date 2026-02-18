import { ThemeComponents, ThemeName, ThemeCategory } from './types';
import * as Default from './default';
import * as Appify from './appify';


// Theme registry — simplified to DEFAULT only
export const themeRegistry: Record<string, ThemeComponents> = {
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
        AboutPage: Default.DefaultStorefrontPage,
        ShopPage: Default.DefaultStorefrontPage,
        FavoritesPage: Default.DefaultStorefrontPage,
    },
    APPIFY: {
        Navbar: Appify.AppifyNavbar,
        Footer: Appify.AppifyFooter,
        StorefrontHero: Appify.AppifyHero,
        ProductGrid: Appify.AppifyProductGrid,
        ProductDetail: Appify.AppifyProductDetail,
        CartDrawer: Appify.AppifyCartDrawer,
        CheckoutPage: Appify.AppifyCheckout,
        Layout: Appify.AppifyLayout,
        StorefrontPage: Appify.AppifyHomePage,
        ProductPage: Appify.AppifyProductPage,
        AboutPage: Appify.AppifyHomePage,
        ShopPage: Appify.AppifyShopPage,
        FavoritesPage: Appify.AppifyFavoritesPage,
    },
};

// All old theme names point to DEFAULT
themeRegistry.MINIMAL_LUXE = themeRegistry.DEFAULT;
themeRegistry.GLAMOUR_EVE = themeRegistry.DEFAULT;
themeRegistry.CHIC_URBAN = themeRegistry.DEFAULT;
themeRegistry.VINTAGE_CHARM = themeRegistry.DEFAULT;
themeRegistry.PURE_BOTANICAL = themeRegistry.DEFAULT;
themeRegistry.RADIANT_GLOW = themeRegistry.DEFAULT;
themeRegistry.STARK_EDGE = themeRegistry.DEFAULT;
themeRegistry.TECH_SPEC = themeRegistry.DEFAULT;
themeRegistry.NEON_STREAM = themeRegistry.DEFAULT;
themeRegistry.MODERN = themeRegistry.DEFAULT;
themeRegistry.CLASSIC = themeRegistry.DEFAULT;
themeRegistry.BOLD = themeRegistry.DEFAULT;

// Theme metadata for selection UI
export interface ThemeMetadata {
    id: ThemeName;
    name: string;
    category: ThemeCategory;
    description: string;
}

export const themeMetadata: ThemeMetadata[] = [
    { id: 'DEFAULT', name: 'System Default', category: 'FASHION_ACCESSORIES', description: 'Clean, versatile baseline storefront' },
    { id: 'APPIFY', name: 'Appify Mobile', category: 'FASHION_ACCESSORIES', description: 'Mobile-app style experience with bottom navigation' },
];

export const getThemesByCategory = (category: ThemeCategory) => {
    return themeMetadata.filter(t => t.category === category);
};

export const getThemeComponents = (themeName: string = 'DEFAULT'): ThemeComponents => {
    const normalizedName = themeName.toUpperCase().replace(/-/g, '_');
    return themeRegistry[normalizedName] || themeRegistry.DEFAULT;
};

export const getThemeLayout = (themeName: string = 'DEFAULT') => {
    return getThemeComponents(themeName).Layout;
};
