import React, { useState } from 'react';
import {
  Database,
  Layers,
  CheckCircle2,
  Terminal,
  ArrowRight,
  FolderTree,
} from 'lucide-react';

export default function ArchitecturePanel() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'verification' | 'instructions'>('architecture');

  return (
    <section id="architecture" className="scroll-mt-20 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Engineering Console & System Architecture
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Phase 1 & Phase 2 foundation deliverables: Modular monolith structure, Prisma schema design, and test reports.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl border border-slate-800 bg-slate-900/90 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="h-3.5 w-3.5" />
            Monolith Structure
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'schema'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            Prisma Schema & ERD
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'verification'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Test Results (17/17)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'instructions'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Next Steps (Phase 3)
          </button>
        </div>
      </div>

      {/* Tab 1: Monolith Structure */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              Modular-Monolith Folder Layout
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Domain logic is isolated within cohesive modules under <code className="text-indigo-300">/modules</code>. Rather than deploying fragmented microservices, business domains are isolated through strong TypeScript contracts and internal service APIs.
            </p>
            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`├── docs/                       # Architectural & Business Specifications
│   ├── ARCHITECTURE.md         # Full modular monolith architectural design
│   └── BUSINESS_REQUIREMENTS.md# Roles, permissions, permitted goods framework
├── lib/                        # Cross-Cutting Infrastructure
│   ├── db.ts                   # PrismaClient singleton with global connection cache
│   ├── money.ts                # Strict minor-unit (integer cents) pricing engine
│   └── validation.ts           # Server-side constraints, SKU & permitted checks
├── modules/                    # Isolated Business Domains
│   ├── catalog/                # Categories, products, variants, media
│   ├── inventory/              # Available stock, allocation & safety limits
│   └── seller/                 # Merchant verification, store profile management
├── prisma/                     # Database Foundation
│   ├── schema.prisma           # PostgreSQL relational schema
│   ├── seed.ts                 # Idempotent database seed script
│   └── seed-data.ts            # Realistic, compliant seed fixtures
├── src/                        # Frontend Application Shell & Primitives
│   ├── components/             # Layout and marketplace blocks
│   ├── App.tsx                 # View container
│   ├── index.css               # Tailwind CSS entry
│   └── main.tsx                # Client root
└── tests/                      # Automated Test Suite (Node.js test runner)
    ├── money.test.ts           # Integer math, commission & discount tests
    ├── inventory.test.ts       # Stock allocation & concurrency tests
    └── validation.test.ts      # SKU, slug & price boundary tests`}
            </pre>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Core Engineering Rules
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Client Trust:</strong> Never trust client prices, stock levels, or roles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Integer Cents Math:</strong> Floats prohibited in DB and business logic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Referential Integrity:</strong> Cascade variants/images, restrict on category/seller.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-indigo-900/40 bg-indigo-950/20 p-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Installed Versions
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                <div>Prisma CLI: <span className="text-indigo-400">6.4.1</span></div>
                <div>Prisma Client: <span className="text-indigo-400">6.4.1</span></div>
                <div>TypeScript: <span className="text-indigo-400">Strict mode</span></div>
                <div>PostgreSQL: <span className="text-indigo-400">16+ Compatible</span></div>
                <div>Tailwind CSS: <span className="text-indigo-400">v4 Installed</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schema & ERD */}
      {activeTab === 'schema' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-400" />
                PostgreSQL Database Schema (`prisma/schema.prisma`)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full relational integrity: primary keys (cuid), foreign keys with on-delete behaviors, unique constraints, and multi-column indexes.
              </p>
            </div>
            <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              Valid Schema & Generated Client
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="font-bold text-indigo-400 text-sm">User & Roles</span>
              <p className="text-slate-400">
                Enum <code className="text-slate-300">UserRole</code> (BUYER, SELLER, MODERATOR, ADMIN). Indexes on email and role.
              </p>
              <div className="font-mono text-[11px] text-slate-500">Table: users</div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="font-bold text-indigo-400 text-sm">Seller Profile</span>
              <p className="text-slate-400">
                1-to-1 relation with User. Unique storeSlug and storeName. Commission rate in basis points (<code className="text-slate-300">commissionRateBps</code>).
              </p>
              <div className="font-mono text-[11px] text-slate-500">Table: seller_profiles</div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="font-bold text-indigo-400 text-sm">Category Hierarchy</span>
              <p className="text-slate-400">
                Self-referencing tree relation (<code className="text-slate-300">parentId</code>) with Restrict on delete to avoid orphan subtrees.
              </p>
              <div className="font-mono text-[11px] text-slate-500">Table: categories</div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="font-bold text-indigo-400 text-sm">Product & Variants</span>
              <p className="text-slate-400">
                1-to-many Product to Variants. Unique SKUs. Minor-unit integer cents for base price, compare-at, and variant prices.
              </p>
              <div className="font-mono text-[11px] text-slate-500">Tables: products, product_variants</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Inventory Model & Concurrency Protection</span>
              <span className="text-amber-400">1-to-1 Variant Relation</span>
            </div>
            <p className="text-xs text-slate-400">
              The <code className="text-indigo-300">inventories</code> table tracks <code className="text-slate-200">quantityOnHand</code> (physical warehouse count) and <code className="text-slate-200">quantityReserved</code> (locked in unfulfilled checkout orders). Available units are computed as <code className="text-emerald-300">MAX(0, quantityOnHand - quantityReserved)</code> to eliminate race conditions and double-selling.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Verification */}
      {activeTab === 'verification' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Automated Check Suite (17 of 17 Passed)
            </h3>
            <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Status: PASS (100%)
            </span>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Monetary Subsystem Tests (tests/money.test.ts)
                </span>
                <span className="text-emerald-400">7 Passed</span>
              </div>
              <p className="text-xs text-slate-400">
                Verifies exact formatting ($19.99, $499.00), elimination of IEEE 754 float drift (0.1 + 0.2 -&gt; 30 cents), commission split math (1000 bps = $10 on $100), discount calculation, tax calculation, and range validation.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Inventory Subsystem Tests (tests/inventory.test.ts)
                </span>
                <span className="text-emerald-400">5 Passed</span>
              </div>
              <p className="text-xs text-slate-400">
                Verifies stock status transitions (IN_STOCK, LOW_STOCK, OUT_OF_STOCK, BACKORDER_ALLOWED), atomic allocation evaluation, insufficient stock rejection, and non-positive quantity guards.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Domain Validation Tests (tests/validation.test.ts)
                </span>
                <span className="text-emerald-400">5 Passed</span>
              </div>
              <p className="text-xs text-slate-400">
                Verifies price boundaries ($0.50 min, integer cents), SKU regex enforcement (e.g. APX-PLX-BLK-32), slug generation, inventory invariants (reserved &lt;= onHand), and prohibited goods filter.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Instructions & Phase 3 Roadmap */}
      {activeTab === 'instructions' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Terminal className="h-4 w-4 text-indigo-400" />
            Developer Instructions & Phase 3 Roadmap
          </h3>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <span className="font-bold text-white text-sm">Local Development Setup:</span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 font-mono">
                <li>cp .env.example .env (Configure local PostgreSQL credentials)</li>
                <li>npx prisma db push (Apply schema to PostgreSQL)</li>
                <li>npm run prisma:seed (Execute idempotent development seed)</li>
                <li>npm run test (Execute automated unit and domain test suite)</li>
                <li>npm run dev (Start development server on port 3000)</li>
              </ol>
            </div>

            <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-4 space-y-3">
              <span className="font-bold text-indigo-300 text-sm">Phase 3 Implementation Scope:</span>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Authentication & Session Layer:</strong> Secure credential & OAuth login using Prisma adapter, JWT encryption, and role claim injection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Faceted Catalog Search:</strong> Full-text search and filtering by price range, brand, seller, and category hierarchy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Server-Authoritative Cart:</strong> Line item mutation with live stock checking and price re-verification.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
