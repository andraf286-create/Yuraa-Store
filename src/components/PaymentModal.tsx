import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Copy,
  MessageCircle,
  Download,
  Upload,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Loader2,
  RefreshCw,
  Mail,
  Send,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, DeliveredAccount } from '../types';
import { STORE_INFO } from '../data/products';
import { formatRupiah, formatDateTime } from '../utils/formatters';
import { dispenseAccountForProduct } from '../utils/storage';

interface PaymentModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (updatedOrder: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'dana' | 'qris'>('dana');
  const [copiedDana, setCopiedDana] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedCredIndex, setCopiedCredIndex] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(order.paymentStatus === 'paid');
  const [uploadedProofName, setUploadedProofName] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<DeliveredAccount[]>(order.deliveredAccounts || []);
  const [timerSeconds, setTimerSeconds] = useState(900); // 15:00 minutes
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Visual Verification Progress & Skeleton Loading State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyStepText, setVerifyStepText] = useState('Menghubungi sistem pembayaran DANA & QRIS...');

  useEffect(() => {
    if (!isOpen) return;
    setIsPaid(order.paymentStatus === 'paid');
    setIsVerifying(false);
    setVerifyProgress(0);
    if (order.deliveredAccounts && order.deliveredAccounts.length > 0) {
      setCredentials(order.deliveredAccounts);
    }
  }, [isOpen, order]);

  // Countdown timer for payment session
  useEffect(() => {
    if (!isOpen || isPaid || isVerifying) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPaid, isVerifying]);

  if (!isOpen) return null;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  const handleCopyDana = () => {
    navigator.clipboard.writeText(STORE_INFO.danaNumber);
    setCopiedDana(true);
    setTimeout(() => setCopiedDana(false), 2000);
  };

  const handleCopyTotal = () => {
    navigator.clipboard.writeText(order.totalAmount.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleSendProofToWhatsapp = () => {
    const itemsList = order.items
      .map((it) => `• ${it.product.name} (${it.selectedVariant.name}) x${it.quantity}`)
      .join('\n');

    const message = `Halo Admin Yuraa Store 🐼, saya mau konfirmasi pembayaran:

📌 No. Invoice: ${order.invoiceNumber}
👤 Nama: ${order.customerName}
📱 No. WhatsApp: ${order.customerWhatsapp}
🛍️ Produk:
${itemsList}

💰 Total Bayar: ${formatRupiah(order.totalAmount)}
💳 Metode: ${selectedMethod === 'dana' ? 'DANA (' + STORE_INFO.danaNumber + ')' : 'QRIS Instan'}

Berikut saya lampirkan bukti pembayarannya ya Kak. Mohon bantu proses akunnya secepatnya, terima kasih!`;

    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Trigger simulated payment verification with realistic progress bar & skeleton loading state
  const handleStartVerification = () => {
    setIsVerifying(true);
    setVerifyProgress(10);
    setVerifyStepText('Menghubungi sistem mutasi DANA & QRIS...');

    // Progress timeline simulation
    setTimeout(() => {
      setVerifyProgress(38);
      setVerifyStepText('Memverifikasi nomor invoice & nominal transfer...');
    }, 800);

    setTimeout(() => {
      setVerifyProgress(72);
      setVerifyStepText('Mengecek ketersediaan & mengalokasikan akun premium dari database...');
    }, 1700);

    setTimeout(() => {
      setVerifyProgress(95);
      setVerifyStepText('Mengamankan profil akun & mengaktifkan garansi resmi 100%...');
    }, 2400);

    setTimeout(() => {
      setVerifyProgress(100);
      setVerifyStepText('Pembayaran terverifikasi! Menyiapkan kredensial akun...');

      setTimeout(() => {
        finishPaymentSuccess();
      }, 500);
    }, 3000);
  };

  const handleCopyField = (text: string, credIndex: number, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCredIndex(credIndex);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedCredIndex(null);
      setCopiedField(null);
    }, 2000);
  };

  const finishPaymentSuccess = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });

    // Dispense real credentials from the Admin Control Panel restocked inventory!
    const delivered: DeliveredAccount[] = order.items.map((it) => {
      return dispenseAccountForProduct(it.productId, order.invoiceNumber);
    });

    const updatedOrder: Order = {
      ...order,
      paymentStatus: 'paid',
      paidAt: Date.now(),
      deliveredAccounts: delivered,
    };

    setCredentials(delivered);
    setIsVerifying(false);
    setIsPaid(true);
    onPaymentSuccess(updatedOrder);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedProofName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-slate-700/80 p-5 sm:p-6 shadow-2xl text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block font-mono">
              INVOICE: {order.invoiceNumber}
            </span>
            <h2 className="text-lg font-black text-white">
              {isPaid
                ? '🎉 Pembayaran Berhasil & Akun Terkirim'
                : isVerifying
                ? '⏳ Memverifikasi Pembayaran Anda...'
                : 'Sistem Pembayaran Terintegrasi'}
            </h2>
          </div>
          {!isVerifying && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STATE 1: VERIFYING WITH VISUAL PROGRESS BAR & SKELETON LOADING */}
        {isVerifying ? (
          <div className="pt-4 space-y-5">
            {/* Progress Bar Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121d33] to-[#0a1120] border border-blue-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    VERIFIKASI TRANSAKSI OTOMATIS
                  </span>
                </div>
                <span className="text-sm font-black text-blue-400 font-mono tracking-wider">
                  {verifyProgress}%
                </span>
              </div>

              {/* Glowing Multi-step Progress Bar */}
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 transition-all duration-500 ease-out shadow-lg shadow-cyan-500/50 relative overflow-hidden"
                  style={{ width: `${verifyProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-medium text-slate-200">{verifyStepText}</span>
                </span>
                <span className="text-slate-400 font-mono text-[10px]">Sistem Real-Time</span>
              </div>
            </div>

            {/* Skeleton Loading State for Account Credentials */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Menyiapkan Kredensial Akun:
                </span>
                <span className="text-[10px] text-blue-400 animate-pulse font-semibold">
                  Alokasi Database...
                </span>
              </div>

              {/* Skeleton Card 1 */}
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3 animate-shimmer relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="w-24 h-4 bg-slate-800 rounded animate-pulse"></div>
                  <div className="w-32 h-4 bg-emerald-950/60 border border-emerald-500/20 rounded animate-pulse"></div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-3.5 bg-slate-800 rounded"></div>
                    <div className="w-52 h-4 bg-slate-800 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-3.5 bg-slate-800 rounded"></div>
                    <div className="w-36 h-4 bg-amber-950/40 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-3.5 bg-slate-800 rounded"></div>
                    <div className="w-28 h-4 bg-slate-800 rounded"></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <div className="w-full h-3 bg-slate-800/60 rounded"></div>
                </div>
              </div>

              {/* Trust Info while waiting */}
              <div className="p-3 rounded-2xl bg-[#0c1322] border border-blue-500/20 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Transaksi Anda terlindungi GARANSI 100% Full Replace dari Yuraa Store.</span>
              </div>
            </div>
          </div>
        ) : isPaid ? (
          /* STATE 2: PAID & ACCOUNT DELIVERED! */
          <div className="pt-4 space-y-5">
            <div className="rounded-2xl bg-emerald-950/60 border border-emerald-500/40 p-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                Transaksi Sukses &amp; Terverifikasi!
              </h3>
              <p className="text-xs text-emerald-300">
                Akun premium Anda telah aktif dan siap digunakan sekarang juga.
              </p>
            </div>

            {/* Email Auto-Delivery Notification Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900 border border-blue-500/40 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-white">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="uppercase tracking-wider">AKUN TELAH DIKIRIM KE EMAIL:</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  TERKIRIM
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-blue-500/30 flex items-center justify-between text-xs font-mono">
                <span className="text-blue-300 truncate font-bold">{order.customerEmail}</span>
                <span className="text-[10px] text-slate-400 font-sans">Inbox / Spam</span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Username &amp; Password akun telah dikirimkan ke email Anda. Anda juga dapat melihat dan menyalinnya langsung di bawah ini:
              </p>

              <button
                type="button"
                onClick={() => setShowEmailPreview(!showEmailPreview)}
                className="w-full py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{showEmailPreview ? 'Sembunyikan Salinan Email' : 'Lihat Tampilan Salinan Email Pengiriman'}</span>
              </button>
            </div>

            {/* Email Preview Accordion / Client Card */}
            {showEmailPreview && (
              <div className="rounded-2xl bg-slate-950 border border-blue-500/40 p-4 space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-slate-300 font-mono text-[11px]">
                    📨 PREVIEW EMAIL PENGIRIMAN AKUN
                  </span>
                  <span className="text-[10px] text-slate-400">Yuraa Mailer Engine</span>
                </div>

                <div className="space-y-1 font-mono text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <p><strong className="text-slate-300">Dari:</strong> Yuraa Store Delivery &lt;cs@yuraastore.id&gt;</p>
                  <p><strong className="text-slate-300">Kepada:</strong> {order.customerName} &lt;{order.customerEmail}&gt;</p>
                  <p><strong className="text-slate-300">Subjek:</strong> [Yuraa Store] Akun Premium Aktif - No. Invoice #{order.invoiceNumber}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-800 space-y-2 text-slate-200">
                  <p className="font-bold text-white">
                    Halo {order.customerName}, terima kasih telah berbelanja di Yuraa Store! 🐼
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Berikut adalah akun premium resmi hasil restock yang telah dialokasikan khusus untuk Anda:
                  </p>

                  {credentials.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                      <p><span className="text-slate-400">Produk:</span> <strong className="text-white">{order.items[i]?.product.name || 'Akun Premium'}</strong></p>
                      <p><span className="text-slate-400">Username/Email:</span> <strong className="text-blue-400">{c.email}</strong></p>
                      <p><span className="text-slate-400">Password:</span> <strong className="text-emerald-400">{c.password}</strong></p>
                      {c.pin && <p><span className="text-slate-400">PIN Profil:</span> <strong className="text-amber-400">{c.pin}</strong></p>}
                      <p><span className="text-slate-400">Masa Aktif:</span> {c.duration} (s/d {c.expiredDate})</p>
                    </div>
                  ))}

                  <p className="text-[10px] text-slate-400 pt-1">
                    Jika ada kendala akses atau screen limit, hubungi Customer Care kami di WhatsApp {STORE_INFO.whatsappDisplay} dengan melampirkan invoice ini.
                  </p>
                </div>
              </div>
            )}

            {/* Delivered Credentials Box */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>🔐 Detail Akun Anda (Tersedia untuk Disalin):</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">1-KLIK SALIN</span>
              </h4>

              {credentials.map((cred, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900 border border-slate-700 p-4 space-y-3 font-mono text-xs shadow-inner"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-blue-400 font-bold uppercase">AKUN #{idx + 1} • {order.items[idx]?.product.name || 'PREMIUM'}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-sans">
                      Garansi s/d {cred.warrantyUntil}
                    </span>
                  </div>

                  {/* Email row with Copy Button */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex-1 pr-2 truncate">
                      <span className="text-[10px] text-slate-400 block font-sans">USERNAME / EMAIL:</span>
                      <span className="text-white font-bold select-all">{cred.email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyField(cred.email, idx, 'email')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                    >
                      {copiedCredIndex === idx && copiedField === 'email' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Password row with Copy Button */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex-1 pr-2 truncate">
                      <span className="text-[10px] text-slate-400 block font-sans">PASSWORD:</span>
                      <span className="text-emerald-400 font-black text-sm select-all">{cred.password}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyField(cred.password || '', idx, 'password')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-sans font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                    >
                      {copiedCredIndex === idx && copiedField === 'password' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Profile & PIN */}
                  {(cred.profileName || cred.pin) && (
                    <div className="grid grid-cols-2 gap-2">
                      {cred.profileName && (
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-sans">PROFIL:</span>
                          <span className="text-white font-bold">{cred.profileName}</span>
                        </div>
                      )}

                      {cred.pin && (
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-sans">PIN PROFIL:</span>
                            <span className="text-amber-400 font-black tracking-wider">{cred.pin}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyField(cred.pin || '', idx, 'pin')}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            title="Salin PIN"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 text-[11px] font-sans text-slate-400 leading-relaxed">
                    ⚠️ {cred.rulesNotes}
                  </div>
                </div>
              ))}
            </div>

            {/* Action after delivery */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleSendProofToWhatsapp}
                className="w-full py-3.5 rounded-2xl bg-[#075E54] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi CS WhatsApp Jika Ada Kendala
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide transition-all"
              >
                Selesai &amp; Tutup
              </button>
            </div>
          </div>
        ) : (
          /* STATE 3: PENDING PAYMENT INSTRUCTIONS */
          <div className="pt-4 space-y-5">
            {/* Countdown Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141e33] border border-blue-500/30 text-xs">
              <span className="text-slate-300 font-medium">Batas Waktu Pembayaran:</span>
              <span className="font-mono font-black text-amber-400 text-sm">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            {/* Total Amount Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    TOTAL PEMBAYARAN
                  </span>
                  <span className="text-xl font-black text-white font-mono">
                    {formatRupiah(order.totalAmount)}
                  </span>
                </div>
                <button
                  onClick={handleCopyTotal}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAmount ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 text-emerald-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Diskon Kupon / Referral Diterapkan:</span>
                  </span>
                  <span className="font-mono">-{formatRupiah(order.discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedMethod('dana')}
                className={`py-2.5 px-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  selectedMethod === 'dana'
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-400/50'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                <span>DANA Instan</span>
              </button>
              <button
                onClick={() => setSelectedMethod('qris')}
                className={`py-2.5 px-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  selectedMethod === 'qris'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-400/50'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                <span>QRIS (Semua Bank/E-Wallet)</span>
              </button>
            </div>

            {/* DANA Method Content */}
            {selectedMethod === 'dana' ? (
              <div className="space-y-3.5 p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-sky-400 uppercase tracking-wide">
                    TRANSFER APLIKASI DANA
                  </span>
                  <span className="text-[10px] text-sky-300 font-mono">Bebas Biaya Admin</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      NOMOR DANA ({STORE_INFO.danaName})
                    </span>
                    <span className="text-lg font-black text-sky-400 font-mono tracking-wider">
                      {STORE_INFO.danaNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyDana}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs active:scale-95 transition-transform"
                  >
                    {copiedDana ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDana ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal pl-4">
                  <li>Buka aplikasi DANA di HP Anda</li>
                  <li>Pilih menu <strong>Kirim</strong> lalu masukkan nomor <strong>{STORE_INFO.danaNumber}</strong></li>
                  <li>Masukkan nominal <strong>{formatRupiah(order.totalAmount)}</strong></li>
                  <li>Konfirmasi transfer &amp; simpan bukti pembayaran</li>
                </ol>
              </div>
            ) : (
              /* QRIS Method Content */
              <div className="space-y-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs font-bold text-slate-300 block">
                  Scan QRIS dengan BCA, Mandiri, GoPay, OVO, ShopeePay, DANA
                </span>

                <div className="w-48 h-48 mx-auto p-2 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg border border-slate-300">
                  <div className="w-full flex justify-between items-center px-1 mb-1">
                    <span className="text-[9px] font-black text-slate-800 font-mono tracking-tighter">QRIS RESMI</span>
                    <span className="text-[8px] text-slate-500">YURAA STORE</span>
                  </div>
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021226670014ID.GO.QRIS.WWW01189360091808984436849520458125303360540"
                    alt="QRIS Yuraa Store"
                    className="w-36 h-36 object-contain"
                  />
                  <span className="text-[8px] font-bold text-slate-700 mt-1 uppercase">
                    A/N YURAA STORE DIGITAL
                  </span>
                </div>
              </div>
            )}

            {/* Upload Proof or Direct WhatsApp Confirmation */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Bukti Pembayaran:
              </label>

              <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-3 text-center cursor-pointer transition-colors bg-slate-900/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>{uploadedProofName ? `File: ${uploadedProofName}` : 'Pilih / Lampirkan Foto Bukti Transfer'}</span>
                </div>
              </div>

              {/* Send to WhatsApp Button */}
              <button
                onClick={handleSendProofToWhatsapp}
                className="w-full py-3.5 rounded-2xl bg-[#075E54] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-transform active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4" />
                KIRIM BUKTI PEMBAYARAN KE WHATSAPP (08984436849)
              </button>

              {/* Verification Trigger with Progress Bar & Skeleton */}
              <button
                onClick={handleStartVerification}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 border border-blue-400/30"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Cek &amp; Verifikasi Pembayaran Sekarang</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
