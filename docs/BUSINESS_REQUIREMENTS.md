# Everything Market — Business Requirements & Scope Specification

**Document Version:** 1.0.0 (Phase 1 & Phase 2 Foundation)  
**Status:** Approved Architectural Baseline  
**System Architecture:** Modular Monolith (Prisma ORM, PostgreSQL)

---

## 1. Executive Summary & Product Vision

**Everything Market** is a multi-vendor digital e-commerce marketplace engineered to connect independent sellers with consumer and enterprise buyers for all permitted, compliant physical and digital goods. The platform balances vendor autonomy with strict platform governance, fraud prevention, catalog quality, and deterministic inventory and financial management.

---

## 2. User Roles & Permission Matrix (RBAC)

The system enforces strict Role-Based Access Control (RBAC). Business privileges are resolved exclusively on the server.

| Role | Description | Core Capabilities | Restricted Actions |
| :--- | :--- | :--- | :--- |
| **GUEST (Anonymous)** | Unauthenticated public visitor | Browse catalog, filter categories, view product pages, manage client-side guest session | Cannot place orders, leave reviews, or access seller/admin areas |
| **BUYER (Customer)** | Registered consumer account | Save addresses, maintain persistent carts, submit orders, view order history, write verified reviews | Cannot create products or access other users' data |
| **SELLER (Vendor)** | Verified commercial merchant | Manage store profile, publish products, manage variant pricing, track inventory, fulfill assigned orders | Cannot alter platform commission, approve other sellers, or view platform-wide telemetry |
| **MODERATOR** | Catalog & Compliance staff | Inspect flagged products, review seller applications, enforce permitted-product guidelines | Cannot alter platform financial settings or payout bank configurations |
| **ADMIN** | Platform Superuser / Operations | Approve/suspend sellers, manage categories, define commission tiers, oversee dispute resolutions, audit logs | Full access governed by audit log tracking |

---

## 3. Product Policy & Permitted Goods Framework

To maintain commercial viability and compliance with legal, payment network, and logistics standards:
- **Permitted Products:** Electronics, home goods, cookware, coffee equipment, apparel, books, hobbies, sports, outdoor gear, beauty, office supplies, tools, automotive accessories, and packaged non-perishables.
- **Prohibited Products:** Weapons, explosive goods, illicit drugs, prescription pharmaceuticals, counterfeit items, unauthorized intellectual property, predatory financial products, or hazardous materials.
- **Enforcement:** Products undergo automated category validation and manual review (`PENDING_REVIEW` -> `ACTIVE` status transitions).

---

## 4. Major System Modules (Modular Monolith)

1. **Identity & Access Management (IAM):** Secure credentials, session tokens, user profiles, and role elevation checks.
2. **Catalog & Taxonomy:** Hierarchical category trees (self-referencing), product definitions, variants, attributes, and image assets.
3. **Inventory & Stock Management:** Per-variant quantity on hand, reservation locks, safety reorder thresholds, and backorder flags.
4. **Pricing & Monetary Subsystem:** Minor-unit (integer cents) pricing engine to eliminate IEEE 754 floating-point inaccuracies, discount comparators, and commission calculations.
5. **Seller & Vendor Management:** Merchant verification lifecycle, store slugging, payout metadata, and performance metrics.
6. **Cart & Checkout (Phases 3+):** Server-verified line items, price locking, tax calculation, and order generation.
7. **Order & Fulfillment (Phases 3+):** Order lifecycle state machine (`PENDING_PAYMENT` -> `PAID` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED` -> `CANCELLED`/`REFUNDED`).

---

## 5. Release Phasing & Scope

- **Phase 1: Inception, Architecture & Foundations (Current)**
  - Comprehensive business requirements & technical specification.
  - Modular monolith directory structure and architectural contracts.
  - Development environment, PostgreSQL and Prisma ORM configuration.
  - Production-ready Prisma database schema with primary keys, FKs, indices, and monetary constraints.
  - Safe `.env.example` template with clean boundary separation.

- **Phase 2: Data Foundations, Seed Pipeline & Baseline UI (Current)**
  - Idempotent seed script (`prisma/seed.ts`) covering realistic vendor, category, product, variant, and inventory data.
  - Server-side domain libraries (`@/lib/money.ts`, `@/lib/db.ts`, `@/lib/validation.ts`).
  - Automated unit and integration testing suite for business logic (monetary rounding, inventory constraints, validation guards).
  - Responsive layout shell, navigation, product cards, category badges, and platform status console.

- **Phase 3: Catalog Browsing, Search & Authentication (Upcoming)**
  - Server-rendered catalog pages, faceted search, category navigation.
  - NextAuth/JWT session integration with Prisma adapter.
  - Server actions for vendor store management and product draft creation.

- **Phase 4: Checkout, Payments & Order State Machine (Future)**
  - Stripe/Payment Gateway webhooks with signature verification.
  - Idempotent order placement and atomic inventory deduction.
  - Vendor payout settlement calculation.
