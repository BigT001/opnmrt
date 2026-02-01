import { z } from 'zod';

// Roles and Enums
export const UserRole = z.enum(['ADMIN', 'SELLER', 'BUYER']);
export type UserRole = z.infer<typeof UserRole>;

export const StorePlan = z.enum(['FREE', 'PAID']);
export type StorePlan = z.infer<typeof StorePlan>;

export const OrderStatus = z.enum(['PENDING', 'PAID', 'COMPLETED', 'CANCELLED']);
export type OrderStatus = z.infer<typeof OrderStatus>;

// --- AUTH SCHEMAS ---

export const RegisterSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: UserRole.default('SELLER'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// --- STORE SCHEMAS ---

export const CreateStoreSchema = z.object({
    name: z.string().min(3, 'Store name must be at least 3 characters'),
    subdomain: z.string()
        .min(3, 'Subdomain must be at least 3 characters')
        .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
});

export type CreateStoreInput = z.infer<typeof CreateStoreSchema>;

// --- TENANT CONTEXT ---

export const TenantContextSchema = z.object({
    tenantId: z.string(),
    storeId: z.string(),
    subdomain: z.string(),
});

export type TenantContext = z.infer<typeof TenantContextSchema>;

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
