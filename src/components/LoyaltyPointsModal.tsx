import React from 'react';
import {
  X,
  Sparkles,
  Award,
  TrendingUp,
  Gift,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Coins,
  Star,
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatRupiah } from '../utils/formatters';

interface LoyaltyPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenCart?: () => void;
}

export const LoyaltyPointsModal: React.FC<LoyaltyPointsModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenCart,
}) => {
  if (!isOpen) return null;

  const points = user?.loyaltyPoints || 0;
  const rupiahValue = points * 1; // 1 Poin = Rp 1
  const tier = user?.tier || 'VIP';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/80 p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base text-slate-900 dark:text-white uppercase tracking-tight">
                  Klub Poin Loyalitas
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">
                  Reward
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Kumpulkan Poin Tiap Belanja &amp; Tukarkan Diskon Masa Depan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
          {/* Main Points Hero Card */}
          <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-600/5 border border-amber-500/30 dark:border-amber-500/20 shadow-inner">
            <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold mb-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Coins className="w-4 h-4" />
                Saldo Poin Kamu Saat Ini
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-black">
                TIER {tier}
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {points.toLocaleString('id-ID')}
              </span>
              <span className="text-base font-extrabold text-amber-500 font-mono">POIN</span>
            </div>

            <div className="mt-2 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Nilai Potongan Diskon:</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                {formatRupiah(rupiahValue)}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              *1 Poin = Rp 1 potongan belanja. Bisa langsung ditukarkan di keranjang checkout!
            </p>
          </div>

          {/* How It Works Steps */}
          <div className="space-y-2.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-500" />
              Cara Mendapatkan &amp; Menukarkan Poin
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center mx-auto mb-1.5">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">1. Belanja Produk</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                  Beli akun Netflix, FF, Robux, Canva, pulsa atau paket data apa saja di toko.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-1.5">
                  <Coins className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">2. Dapat Poin Instan</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                  Dapatkan 10 Poin per Rp 1.000 belanja begitu pembayaran DANA berhasil.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-1.5">
                  <Gift className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">3. Tukar Jadi Diskon</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                  Aktifkan saklar tukar poin di keranjang untuk memotong tagihan belanja berikutnya.
                </p>
              </div>
            </div>
          </div>

          {/* Member Tiers Multiplier */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400/40" />
                Tingkatan Tier &amp; Bonus Pengali Poin
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Auto-Upgrade</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">SILVER</span>
                <span className="font-extrabold font-mono text-slate-800 dark:text-slate-200">1.0x</span>
                <span className="text-[9px] text-slate-400 block">Member Baru</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-500/40 space-y-1">
                <span className="text-[10px] font-black text-amber-500 block uppercase">GOLD</span>
                <span className="font-extrabold font-mono text-amber-600 dark:text-amber-400">1.2x</span>
                <span className="text-[9px] text-slate-400 block">&gt; 3x Order</span>
              </div>

              <div className="p-2.5 rounded-xl bg-gradient-to-b from-blue-500/10 to-indigo-500/10 border border-blue-400/60 dark:border-blue-500/50 space-y-1">
                <span className="text-[10px] font-black text-blue-500 block uppercase">VIP</span>
                <span className="font-black font-mono text-blue-600 dark:text-blue-400">1.5x</span>
                <span className="text-[9px] text-blue-500 font-semibold block">Bonus Maksimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-2">
          {onOpenCart && (
            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Gunakan Poin di Keranjang Belanja</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
