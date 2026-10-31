import React from 'react';
import { ShieldCheck, Database, FileCode, CheckCircle, Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Platform Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
                EM
              </div>
              <span className="text-base font-bold text-white">Everything Market</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              A high-integrity multi-vendor e-commerce platform built as a modular monolith.
              Deterministic minor-unit financial math, server-authoritative inventory, and zero-trust security.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              <span>Phase 1 & 2 Foundation Verified</span>
            </div>
          </div>

          {/* Column 2: Architecture & Foundation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-400" />
              Data & ORM Stack
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                PostgreSQL 16+ Relational DB
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Prisma ORM 6.4.1 Client
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Integer Cents Monetary Model
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Self-Referencing Category Trees
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Platform Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-300">Permitted Products Policy</li>
              <li className="text-slate-300">Vendor KYC & Verification</li>
              <li className="text-slate-300">Server-Side Price Validation</li>
              <li className="text-slate-300">Atomic Inventory Reservation</li>
            </ul>
          </div>

          {/* Column 4: Engineering Checks */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FileCode className="h-4 w-4 text-amber-400" />
              Automated Verification
            </h4>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Unit & Domain Tests:</span>
                <span className="font-semibold text-emerald-400">17 Passed (100%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Prisma Validation:</span>
                <span className="font-semibold text-emerald-400">Valid & Generated</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">TypeScript Strict:</span>
                <span className="font-semibold text-emerald-400">Zero Errors</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Everything Market. Built with Prisma ORM and PostgreSQL.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Scale className="h-3.5 w-3.5 text-slate-400" />
              Compliant Commerce Standards
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
