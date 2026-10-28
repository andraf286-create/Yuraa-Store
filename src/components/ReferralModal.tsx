import React, { useState } from 'react';
import {
  X,
  Gift,
  Copy,
  Check,
  Share2,
  Users,
  Sparkles,
  Ticket,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Percent,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { UserProfile } from '../types';
import { PANDA_ASSETS } from '../utils/assets';
import { STORE_INFO } from '../data/products';
import {
  getReferralData,
  saveReferralData,
  ReferralCoupon,
} from '../utils/referral';
import { formatRupiah } from '../utils/formatters';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onApplyCouponToCart: (couponCode: string) => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  user,
  onApplyCouponToCart,
}) => {
  const [referralData, setReferralData] = useState(() => getReferralData(user));
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCouponIndex, setCopiedCouponIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'invite' | 'coupons' | 'history'>('invite');

  if (!isOpen) return null;

  // Construct invite link
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yuraastore.id';
  const inviteLink = `${origin}/?ref=${referralData.referralCode}`;

  const shareText = `Halo! 🐼 Mau beli akun Netflix, Spotify, YouTube Premium murah & legal bergaransi 100%? Yuk beli di Yuraa Store pakai link referral-ku untuk klaim diskon belanja hingga 15%: ${inviteLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyCouponCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCouponIndex(index);
    setTimeout(() => setCopiedCouponIndex(null), 2000);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleShareTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(
      'Beli Akun Premium Murah & Bergaransi di Yuraa Store pakai diskon khusus!'
    )}`;
    window.open(tgUrl, '_blank');
  };

  const handleShareTwitter = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twUrl, '_blank');
  };

  const handleUseCoupon = (couponCode: string) => {
    onApplyCouponToCart(couponCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0d1322] border border-blue-500/30 p-5 sm:p-6 shadow-2xl text-slate-100 my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-base text-white">Program Referral Yuraa</h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  REWARD DISKON
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Undang Teman &amp; Dapatkan Kupon Belanja Setiap Transaksi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Mascot Banner */}
        <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-purple-950/70 border border-blue-500/30 flex items-center gap-4 relative overflow-hidden shrink-0">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-400 shadow-md shrink-0 bg-slate-900">
            <img
              src={PANDA_ASSETS.avatarLogo}
              alt="Panda Yuraa Store"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> UNTUNG BERSAMA PANDA STORE
            </span>
            <h3 className="font-black text-sm text-white truncate">
              Ajak Teman, Teman Diskon 10%, Kamu Dapat Voucher!
            </h3>
            <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
              Bagikan link unik Anda. Setiap teman yang melakukan order pertama, Anda langsung menerima diskon untuk pembelian berikutnya.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 p-1 rounded-2xl bg-[#090e18] border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('invite')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'invite'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan Link</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === 'coupons'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Kupon Anda</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Statistik</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-4">
          {activeTab === 'invite' && (
            <div className="space-y-4">
              {/* How it works in 3 quick points */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-[#111929] border border-slate-800 space-y-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center mx-auto">
                    1
                  </div>
                  <span className="text-[11px] font-bold text-white block">Salin Link</span>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Kirim link referral ke teman atau medsos
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#111929] border border-slate-800 space-y-1">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center mx-auto">
                    2
                  </div>
                  <span className="text-[11px] font-bold text-white block">Teman Belanja</span>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Teman dapat diskon 10% di pembelian pertama
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#111929] border border-slate-800 space-y-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mx-auto">
                    3
                  </div>
                  <span className="text-[11px] font-bold text-white block">Klaim Reward</span>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Kamu dapat kupon TEMANHEMAT 10% OFF
                  </span>
                </div>
              </div>

              {/* Unique Invite Link Box */}
              <div className="p-4 rounded-2xl bg-[#111a2d] border border-blue-500/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" /> LINK UNDANGAN REFERRAL UNIK ANDA:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Aktif &amp; Terverifikasi</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[#090d16] border border-slate-700 text-xs text-white font-mono select-all focus:outline-none focus:border-blue-500 truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      copiedLink
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Referral Code Box */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Kode Referral:</span>
                    <span className="font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {referralData.referralCode}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Kode Disalin
                      </span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Direct Share Channels */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Bagikan Langsung ke Media Sosial:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleShareWhatsApp}
                    className="py-2.5 px-3 rounded-2xl bg-[#075E54] hover:bg-[#128C7E] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={handleShareTelegram}
                    className="py-2.5 px-3 rounded-2xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={handleShareTwitter}
                    className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Twitter/X</span>
                  </button>
                </div>
              </div>

              {/* Highlight callout to use earned voucher */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Sudah Punya Kupon Diskon?</h4>
                    <p className="text-[10px] text-amber-300">
                      Gunakan kode <strong className="font-mono text-white">TEMANHEMAT</strong> untuk potongan 10% di keranjangmu!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUseCoupon('TEMANHEMAT')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shrink-0 cursor-pointer shadow-md shadow-amber-500/30"
                >
                  Pakai Sekarang
                </button>
              </div>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Kupon Hadiah Yang Siap Digunakan:
                </span>
                <span className="text-[10px] text-blue-400 font-bold">1-Klik Pasang ke Keranjang</span>
              </div>

              {referralData.coupons.map((coupon, idx) => (
                <div
                  key={coupon.code}
                  className="p-4 rounded-2xl bg-[#111929] border border-slate-700/80 hover:border-blue-500/50 transition-colors space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black">
                        {coupon.discountPercent ? `${coupon.discountPercent}%` : '5K'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-white tracking-wider">
                            {coupon.code}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            TERSEDIA
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{coupon.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span>Berlaku s/d: {coupon.expiry}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCouponCode(coupon.code, idx)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedCouponIndex === idx ? (
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

                      <button
                        onClick={() => handleUseCoupon(coupon.code)}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[10px] uppercase flex items-center gap-1 transition-transform active:scale-95 cursor-pointer shadow-md"
                      >
                        <span>Pasang di Keranjang</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Stats overview boxes */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-2xl bg-[#111929] border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Teman Bergabung</span>
                  <span className="text-xl font-black text-blue-400 font-mono mt-0.5 block">
                    {referralData.totalFriendsInvited}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-medium">Orang Aktif</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#111929] border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Hadiah</span>
                  <span className="text-xl font-black text-amber-400 font-mono mt-0.5 block">
                    {formatRupiah(referralData.totalRewardsEarned)}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">Nilai Diskon</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#111929] border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tingkat Member</span>
                  <span className="text-sm font-black text-purple-400 mt-1 block truncate">
                    Panda VIP ⭐
                  </span>
                  <span className="text-[9px] text-purple-300 font-medium">Komisi Maksimal</span>
                </div>
              </div>

              {/* Activity log */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Aktivitas Teman Terakhir:
                </span>

                <div className="space-y-2">
                  {referralData.recentActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-xl bg-[#090e18] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[11px]">
                          {act.friendName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{act.friendName}</div>
                          <div className="text-[10px] text-slate-400">{act.productName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-emerald-400 block font-mono">
                          {act.reward}
                        </span>
                        <span className="text-[9px] text-slate-500">{act.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-400 text-[11px]">
            Ada pertanyaan program referral? Hubungi CS kami di WhatsApp.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
