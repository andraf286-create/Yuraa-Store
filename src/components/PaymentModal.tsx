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
  Coins,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, DeliveredAccount } from '../types';
import { STORE_INFO } from '../data/products';
import { formatRupiah, formatDateTime } from '../utils/formatters';
import { dispenseAccountForProduct, calculatePointsEarned } from '../utils/storage';

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
  const selectedMethod = 'dana';
  const [copiedDana, setCopiedDana] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedCredIndex, setCopiedCredIndex] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(order.paymentStatus === 'paid');
  const [uploadedProofName, setUploadedProofName] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<DeliveredAccount[]>(order.deliveredAccounts || []);
  const [timerSeconds, setTimerSeconds] = useState(900); // 15:00 minutes
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailSentAlert, setEmailSentAlert] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Visual Verification Progress & Skeleton Loading State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyStepText, setVerifyStepText] = useState('Menghubungi sistem pembayaran DANA...');

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

    let extraRoblox = '';
    if (order.robloxUsername) {
      extraRoblox = `\n🎮 Username Roblox: ${order.robloxUsername}\n⚡ Metode Top Up: ${
        order.robloxMethod === 'gamepass'
          ? 'Via Link Gamepass (Hanya Username)'
          : order.robloxMethod === 'premium'
          ? 'Roblox Subs Premium'
          : 'Via Login Kilat'
      }`;
      if (order.robloxGamepassUrl) {
        extraRoblox += `\n🔗 Link Gamepass: ${order.robloxGamepassUrl}`;
      }
    }

    const message = `Halo Admin Yuraa Store 🐼, saya mau konfirmasi pembayaran:

📌 No. Invoice: ${order.invoiceNumber}
👤 Nama: ${order.customerName}
📱 No. WhatsApp: ${order.customerWhatsapp}${extraRoblox}
🛍️ Produk:
${itemsList}

💰 Total Bayar: ${formatRupiah(order.totalAmount)}
💳 Metode: DANA (${STORE_INFO.danaNumber} a/n ${STORE_INFO.danaName})

Berikut saya lampirkan bukti pembayarannya ya Kak. Mohon bantu proses secepatnya (Robux / Akun), terima kasih!`;

    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Trigger simulated payment verification with realistic progress bar & skeleton loading state
  const handleStartVerification = () => {
    setIsVerifying(true);
    setVerifyProgress(10);
    setVerifyStepText('Menghubungi sistem mutasi DANA...');

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

    const pointsEarned = order.pointsEarned || calculatePointsEarned(order.totalAmount);

    const updatedOrder: Order = {
      ...order,
      paymentStatus: 'paid',
      paidAt: Date.now(),
      deliveredAccounts: delivered,
      pointsEarned,
    };

    setCredentials(delivered);
    setIsVerifying(false);
    setIsPaid(true);
    setEmailSentAlert(true);
    onPaymentSuccess(updatedOrder);
  };

  const handleResendEmail = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setEmailSentAlert(true);
      // Re-trigger global app toast if available
      onPaymentSuccess({ ...order, paymentStatus: 'paid', deliveredAccounts: credentials });
    }, 800);
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

            {/* Loyalty Points Earned / Cashback Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                    Poin Loyalitas Masuk ke Dompet
                  </span>
                  <span className="text-xs text-slate-200">
                    Selamat! Anda memperoleh <strong className="text-amber-400 font-mono">+{order.pointsEarned || calculatePointsEarned(order.totalAmount)} Poin</strong> loyalitas.
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                +{order.pointsEarned || calculatePointsEarned(order.totalAmount)} PTS
              </span>
            </div>

            {/* Visual Toast Alert for Email Delivery */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/70 to-slate-900 border border-blue-500/50 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-black text-white">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Mail className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="uppercase tracking-wider block">KREDENSIAL DIKIRIM KE EMAIL</span>
                    <span className="text-[10px] text-slate-400 font-normal">Pengiriman otomatis server</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono tracking-wider">
                  ✓ TERKIRIM
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-blue-500/30 flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 truncate font-bold">{order.customerEmail}</span>
                <span className="text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Inbox / Spam
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Username, password, dan detail pesanan telah otomatis dikirimkan ke email terdaftar Anda. Anda juga dapat melihat dan menyalinnya langsung di bawah ini:
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowEmailPreview(!showEmailPreview)}
                  className="py-2 px-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{showEmailPreview ? 'Sembunyikan' : 'Preview Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 text-emerald-400 ${isResending ? 'animate-spin' : ''}`} />
                  <span>{isResending ? 'Mengirim...' : 'Kirim Ulang Email'}</span>
                </button>
              </div>
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

            {/* ROBLOX TOP UP DELIVERY STATUS BOX IF ROBLOX */}
            {order.robloxUsername && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-neutral-900 to-black border border-emerald-500/50 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      STATUS PENGISIAN ROBUX (PROSES ±5 MENIT)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    SEDANG DIKIRIM
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-neutral-800">
                    <span className="text-[11px] text-neutral-400">Target Akun Roblox:</span>
                    <span className="font-mono font-black text-white">{order.robloxUsername}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-neutral-800">
                    <span className="text-[11px] text-neutral-400">Metode:</span>
                    <span className="font-bold text-emerald-400">
                      {order.robloxMethod === 'gamepass'
                        ? 'Via Link Gamepass (Pajak 30% Ditanggung Toko)'
                        : order.robloxMethod === 'premium'
                        ? 'Roblox Subs Premium'
                        : 'Via Login Kilat'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  ⚡ <strong>Top Up Robux Sedang Berlangsung:</strong> Admin Yuraa Store sedang memproses pengisian ke akun <strong>{order.robloxUsername}</strong>. Robux akan masuk bersih dalam kurun waktu <strong>±5 Menit</strong> tanpa perlu menunggu 5 hari. Notifikasi selesai akan dikirimkan ke WhatsApp Anda!
                </p>
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
                    <span>Diskon Kupon / Promo Diterapkan:</span>
                  </span>
                  <span className="font-mono">-{formatRupiah(order.discountAmount)}</span>
                </div>
              )}

              {order.pointsDiscountAmount && order.pointsDiscountAmount > 0 ? (
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/80 text-amber-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tukar Poin Loyalitas ({order.pointsRedeemed} Poin):</span>
                  </span>
                  <span className="font-mono">-{formatRupiah(order.pointsDiscountAmount)}</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/70 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reward Poin Transaksi Sukses:</span>
                </span>
                <span className="font-mono font-bold text-amber-400">
                  +{order.pointsEarned || calculatePointsEarned(order.totalAmount)} Poin
                </span>
              </div>
            </div>

            {/* DANA Payment Method Section (Exclusive) */}
            <div className="space-y-3.5 p-4 rounded-2xl bg-gradient-to-b from-sky-950/60 to-slate-900 border border-sky-500/40 shadow-lg shadow-sky-950/30">
              <div className="flex items-center justify-between pb-2 border-b border-sky-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center font-black text-white text-sm shadow-md shadow-sky-500/30">
                    D
                  </div>
                  <div>
                    <span className="text-xs font-black text-sky-400 uppercase tracking-wide block">
                      PEMBAYARAN RESMI: DANA INSTAN
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Transfer Cepat &amp; Bebas Biaya Admin
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 font-mono font-bold px-2 py-0.5 rounded-full border border-sky-500/30">
                  Bebas Biaya Admin
                </span>
              </div>

              {/* DANA Number Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    NOMOR DANA ({STORE_INFO.danaName})
                  </span>
                  <span className="text-lg sm:text-xl font-black text-sky-400 font-mono tracking-wider">
                    {STORE_INFO.danaNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyDana}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs active:scale-95 transition-transform shadow-md shadow-sky-600/30 cursor-pointer"
                >
                  {copiedDana ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDana ? 'Tersalin' : 'Salin Nomor'}</span>
                </button>
              </div>

              {/* Step Guide */}
              <div className="bg-sky-950/30 p-3 rounded-xl border border-sky-900/30">
                <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block mb-1.5">
                  Petunjuk Transfer DANA:
                </span>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal pl-4">
                  <li>Buka aplikasi <strong>DANA</strong> di HP Anda</li>
                  <li>Pilih menu <strong>Kirim</strong> lalu masukkan nomor <strong>{STORE_INFO.danaNumber}</strong></li>
                  <li>Masukkan nominal transfer: <strong className="text-sky-300 font-mono">{formatRupiah(order.totalAmount)}</strong></li>
                  <li>Konfirmasi transfer &amp; lampirkan foto bukti pembayaran di bawah</li>
                </ol>
              </div>
            </div>

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
