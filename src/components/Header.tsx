import React from 'react';
import { Sun, Moon, User as UserIcon, ShoppingBag, ShieldCheck, Gift } from 'lucide-react';
import { UserProfile } from '../types';
import { PANDA_ASSETS } from '../utils/assets';
import { formatRupiah } from '../utils/formatters';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenReferral: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  user,
  onOpenAuth,
  cartCount,
  onOpenCart,
  onOpenOrders,
  onOpenReferral,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#0b0f19]/90 border-b border-slate-200 dark:border-slate-800/80 transition-colors shadow-sm dark:shadow-none">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone: Mascot Panda Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-lg shadow-blue-500/20 bg-slate-900 flex items-center justify-center">
              <img
                src={PANDA_ASSETS.avatarLogo}
                alt="Yuraa Store Panda Mascot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0b0f19]">
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            </span>
          </div>

          <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                YURAA<span className="text-blue-500">STORE</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-500 dark:text-blue-400 px-1.5 py-0.2 rounded border border-blue-500/20">
                <ShieldCheck className="w-2.5 h-2.5" />
                VERIFIED
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Akun Premium & Pulsa Terbaik
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Ganti Tema"
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-500 dark:text-amber-400 flex items-center justify-center border border-slate-200 dark:border-slate-700/60 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 fill-amber-400/40" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Referral Program Button */}
          <button
            onClick={onOpenReferral}
            aria-label="Program Referral & Undangan"
            title="Program Referral & Kupon Diskon"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 hover:from-amber-500/25 hover:to-orange-500/25 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/30 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            <span className="hidden sm:inline">Referral</span>
            <span className="text-[10px] bg-amber-500 text-slate-950 px-1 py-0.2 rounded font-black hidden md:inline">
              10%
            </span>
          </button>

          {/* User Button / Balance Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 border border-blue-400/30"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            {user ? (
              <div className="text-left hidden sm:block leading-tight">
                <div className="font-bold truncate max-w-[90px]">{user.name.split(' ')[0]}</div>
                <div className="text-[10px] text-blue-100 font-mono">{formatRupiah(user.balance)}</div>
              </div>
            ) : (
              <span className="font-semibold">Masuk</span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Keranjang Belanja"
            className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700/60 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-[#0b0f19] animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
