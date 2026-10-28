import React from 'react';
import { ShoppingCart, MessageCircle, ShieldCheck, Zap, Headphones } from 'lucide-react';
import { PANDA_ASSETS } from '../utils/assets';
import { STORE_INFO } from '../data/products';

interface FeaturesGuaranteeSectionProps {
  onScrollToProducts: () => void;
  onOpenConsultModal: () => void;
}

export const FeaturesGuaranteeSection: React.FC<FeaturesGuaranteeSectionProps> = ({
  onScrollToProducts,
  onOpenConsultModal,
}) => {
  return (
    <section className="space-y-6 pt-6">
      {/* 3 Trust Feature Cards */}
      <div className="space-y-4">
        {/* Card 1: Garansi 100% */}
        <div className="relative rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-6 overflow-hidden flex items-center justify-between shadow-md dark:shadow-xl group hover:border-blue-500/40 transition-colors">
          <div className="space-y-1.5 max-w-[65%] z-10">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              GARANSI <br />
              <span className="text-blue-600 dark:text-blue-500">100%</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Uang Kembali Jika Bermasalah
            </p>
          </div>

          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-blue-500/30 shadow-lg shrink-0 bg-slate-900 group-hover:scale-105 transition-transform">
            <img
              src={PANDA_ASSETS.guaranteeShield}
              alt="Panda Garansi 100%"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Card 2: Proses Cepat */}
        <div className="relative rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-6 overflow-hidden flex items-center justify-between shadow-md dark:shadow-xl group hover:border-blue-500/40 transition-colors">
          <div className="space-y-1.5 max-w-[65%] z-10">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              PROSES <br />
              <span className="text-blue-600 dark:text-blue-500">CEPAT</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Otomatis &amp; instan setelah pembayaran.
            </p>
          </div>

          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-blue-500/30 shadow-lg shrink-0 bg-slate-900 group-hover:scale-105 transition-transform">
            <img
              src={PANDA_ASSETS.fastRunning}
              alt="Panda Proses Cepat"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Card 3: Layanan 24/7 */}
        <div className="relative rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-6 overflow-hidden flex items-center justify-between shadow-md dark:shadow-xl group hover:border-blue-500/40 transition-colors">
          <div className="space-y-1.5 max-w-[65%] z-10">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              LAYANAN <br />
              <span className="text-blue-600 dark:text-blue-500">24/7</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Siap Membantu Kapan Saja
            </p>
          </div>

          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-blue-500/30 shadow-lg shrink-0 bg-slate-900 group-hover:scale-105 transition-transform">
            <img
              src={PANDA_ASSETS.heroMascot}
              alt="Panda Layanan 24/7"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Main Promo Callout Box */}
      <div className="rounded-3xl bg-white dark:bg-[#111929] border border-blue-200 dark:border-blue-600/30 p-6 sm:p-8 text-center space-y-4 shadow-xl dark:shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-500 font-black text-base uppercase tracking-wider">
          <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          <span>YURAASTORE.ID</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
          Semua Kebutuhan <br />
          Akun Premium <br />
          Ada di Satu Tempat!
        </h3>

        <div className="space-y-3 pt-2 max-w-sm mx-auto">
          <button
            onClick={onScrollToProducts}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/40 cursor-pointer"
          >
            BELANJA SEKARANG
          </button>

          <button
            onClick={onOpenConsultModal}
            className="w-full p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 dark:bg-[#141e33] dark:hover:bg-[#1a2844] border border-blue-200 dark:border-blue-500/20 text-center transition-colors group cursor-pointer"
          >
            <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              MAU BIKIN WEB SEPERTI INI?
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Hubungi Kami via WA ({STORE_INFO.whatsappDisplay})
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};
