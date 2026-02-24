import { ThemeName, ThemeCategory } from './types';

export interface ThemeMetadata {
    id: ThemeName;
    name: string;
    category: ThemeCategory;
    description: string;
}

export const themeMetadata: ThemeMetadata[] = [
    { id: 'DEFAULT', name: 'System Default', category: 'FASHION_ACCESSORIES', description: 'Clean, versatile baseline storefront for any brand.' },
    { id: 'APPIFY', name: 'Appify Mobile', category: 'FASHION_ACCESSORIES', description: 'Premium mobile-app style experience with bottom navigation and immersive headers.' },
    { id: 'VANTAGE', name: 'Vantage Premium', category: 'FASHION_ACCESSORIES', description: 'Bold, high-fashion aesthetic with unique collage hero and premium typography.' },
];

export const getThemesByCategory = (category: ThemeCategory) => {
    return themeMetadata.filter(t => t.category === category);
};
