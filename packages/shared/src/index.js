"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantContextSchema = exports.CreateStoreSchema = exports.LoginSchema = exports.RegisterSchema = exports.OrderStatus = exports.StorePlan = exports.UserRole = void 0;
const zod_1 = require("zod");
exports.UserRole = zod_1.z.enum(['ADMIN', 'SELLER', 'BUYER']);
exports.StorePlan = zod_1.z.enum(['FREE', 'PAID']);
exports.OrderStatus = zod_1.z.enum(['PENDING', 'PAID', 'COMPLETED', 'CANCELLED']);
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    role: exports.UserRole.default('SELLER'),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.CreateStoreSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Store name must be at least 3 characters'),
    subdomain: zod_1.z.string()
        .min(3, 'Subdomain must be at least 3 characters')
        .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
});
exports.TenantContextSchema = zod_1.z.object({
    tenantId: zod_1.z.string(),
    storeId: zod_1.z.string(),
    subdomain: zod_1.z.string(),
});
//# sourceMappingURL=index.js.map