import React from 'react';
import { Home, Search, MessageCircle, AlertCircle } from 'lucide-react';
import { PANDA_ASSETS } from '../utils/assets';
import { STORE_INFO } from '../data/products';

interface NotFoundPageProps {
  onBackToHome: () => void;
  onSearchProduct: (query: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackToHome, onSearchProduct }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-6 shadow-xl dark:shadow-2xl">
        {/* Panda 404 Avatar */}
        <div className="relative w-32 h-32 mx-auto rounded-3xl overflow-hidden border-2 border-blue-500/40 shadow-xl bg-slate-900">
          <img
            src={PANDA_ASSETS.heroMascot}
            alt="Panda Yuraa Store 404"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow">
            404
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Halaman Tidak Ditemukan
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Ups! Link Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Halaman atau paket langganan yang Anda cari mungkin sudah berpindah alamat atau tautan salah ketik.
          </p>
        </div>

        {/* Quick Search */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari Netflix, Spotify, Canva..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    onSearchProduct(target.value.trim());
                    onBackToHome();
                  }
                }
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => onBackToHome()}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onBackToHome}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-transform active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Kembali ke Katalog Beranda
          </button>

          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Admin%20Yuraa%20Store%2C%20saya%20mengalami%20link%20error%20404.`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-2xl bg-slate-50 dark:bg-[#141f33] hover:bg-slate-100 dark:hover:bg-[#1a2842] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/60 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            Bantuan CS WhatsApp ({STORE_INFO.whatsappDisplay})
          </a>
        </div>
      </div>
    </div>
  );
};
