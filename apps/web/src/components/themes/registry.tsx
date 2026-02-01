import { ModernLayout } from './modern/layout';
import { ClassicLayout } from './classic/layout';
import { BoldLayout } from './bold/layout';
import { StoreThemeProps } from './types';

export const themeRegistry: Record<string, React.FC<StoreThemeProps>> = {
    MODERN: ModernLayout,
    CLASSIC: ClassicLayout,
    BOLD: BoldLayout,
};

export const getThemeLayout = (themeName: string = 'MODERN') => {
    const normalizedName = themeName.toUpperCase();
    return themeRegistry[normalizedName] || themeRegistry.MODERN;
};
