import React from 'react';
import { X, Rocket, CheckCircle2, MessageCircle, Globe, Shield, Smartphone } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface WebConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebConsultModal: React.FC<WebConsultModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleConsultWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo Developer Yuraa Store 🚀, saya tertarik ingin membuat website e-commerce & toko akun premium seperti ini. Boleh info detail biaya & fiturnya?`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-blue-500/40 p-6 text-slate-100 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-base text-white">Jasa Pembuatan Web Seperti Ini</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            Ingin punya platform penjualan digital otomatis seperti <strong>Yuraa Store</strong> lengkap dengan:
          </p>

          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sistem Pembayaran DANA (08984436849) &amp; QRIS Otomatis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Integrasi Bukti Pembayaran ke WhatsApp 1-Klik</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI Asisten Jualan 24 Jam dengan Gemini Flash</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Mode Gelap &amp; Terang + 100% Responsif di Semua HP</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Siap Deploy di Vercel / Cloud Run tanpa error</span>
            </div>
          </div>
        </div>

        <div className="pt-2 space-y-2.5">
          <button
            onClick={handleConsultWhatsApp}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            Konsultasi Langsung via WhatsApp ({STORE_INFO.whatsappDisplay})
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
