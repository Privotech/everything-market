import React from 'react';
import { CatalogCategory } from '@/modules/catalog/types.ts';
import { Layers } from 'lucide-react';

interface CategoryBarProps {
  categories: CatalogCategory[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export default function CategoryBar({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          Marketplace Taxonomy & Hierarchies
        </h3>
        <span className="text-xs text-slate-500">
          {categories.length} Top Categories | Self-Referencing DB Relation
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
            activeCategoryId === null
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
              : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
          }`}
        >
          All Permitted Categories
        </button>

        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat.name}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <span className="ml-1.5 text-[10px] text-slate-400">
                  ({cat.subcategories.length})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
