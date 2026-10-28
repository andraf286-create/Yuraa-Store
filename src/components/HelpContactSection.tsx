import React, { useState } from 'react';
import { Smartphone, Shield, Clock, MessageCircle, Check, X } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface HelpContactSectionProps {
  onOpenWarrantyModal: () => void;
  onOpenConsultModal: () => void;
}

export const HelpContactSection: React.FC<HelpContactSectionProps> = ({
  onOpenWarrantyModal,
  onOpenConsultModal,
}) => {
  const handleContactAdmin = () => {
    const text = encodeURIComponent(
      `Halo Admin Yuraa Store 🐼, saya ingin bertanya seputar akun premium atau cara pembelian.`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section className="space-y-6 pt-6">
      {/* Help Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111929] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-4 shadow-lg dark:shadow-xl">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          BUTUH BANTUAN?
        </h2>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          TIM CS KAMI SIAP MELAYANI ANDA 24 JAM
        </p>

        {/* Operating Hours Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b101c] border border-slate-200 dark:border-slate-800 max-w-xs mx-auto space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            JAM KERJA
          </span>
          <span className="font-mono text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 tracking-wide block">
            {STORE_INFO.operatingHours}
          </span>
        </div>

        {/* Action Buttons matching screenshot */}
        <div className="space-y-3 pt-2 max-w-sm mx-auto">
          {/* Button 1: Hubungi Admin (Green) */}
          <button
            onClick={handleContactAdmin}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>HUBUNGI ADMIN</span>
          </button>

          {/* Button 2: Klaim Garansi (Red/Pink Gradient) */}
          <button
            onClick={onOpenWarrantyModal}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-transform active:scale-95 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>KLAIM GARANSI</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="text-center pt-4 pb-12 space-y-4">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
          © 2026 YURAA STORE • OFFICIAL DIGITAL PARTNER
        </p>

        {/* Promo link footer */}
        <div
          onClick={onOpenConsultModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-md cursor-pointer hover:border-blue-500 transition-colors"
        >
          <span>🚀</span>
          <span className="text-xs font-semibold">MAU BUAT WEBSITE SEPERTI INI?</span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 underline">
            Hubungi Kami
          </span>
        </div>
      </footer>
    </section>
  );
};
