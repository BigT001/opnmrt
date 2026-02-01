import { z } from 'zod';

export const UpdateStoreSchema = z.object({
    name: z.string().optional(),
    officialEmail: z.string().email().optional().or(z.literal('')),
    biography: z.string().optional(),
    logo: z.string().optional(),
    heroImage: z.string().optional(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    primaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    theme: z.string().optional(),
    themeConfig: z.any().optional(),
});

export type UpdateStoreDto = z.infer<typeof UpdateStoreSchema>;
