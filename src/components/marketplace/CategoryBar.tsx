import React from 'react';
import {
  Layers,
  Smartphone,
  Coffee,
  Compass,
  Sparkles,
  Shirt,
  Boxes,
} from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  cat_all: Layers,
  cat_electronics: Smartphone,
  cat_home_kitchen: Coffee,
  cat_outdoor_gear: Compass,
  cat_beauty_wellness: Sparkles,
  cat_fashion: Shirt,
  cat_wholesale_b2b: Boxes,
};

export default function CategoryBar() {
  const { categories, selectedCategory, setSelectedCategory, products } = useMarketplace();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-orange-400" />
          Marketplace Categories
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          {products.length} Products Available
        </span>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20'
              : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
          }`}
        >
          <Layers className="h-4 w-4" />
          All Categories ({products.length})
        </button>

        {categories
          .filter((c) => c.slug !== 'all')
          .map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Layers;
            const isSelected = selectedCategory === cat.id;
            const count = products.filter(
              (p) => p.category.id === cat.id || p.category.slug === cat.slug
            ).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20'
                    : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.name}</span>
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
}
