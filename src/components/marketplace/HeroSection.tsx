import React from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Database, CheckCircle2, Cpu } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-24">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Phase Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Phase 1 & Phase 2 Foundation Operational
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
            Everything Market <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
              Production-Minded Commerce
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            A robust modular-monolith e-commerce marketplace powered by TypeScript,
            PostgreSQL, and Prisma ORM. Engineered for zero-error integer financial calculations,
            multi-vendor catalog management, and automated verification.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <ShoppingBag className="h-4 w-4" />
              Explore Permitted Catalog
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#architecture"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <Database className="h-4 w-4 text-indigo-400" />
              View Architecture & Database Specs
            </a>
          </div>

          {/* Technical Pillar Pills */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                <Database className="h-4 w-4" />
                PostgreSQL & Prisma
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Prisma 6.4.1 schema with relational integrity and indexes
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Zero-Trust Security
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Server-side pricing, inventory deduction, and RBAC
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Cpu className="h-4 w-4" />
                Integer Cents Math
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Minor currency units eliminate IEEE 754 float drift
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                17 Automated Tests
              </div>
              <p className="mt-1 text-xs text-slate-400">
                100% test pass rate for money, stock, and rules
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
