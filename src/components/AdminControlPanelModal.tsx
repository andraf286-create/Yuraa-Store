import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  Search,
  Filter,
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
  Sun,
  Moon,
  BarChart3,
  TrendingUp,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Square,
  ChevronDown,
  CheckCheck,
  Wallet,
} from 'lucide-react';
import { Product, Order, AccountInventoryItem } from '../types';
import { BrandIcon } from './BrandIcon';
import { DailySalesChart } from './DailySalesChart';
import { useTheme } from '../context/ThemeContext';
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
  onBulkUpdateOrderStatus?: (orderIds: string[], status: 'pending' | 'paid' | 'cancelled' | 'refunded') => void;
  onOrdersChange?: () => void;
  darkMode?: boolean;
  onToggleTheme?: () => void;
}

export const AdminControlPanelModal: React.FC<AdminControlPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProductStock,
  onResetAllOverrides,
  orders,
  onUpdateOrderStatus,
  onBulkUpdateOrderStatus,
  onOrdersChange,
  darkMode: propDarkMode,
  onToggleTheme: propToggleTheme,
}) => {
  // Theme context synchronization
  const themeContext = useTheme();
  const isDark = propDarkMode !== undefined ? propDarkMode : themeContext.isDark;
  const toggleTheme = propToggleTheme || themeContext.toggleTheme;

  // Authentication state - with persistent session check & logout capability
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getAdminSession());
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Active Tab: 'stock' | 'credentials' | 'analytics' | 'orders' | 'deleted_history' | 'security'
  const [activeTab, setActiveTab] = useState<'stock' | 'credentials' | 'analytics' | 'orders' | 'deleted_history' | 'security'>('stock');

  // Multi-select state for bulk order status updates
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [showBulkStatusDropdown, setShowBulkStatusDropdown] = useState(false);

  // Search & Status filter state for orders
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'paid' | 'pending' | 'cancelled' | 'refunded'>('all');

  // Filtered orders memo based on search query and status filter
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 1. Status filter
      if (orderStatusFilter !== 'all' && o.paymentStatus !== orderStatusFilter) {
        return false;
      }

      // 2. Search query filter
      if (orderSearchQuery.trim()) {
        const query = orderSearchQuery.toLowerCase().trim();
        const matchInvoice = o.invoiceNumber?.toLowerCase().includes(query);
        const matchName = o.customerName?.toLowerCase().includes(query);
        const matchWhatsapp = o.customerWhatsapp?.toLowerCase().includes(query);
        const matchEmail = o.customerEmail?.toLowerCase().includes(query);
        const matchRoblox = o.robloxUsername ? o.robloxUsername.toLowerCase().includes(query) : false;
        const matchItems = o.items.some(
          (it) =>
            it.product?.name?.toLowerCase().includes(query) ||
            it.selectedVariant?.name?.toLowerCase().includes(query)
        );

        return matchInvoice || matchName || matchWhatsapp || matchEmail || matchRoblox || matchItems;
      }

      return true;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Calculations for summary card: lifetime revenue and completed transactions
  const completedOrders = useMemo(() => {
    return orders.filter((o) => o.paymentStatus === 'paid');
  }, [orders]);

  const totalCompletedTransactions = completedOrders.length;

  const totalLifetimeRevenue = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [completedOrders]);

  const pendingOrders = useMemo(() => {
    return orders.filter((o) => o.paymentStatus === 'pending');
  }, [orders]);

  const pendingRevenue = useMemo(() => {
    return pendingOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [pendingOrders]);

  const averageOrderValue = useMemo(() => {
    return totalCompletedTransactions > 0
      ? Math.round(totalLifetimeRevenue / totalCompletedTransactions)
      : 0;
  }, [totalLifetimeRevenue, totalCompletedTransactions]);

  // Deleted orders audit log state & in-app confirmation modals (replaces blocked window.confirm)
  const [deletedOrders, setDeletedOrders] = useState<DeletedOrderLog[]>(() => getDeletedOrders());
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleteReason, setDeleteReason] = useState<string>('');
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [logToDeletePermanently, setLogToDeletePermanently] = useState<DeletedOrderLog | null>(null);

  // Sync deleted orders whenever modal opens, and reset selection
  useEffect(() => {
    if (isOpen) {
      setDeletedOrders(getDeletedOrders());
      setIsAuthenticated(getAdminSession());
      setSelectedOrderIds([]);
      setShowBulkStatusDropdown(false);
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

  // Export current orders to CSV file for record-keeping
  const handleExportOrdersToCSV = (onlySelected: boolean = false) => {
    const targetOrders =
      onlySelected && selectedOrderIds.length > 0
        ? orders.filter((o) => selectedOrderIds.includes(o.id))
        : orderSearchQuery.trim() || orderStatusFilter !== 'all'
        ? filteredOrders
        : orders;

    if (!targetOrders || targetOrders.length === 0) {
      showToast('⚠️ Belum ada data pesanan untuk diekspor.');
      return;
    }

    const headers = [
      'No Invoice',
      'Tanggal & Waktu Pesanan',
      'Status Pembayaran',
      'Nama Pelanggan',
      'No WhatsApp',
      'Email Pelanggan',
      'Daftar Produk & Varian',
      'Total Belanja (Rp)',
      'Diskon Promo / Kupon (Rp)',
      'Poin Loyalitas Ditukar',
      'Potongan Poin (Rp)',
      'Reward Poin Transaksi',
      'Metode Pembayaran',
      'Username Roblox',
      'Metode Roblox',
      'Waktu Lunas',
    ];

    const escapeCSV = (val: string | number | null | undefined): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = targetOrders.map((o) => {
      const itemsText = o.items
        .map((it) => `${it.product?.name || 'Produk'} (${it.selectedVariant?.name || 'Paket'}) x${it.quantity}`)
        .join('; ');

      const orderDate = new Date(o.createdAt).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      const paidDate = o.paidAt
        ? new Date(o.paidAt).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        : '-';

      const statusText =
        o.paymentStatus === 'paid'
          ? 'Lunas'
          : o.paymentStatus === 'pending'
          ? 'Menunggu Pembayaran'
          : o.paymentStatus === 'cancelled'
          ? 'Dibatalkan'
          : 'Refund';

      return [
        escapeCSV(o.invoiceNumber),
        escapeCSV(orderDate),
        escapeCSV(statusText),
        escapeCSV(o.customerName),
        escapeCSV(o.customerWhatsapp),
        escapeCSV(o.customerEmail),
        escapeCSV(itemsText),
        escapeCSV(o.totalAmount),
        escapeCSV(o.discountAmount || 0),
        escapeCSV(o.pointsRedeemed || 0),
        escapeCSV(o.pointsDiscountAmount || 0),
        escapeCSV(o.pointsEarned || 0),
        escapeCSV(o.paymentMethod.toUpperCase()),
        escapeCSV(o.robloxUsername || '-'),
        escapeCSV(o.robloxMethod || '-'),
        escapeCSV(paidDate),
      ].join(',');
    });

    const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows].join('\r\n');

    // Create Blob with UTF-8 BOM so Microsoft Excel & Google Sheets parse properly without encoding errors
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    const nowStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('download', `rekap-pesanan-yuraa-store-${nowStr}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);

    showToast(`✓ Berhasil mengunduh rekapan ${targetOrders.length} pesanan (.CSV)`);
  };

  // Toggle selection for a single order
  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Toggle select all visible/filtered orders
  const toggleSelectAllOrders = () => {
    const visibleIds = filteredOrders.map((o) => o.id);
    if (visibleIds.length === 0) return;

    const allVisibleSelected = visibleIds.every((id) => selectedOrderIds.includes(id));
    if (allVisibleSelected) {
      setSelectedOrderIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedOrderIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Bulk update status of selected orders
  const handleBulkUpdateStatus = (newStatus: 'pending' | 'paid' | 'cancelled' | 'refunded') => {
    if (selectedOrderIds.length === 0) return;

    if (onBulkUpdateOrderStatus) {
      onBulkUpdateOrderStatus(selectedOrderIds, newStatus);
    } else if (onUpdateOrderStatus) {
      selectedOrderIds.forEach((id) => onUpdateOrderStatus(id, newStatus));
    }

    if (onOrdersChange) {
      onOrdersChange();
    }

    const label =
      newStatus === 'paid'
        ? 'Lunas'
        : newStatus === 'pending'
        ? 'Pending'
        : newStatus === 'cancelled'
        ? 'Dibatalkan'
        : 'Refund';

    showToast(`✓ Berhasil memperbarui status ${selectedOrderIds.length} pesanan menjadi "${label}"`);
    setSelectedOrderIds([]);
    setShowBulkStatusDropdown(false);
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
    const log = deleteOrderFromStorage(orderToDelete, deleteReason);
    if (log) {
      setDeletedOrders(getDeletedOrders());
      onOrdersChange?.();
      showToast(`Pesanan #${inv} berhasil dihapus & dicatat di Riwayat`);
    } else {
      setDeletedOrders(getDeletedOrders());
      onOrdersChange?.();
      showToast(`Pesanan #${inv} telah dihapus.`);
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

  const handlePromptPermanentDelete = (log: DeletedOrderLog) => {
    setLogToDeletePermanently(log);
  };

  const handleExecutePermanentDelete = () => {
    if (!logToDeletePermanently) return;
    const inv = logToDeletePermanently.invoiceNumber;
    deleteDeletedOrderPermanently(logToDeletePermanently.id);
    setDeletedOrders(getDeletedOrders());
    setLogToDeletePermanently(null);
    showToast(`Riwayat #${inv} dihapus permanen.`);
  };

  const handleOpenClearAllConfirm = () => {
    setShowClearAllConfirm(true);
  };

  const handleExecuteClearAllLogs = () => {
    clearAllDeletedOrders();
    setDeletedOrders([]);
    setShowClearAllConfirm(false);
    showToast('Semua riwayat penghapusan transaksi telah dibersihkan.');
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
      <div className="relative w-full max-w-3xl lg:max-w-4xl rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/80 p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col">
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
            {/* Theme Context Toggle inside Admin Control Panel */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              title={isDark ? 'Ganti ke Mode Terang (Light)' : 'Ganti ke Mode Gelap (Dark)'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400/40" />
                  <span className="hidden sm:inline">Mode Gelap</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-600 fill-blue-500/20" />
                  <span className="hidden sm:inline">Mode Terang</span>
                </>
              )}
            </button>

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
            {/* Top Summary Card: Total Lifetime Revenue & Completed Transactions */}
            <div className="mt-3 shrink-0 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/90 dark:from-[#111928] dark:to-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Ringkasan Finansial &amp; Transaksi Toko
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Data Real-time ({orders.length} Pesanan)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {/* 1. Total Lifetime Revenue */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#162238] border border-slate-200/90 dark:border-slate-700/60 shadow-xs flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Total Lifetime Revenue
                    </span>
                    <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight truncate">
                      Rp {totalLifetimeRevenue.toLocaleString('id-ID')}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      Dari {totalCompletedTransactions} transaksi sukses terverifikasi
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/25">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>

                {/* 2. Total Completed Transactions */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#162238] border border-slate-200/90 dark:border-slate-700/60 shadow-xs flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Transaksi Selesai (Completed)
                    </span>
                    <div className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight flex items-baseline gap-1.5">
                      <span>{totalCompletedTransactions}</span>
                      <span className="text-xs font-semibold text-slate-400 font-sans">
                        / {orders.length} pesanan
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {orders.length > 0
                        ? `${Math.round((totalCompletedTransactions / orders.length) * 100)}% sukses terverifikasi`
                        : 'Belum ada transaksi'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/25">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>

                {/* 3. Average Order Value (AOV) & Pending Status */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#162238] border border-slate-200/90 dark:border-slate-700/60 shadow-xs flex items-center justify-between gap-3 sm:col-span-2 lg:col-span-1">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Rata-Rata Order (AOV)
                    </span>
                    <div className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400 font-mono tracking-tight truncate">
                      Rp {averageOrderValue.toLocaleString('id-ID')}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {pendingOrders.length > 0
                        ? `⏳ ${pendingOrders.length} pending (Rp ${pendingRevenue.toLocaleString('id-ID')})`
                        : '✓ Semua pesanan telah diproses'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/25">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

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
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Grafik Penjualan</span>
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

              {/* TAB: GRAFIK PENJUALAN (RECHARTS ENGINE) */}
              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Visualisasi &amp; Analitik Penjualan Harian
                    </span>
                    <button
                      type="button"
                      onClick={() => handleExportOrdersToCSV(false)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Unduh seluruh data pesanan ke dalam file CSV untuk Excel / Spreadsheet"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                  <DailySalesChart orders={orders} isDark={isDark} />
                </div>
              )}

              {/* TAB 3: PESANAN MASUK */}
              {activeTab === 'orders' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Daftar Transaksi Pembeli ({orderSearchQuery.trim() || orderStatusFilter !== 'all' ? `${filteredOrders.length} dari ${orders.length}` : orders.length})
                      </span>
                      <p className="text-[10px] text-slate-500">
                        {orders.filter((o) => o.paymentStatus === 'paid').length} Pesanan Lunas Terverifikasi via DANA
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleExportOrdersToCSV(false)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                        title="Unduh riwayat transaksi pembeli dalam format file CSV (.csv)"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('analytics')}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Grafik</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Status Filter Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#121929] border border-slate-200 dark:border-slate-800">
                    <div className="sm:col-span-7 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        placeholder="Cari invoice, nama, no HP, email, atau Roblox..."
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-[#0a0f1d] border border-slate-300 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                      {orderSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setOrderSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          title="Hapus pencarian"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="sm:col-span-5 flex items-center gap-2">
                      <div className="relative flex-1">
                        <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={orderStatusFilter}
                          onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                          className="w-full pl-8 pr-7 py-2 rounded-xl bg-white dark:bg-[#0a0f1d] border border-slate-300 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none transition-colors"
                        >
                          <option value="all">Semua Status ({orders.length})</option>
                          <option value="paid">✓ Lunas ({orders.filter((o) => o.paymentStatus === 'paid').length})</option>
                          <option value="pending">⏳ Pending ({orders.filter((o) => o.paymentStatus === 'pending').length})</option>
                          <option value="cancelled">✕ Dibatalkan ({orders.filter((o) => o.paymentStatus === 'cancelled').length})</option>
                          <option value="refunded">↺ Refunded ({orders.filter((o) => o.paymentStatus === 'refunded').length})</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {(orderSearchQuery || orderStatusFilter !== 'all') && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderSearchQuery('');
                            setOrderStatusFilter('all');
                          }}
                          className="px-2.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                          title="Reset pencarian & filter"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Selection & Bulk Actions Toolbar */}
                  {orders.length > 0 && (
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                      {/* Select All Checkbox */}
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={
                            filteredOrders.length > 0 &&
                            filteredOrders.every((o) => selectedOrderIds.includes(o.id))
                          }
                          onChange={toggleSelectAllOrders}
                          disabled={filteredOrders.length === 0}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer accent-blue-600 shrink-0 disabled:opacity-50"
                        />
                        <span>
                          {filteredOrders.length > 0 &&
                          filteredOrders.every((o) => selectedOrderIds.includes(o.id))
                            ? 'Batal Pilih Semua'
                            : `Pilih Semua (${filteredOrders.length})`}
                        </span>
                      </label>

                      {/* Bulk Actions when any item is checked */}
                      {selectedOrderIds.length > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold font-mono">
                            {selectedOrderIds.length} Terpilih
                          </span>

                          {/* Bulk Update Status Dropdown Button */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowBulkStatusDropdown(!showBulkStatusDropdown)}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 active:scale-95 transition-all cursor-pointer"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Bulk Update Status</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showBulkStatusDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showBulkStatusDropdown && (
                              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/80 shadow-2xl z-30 p-1.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                    Ubah Status Ke:
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleBulkUpdateStatus('paid')}
                                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                                  <span>Set LUNAS / SELESAI</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleBulkUpdateStatus('pending')}
                                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                                  <span>Set PENDING</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleBulkUpdateStatus('cancelled')}
                                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
                                  <span>Set DIBATALKAN</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleBulkUpdateStatus('refunded')}
                                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
                                  <span>Set REFUNDED</span>
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleExportOrdersToCSV(true)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Unduh hanya pesanan yang dicentang ke CSV"
                          >
                            <Download className="w-3 h-3" />
                            <span>Export Terpilih</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderIds([]);
                              setShowBulkStatusDropdown(false);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">
                          Centang pesanan untuk ubah status massal sekaligus
                        </span>
                      )}
                    </div>
                  )}

                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                      <ShoppingBag className="w-8 h-8 mx-auto text-slate-500" />
                      <p>Belum ada transaksi pesanan yang masuk.</p>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 space-y-3 bg-slate-50 dark:bg-[#121929] rounded-2xl border border-slate-200 dark:border-slate-800">
                      <Search className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
                      <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          Tidak ada pesanan yang sesuai dengan filter
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Coba ubah kata kunci pencarian atau ganti status filter pembayaran.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOrderSearchQuery('');
                          setOrderStatusFilter('all');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Filter &amp; Pencarian</span>
                      </button>
                    </div>
                  ) : (
                    filteredOrders.map((o) => (
                      <div
                        key={o.id}
                        className={`p-3.5 rounded-2xl transition-all duration-150 space-y-2 border ${
                          selectedOrderIds.includes(o.id)
                            ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500/60 dark:border-blue-500/60 shadow-md shadow-blue-500/5'
                            : 'bg-slate-50 dark:bg-[#121929] border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={selectedOrderIds.includes(o.id)}
                              onChange={() => toggleSelectOrder(o.id)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer accent-blue-600 shrink-0"
                              title="Pilih transaksi ini"
                            />
                            <div>
                              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                {o.invoiceNumber}
                              </span>
                              <span className="text-slate-500 ml-2">
                                {formatDateTime(o.createdAt)}
                              </span>
                            </div>
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

                          {/* Roblox Top Up Specifics for Admin Fulfillment */}
                          {o.robloxUsername && (
                            <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-emerald-400">🎮 DATA TOP UP ROBLOX:</span>
                                <span className="text-[10px] uppercase font-bold text-neutral-400">
                                  {o.robloxMethod === 'gamepass' ? 'Via Gamepass' : o.robloxMethod === 'premium' ? 'Subs Premium' : 'Via Login'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between font-mono bg-black/50 p-1.5 rounded-lg border border-neutral-800">
                                <span className="text-white">User: <strong>{o.robloxUsername}</strong></span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(o.robloxUsername || '');
                                    showToast('Username Roblox disalin!');
                                  }}
                                  className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold"
                                >
                                  Salin User
                                </button>
                              </div>
                              {o.robloxPassword && (
                                <div className="flex items-center justify-between font-mono bg-black/50 p-1.5 rounded-lg border border-neutral-800">
                                  <span className="text-amber-300">Pass: <strong>{o.robloxPassword}</strong></span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(o.robloxPassword || '');
                                      showToast('Password Roblox disalin!');
                                    }}
                                    className="text-[10px] px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-sans font-bold"
                                  >
                                    Salin Pw
                                  </button>
                                </div>
                              )}
                              {o.robloxGamepassUrl && (
                                <p className="text-[10px] text-neutral-300 truncate">
                                  Link Pass: <span className="text-cyan-400">{o.robloxGamepassUrl}</span>
                                </p>
                              )}
                            </div>
                          )}
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
                        type="button"
                        onClick={handleOpenClearAllConfirm}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 text-xs font-bold border border-red-500/30 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        title="Kosongkan seluruh riwayat audit penghapusan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Bersihkan Riwayat</span>
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
                              type="button"
                              onClick={() => handlePromptPermanentDelete(log)}
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

        {/* Clear All Audit History Confirmation Dialog */}
        {showClearAllConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#121b2d] border border-red-300 dark:border-red-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 text-slate-900 dark:text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Bersihkan Seluruh Riwayat Transaksi?
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Total {deletedOrders.length} catatan riwayat transaksi yang pernah dihapus
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin mengosongkan seluruh riwayat audit transaksi yang pernah dihapus? Semua catatan ini akan dibersihkan dan tidak dapat dipulihkan kembali.
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowClearAllConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteClearAllLogs}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold uppercase tracking-wide transition-all shadow-md shadow-red-600/30 cursor-pointer"
                >
                  Ya, Bersihkan Semua
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Permanent Delete Single Item Dialog */}
        {logToDeletePermanently && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#121b2d] border border-red-300 dark:border-red-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 text-slate-900 dark:text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Hapus Permanen Catatan Riwayat?
                  </h3>
                  <p className="text-[11px] font-mono text-red-500 font-bold">
                    Invoice: #{logToDeletePermanently.invoiceNumber}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <p className="text-slate-700 dark:text-slate-300">
                  👤 <strong>{logToDeletePermanently.customerName}</strong> ({logToDeletePermanently.customerWhatsapp})
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Produk: <span className="text-slate-900 dark:text-white font-medium">{logToDeletePermanently.itemsSummary}</span>
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Total: <strong className="text-slate-900 dark:text-white font-mono">{formatRupiah(logToDeletePermanently.totalAmount)}</strong>
                </p>
              </div>

              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                ⚠️ Catatan ini akan dihapus permanen dari audit log dan tidak bisa dipulihkan lagi.
              </p>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setLogToDeletePermanently(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecutePermanentDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold uppercase tracking-wide transition-all shadow-md shadow-red-600/30 cursor-pointer"
                >
                  Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
