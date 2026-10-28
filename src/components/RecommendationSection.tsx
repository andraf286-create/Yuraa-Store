import React from 'react';
import { Zap } from 'lucide-react';
import { Product } from '../types';
import { BrandIcon } from './BrandIcon';
import { formatRupiah } from '../utils/formatters';

interface RecommendationSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickBuy?: (product: Product, e: React.MouseEvent) => void;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  products,
  onSelectProduct,
  onQuickBuy,
}) => {
  // Take recommendation IDs: viki-rakuten, spotify-premium, netflix-uhd, prime-video
  const recommendedIds = ['viki-rakuten', 'spotify-premium', 'netflix-uhd', 'prime-video'];
  const recommendedProducts = products.filter((p) => recommendedIds.includes(p.id));

  return (
    <section className="space-y-4 pt-6">
      <div>
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
          MUNGKIN KAMU SUKA
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          REKOMENDASI UNTUKMU
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {recommendedProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProduct(p)}
            className="rounded-3xl bg-white hover:bg-slate-50 dark:bg-[#121929] dark:hover:bg-[#152033] border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between cursor-pointer transition-all hover:border-blue-500/40 shadow-md dark:shadow-lg group"
          >
            <div className="flex flex-col items-center justify-center py-4 bg-slate-50 dark:bg-[#0d1320] rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-3">
              <BrandIcon iconType={p.iconType} size="md" className="group-hover:scale-105 transition-transform" />
            </div>

            <div className="space-y-1 mb-3">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                {p.name}
              </h3>
              <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400 block">
                {formatRupiah(p.price)}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickBuy) {
                  onQuickBuy(p, e);
                } else {
                  onSelectProduct(p);
                }
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors active:scale-95 border border-blue-400/30 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>QUICK BUY</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
