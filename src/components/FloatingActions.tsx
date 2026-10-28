import React from 'react';
import { ShoppingBag, MessageCircle, Bot } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface FloatingActionsProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAI: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  cartCount,
  onOpenCart,
  onOpenAI,
}) => {
  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo Admin Yuraa Store 🐼, saya mau tanya stok dan cara order akun premium.`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* 1. Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={onOpenCart}
          aria-label="Buka Keranjang Belanja"
          className="relative w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-blue-400/40"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-[#0b0f19] animate-bounce">
            {cartCount}
          </span>
        </button>
      )}

      {/* 2. Floating AI Sales Assistant Button (Blue Bot button matching screenshot) */}
      <button
        onClick={onOpenAI}
        aria-label="Tanya AI Asisten Jualan"
        className="group relative w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-blue-300/40"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        {/* Tooltip on hover */}
        <span className="absolute right-14 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow-lg border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Tanya Panda AI 🐼
        </span>
      </button>

      {/* 3. Floating WhatsApp CS Button (Green Chat Bubble button matching screenshot) */}
      <button
        onClick={handleOpenWhatsApp}
        aria-label="Hubungi WhatsApp Admin"
        className="group relative w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-emerald-300/40"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="absolute right-14 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow-lg border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat WhatsApp CS 💬
        </span>
      </button>
    </div>
  );
};
