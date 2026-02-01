import { z } from 'zod';
export declare const UserRole: z.ZodEnum<["ADMIN", "SELLER", "BUYER"]>;
export type UserRole = z.infer<typeof UserRole>;
export declare const StorePlan: z.ZodEnum<["FREE", "PAID"]>;
export type StorePlan = z.infer<typeof StorePlan>;
export declare const OrderStatus: z.ZodEnum<["PENDING", "PAID", "COMPLETED", "CANCELLED"]>;
export type OrderStatus = z.infer<typeof OrderStatus>;
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["ADMIN", "SELLER", "BUYER"]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    role: "ADMIN" | "SELLER" | "BUYER";
}, {
    email: string;
    password: string;
    name: string;
    role?: "ADMIN" | "SELLER" | "BUYER" | undefined;
}>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginInput = z.infer<typeof LoginSchema>;
export declare const CreateStoreSchema: z.ZodObject<{
    name: z.ZodString;
    subdomain: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    subdomain: string;
}, {
    name: string;
    subdomain: string;
}>;
export type CreateStoreInput = z.infer<typeof CreateStoreSchema>;
export declare const TenantContextSchema: z.ZodObject<{
    tenantId: z.ZodString;
    storeId: z.ZodString;
    subdomain: z.ZodString;
}, "strip", z.ZodTypeAny, {
    subdomain: string;
    tenantId: string;
    storeId: string;
}, {
    subdomain: string;
    tenantId: string;
    storeId: string;
}>;
export type TenantContext = z.infer<typeof TenantContextSchema>;
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
