import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Minus,
  Save,
  KeyRound,
  Eye,
  EyeOff,
  ShoppingBag,
  Boxes,
  Zap,
  Mail,
  Trash2,
  Copy,
  Users,
  Check,
  LogOut,
  RotateCcw,
  Archive,
  History,
  FileText,
} from 'lucide-react';
import { Product, Order, AccountInventoryItem } from '../types';
import { BrandIcon } from './BrandIcon';
import {
  getAdminPassword,
  setAdminPassword,
  saveProductOverride,
  resetAllProductOverrides,
  getAccountInventory,
  addAccountToInventory,
  deleteInventoryItem,
  DeletedOrderLog,
  getDeletedOrders,
  deleteOrderFromStorage,
  restoreDeletedOrder,
  deleteDeletedOrderPermanently,
  clearAllDeletedOrders,
  getAdminSession,
  setAdminSession,
} from '../utils/storage';
import { formatRupiah, formatDateTime } from '../utils/formatters';

interface AdminControlPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProductStock: (
    productId: string,
    newStock: number,
    isSoldOut: boolean,
    newPrice?: number
  ) => void;
  onResetAllOverrides: () => void;
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, status: 'pending' | 'paid' | 'cancelled' | 'refunded') => void;
  onOrdersChange?: () => void;
}

export const AdminControlPanelModal: React.FC<AdminControlPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProductStock,
  onResetAllOverrides,
  orders,
  onUpdateOrderStatus,
  onOrdersChange,
}) => {
  // Authentication state - with persistent session check & logout capability
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getAdminSession());
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Active Tab: 'stock' | 'credentials' | 'orders' | 'deleted_history' | 'security'
  const [activeTab, setActiveTab] = useState<'stock' | 'credentials' | 'orders' | 'deleted_history' | 'security'>('stock');

  // Deleted orders audit log state
  const [deletedOrders, setDeletedOrders] = useState<DeletedOrderLog[]>(() => getDeletedOrders());
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleteReason, setDeleteReason] = useState<string>('');

  // Sync deleted orders whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setDeletedOrders(getDeletedOrders());
      setIsAuthenticated(getAdminSession());
    }
  }, [isOpen]);

  // Inventory accounts state
  const [inventoryList, setInventoryList] = useState<AccountInventoryItem[]>(() => getAccountInventory());
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'netflix-uhd');

  // Form for adding single credential
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [newAccountPassword, setNewAccountPassword] = useState('');
  const [newAccountPin, setNewAccountPin] = useState('');
  const [newAccountProfile, setNewAccountProfile] = useState('');
  const [newAccountNotes, setNewAccountNotes] = useState('');

  // Bulk add modal/textarea state
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  // Search & Filter state for products
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'soldout'>('all');

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLogoutAdmin = () => {
    setAdminSession(false);
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError('');
    showToast('🔒 Berhasil keluar dari Control Panel Admin');
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getAdminPassword();
    if (passwordInput.trim() === correctPassword) {
      setAdminSession(true);
      setIsAuthenticated(true);
      setPasswordError('');
      setPasswordInput('');
      setDeletedOrders(getDeletedOrders());
      showToast('🔓 Selamat datang di Control Panel Admin Yuraa Store');
    } else {
      setPasswordError('Kata sandi admin salah! Silakan coba lagi.');
    }
  };

  const handlePromptDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setDeleteReason('Pembatalan transaksi oleh admin');
  };

  const handleConfirmDeleteOrder = () => {
    if (!orderToDelete) return;
    const inv = orderToDelete.invoiceNumber;
    const log = deleteOrderFromStorage(orderToDelete.id, deleteReason);
    if (log) {
      setDeletedOrders(getDeletedOrders());
      onOrdersChange?.();
      showToast(`Pesanan #${inv} berhasil dihapus & dicatat di Riwayat Penghapusan`);
    }
    setOrderToDelete(null);
    setDeleteReason('');
  };

  const handleRestoreOrder = (logId: string) => {
    const restored = restoreDeletedOrder(logId);
    if (restored) {
      setDeletedOrders(getDeletedOrders());
      onOrdersChange?.();
      showToast(`Pesanan #${restored.invoiceNumber} berhasil dipulihkan ke Pesanan Aktif!`);
    }
  };

  const handlePermanentDelete = (logId: string, invoice: string) => {
    if (confirm(`Hapus permanen riwayat transaksi #${invoice}? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteDeletedOrderPermanently(logId);
      setDeletedOrders(getDeletedOrders());
      showToast(`Riwayat #${invoice} dihapus permanen`);
    }
  };

  const handleClearAllDeletedLogs = () => {
    if (confirm('Kosongkan seluruh riwayat transaksi yang pernah dihapus?')) {
      clearAllDeletedOrders();
      setDeletedOrders([]);
      showToast('Semua riwayat penghapusan transaksi telah dibersihkan.');
    }
  };

  const handleToggleSoldOut = (product: Product) => {
    const nextSoldOut = !product.isSoldOut;
    const nextStock = nextSoldOut ? 0 : product.stockCount > 0 ? product.stockCount : 10;
    onUpdateProductStock(product.id, nextStock, nextSoldOut);
    showToast(
      `${product.name} sekarang: ${nextSoldOut ? '🔴 HABIS / SOLD OUT' : `🟢 TERSEDIA (${nextStock} Stok)`}`
    );
  };

  const handleAdjustStock = (product: Product, delta: number) => {
    const currentStock = product.stockCount || 0;
    const newStock = Math.max(0, currentStock + delta);
    const isSoldOut = newStock <= 0;
    onUpdateProductStock(product.id, newStock, isSoldOut);
    showToast(`${product.name}: Stok disesuaikan menjadi ${newStock} unit`);
  };

  const handleSetExactStock = (product: Product, valueStr: string) => {
    const parsed = parseInt(valueStr, 10);
    const newStock = isNaN(parsed) ? 0 : Math.max(0, parsed);
    const isSoldOut = newStock <= 0;
    onUpdateProductStock(product.id, newStock, isSoldOut);
    showToast(`${product.name}: Stok di-update menjadi ${newStock} unit`);
  };

  // Add single credential to inventory
  const handleAddCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountEmail.trim() || !newAccountPassword.trim()) {
      alert('Mohon isi Email/Username dan Password akun!');
      return;
    }

    addAccountToInventory({
      productId: selectedProductId,
      email: newAccountEmail.trim(),
      password: newAccountPassword.trim(),
      profilePin: newAccountPin.trim() || undefined,
      profileName: newAccountProfile.trim() || 'Profile 1 (Khusus Pembeli)',
      notes: newAccountNotes.trim() || 'Garansi Resmi 100% Yuraa Store.',
    });

    setInventoryList(getAccountInventory());
    setNewAccountEmail('');
    setNewAccountPassword('');
    setNewAccountPin('');
    setNewAccountProfile('');
    setNewAccountNotes('');

    // Automatically increase product stock count
    const targetProduct = products.find((p) => p.id === selectedProductId);
    if (targetProduct) {
      const nextStock = targetProduct.stockCount + 1;
      onUpdateProductStock(targetProduct.id, nextStock, false);
      showToast(`Akun ${targetProduct.name} ditambahkan! Stok sekarang: ${nextStock}`);
    }
  };

  // Bulk add accounts
  const handleBulkAddAccounts = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput.trim().split('\n');
    let addedCount = 0;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      let parts: string[] = [];
      if (trimmed.includes('|')) {
        parts = trimmed.split('|').map((s) => s.trim());
      } else if (trimmed.includes(':')) {
        parts = trimmed.split(':').map((s) => s.trim());
      } else if (trimmed.includes(';')) {
        parts = trimmed.split(';').map((s) => s.trim());
      } else {
        parts = [trimmed, 'YuraaPass@2026'];
      }

      const email = parts[0];
      const password = parts[1] || 'YuraaPass@2026';
      const pin = parts[2] || '';
      const profile = parts[3] || 'Profile 1';

      if (email && password) {
        addAccountToInventory({
          productId: selectedProductId,
          email,
          password,
          profilePin: pin,
          profileName: profile,
          notes: 'Garansi resmi 100% Yuraa Store.',
        });
        addedCount++;
      }
    });

    setInventoryList(getAccountInventory());
    setBulkInput('');
    setShowBulkAdd(false);

    const targetProduct = products.find((p) => p.id === selectedProductId);
    if (targetProduct && addedCount > 0) {
      const nextStock = targetProduct.stockCount + addedCount;
      onUpdateProductStock(targetProduct.id, nextStock, false);
      showToast(`Berhasil menambahkan ${addedCount} akun ke stok ${targetProduct.name}!`);
    }
  };

  const handleDeleteCredential = (id: string) => {
    deleteInventoryItem(id);
    setInventoryList(getAccountInventory());
    showToast('Akun dihapus dari database stok.');
  };

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    const savedPass = getAdminPassword();
    if (currentPass !== savedPass) {
      setSecurityError('Kata sandi saat ini tidak cocok!');
      return;
    }
    if (!newPass || newPass.length < 4) {
      setSecurityError('Kata sandi baru minimal 4 karakter!');
      return;
    }
    if (newPass !== confirmPass) {
      setSecurityError('Konfirmasi kata sandi baru tidak sama!');
      return;
    }

    setAdminPassword(newPass);
    setSecuritySuccess('Kata sandi admin berhasil diperbarui dan disimpan!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    showToast('Kata sandi admin baru aktif!');
  };

  const handleResetCatalog = () => {
    if (confirm('Yakin ingin mereset semua stok dan status produk ke setelan awal default?')) {
      onResetAllOverrides();
      showToast('Katalog produk direset ke setelan awal default!');
    }
  };

  // Filter products for admin list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const isSold = p.isSoldOut || p.stockCount <= 0;
    if (statusFilter === 'available') return matchesSearch && !isSold;
    if (statusFilter === 'soldout') return matchesSearch && isSold;
    return matchesSearch;
  });

  const availableCount = products.filter((p) => !p.isSoldOut && p.stockCount > 0).length;
  const soldOutCount = products.filter((p) => p.isSoldOut || p.stockCount <= 0).length;

  // Selected product for credentials management
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const productCredentials = inventoryList.filter((it) => it.productId === selectedProductId);
  const readyCredentialsCount = productCredentials.filter((it) => !it.isUsed).length;
  const usedCredentialsCount = productCredentials.filter((it) => it.isUsed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/80 p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl border border-emerald-400/50 flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base text-slate-900 dark:text-white uppercase tracking-tight">
                  Control Panel Admin
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                  Rahasia
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Kelola Stok, Status Sold Out, dan Akun Password Pembeli
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogoutAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                title="Keluar dari sesi Control Panel Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCREEN 1: PASSWORD GATE (IF NOT AUTHENTICATED) */}
        {!isAuthenticated ? (
          <div className="py-8 px-2 max-w-md mx-auto w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Verifikasi Kata Sandi Admin
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Panel ini khusus pemilik toko dan tersembunyi dari pembeli biasa. Silakan masukkan kata sandi yang sudah Anda buat.
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Kata Sandi Admin
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-4 pr-11 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  💡 <strong>Info Awal:</strong> Kata sandi default pertama kali adalah{' '}
                  <code className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold text-blue-600 dark:text-blue-400">
                    yuraa2026
                  </code>
                  . Anda dapat menggantinya sesuka hati setelah masuk.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Buka Control Panel</span>
              </button>
            </form>
          </div>
        ) : (
          /* SCREEN 2: AUTHENTICATED ADMIN DASHBOARD */
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mt-3 shrink-0 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('stock')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'stock'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Restock &amp; Status Produk</span>
              </button>

              <button
                onClick={() => setActiveTab('credentials')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'credentials'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Isi Akun &amp; Password</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pesanan ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('deleted_history')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'deleted_history'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5 text-red-400" />
                <span>Riwayat Hapus ({deletedOrders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ganti Sandi</span>
              </button>
            </div>

            {/* TAB BODY */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4">
              {/* TAB 1: RESTOCK & PRODUK */}
              {activeTab === 'stock' && (
                <div className="space-y-4">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-[#121d33] border border-blue-200 dark:border-blue-500/20 text-center">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                        TOTAL PRODUK
                      </span>
                      <span className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
                        {products.length}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 text-center">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                        TERSEDIA
                      </span>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {availableCount}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/20 text-center">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                        SOLD OUT
                      </span>
                      <span className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                        {soldOutCount}
                      </span>
                    </div>
                  </div>

                  {/* Search and Status Filters */}
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari akun (Netflix, Spotify, Canva, dll)..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-1 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          statusFilter === 'all'
                            ? 'bg-slate-800 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Semua ({products.length})
                      </button>
                      <button
                        onClick={() => setStatusFilter('available')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          statusFilter === 'available'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        Tersedia ({availableCount})
                      </button>
                      <button
                        onClick={() => setStatusFilter('soldout')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          statusFilter === 'soldout'
                            ? 'bg-rose-600 text-white'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        Sold Out ({soldOutCount})
                      </button>
                    </div>
                  </div>

                  {/* Product Restock List */}
                  <div className="space-y-3 pt-1">
                    {filteredProducts.map((p) => {
                      const isSold = p.isSoldOut || p.stockCount <= 0;
                      return (
                        <div
                          key={p.id}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                            isSold
                              ? 'bg-rose-50/60 dark:bg-[#1a1219] border-rose-200 dark:border-rose-900/40'
                              : 'bg-slate-50 dark:bg-[#121929] border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Product Info */}
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                                <BrandIcon iconType={p.iconType} size="sm" />
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                                    {p.name}
                                  </h4>
                                  {isSold ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white uppercase tracking-wider shadow-sm">
                                      SOLD OUT
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                                      TERSEDIA
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span>{p.categoryLabel}</span>
                                  <span>•</span>
                                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                    {formatRupiah(p.price)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status Toggle Switch: Tersedia / Sold Out */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleToggleSoldOut(p)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                                  isSold
                                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                              >
                                {isSold ? (
                                  <>
                                    <span>🔴 Status: Sold Out</span>
                                    <span className="underline ml-1">Ubah ke Tersedia</span>
                                  </>
                                ) : (
                                  <>
                                    <span>🟢 Status: Tersedia</span>
                                    <span className="underline ml-1">Ubah ke Sold Out</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Stock Controls, Quick Add, and Credentials Manager Link */}
                          <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                Stok:
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleAdjustStock(p, -1)}
                                  className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold cursor-pointer"
                                  title="Kurangi 1"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={p.stockCount}
                                  onChange={(e) => handleSetExactStock(p, e.target.value)}
                                  className="w-16 px-2 py-1 text-center font-mono font-bold text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                                <button
                                  onClick={() => handleAdjustStock(p, 1)}
                                  className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold cursor-pointer"
                                  title="Tambah 1"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Quick Restock Increment Buttons */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500 font-bold uppercase">
                                Quick:
                              </span>
                              {[+5, +10, +25, +50].map((num) => (
                                <button
                                  key={num}
                                  onClick={() => handleAdjustStock(p, num)}
                                  className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-[11px] font-bold cursor-pointer transition-all active:scale-95"
                                >
                                  +{num}
                                </button>
                              ))}

                              {/* Button to jump to credentials for this product */}
                              <button
                                onClick={() => {
                                  setSelectedProductId(p.id);
                                  setActiveTab('credentials');
                                }}
                                className="ml-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                                title="Isi Username & Password Akun Ini"
                              >
                                <KeyRound className="w-3 h-3 text-amber-500" />
                                <span>Isi Akun</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reset Catalog Button */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
                    <button
                      onClick={handleResetCatalog}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Semua Stok ke Setelan Awal Default</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: ISI AKUN & PASSWORD (CREDENTIALS INVENTORY) */}
              {activeTab === 'credentials' && (
                <div className="space-y-4">
                  {/* Product Picker Dropdown */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-[#121f38] border border-blue-200 dark:border-blue-500/30 space-y-2">
                    <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      PILIH PRODUK UNTUK DIISI AKUN &amp; PASSWORD:
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} — Stok Saat Ini: {prod.stockCount} ({prod.isSoldOut ? 'Sold Out' : 'Tersedia'})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <span>
                        Akun Siap Kirim:{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {readyCredentialsCount} unit
                        </strong>
                      </span>
                      <span>
                        Sudah Terjual ke Pembeli:{' '}
                        <strong className="text-blue-600 dark:text-blue-400">
                          {usedCredentialsCount} unit
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Add New Credential Form */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-blue-500" />
                        Tambah Stok Akun Baru ({selectedProduct.name})
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowBulkAdd(!showBulkAdd)}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {showBulkAdd ? 'Form Satuan' : 'Input Massal (Banyak Sekaligus)'}
                      </button>
                    </div>

                    {showBulkAdd ? (
                      /* Bulk Add Textarea */
                      <div className="space-y-2">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Format: <code>email:password:pin:profil</code> (1 akun per baris)
                        </p>
                        <textarea
                          rows={4}
                          value={bulkInput}
                          onChange={(e) => setBulkInput(e.target.value)}
                          placeholder={`netflix01@email.com:Pass123!:1234:User1\nnetflix02@email.com:Pass456!:4321:User2`}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleBulkAddAccounts}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                        >
                          Simpan Semua Akun ke Stok
                        </button>
                      </div>
                    ) : (
                      /* Single Add Form */
                      <form onSubmit={handleAddCredential} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Email / Username Akun *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAccountEmail}
                              onChange={(e) => setNewAccountEmail(e.target.value)}
                              placeholder="contoh: user@netflix.com"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Password Akun *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAccountPassword}
                              onChange={(e) => setNewAccountPassword(e.target.value)}
                              placeholder="contoh: YuraaPass@2026"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              PIN Profil (Opsional)
                            </label>
                            <input
                              type="text"
                              value={newAccountPin}
                              onChange={(e) => setNewAccountPin(e.target.value)}
                              placeholder="contoh: 1234"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Nama Profil (Opsional)
                            </label>
                            <input
                              type="text"
                              value={newAccountProfile}
                              onChange={(e) => setNewAccountProfile(e.target.value)}
                              placeholder="contoh: Profile 1"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                            Catatan / Aturan Penggunaan Akun
                          </label>
                          <input
                            type="text"
                            value={newAccountNotes}
                            onChange={(e) => setNewAccountNotes(e.target.value)}
                            placeholder="contoh: Dilarang ganti password. Garansi aktif 100%."
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wide shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Simpan Akun Ini ke Stok ({selectedProduct.name})</span>
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Ready Stock Credentials List */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block uppercase tracking-wide">
                      Daftar Akun Siap Dikirim ke Email Pembeli ({productCredentials.length}):
                    </span>

                    {productCredentials.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 space-y-2">
                        <KeyRound className="w-6 h-6 mx-auto text-slate-400" />
                        <p>Belum ada kredensial akun khusus yang diisi untuk produk ini.</p>
                        <p className="text-[11px] text-blue-500">
                          (Sistem akan otomatis membuat akun cadangan legal jika pembeli order)
                        </p>
                      </div>
                    ) : (
                      productCredentials.map((cred) => (
                        <div
                          key={cred.id}
                          className={`p-3 rounded-2xl border transition-all text-xs space-y-1.5 ${
                            cred.isUsed
                              ? 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                              : 'bg-white dark:bg-[#121929] border-emerald-300 dark:border-emerald-500/40 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {cred.isUsed ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500">
                                  SUDAH TERJUAL ({cred.usedByInvoice || 'Invoice'})
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                  🟢 SIAP DIKIRIM KE EMAIL
                                </span>
                              )}
                              {cred.profileName && (
                                <span className="text-[10px] text-slate-500 font-semibold">
                                  {cred.profileName}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteCredential(cred.id)}
                              className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                              title="Hapus akun dari stok"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                              <span className="text-slate-500 text-[10px]">Email:</span>
                              <span className="font-bold text-slate-900 dark:text-white select-all">
                                {cred.email}
                              </span>
                            </div>

                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                              <span className="text-slate-500 text-[10px]">Pass:</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 select-all">
                                {cred.password}
                              </span>
                            </div>
                          </div>

                          {cred.profilePin && (
                            <div className="text-[11px] font-mono text-slate-500">
                              PIN Profil: <strong className="text-blue-500">{cred.profilePin}</strong>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PESANAN MASUK */}
              {activeTab === 'orders' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Daftar Transaksi Pembeli ({orders.length})
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Diverifikasi via DANA / QRIS &amp; WhatsApp
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                      <ShoppingBag className="w-8 h-8 mx-auto text-slate-500" />
                      <p>Belum ada transaksi pesanan yang masuk.</p>
                    </div>
                  ) : (
                    orders.map((o) => (
                      <div
                        key={o.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121929] border border-slate-200 dark:border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                              {o.invoiceNumber}
                            </span>
                            <span className="text-slate-500 ml-2">
                              {formatDateTime(o.createdAt)}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.paymentStatus === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {o.paymentStatus === 'paid' ? 'LUNAS / SELESAI' : 'PENDING'}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                          <p>
                            👤 <strong>{o.customerName}</strong> ({o.customerWhatsapp})
                          </p>
                          <p className="text-[11px] text-blue-500 font-mono">
                            ✉️ Email Pembeli: {o.customerEmail}
                          </p>
                          <div className="space-y-0.5 pt-1">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="text-slate-600 dark:text-slate-400">
                                • {it.product.name} ({it.selectedVariant.name}) x{it.quantity}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-bold mr-1">
                              Total Bayar:
                            </span>
                            <span className="font-mono font-black text-slate-900 dark:text-white">
                              {formatRupiah(o.totalAmount)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {onUpdateOrderStatus && (
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateOrderStatus(
                                    o.id,
                                    o.paymentStatus === 'paid' ? 'pending' : 'paid'
                                  )
                                }
                                className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                              >
                                {o.paymentStatus === 'paid' ? 'Set Pending' : 'Set Lunas'}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handlePromptDeleteOrder(o)}
                              className="px-2.5 py-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                              title="Hapus transaksi dari daftar aktif"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus Pesanan</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: RIWAYAT PENGHAPUSAN PESANAN TRANSAKSI (AUDIT LOG) */}
              {activeTab === 'deleted_history' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                        <History className="w-4 h-4 text-red-500" />
                        Riwayat Penghapusan Pesanan Transaksi ({deletedOrders.length})
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Audit log kontrol admin eksklusif (Bisa dipulihkan kapan saja)
                      </span>
                    </div>

                    {deletedOrders.length > 0 && (
                      <button
                        onClick={handleClearAllDeletedLogs}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-400 hover:text-red-500 text-[10px] font-bold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        Bersihkan Riwayat
                      </button>
                    )}
                  </div>

                  {deletedOrders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 space-y-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                      <Archive className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">Belum ada pesanan yang dihapus.</p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Semua transaksi yang dihapus oleh admin akan tercatat di sini dengan informasi pelanggan dan alasan penghapusan, serta dapat dipulihkan sewaktu-waktu.
                      </p>
                    </div>
                  ) : (
                    deletedOrders.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121929] border border-red-200 dark:border-red-900/30 space-y-2.5 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-red-600 dark:text-red-400">
                              #{log.invoiceNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 uppercase">
                              TERHAPUS
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Dihapus: {formatDateTime(log.deletedAt)}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                          <p>
                            👤 <strong>{log.customerName}</strong> ({log.customerWhatsapp}) • <span className="font-mono text-blue-500">{log.customerEmail}</span>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            🛍️ Produk: <span className="text-slate-800 dark:text-slate-200">{log.itemsSummary}</span>
                          </p>
                          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
                            📝 Alasan Hapus: <strong>{log.reason || 'Dihapus oleh Admin'}</strong>
                            <div className="text-[10px] text-slate-500 mt-0.5">Oleh: {log.deletedBy}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-bold mr-1">Nominal:</span>
                            <span className="font-mono font-black text-slate-900 dark:text-white">
                              {formatRupiah(log.totalAmount)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRestoreOrder(log.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Pulihkan Transaksi</span>
                            </button>

                            <button
                              onClick={() => handlePermanentDelete(log.id, log.invoiceNumber)}
                              className="p-1.5 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Hapus Permanen Catatan Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: GANTI SANDI ADMIN */}
              {activeTab === 'security' && (
                <div className="max-w-md mx-auto py-2 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Ubah Kata Sandi Akses Admin
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Buat kata sandi baru yang hanya Anda ketahui. Kata sandi ini disimpan di perangkat Anda dan tidak dapat dilihat oleh pengguna atau pembeli lain.
                    </p>
                  </div>

                  {securityError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{securityError}</span>
                    </div>
                  )}

                  {securitySuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{securitySuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangeAdminPassword} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Kata Sandi Saat Ini *
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Masukkan kata sandi lama / default"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Kata Sandi Baru *
                      </label>
                      <input
                        type="password"
                        required
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Minimal 4 karakter"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Konfirmasi Kata Sandi Baru *
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Ulangi kata sandi baru"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide shadow-md shadow-blue-600/30 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Kata Sandi Baru</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </>
        )}

        {/* Delete Order Confirmation Dialog */}
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#121b2d] border border-red-300 dark:border-red-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 text-slate-900 dark:text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Hapus Transaksi Pesanan?
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Invoice: #{orderToDelete.invoiceNumber}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <p className="text-slate-700 dark:text-slate-300">
                  👤 <strong>{orderToDelete.customerName}</strong> ({orderToDelete.customerWhatsapp})
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Total: <strong className="text-slate-900 dark:text-white font-mono">{formatRupiah(orderToDelete.totalAmount)}</strong>
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Alasan Penghapusan (Tercatat di Riwayat Audit):
                </label>
                <input
                  type="text"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="contoh: Pembatalan oleh pembeli / Salah nominal"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
                ⚠️ Pesanan ini akan dipindahkan ke <strong>Riwayat Hapus</strong> di Control Panel dan dapat Anda pulihkan kembali kapan saja.
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteOrder}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold uppercase tracking-wide transition-all shadow-md shadow-red-600/30 cursor-pointer"
                >
                  Hapus Transaksi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
