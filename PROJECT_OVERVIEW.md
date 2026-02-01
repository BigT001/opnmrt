# OPNMRT: Multi-Tenant AI-Powered Storefront SaaS Platform

## Project Overview
OPNMRT is a multi-tenant e-commerce SaaS platform designed to enable sellers to create, manage, and grow their own independent online storefronts while providing buyers with a seamless, account-based shopping experience. The platform operates as storefront infrastructure and business intelligence software, not as a payment intermediary or centralized marketplace.

---

## Core Vision
The platform provides a complete commerce operating system where:
- **Sellers** own their stores, brands, customers, and payments.
- **Buyers** enjoy a smooth, trust-based shopping experience with purchase history and communication tools.
- **The Platform** earns via subscriptions while enabling transparency, scalability, and AI-assisted decision-making.

---

## Multi-Tenancy Model
- Each seller operates as a tenant (store).
- All data is strictly isolated using `tenantId` / `storeId`.
- A single application serves all tenants securely.
- **Access Points:**
  - Default subdomain: `storename.platform.com`
  - Optional custom domain owned and connected by the seller.

---

## User Experiences

### Seller Experience
- **Capabilities:**
  - Create and manage a storefront.
  - Add and manage products, pricing, and inventory.
  - Receive payments directly via integrated gateways.
  - Fulfill orders and communicate with buyers.
  - View analytics and AI-generated insights.
- **Dashboard:**
  - Sales overview (daily, weekly, monthly).
  - Order management and fulfillment.
  - Product/inventory management with low-stock alerts and forecasts.
  - Customer list and order history.
  - AI Assistant for business insights and recommendations.

### Buyer Experience
- **Onboarding:** Buyers create accounts per store (tenant-scoped).
- **Storefront Experience:** Clean, fast, mobile-first storefront with cart and checkout.
- **Dashboard:** Order tracking, history, spending metrics, and profile management.
- **Communication:** Simple in-platform chat per order or store for trust and support.

### Admin (Platform Owner) Experience
- **Role:** Super-admin privileges across all tenants for governance and support.
- **Dashboard:** 
  - View all stores, products, and orders.
  - Monitor platform activity and metrics.
  - Access buyer–seller chats for dispute resolution.
  - Moderation: Suspend or restrict stores/products if needed.
  - Audit platform health and usage.

---

## Payments & Pricing

### Payments Model
- **Direct Payments:** Buyers pay sellers directly.
- **No Escrow:** The platform does not hold funds or manage payouts.
- **Gateway Integration:** Sellers integrate their preferred gateways (e.g., Paystack, Flutterwave).
- **Software Focus:** Platform handles metadata and infrastructure only.

### Pricing Model
- **Free Tier:** Limited products, platform subdomain, basic analytics.
- **Paid Tier:** Custom domains, unlimited products, advanced analytics, AI assistant, priority support.

---

## AI Integration (MVP Scope)
- **Product Content:** Automated product description generation.
- **Business Intelligence:** Plain-English sales and performance insights.
- **Forecasting:** Inventory run-out predictions and restock recommendations.
- **Optimization:** Smart promotion and pricing suggestions.
- **Read-only AI Assistant:** Answers business questions using aggregated store data.

---

## Technical Stack

### 1. Core Architecture
- **Type:** Multi-tenant SaaS with domain-based routing.
- **Approach:** Single codebase, isolated tenant data.

### 2. Frontend Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS, shadcn/ui, Radix UI, Framer Motion.
- **State Management:** React Query (Server), Zustand (Client).
- **Forms:** React Hook Form + Zod.

### 3. Backend Stack
- **Framework:** NestJS (Modular Architecture, Domain-Driven Design).
- **API:** REST API with clear separation (Public, Seller, Buyer, Admin).
- **Auth:** JWT (Access/Refresh), RBAC (Admin, Seller, Buyer), Passport.js.

### 4. Database & Data Layer
- **Primary DB:** PostgreSQL.
- **ORM:** Prisma (with strict tenant enforcement).
- **Caching:** Redis (Session, AI insights, Rate limiting).

### 5. Infrastructure & Services
- **Hosting:** Vercel (Next.js Middleware for routing, Edge functions, Automatic SSL).
- **Storage:** Cloudinary (Images/Media).
- **Communication:** WebSockets (Socket.IO via NestJS), Redis Pub/Sub, Resend/Postmark (Email).
- **AI:** Gemini API or OpenAI (GPT-4o-mini).
- **Monitoring:** Winston/Pino (Logging), Sentry (Errors).

---

## Analytics & Data Flow
- **Events:** Custom internal system tracking `ORDER_CREATED`, `STOCK_UPDATED`, etc.
- **Aggregation:** NestJS Cron Jobs for daily metrics.
- **Security:** AI consumes pre-aggregated data only; tenant isolation at the query level.

---

## Product Philosophy
OPNMRT is a **storefront engine**, a **business intelligence assistant**, and a **trust-focused commerce platform**. It is built to help sellers run better businesses and buyers shop with confidence.
