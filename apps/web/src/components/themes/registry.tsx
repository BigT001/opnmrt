import { ThemeComponents, ThemeName, ThemeCategory, NavbarProps, FooterProps, HeroProps, ProductGridProps, ProductDetailProps, CartDrawerProps, CheckoutProps, StoreThemeProps, PageProps, ProductPageProps } from './types';
import dynamic from 'next/dynamic';
import React from 'react';

// Using a function with switch-case and static imports to avoid Turbopack hangs
// compared to a static registry object with many dynamic imports.

export const getThemeComponents = async (themeName: string = 'DEFAULT'): Promise<ThemeComponents> => {
    const normalizedName = themeName.toUpperCase().replace(/-/g, '_');

    switch (normalizedName) {
        case 'APPIFY':
            return {
                Navbar: (await import('./appify/Navbar')).AppifyNavbar,
                Footer: (await import('./appify/Footer')).AppifyFooter,
                StorefrontHero: (await import('./appify/StorefrontHero')).AppifyHero,
                ProductGrid: (await import('./appify/ProductGrid')).AppifyProductGrid,
                ProductDetail: (await import('./appify/ProductDetail')).AppifyProductDetail,
                CartDrawer: (await import('./appify/CartDrawer')).AppifyCartDrawer,
                CheckoutPage: (await import('./appify/CheckoutPage')).AppifyCheckout,
                Layout: (await import('./appify/layout')).AppifyLayout,
                StorefrontPage: (await import('./appify/HomePage')).AppifyHomePage,
                ProductPage: (await import('./appify/ProductPage')).AppifyProductPage,
                AboutPage: (await import('./appify/HomePage')).AppifyHomePage,
                ShopPage: (await import('./appify/ShopPage')).AppifyShopPage,
                FavoritesPage: (await import('./appify/FavoritesPage')).AppifyFavoritesPage,
            } as ThemeComponents;
        case 'VANTAGE':
            return {
                Navbar: (await import('./vantage/Navbar')).VantageNavbar,
                Footer: (await import('./vantage/Footer')).VantageFooter,
                StorefrontHero: (await import('./vantage/StorefrontHero')).VantageHero,
                ProductGrid: (await import('./vantage/ProductGrid')).VantageProductGrid,
                ProductDetail: (await import('./vantage/ProductDetail')).VantageProductDetail,
                CartDrawer: (await import('./vantage/CartDrawer')).VantageCartDrawer,
                CheckoutPage: (await import('./vantage/CheckoutPage')).VantageCheckout,
                Layout: (await import('./vantage/layout')).VantageLayout,
                StorefrontPage: (await import('./vantage/HomePage')).VantageHomePage,
                ProductPage: (await import('./vantage/ProductPage')).VantageProductPage,
                AboutPage: (await import('./vantage/AboutPage')).VantageAboutPage,
                ShopPage: (await import('./vantage/ShopPage')).VantageShopPage,
                FavoritesPage: (await import('./vantage/FavoritesPage')).VantageFavoritesPage,
            } as ThemeComponents;
        case 'MINIMAL_LUXE':
        case 'GLAMOUR_EVE':
        case 'NEON_STREAM':
        case 'DEFAULT':
        default:
            return {
                Navbar: (await import('./default/Navbar')).DefaultNavbar,
                Footer: (await import('./default/Footer')).DefaultFooter,
                StorefrontHero: (await import('./default/StorefrontHero')).DefaultHero,
                ProductGrid: (await import('./default/ProductGrid')).DefaultProductGrid,
                ProductDetail: (await import('./default/ProductDetail')).DefaultProductDetail,
                CartDrawer: (await import('./default/CartDrawer')).DefaultCartDrawer,
                CheckoutPage: (await import('./default/CheckoutPage')).DefaultCheckout,
                Layout: (await import('./default/layout')).DefaultLayout,
                StorefrontPage: (await import('./default/StorefrontPage')).DefaultStorefrontPage,
                ProductPage: (await import('./default/ProductPage')).DefaultProductPage,
                AboutPage: (await import('./default/AboutPage')).DefaultAboutPage,
                ShopPage: (await import('./default/ShopPage')).DefaultShopPage,
                FavoritesPage: (await import('./default/FavoritesPage')).DefaultFavoritesPage,
            } as ThemeComponents;
    }
};

export const getThemeLayout = async (themeName: string = 'DEFAULT') => {
    const components = await getThemeComponents(themeName);
    return components.Layout;
};

import { themeMetadata, ThemeMetadata, getThemesByCategory } from './metadata';
export { themeMetadata, type ThemeMetadata, getThemesByCategory };
