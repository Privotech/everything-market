# Everything Market — Technical Architecture & Domain Design

**Document Version:** 1.0.0 (Phase 1 & Phase 2 Baseline)  
**Architecture Pattern:** Modular Monolith  
**Tech Stack:** React 19, TypeScript 5+ (Strict), Prisma ORM 8+, PostgreSQL 16+

---

## 1. Architectural Philosophy: The Modular Monolith

Rather than introducing distributed microservices with network latency, complex sagas, and deployment overhead, **Everything Market** is structured as a **Modular Monolith**.

### Core Tenets:
1. **Single Deployment Unit, Strict Module Boundaries:** Code is organized by high-cohesion domain modules (`catalog`, `seller`, `inventory`, `pricing`, `auth`). Modules interact via explicit domain service interfaces.
2. **Zero Client Trust:** Prices, stock levels, discounts, tax rates, and user privileges are never computed on or accepted from client requests. The client provides intent (e.g., variant ID and requested quantity); the server resolves canonical pricing from the database.
3. **Deterministic Financial Mathematics:** All monetary values are represented as minor currency units (e.g., USD integer cents: $19.99 = `1999`). Floating-point arithmetic is strictly forbidden in database schemas and domain calculations.
4. **Strong Consistency for Inventory & Money:** PostgreSQL relational guarantees (ACID, foreign key constraints, unique constraints, and check constraints) protect inventory balances and order state.
5. **Secure Domain Services:** Server-side services handle data fetching, authorization gates, and data integrity without exposing raw credentials or direct table access to the browser.

---

## 2. Directory & Module Structure

```text
├── docs/                             # System Architecture & Business Specs
│   ├── ARCHITECTURE.md
│   └── BUSINESS_REQUIREMENTS.md
├── lib/                              # Shared Infrastructure & Utilities
│   ├── db.ts                         # Prisma Client singleton with connection caching
│   ├── money.ts                      # Strict integer-cents currency arithmetic
│   ├── validation.ts                 # Input validation & business constraints
│   └── utils.ts                      # Tailwind clsx/twMerge helpers
├── modules/                          # Domain Business Logic (Modular Monolith)
│   ├── catalog/                      # Catalog service, categories, products
│   │   ├── types.ts
│   │   └── catalog.service.ts
│   ├── inventory/                    # Stock validation, allocation, safety limits
│   │   ├── types.ts
│   │   └── inventory.service.ts
│   └── seller/                       # Merchant verification, store profiles
│       ├── types.ts
│       └── seller.service.ts
├── prisma/                           # Database Schema & Seed Engine
│   ├── schema.prisma                 # PostgreSQL database schema
│   ├── seed.ts                       # Idempotent development seed script
│   └── seed-data.ts                  # Fully compliant realistic seed dataset
├── src/                              # Frontend Application Shell
│   ├── components/                   # Shared UI Design System
│   │   ├── layout/                   # Header, Footer, Navigation
│   │   └── marketplace/              # ProductCard, CategoryBar, SpecsPanel
│   ├── App.tsx                       # Marketplace main view container
│   ├── index.css                     # Tailwind CSS entry
│   └── main.tsx                      # React root
├── tests/                            # Automated Test Suite (Node.js test runner)
│   ├── money.test.ts                 # Monetary arithmetic verification
│   ├── inventory.test.ts             # Stock allocation & concurrency safeguards
│   └── validation.test.ts            # Data contract & validation checks
└── .env.example                      # Production-safe environment template
```

---

## 3. Database Entity Relationship Model (ERD Overview)

```text
[User] 1 ──── 0..1 [SellerProfile]
  │                     │
  │ (Auth & Roles)      │ (Owns)
  ▼                     ▼
[Order] (Phase 4)    [Product] ───────── n..1 ───────── [Category] (Self-referencing tree)
                        │                                    ▲
                        │ (Has Many)                         │ (Parent/Child)
                        ▼                                    │
                 [ProductVariant]                            └───┘
                   │           │
       (Has Many)  │           │ (1-to-1)
                   ▼           ▼
             [ProductImage]  [Inventory]
```

### Table Relationships & Referential Integrity:
1. **User -> SellerProfile (1:0..1):** A user can optionally register as a seller. `userId` is unique in `SellerProfile` with `onDelete: Cascade`.
2. **Category -> Category (1:N Self-relation):** Top-level categories (e.g. `Electronics`) reference child categories (e.g. `Audio`) via `parentId` with `onDelete: Restrict` to avoid accidental orphan sub-trees.
3. **SellerProfile -> Product (1:N):** A verified merchant owns catalog products. Products reference `sellerId` with `onDelete: Restrict` so deleted sellers do not orphan products with active orders.
4. **Category -> Product (1:N):** Every product belongs to a canonical category (`categoryId`) with `onDelete: Restrict`.
5. **Product -> ProductVariant (1:N):** Products must have at least one variant (e.g., color, size, storage capacity). Deleting a product cascades to its variants.
6. **ProductVariant -> Inventory (1:1):** Every variant has an exact stock record (`variantId` unique) tracking `quantityOnHand` and `quantityReserved`.
7. **Product -> ProductImage (1:N):** Images are linked to the product, and optionally to a specific variant for color-matched displays.

---

## 4. Monetary Representation Standard

To satisfy zero-error banking and tax compliance:
- **Rule 1:** Prices in the database are stored as **64-bit/32-bit Integers (`Int` or `BigInt`)** representing minor currency units (e.g., cents in USD, EUR, GBP; yen in JPY).
- **Rule 2:** `basePriceCents`, `priceCents`, `compareAtPriceCents`, and `costPriceCents` must be non-negative integers (`>= 0`).
- **Rule 3:** Multiplications (taxes, percentages, discounts) must use explicit rounding strategies (e.g. Bankers' rounding / Half-Up rounding via `Math.round`) encapsulated in `@/lib/money.ts`.
- **Rule 4:** Formatting for UI display occurs only at the view boundary via `formatMoney(cents, currency)`.
