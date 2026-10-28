import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { BrandIcon } from './BrandIcon';
import { formatRupiah } from '../utils/formatters';
import { evaluateDiscountCode, getAppliedReferralCode } from '../utils/referral';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: (appliedDiscount: number) => void;
  onBrowseProducts: () => void;
  appliedCouponCode?: string;
  onOpenReferral?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onBrowseProducts,
  appliedCouponCode,
  onOpenReferral,
}) => {
  const [voucherCode, setVoucherCode] = useState(appliedCouponCode || '');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFixed, setDiscountFixed] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');

  // Auto-apply prefilled or URL-stored referral voucher on open
  React.useEffect(() => {
    const codeToTest = appliedCouponCode || getAppliedReferralCode();
    if (codeToTest && !discountPercent && !discountFixed) {
      setVoucherCode(codeToTest);
      const evalResult = evaluateDiscountCode(codeToTest, 100000);
      if (evalResult.isValid) {
        setDiscountPercent(evalResult.discountPercent);
        setDiscountFixed(evalResult.discountFixed);
        setVoucherSuccess(evalResult.description);
      }
    }
  }, [appliedCouponCode, isOpen]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.selectedVariant.price * item.quantity, 0);
  const calculatedPercentDiscount = Math.round((subtotal * discountPercent) / 100);
  const discountAmount = discountFixed > 0 ? discountFixed : calculatedPercentDiscount;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherCode.trim().toUpperCase();
    setVoucherError('');
    setVoucherSuccess('');

    const evalResult = evaluateDiscountCode(code, subtotal);
    if (evalResult.isValid) {
      setDiscountPercent(evalResult.discountPercent);
      setDiscountFixed(evalResult.discountFixed);
      setVoucherSuccess(evalResult.description);
    } else {
      setDiscountPercent(0);
      setDiscountFixed(0);
      setVoucherError(evalResult.description || 'Kode kupon / referral tidak valid.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md h-full bg-[#0d1320] border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#111929]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <h2 className="font-extrabold text-base text-white">Keranjang Belanja</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">
              {cart.length} Item
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Keranjang Masih Kosong</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Pilih akun premium favorit Anda dari katalog dan nikmati harga promo terbaik!
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onBrowseProducts();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md shadow-blue-600/30"
            >
              Mulai Belanja Sekarang
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#131b2c] border border-slate-800 flex items-center gap-3 relative group"
                >
                  <BrandIcon iconType={item.product.iconType} size="sm" />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-white truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-blue-400 block truncate font-medium">
                      {item.selectedVariant.name}
                    </span>
                    <span className="text-xs font-black text-slate-200 font-mono mt-0.5 block">
                      {formatRupiah(item.selectedVariant.price)}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-[#090d16] px-2 py-1 rounded-xl border border-slate-700/80">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-slate-400 hover:text-white rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-slate-400 hover:text-white rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Promo Voucher Box */}
              <div className="pt-2 space-y-2">
                <form onSubmit={handleApplyVoucher} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        placeholder="Kode Kupon / Referral (contoh: TEMANHEMAT)"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-xs text-white uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
                    >
                      Gunakan
                    </button>
                  </div>

                  {voucherSuccess && (
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                      <Check className="w-3 h-3 shrink-0" /> {voucherSuccess}
                    </p>
                  )}
                  {voucherError && (
                    <p className="text-[10px] text-red-400 font-medium bg-red-500/10 p-1.5 rounded-lg border border-red-500/20">
                      ⚠️ {voucherError}
                    </p>
                  )}
                </form>

                {onOpenReferral && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReferral();
                    }}
                    className="w-full py-1.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>🎁 Mau kupon diskon tambahan? Undang teman di sini</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Footer Summary & Checkout Button */}
            <div className="p-4 border-t border-slate-800 bg-[#111929] space-y-3">
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white font-bold">{formatRupiah(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>
                      Diskon {discountPercent > 0 ? `(${discountPercent}%)` : 'Referral'}:
                    </span>
                    <span className="font-mono">-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Biaya Layanan &amp; Pajak:</span>
                  <span className="text-emerald-400 font-bold">GRATIS (Rp 0)</span>
                </div>

                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Pembayaran:</span>
                  <span className="font-mono text-blue-400 text-base">{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => onCheckout(discountAmount)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-transform active:scale-[0.98]"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
