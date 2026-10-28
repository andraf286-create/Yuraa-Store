import { CartItem, Order, UserProfile, AccountInventoryItem, DeliveredAccount } from '../types';

const STORAGE_KEYS = {
  USER: 'yuraa_user_profile',
  CART: 'yuraa_cart_items',
  ORDERS: 'yuraa_user_orders',
  THEME: 'yuraa_theme_mode',
  ADMIN_PASSWORD: 'yuraa_admin_password',
  PRODUCT_OVERRIDES: 'yuraa_product_overrides',
  ACCOUNT_INVENTORY: 'yuraa_account_inventory',
  DELETED_ORDERS: 'yuraa_deleted_orders_log',
  ADMIN_SESSION: 'yuraa_admin_session_auth',
};

export const DEFAULT_ADMIN_PASSWORD = 'yuraa2026';

export const DEFAULT_USER: UserProfile = {
  id: 'usr-default-01',
  name: 'Andra Pratama',
  email: 'andraf286@gmail.com',
  whatsapp: '081234567890',
  balance: 150000,
  isMember: true,
  tier: 'VIP',
};

export function getAdminPassword(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
    return saved && saved.trim() ? saved : DEFAULT_ADMIN_PASSWORD;
  } catch {
    return DEFAULT_ADMIN_PASSWORD;
  }
}

export function setAdminPassword(password: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, password.trim());
  } catch (e) {
    console.error('Failed to set admin password in storage', e);
  }
}

export interface ProductOverride {
  stockCount: number;
  isSoldOut: boolean;
  price?: number;
  originalPrice?: number;
  isUrgent?: boolean;
}

export function getProductOverrides(): Record<string, ProductOverride> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCT_OVERRIDES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProductOverride(productId: string, override: ProductOverride): void {
  try {
    const existing = getProductOverrides();
    existing[productId] = { ...existing[productId], ...override };
    localStorage.setItem(STORAGE_KEYS.PRODUCT_OVERRIDES, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save product override', e);
  }
}

export function resetAllProductOverrides(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PRODUCT_OVERRIDES);
  } catch (e) {
    console.error('Failed to reset product overrides', e);
  }
}

export const INITIAL_ACCOUNT_INVENTORY: AccountInventoryItem[] = [
  {
    id: 'inv-nf-01',
    productId: 'netflix-uhd',
    email: 'yuraanf01@premium.id',
    password: 'YuraaNF@2026',
    profilePin: '1234',
    profileName: 'Profile 1 (Yuraa VIP)',
    notes: 'Kualitas UHD 4K, 1 Profil Khusus Pembeli, Dilarang ganti password akun.',
    isUsed: false,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'inv-nf-02',
    productId: 'netflix-uhd',
    email: 'yuraanf02@premium.id',
    password: 'PandaStream#88',
    profilePin: '8899',
    profileName: 'Profile 2 (Yuraa Store)',
    notes: 'Kualitas UHD 4K, Garansi Full 30 Hari.',
    isUsed: false,
    createdAt: Date.now() - 43200000,
  },
  {
    id: 'inv-sp-01',
    productId: 'spotify-premium',
    email: 'spot.yuraa@family.id',
    password: 'SpotPanda@2026',
    profilePin: '',
    profileName: 'Individual Premium / Plan Family',
    notes: 'No ads, offline download, garansi aktif.',
    isUsed: false,
    createdAt: Date.now() - 50000000,
  },
  {
    id: 'inv-ca-01',
    productId: 'canva-pro',
    email: 'pro.designer@yuraamember.id',
    password: 'CanvaPro#8899',
    profilePin: '',
    profileName: 'Canva Pro Lifetime',
    notes: 'Akses ratusan juta template, brand kit & magic AI.',
    isUsed: false,
    createdAt: Date.now() - 36000000,
  },
  {
    id: 'inv-ds-01',
    productId: 'disney-hotstar',
    email: 'disney.yuraa@streambox.id',
    password: 'DisneyHotstar#26',
    profilePin: '7788',
    profileName: 'Hotstar User 1',
    notes: 'Bisa tonton Marvel, Pixar, Disney+ di HP/Laptop/TV.',
    isUsed: false,
    createdAt: Date.now() - 30000000,
  },
  {
    id: 'inv-pv-01',
    productId: 'prime-video',
    email: 'amazon.yuraa@primeaccess.id',
    password: 'PrimeVideo@2026',
    profilePin: '1122',
    profileName: 'Prime Profile',
    notes: 'Akses penuh Prime Video 4K HDR.',
    isUsed: false,
    createdAt: Date.now() - 20000000,
  },
  {
    id: 'inv-yt-01',
    productId: 'youtube-premium',
    email: 'yt.yuraa@googleaccess.id',
    password: 'YouTubeVIP#2026',
    profilePin: '',
    profileName: 'Family Member',
    notes: 'Bebas iklan YouTube & akses YouTube Music.',
    isUsed: false,
    createdAt: Date.now() - 15000000,
  },
];

export function getAccountInventory(): AccountInventoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNT_INVENTORY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.ACCOUNT_INVENTORY, JSON.stringify(INITIAL_ACCOUNT_INVENTORY));
    return INITIAL_ACCOUNT_INVENTORY;
  } catch {
    return INITIAL_ACCOUNT_INVENTORY;
  }
}

export function saveAccountInventory(items: AccountInventoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNT_INVENTORY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save account inventory', e);
  }
}

export function addAccountToInventory(item: Omit<AccountInventoryItem, 'id' | 'isUsed' | 'createdAt'>): AccountInventoryItem {
  const all = getAccountInventory();
  const newItem: AccountInventoryItem = {
    ...item,
    id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    isUsed: false,
    createdAt: Date.now(),
  };
  const updated = [newItem, ...all];
  saveAccountInventory(updated);
  return newItem;
}

export function deleteInventoryItem(id: string): void {
  const all = getAccountInventory();
  const filtered = all.filter((it) => it.id !== id);
  saveAccountInventory(filtered);
}

export function dispenseAccountForProduct(productId: string, invoiceNumber: string): DeliveredAccount {
  const all = getAccountInventory();
  // Find first unused inventory item for this product
  const foundIndex = all.findIndex((it) => it.productId === productId && !it.isUsed);

  if (foundIndex > -1) {
    const item = all[foundIndex];
    all[foundIndex] = {
      ...item,
      isUsed: true,
      usedByInvoice: invoiceNumber,
      usedAt: Date.now(),
    };
    saveAccountInventory(all);

    return {
      email: item.email,
      password: item.password,
      profileName: item.profileName || 'Profile 1 (Khusus Pembeli)',
      pin: item.profilePin || '',
      duration: '30 Hari (1 Bulan Penuh)',
      expiredDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      rulesNotes: item.notes || 'Dilarang mengubah email/password utama akun. Garansi aktif 100%.',
      warrantyUntil: new Date(Date.now() + 30 * 86400000).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  }

  // Fallback realistic credentials if custom pool for this product is dry
  const rnd = Math.floor(100 + Math.random() * 900);
  const cleanId = productId.replace(/[^a-z0-9]/g, '');
  const fallbackEmail = `yuraa.${cleanId}.${rnd}@tokopremium.id`;
  const fallbackPassword = `YuraaPanda@${rnd}!`;

  return {
    email: fallbackEmail,
    password: fallbackPassword,
    profileName: 'Profile 1 (Khusus Pembeli)',
    pin: '1234',
    duration: '30 Hari (1 Bulan Penuh)',
    expiredDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    rulesNotes: 'Akun premium resmi bergaransi 100%. Dilarang mengubah setting email.',
    warrantyUntil: new Date(Date.now() + 30 * 86400000).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
    return DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

export function setStoredUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (e) {
    console.error('Failed to set user in storage', e);
  }
}

export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrderToStorage(order: Order): void {
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save order', e);
  }
}

export interface DeletedOrderLog {
  id: string;
  orderId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  itemsSummary: string;
  totalAmount: number;
  paymentStatus: string;
  deletedAt: number;
  deletedBy: string;
  reason?: string;
  originalOrder: Order;
}

export function getDeletedOrders(): DeletedOrderLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteOrderFromStorage(orderId: string, reason: string = 'Dihapus oleh Admin'): DeletedOrderLog | null {
  try {
    const existingOrders = getStoredOrders();
    const targetOrder = existingOrders.find((o) => o.id === orderId);
    if (!targetOrder) return null;

    // Filter out from active orders
    const updatedOrders = existingOrders.filter((o) => o.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

    // Construct deletion log
    const itemsText = targetOrder.items
      .map((it) => `${it.product.name} (${it.selectedVariant.name}) x${it.quantity}`)
      .join(', ');

    const logEntry: DeletedOrderLog = {
      id: `del-log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      orderId: targetOrder.id,
      invoiceNumber: targetOrder.invoiceNumber,
      customerName: targetOrder.customerName,
      customerEmail: targetOrder.customerEmail,
      customerWhatsapp: targetOrder.customerWhatsapp,
      itemsSummary: itemsText || 'Produk Akun Premium',
      totalAmount: targetOrder.totalAmount,
      paymentStatus: targetOrder.paymentStatus,
      deletedAt: Date.now(),
      deletedBy: 'Admin Yuraa Store (Control Panel)',
      reason: reason.trim() || 'Dihapus dari Control Panel Admin',
      originalOrder: targetOrder,
    };

    const existingLogs = getDeletedOrders();
    localStorage.setItem(STORAGE_KEYS.DELETED_ORDERS, JSON.stringify([logEntry, ...existingLogs]));

    return logEntry;
  } catch (e) {
    console.error('Failed to delete order and log in storage', e);
    return null;
  }
}

export function restoreDeletedOrder(logId: string): Order | null {
  try {
    const logs = getDeletedOrders();
    const targetLog = logs.find((l) => l.id === logId);
    if (!targetLog) return null;

    // Save back to active orders
    saveOrderToStorage(targetLog.originalOrder);

    // Remove from deleted logs
    const updatedLogs = logs.filter((l) => l.id !== logId);
    localStorage.setItem(STORAGE_KEYS.DELETED_ORDERS, JSON.stringify(updatedLogs));

    return targetLog.originalOrder;
  } catch (e) {
    console.error('Failed to restore order', e);
    return null;
  }
}

export function deleteDeletedOrderPermanently(logId: string): void {
  try {
    const logs = getDeletedOrders();
    const updated = logs.filter((l) => l.id !== logId);
    localStorage.setItem(STORAGE_KEYS.DELETED_ORDERS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to permanently delete log', e);
  }
}

export function clearAllDeletedOrders(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.DELETED_ORDERS);
  } catch (e) {
    console.error('Failed to clear deleted orders', e);
  }
}

export function getAdminSession(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  } catch {
    return false;
  }
}

export function setAdminSession(auth: boolean): void {
  try {
    if (auth) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  } catch {
    // Ignore storage issues
  }
}

