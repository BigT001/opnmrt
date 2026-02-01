export type ThemeName = 'MODERN' | 'CLASSIC' | 'BOLD';

export interface ThemeConfig {
    colors?: {
        primary?: string;
        secondary?: string;
        background?: string;
        foreground?: string;
    };
    fonts?: {
        sans?: string;
        serif?: string;
    };
    borderRadius?: string;
}

export interface StoreThemeProps {
    store: any; // We'll refine this type
    children: React.ReactNode;
}
