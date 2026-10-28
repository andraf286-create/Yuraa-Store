import React from 'react';
import { Zap, Star, Flame, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { BrandIcon } from './BrandIcon';
import { formatRupiah } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onQuickBuy: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onQuickBuy,
}) => {
  const isSoldOut = product.isSoldOut || product.stockCount <= 0;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#121929] dark:hover:bg-[#152033] border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/50 p-3.5 sm:p-4 transition-all duration-200 cursor-pointer shadow-md dark:shadow-lg hover:shadow-xl hover:shadow-blue-500/5"
    >
      {/* Top Badges Area */}
      <div className="flex items-center justify-between gap-1 mb-2.5 min-h-6">
        {/* Left Badge: Trending or delivery time */}
        {product.isTrending ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold border border-amber-500/30">
            <Star className="w-2.5 h-2.5 fill-amber-500 dark:fill-amber-300" />
            TRENDING
          </span>
        ) : product.deliveryType === 'manual' ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
            <Zap className="w-2.5 h-2.5" />
            PROSES ±30 MENIT
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
            <Zap className="w-2.5 h-2.5" />
            INSTAN
          </span>
        )}

        {/* Right Badge: Segera Habis */}
        {product.isUrgent && !isSoldOut && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-300 text-[10px] font-bold border border-red-500/30 animate-pulse">
            SEGERA HABIS
          </span>
        )}
      </div>

      {/* Brand Icon Showcase Box */}
      <div className="flex flex-col items-center justify-center py-3.5 sm:py-4 bg-slate-50 dark:bg-[#0d1320] rounded-xl border border-slate-100 dark:border-slate-800/60 group-hover:border-slate-300 dark:group-hover:border-slate-700/60 transition-colors relative overflow-hidden">
        <BrandIcon iconType={product.iconType} size="md" className="group-hover:scale-110 transition-transform duration-300" />

        {/* Micro Pill below Logo */}
        <div className="mt-2.5">
          {product.deliveryType === 'instant' ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
              <Zap className="w-2.5 h-2.5 text-blue-500 dark:text-blue-400" />
              BAYAR LANGSUNG KIRIM
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              <Zap className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400" />
              DIPROSES SETELAH ORDER
            </span>
          )}
        </div>
      </div>

      {/* Information Area */}
      <div className="mt-3 space-y-1.5 flex-1">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          AKUN PREMIUM
        </span>

        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* Pricing */}
        <div>
          <span className="text-[11px] text-slate-400 dark:text-slate-400 line-through block font-mono">
            {formatRupiah(product.originalPrice)}
          </span>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono block">
            {formatRupiah(product.price)}
          </span>
        </div>

        {/* Sales & Inventory Indicator */}
        <div className="pt-0.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ShoppingCart className="w-3 h-3 text-slate-400" />
              <span className="font-mono">{product.soldCount} TERJUAL</span>
            </span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Flame className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              <span className="font-mono">SISA {product.stockCount}</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                product.stockCount < 5
                  ? 'bg-red-500'
                  : product.stockCount < 15
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, 100 - product.stockCount * 2))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Quick Buy directly onto Product Card */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-200 dark:border-slate-800/60 space-y-2">
        {isSoldOut ? (
          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider cursor-not-allowed border border-slate-200 dark:border-slate-700/50"
          >
            HABIS / SOLD OUT
          </button>
        ) : (
          <>
            {/* Primary 'Quick Buy' button (skips detail view, directly triggers payment modal) */}
            <button
              onClick={(e) => onQuickBuy(product, e)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black tracking-wide shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-blue-400/30 cursor-pointer"
              title="Langsung Beli & Bayar Cepat via DANA / QRIS"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>QUICK BUY (BAYAR CEPAT)</span>
            </button>

            {/* Secondary Controls: Detail View & Add to Cart */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(product);
                }}
                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-[11px] font-bold border border-slate-200 dark:border-slate-700/80 transition-colors flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
              >
                <Eye className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                <span>Detail</span>
              </button>

              <button
                onClick={(e) => onAddToCart(product, e)}
                title="Tambah ke Keranjang"
                className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-slate-700/80 transition-colors active:scale-95 flex items-center justify-center gap-1 text-[11px] font-bold cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+Keranjang</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
