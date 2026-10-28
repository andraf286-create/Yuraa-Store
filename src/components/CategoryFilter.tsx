import React from 'react';
import { Search, Sparkles, Smartphone, BarChart3, Film, Palette, Music, Zap } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryFilterProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalProductsCount: number;
}

export const CATEGORIES_LIST: { id: ProductCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Semua', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'pulsa', label: 'Pulsa', icon: <Smartphone className="w-3.5 h-3.5" /> },
  { id: 'paket_data', label: 'Paket Data', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: 'streaming', label: 'Streaming', icon: <Film className="w-3.5 h-3.5" /> },
  { id: 'desain', label: 'Desain & Kreatif', icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'musik', label: 'Musik & Audio', icon: <Music className="w-3.5 h-3.5" /> },
  { id: 'vpn', label: 'VPN & Cloud', icon: <Zap className="w-3.5 h-3.5" /> },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalProductsCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          Kategori Populer
        </h2>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
          {totalProductsCount} PRODUK
        </span>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari akun favorit kamu (Netflix, Spotify, Canva, Telkomsel...)"
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-700/60 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-2 py-1 rounded-md"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Category Horizontal Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none no-scrollbar">
        {CATEGORIES_LIST.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold tracking-wide transition-all whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-red-500/30 border border-red-400/40'
                  : 'bg-white hover:bg-slate-100 dark:bg-[#131b2c] dark:hover:bg-[#1a253c] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
