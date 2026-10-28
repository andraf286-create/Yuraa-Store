import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, ShieldCheck, Wallet, History, LogOut, CheckCircle, Copy, KeyRound } from 'lucide-react';
import { UserProfile, Order } from '../types';
import { DEFAULT_USER } from '../utils/storage';
import { formatRupiah, formatDateTime } from '../utils/formatters';
import { STORE_INFO } from '../data/products';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  orders: Order[];
  onSelectOrderForPayment: (order: Order) => void;
  onOpenAdminPanel?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  orders,
  onSelectOrderForPayment,
  onOpenAdminPanel,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile' | 'orders' | 'topup'>(
    user ? 'profile' : 'login'
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [topupAmount, setTopupAmount] = useState(50000);

  if (!isOpen) return null;

  const handleQuickDemoLogin = () => {
    onLogin(DEFAULT_USER);
    setActiveTab('profile');
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const loggedUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email: email,
      whatsapp: whatsapp || '081234567890',
      balance: 100000,
      isMember: true,
      tier: 'Gold',
    };
    onLogin(loggedUser);
    setActiveTab('profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-slate-700/80 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">
                {user ? `Akun: ${user.name}` : 'Login & Member Yuraa Store'}
              </h2>
              <p className="text-[10px] text-slate-400">Pusat Akun Premium &amp; Riwayat Pesanan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800 mt-3 shrink-0 overflow-x-auto no-scrollbar">
          {!user ? (
            <>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'register' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daftar Baru
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Profil &amp; Saldo
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Riwayat Pesanan ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('topup')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'topup' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Top Up Saldo
              </button>
            </>
          )}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* TAB: LOGIN */}
          {activeTab === 'login' && !user && (
            <div className="space-y-4">
              {/* Quick Demo Login */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-center space-y-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                  AKUN TEST &amp; DEMO CEPAT
                </span>
                <p className="text-xs text-slate-200">
                  Masuk instan sebagai Member VIP dengan saldo bawaan <strong>Rp 150.000</strong>:
                </p>
                <button
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md shadow-blue-600/30"
                >
                  Masuk Cepat Demo (1-Klik)
                </button>
              </div>

              <div className="relative text-center my-3">
                <span className="bg-[#0f172a] px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider relative z-10">
                  ATAU MASUK DENGAN EMAIL
                </span>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-800"></div>
              </div>

              <form onSubmit={handleManualLogin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Email Pengguna
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wide transition-colors mt-2"
                >
                  Masuk ke Akun
                </button>
              </form>
            </div>
          )}

          {/* TAB: REGISTER */}
          {activeTab === 'register' && !user && (
            <form onSubmit={handleManualLogin} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap kamu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide shadow-md shadow-blue-600/30 transition-transform active:scale-95 mt-2"
              >
                Daftar &amp; Dapatkan Saldo Bonus Rp 100.000
              </button>
            </form>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && user && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121f38] to-[#0c1424] border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-xs text-emerald-400">Status: Member VIP Aktif</span>
                  </div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                    Tier {user.tier}
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    SALDO TOKOAKUN / YURAA
                  </span>
                  <span className="text-2xl font-black text-white font-mono tracking-tight">
                    {formatRupiah(user.balance)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                  <p>👤 <strong>{user.name}</strong></p>
                  <p>📱 {user.whatsapp}</p>
                  <p>✉️ {user.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('topup')}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Top Up Saldo</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Riwayat ({orders.length})</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  setActiveTab('login');
                }}
                className="w-full py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold border border-red-800/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar dari Akun</span>
              </button>

              {/* Hidden Admin Access Button in Profile */}
              {onOpenAdminPanel && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminPanel();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                    <span>Control Panel Admin (Restock &amp; Status Produk)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <History className="w-8 h-8 mx-auto text-slate-500" />
                  <p>Belum ada riwayat pesanan.</p>
                </div>
              ) : (
                orders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => onSelectOrderForPayment(o)}
                    className="p-3.5 rounded-2xl bg-[#121929] border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-blue-400">{o.invoiceNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.paymentStatus === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {o.paymentStatus === 'paid' ? 'LUNAS / AKTIF' : 'MENUNGGU BAYAR'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="truncate">
                          • {it.product.name} ({it.selectedVariant.name}) x{it.quantity}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-400">{formatDateTime(o.createdAt)}</span>
                      <span className="font-mono font-black text-white">{formatRupiah(o.totalAmount)}</span>
                    </div>

                    <div className="text-[10px] text-blue-400 font-semibold text-right">
                      Lihat Kredensial &amp; Detail →
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: TOP UP */}
          {activeTab === 'topup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">Pilih Nominal Top Up Saldo</span>

                <div className="grid grid-cols-3 gap-2">
                  {[25000, 50000, 100000, 200000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className={`p-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        topupAmount === amt
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {formatRupiah(amt)}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs text-slate-300 space-y-2">
                  <span className="font-bold text-sky-400 block">Transfer ke DANA Resmi Yuraa:</span>
                  <div className="flex items-center justify-between font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-sky-300">{STORE_INFO.danaNumber}</span>
                    <span className="text-[10px] text-slate-400">A/N {STORE_INFO.danaName}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (user) {
                      onLogin({ ...user, balance: user.balance + topupAmount });
                      alert(`Saldo berhasil ditambahkan sebesar ${formatRupiah(topupAmount)}!`);
                      setActiveTab('profile');
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md shadow-emerald-600/30"
                >
                  Simulasi Tambah Saldo {formatRupiah(topupAmount)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
