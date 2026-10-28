import React from 'react';
import { ShoppingBag, MessageCircle, Sparkles, Gift } from 'lucide-react';
import { PANDA_ASSETS } from '../utils/assets';
import { STORE_INFO } from '../data/products';

interface HeroProps {
  onScrollToProducts: () => void;
  onOpenConsultModal: () => void;
  onOpenReferral?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToProducts, onOpenConsultModal, onOpenReferral }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-8 sm:pt-10 sm:pb-12 bg-gradient-to-b from-blue-50/60 to-white dark:from-[#0e1628] dark:to-[#0b0f19] border-b border-slate-200 dark:border-slate-800/60 transition-colors">
      {/* Background glow radial */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="relative rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#121a2d] dark:via-[#101726] dark:to-[#0c1220] border border-blue-100 dark:border-blue-900/30 p-6 sm:p-8 lg:p-10 shadow-xl dark:shadow-2xl overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>Pusat Akun Premium & Pulsa Resmi #1</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Akun Premium <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    Harga Terbaik
                  </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed pt-2 max-w-lg">
                  Aman, cepat, bergaransi, dan terpercaya hanya di{' '}
                  <span className="text-blue-600 dark:text-white font-bold">yuraastore.id</span>. Pembayaran instan via DANA &amp; QRIS dengan proses hitungan menit!
                </p>
              </div>

              {/* CTAs */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={onScrollToProducts}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/40 hover:shadow-blue-500/60 transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/40 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    BELANJA SEKARANG
                  </button>

                  {onOpenReferral && (
                    <button
                      onClick={onOpenReferral}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Gift className="w-4 h-4 text-amber-500 animate-bounce" />
                      <span>Undang Teman (Diskon 10%)</span>
                    </button>
                  )}
                </div>

                {/* Sub-banner: Mau Bikin Web Seperti Ini? */}
                <div
                  onClick={onOpenConsultModal}
                  className="cursor-pointer group flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 dark:bg-[#141e33]/90 dark:hover:bg-[#182540] border border-blue-200 dark:border-blue-500/20 transition-all hover:border-blue-400/40 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        MAU BIKIN WEB SEPERTI INI?
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        Hubungi Kami via WA ({STORE_INFO.whatsappDisplay})
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform font-bold">
                    →
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Mascot Panda */}
            <div className="md:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-transparent blur-2xl animate-pulse"></div>

                <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-blue-500/40 shadow-2xl bg-[#0b101d] group hover:scale-[1.02] transition-transform">
                  <img
                    src={PANDA_ASSETS.heroMascot}
                    alt="Yuraa Store Panda Mascot"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-3 text-center">
                    <span className="text-[11px] font-semibold text-slate-300">
                      Maskot Yuraa Panda 🐼 Siap Melayani
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
