import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Users, Zap, ShieldCheck, Box, Check, Copy, CheckCircle2, MessageCircle, ShoppingBag, Clock } from 'lucide-react';
import { Product, ProductVariant, UserProfile } from '../types';
import { BrandIcon } from './BrandIcon';
import { STORE_INFO } from '../data/products';
import { formatRupiah } from '../utils/formatters';

interface ProductDetailPageProps {
  product: Product;
  user: UserProfile | null;
  onBack: () => void;
  onOpenAuth: () => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onDirectBuy: (product: Product, variant: ProductVariant, customerData: { name: string; whatsapp: string; email: string }) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  user,
  onBack,
  onOpenAuth,
  onAddToCart,
  onDirectBuy,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0] || {
    id: `${product.id}-default`,
    name: 'Standard 1 Bulan',
    price: product.price,
    originalPrice: product.originalPrice,
    stock: product.stockCount,
    durationDays: 30,
    description: 'Akses aktif 30 hari',
  });

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [email, setEmail] = useState(user?.email || '');
  const [copiedDana, setCopiedDana] = useState(false);

  // Promo countdown timer (e.g. 02 : 03 : 18)
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 3, seconds: 18 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!whatsapp) setWhatsapp(user.whatsapp);
      if (!email) setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyDana = () => {
    navigator.clipboard.writeText(STORE_INFO.danaNumber);
    setCopiedDana(true);
    setTimeout(() => setCopiedDana(false), 2000);
  };

  const handleProceedOrder = () => {
    if (!customerName.trim()) {
      alert('Mohon isi Nama Lengkap Anda terlebih dahulu');
      return;
    }
    if (!whatsapp.trim()) {
      alert('Mohon isi Nomor WhatsApp Anda untuk pengiriman akun');
      return;
    }
    onDirectBuy(product, selectedVariant, {
      name: customerName,
      whatsapp,
      email: email || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
    });
  };

  const handleDirectWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Halo Admin Yuraa Store 🐼, saya mau pesan:\n- Produk: ${product.name}\n- Variasi: ${selectedVariant.name}\n- Harga: ${formatRupiah(selectedVariant.price)}\n- Nama: ${customerName || 'Pelanggan'}\n- No WA: ${whatsapp || '-'}\n\nSaya mau bayar via DANA ${STORE_INFO.danaNumber}. Tolong dibantu ya!`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      {/* Top Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors uppercase tracking-wider mb-3 py-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          KEMBALI KE KATALOG
        </button>

        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <span className="cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={onBack}>HOME</span>
          <span>/</span>
          <span className="text-slate-500 dark:text-slate-400">{product.categoryLabel.toUpperCase()}</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 truncate">{product.name.toUpperCase()}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Product Visual & Header Card */}
        <div className="rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-7 shadow-lg dark:shadow-2xl relative overflow-hidden">
          {/* Top Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-bold border border-amber-500/30">
              <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-300" />
              TRENDING
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Users className="w-3 h-3" />
              {product.soldCount} TERJUAL
            </span>
          </div>

          {/* Big Brand Icon */}
          <div className="w-full flex items-center justify-center py-8 bg-slate-50 dark:bg-[#090e18] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <BrandIcon iconType={product.iconType} size="lg" className="scale-125" />
          </div>

          {/* Category Pill */}
          <div className="mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-xs tracking-wider border border-blue-500/20 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              AKUN PREMIUM
            </span>
          </div>

          {/* Title & Price */}
          <div className="mt-3 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              {product.name}
            </h1>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-500 font-mono tracking-tight">
              {formatRupiah(selectedVariant.price)}
            </div>
          </div>
        </div>

        {/* Section: Deskripsi */}
        <div className="rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-7 shadow-md dark:shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-blue-600 dark:text-blue-500 font-black text-lg">📘</span>
            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase">DESKRIPSI</h2>
          </div>

          <div className="prose max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {product.description}
          </div>
        </div>

        {/* Section: Keunggulan Produk */}
        <div className="rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-7 shadow-md dark:shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase">KEUNGGULAN PRODUK</h2>
          </div>

          <div className="space-y-2.5">
            {product.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* 3 Stats Highlights */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5">
                <Zap className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">PROSES</span>
              <span className="text-xs font-black text-slate-900 dark:text-white">{product.deliveryType === 'instant' ? 'INSTAN' : '5 MENIT'}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">GARANSI</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">AKTIF 100%</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-1.5">
                <Box className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">STOK</span>
              <span className="text-xs font-black text-slate-900 dark:text-white font-mono">{product.stockCount} UNIT</span>
            </div>
          </div>
        </div>

        {/* Section: Proses Order */}
        <div className="rounded-3xl bg-white dark:bg-[#121929] border border-blue-200 dark:border-blue-500/30 p-5 sm:p-7 shadow-lg dark:shadow-2xl space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-blue-600 dark:text-blue-500 font-black text-lg">🛒</span>
            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase">PROSES ORDER</h2>
          </div>

          {/* Quick Login Banner */}
          {!user ? (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 dark:bg-[#152138] border border-blue-200 dark:border-blue-500/30 gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Punya akun? Login untuk auto-isi data!
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tidak perlu isi email &amp; WA setiap saat
                </p>
              </div>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                LOGIN
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  Login sebagai <strong>{user.name}</strong> ({user.whatsapp})
                </span>
              </div>
            </div>
          )}

          {/* Promo Terbatas Countdown Timer */}
          <div className="rounded-2xl bg-[#191512] border border-amber-600/30 p-4 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest text-amber-500 uppercase">
              <Zap className="w-3.5 h-3.5 fill-amber-500" />
              <span>PROMO TERBATAS</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-500 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">JAM</span>
              </div>
              <span className="text-xl font-bold text-amber-500 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-500 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">MNT</span>
              </div>
              <span className="text-xl font-bold text-amber-500 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-500 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">DET</span>
              </div>
            </div>
          </div>

          {/* Customer Input Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                NAMA LENGKAP *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama kamu"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                WHATSAPP *
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08123456789"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                Akun &amp; notifikasi instan akan dikirimkan ke nomor WhatsApp ini.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                EMAIL PENGIRIMAN *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namakamu@gmail.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Section: Pilih Variasi Produk */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              📦 PILIH VARIASI PRODUK *
            </label>

            <div className="space-y-3">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-[#18233c] border-blue-500 shadow-md dark:shadow-lg dark:shadow-blue-500/20'
                        : 'bg-slate-50 dark:bg-[#0e1422] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Checkmark badge */}
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}

                    <div className="flex items-start justify-between pr-8">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-wide uppercase">
                            {v.name}
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {v.durationDays} HARI
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{v.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-base font-black text-blue-600 dark:text-blue-400">
                        {formatRupiah(v.price)}
                      </span>

                      {v.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          <Check className="w-3 h-3" />
                          STOK: {v.stock}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          PROSES ±30 MENIT
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DANA Payment Details Banner */}
          <div className="rounded-2xl bg-sky-50 dark:bg-gradient-to-r dark:from-sky-950/60 dark:via-blue-950/40 dark:to-slate-900 border border-sky-300 dark:border-sky-500/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-black text-xs">
                  DANA
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Nomor Pembayaran Resmi</span>
              </div>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">Aktif 24 Jam</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 border border-sky-200 dark:border-sky-500/30 shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  NOMOR DANA (A/N {STORE_INFO.danaName})
                </span>
                <span className="font-mono text-lg font-black text-sky-600 dark:text-sky-400 tracking-wider">
                  {STORE_INFO.danaNumber}
                </span>
              </div>
              <button
                onClick={handleCopyDana}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-transform active:scale-95 cursor-pointer"
              >
                {copiedDana ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDana ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              💡 <em>Setelah transfer, kirim bukti pembayaran QRIS / DANA langsung ke WhatsApp toko untuk verifikasi &amp; pengiriman akun otomatis!</em>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleProceedOrder}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 border border-blue-400/30 active:scale-[0.99] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              BELI SEKARANG (PROSES PEMBAYARAN)
            </button>

            <button
              onClick={handleDirectWhatsAppChat}
              className="w-full py-3.5 rounded-2xl bg-[#075E54] hover:bg-[#128C7E] text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-emerald-500/30 active:scale-[0.99] cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              KIRIM BUKTI PEMBAYARAN / ORDER VIA WA ({STORE_INFO.whatsappDisplay})
            </button>

            <button
              onClick={() => onAddToCart(product, selectedVariant)}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#161f33] dark:hover:bg-[#1c2842] text-slate-800 dark:text-slate-200 font-bold text-xs tracking-wider uppercase border border-slate-200 dark:border-slate-700/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              TAMBAHKAN KE KERANJANG BELANJA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
