import { ThemeName, ThemeCategory } from './types';
import { Home, LayoutGrid, Type, Columns, BookOpen, Heart } from 'lucide-react';

export interface ThemePageDef {
    id: string;
    name: string;
    desc: string;
    icon: any; // Lucide icon component
    configKey?: string; // Config key for dynamic name editing
}

export interface ThemeMetadata {
    id: ThemeName;
    name: string;
    category: ThemeCategory;
    description: string;
    /** Pages this theme exposes in the preview sidebar */
    pages: ThemePageDef[];
    /** Built-in categories for this theme's navigation. Empty = theme has no category nav */
    defaultCategories: string[];
}

export const themeMetadata: ThemeMetadata[] = [
    {
        id: 'DEFAULT',
        name: 'System Default',
        category: 'FASHION_ACCESSORIES',
        description: 'Clean, versatile baseline storefront for any brand.',
        pages: [
            { id: 'index', name: 'Home', desc: 'Main Storefront', icon: Home, configKey: 'navHomeText' },
            { id: 'shop', name: 'Shop', desc: 'Product Listing', icon: LayoutGrid, configKey: 'navShopText' },
            { id: 'about', name: 'About', desc: 'Brand Narrative', icon: Type, configKey: 'navAboutText' },
        ],
        defaultCategories: [],
    },
    {
        id: 'APPIFY',
        name: 'Appify Mobile',
        category: 'FASHION_ACCESSORIES',
        description: 'Premium mobile-app style experience with bottom navigation and immersive headers.',
        pages: [
            { id: 'index', name: 'Home', desc: 'Main Storefront', icon: Home, configKey: 'navHome' },
            { id: 'shop', name: 'Shop', desc: 'Product Listing', icon: LayoutGrid, configKey: 'navShop' },
        ],
        defaultCategories: ["Men's", "Women's", 'Kids', 'New In', 'Collection'],
    },
    {
        id: 'VANTAGE',
        name: 'Vantage Premium',
        category: 'FASHION_ACCESSORIES',
        description: 'Bold, high-fashion aesthetic with unique collage hero and premium typography.',
        pages: [
            { id: 'index', name: 'Home', desc: 'Main Storefront', icon: Home, configKey: 'navHome' },
            { id: 'shop', name: 'Collections', desc: 'Style Listing', icon: LayoutGrid, configKey: 'navCollections' },
            { id: 'about', name: 'Our Story', desc: 'Brand Narrative', icon: Type, configKey: 'navStory' },
        ],
        defaultCategories: [],
    },
    {
        id: 'ELECTSHOP',
        name: 'Electshop Electronics',
        category: 'GADGETS_ACCESSORIES',
        description: 'High-performance electronics marketplace with complex layouts and category-first navigation.',
        pages: [
            { id: 'index', name: 'Home', desc: 'Main Storefront', icon: Home, configKey: 'navHome' },
            { id: 'shop', name: 'Shop / All', desc: 'Full Catalogue', icon: LayoutGrid },
            { id: 'shop/electronics', name: 'Electronics', desc: 'Category View', icon: LayoutGrid },
            { id: 'shop/smartphones', name: 'Smartphones', desc: 'Category View', icon: LayoutGrid },
            { id: 'shop/laptops', name: 'Laptops', desc: 'Category View', icon: LayoutGrid },
            { id: 'shop/wearables', name: 'Smart Watches', desc: 'Category View', icon: LayoutGrid },
            { id: 'blog', name: 'Blog', desc: 'Content & News', icon: BookOpen, configKey: 'navBlog' },
            { id: 'contact', name: 'Contact', desc: 'Stay Connected', icon: Columns, configKey: 'navContact' },
        ],
        defaultCategories: ['All Products', 'Electronics', 'Smartphones', 'Accessories'],
    },
];

/** Lookup a single theme's metadata by ID (case-insensitive) */
export function getThemeMeta(themeId: string): ThemeMetadata {
    const found = themeMetadata.find(
        (t) => t.id.toUpperCase() === themeId.toUpperCase()
    );
    return found ?? themeMetadata[0]; // fall back to DEFAULT
}

export const getThemesByCategory = (category: ThemeCategory) => {
    return themeMetadata.filter(t => t.category === category);
};
