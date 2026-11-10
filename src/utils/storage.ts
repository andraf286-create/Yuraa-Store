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
  loyaltyPoints: 3500, // 3.500 Poin Loyalitas (~ Rp 3.500 diskon)
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
  {
    id: 'inv-ff-01',
    productId: 'freefire-sultan',
    email: 'ff.sultan01@yuraagame.id',
    password: 'FreeFireSultan@2026',
    profilePin: '',
    profileName: 'Akun FF Sultan Old Vault Rame (Login Google)',
    notes: 'Akun Monsep 100%. Login via Google. Segera ganti kata sandi, kaitkan No HP & aktifkan 2FA. Garansi Anti Hackback 30 Hari.',
    isUsed: false,
    createdAt: Date.now() - 25000000,
  },
  {
    id: 'inv-ff-02',
    productId: 'freefire-sultan',
    email: 'ff.evogun.max@yuraagame.id',
    password: 'EvoGunMax#8899',
    profilePin: '',
    profileName: 'Akun FF Sultan Evo Gun Max (Login VK)',
    notes: 'Login VK / Google. Evo Gun AK Dragon Max Lv 7. Monsep 100%. Garansi Anti HB 30 Hari.',
    isUsed: false,
    createdAt: Date.now() - 18000000,
  },
  {
    id: 'inv-ff-03',
    productId: 'freefire-sultan',
    email: 'ff.master.ranked@yuraagame.id',
    password: 'MasterFF@Panda2026',
    profilePin: '',
    profileName: 'Akun FF Master Booyah Pass (Login Google)',
    notes: 'Rank Master aktif, Booyah Pass on. Monsep aman, garansi resmi Yuraa Store.',
    isUsed: false,
    createdAt: Date.now() - 10000000,
  },
];

export function getAccountInventory(): AccountInventoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNT_INVENTORY);
    if (raw) {
      const parsed: AccountInventoryItem[] = JSON.parse(raw);
      // Ensure Free Fire initial stock accounts exist if not yet seeded
      const hasFF = parsed.some((it) => it.productId === 'freefire-sultan');
      if (!hasFF) {
        const ffDefaults = INITIAL_ACCOUNT_INVENTORY.filter((it) => it.productId === 'freefire-sultan');
        const merged = [...parsed, ...ffDefaults];
        localStorage.setItem(STORAGE_KEYS.ACCOUNT_INVENTORY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
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

    const isGameAccount = productId === 'freefire-sultan';

    return {
      email: item.email,
      password: item.password,
      profileName: item.profileName || (isGameAccount ? 'Akun FF Sultan Monsep (Login Google/VK)' : 'Profile 1 (Khusus Pembeli)'),
      pin: item.profilePin || '',
      duration: isGameAccount ? 'Permanen / Milik Sendiri' : '30 Hari (1 Bulan Penuh)',
      expiredDate: isGameAccount
        ? 'Permanen (Milik Pembeli)'
        : new Date(Date.now() + 30 * 86400000).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
      rulesNotes: item.notes || (isGameAccount
        ? 'Akun Monsep 100% Anti Hackback. Harap segera amankan kata sandi & aktifkan 2FA nomor HP pribadi Anda.'
        : 'Dilarang mengubah email/password utama akun. Garansi aktif 100%.'),
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

  if (productId === 'freefire-sultan') {
    return {
      email: fallbackEmail,
      password: fallbackPassword,
      profileName: 'Akun FF Sultan Monsep (Login Google/VK)',
      pin: '',
      duration: 'Permanen / Milik Sendiri',
      expiredDate: 'Permanen (Milik Pembeli)',
      rulesNotes: 'Akun Monsep 100% Anti Hackback. Harap segera amankan kata sandi & aktifkan 2FA nomor HP pribadi Anda.',
      warrantyUntil: new Date(Date.now() + 30 * 86400000).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  }

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
    if (raw) {
      const parsed: UserProfile = JSON.parse(raw);
      if (parsed && typeof parsed.loyaltyPoints !== 'number') {
        parsed.loyaltyPoints = 3500;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsed));
      }
      return parsed;
    }
    return DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

// LOYALTY POINTS REWARD SYSTEM
// Belanja Rp 1.000 = mendapatkan 10 Poin Loyalitas (1% cashback poin)
// Multiplier Tier: Silver 1.0x, Gold 1.2x, VIP 1.5x
// 1 Poin = Rp 1 Potongan Diskon
export const LOYALTY_POINT_EARN_PERCENT = 0.01;
export const LOYALTY_POINT_VALUE_IDR = 1;

export function calculatePointsEarned(totalAmount: number, tier: string = 'VIP'): number {
  if (totalAmount <= 0) return 0;
  const multiplier = tier === 'VIP' ? 1.5 : tier === 'Gold' ? 1.2 : 1.0;
  return Math.max(10, Math.floor(totalAmount * LOYALTY_POINT_EARN_PERCENT * multiplier));
}

export function awardLoyaltyPoints(pointsToAdd: number): UserProfile | null {
  try {
    const user = getStoredUser();
    if (!user) return null;
    const current = typeof user.loyaltyPoints === 'number' ? user.loyaltyPoints : 0;
    const updatedUser: UserProfile = {
      ...user,
      loyaltyPoints: current + pointsToAdd,
    };
    setStoredUser(updatedUser);
    return updatedUser;
  } catch (e) {
    console.error('Failed to award loyalty points', e);
    return null;
  }
}

export function deductLoyaltyPoints(pointsToDeduct: number): UserProfile | null {
  try {
    const user = getStoredUser();
    if (!user) return null;
    const current = typeof user.loyaltyPoints === 'number' ? user.loyaltyPoints : 0;
    const updatedUser: UserProfile = {
      ...user,
      loyaltyPoints: Math.max(0, current - pointsToDeduct),
    };
    setStoredUser(updatedUser);
    return updatedUser;
  } catch (e) {
    console.error('Failed to deduct loyalty points', e);
    return null;
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

const DAY_MS = 86400000;
const NOW = Date.now();

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-init-01',
    invoiceNumber: 'YURA-261105-8812',
    totalAmount: 65000,
    discountAmount: 0,
    feeAmount: 0,
    paymentMethod: 'dana',
    paymentStatus: 'paid',
    customerName: 'Dimas Pratama',
    customerEmail: 'dimas.pratama@gmail.com',
    customerWhatsapp: '081298457711',
    createdAt: NOW - 2 * 3600000,
    paidAt: NOW - 2 * 3600000 + 120000,
    items: [
      {
        id: 'cart-init-01',
        productId: 'freefire-sultan',
        quantity: 1,
        addedAt: NOW - 2 * 3600000,
        product: {
          id: 'freefire-sultan',
          name: 'Akun Free Fire Sultan (Old Vault Rame)',
          category: 'game',
          categoryLabel: 'Top Up & Akun Game',
          price: 65000,
          originalPrice: 120000,
          soldCount: 3840,
          stockCount: 8,
          brandColor: '#EA580C',
          iconType: 'freefire',
          deliveryType: 'instant',
          deliveryTimeEstimate: 'Bayar Langsung Kirim',
          features: [],
          rules: [],
          variants: [],
          description: '',
        },
        selectedVariant: {
          id: 'ff-sultan-old',
          name: 'Akun FF Sultan Old Vault Rame + SG2',
          price: 65000,
          originalPrice: 120000,
          stock: 8,
          durationDays: 365,
          description: 'Vault Rame • SG2 OPM / Incu • Emote langka • Monsep',
        },
      },
    ],
  },
  {
    id: 'ord-init-02',
    invoiceNumber: 'YURA-261105-7734',
    totalAmount: 67000,
    discountAmount: 0,
    feeAmount: 0,
    paymentMethod: 'dana',
    paymentStatus: 'paid',
    customerName: 'Rizky Alamsyah',
    customerEmail: 'rizky.alam99@yahoo.com',
    customerWhatsapp: '085711223344',
    createdAt: NOW - 5 * 3600000,
    paidAt: NOW - 5 * 3600000 + 95000,
    robloxUsername: 'RizkyRobloxGamer',
    robloxMethod: 'gamepass',
    items: [
      {
        id: 'cart-init-02',
        productId: 'roblox-gamepass',
        quantity: 1,
        addedAt: NOW - 5 * 3600000,
        product: {
          id: 'roblox-gamepass',
          name: 'Robux Via Link Gamepass',
          category: 'game',
          categoryLabel: 'Top Up & Akun Game',
          price: 67000,
          originalPrice: 85000,
          soldCount: 5410,
          stockCount: 999,
          brandColor: '#00E676',
          iconType: 'robux_gamepass',
          deliveryType: 'instant',
          deliveryTimeEstimate: 'Proses ±5 Menit',
          features: [],
          rules: [],
          variants: [],
          description: '',
        },
        selectedVariant: {
          id: 'rbx-gp-1000',
          name: '1000 R$ (Via Gamepass)',
          price: 67000,
          originalPrice: 85000,
          stock: 999,
          durationDays: 1,
          description: 'Hanya username • Bersih 1.000 Robux',
        },
      },
    ],
  },
  {
    id: 'ord-init-03',
    invoiceNumber: 'YURA-261104-6291',
    totalAmount: 47500,
    discountAmount: 0,
    feeAmount: 0,
    paymentMethod: 'dana',
    paymentStatus: 'paid',
    customerName: 'Siti Nurhaliza',
    customerEmail: 'sitinur@gmail.com',
    customerWhatsapp: '081388992200',
    createdAt: NOW - DAY_MS - 3 * 3600000,
    paidAt: NOW - DAY_MS - 3 * 3600000 + 60000,
    items: [
      {
        id: 'cart-init-03',
        productId: 'netflix-uhd',
        quantity: 1,
        addedAt: NOW - DAY_MS - 3 * 3600000,
        product: {
          id: 'netflix-uhd',
          name: 'Netflix Premium UHD 4K',
          category: 'streaming',
          categoryLabel: 'Streaming',
          price: 47500,
          originalPrice: 65000,
          soldCount: 8004,
          stockCount: 15,
          brandColor: '#E50914',
          iconType: 'netflix',
          deliveryType: 'instant',
          deliveryTimeEstimate: 'Bayar Langsung Kirim',
          features: [],
          rules: [],
          variants: [],
          description: '',
        },
        selectedVariant: {
          id: 'netflix-private-1m',
          name: 'PRIVATE PROFILE 1 BULAN',
          price: 47500,
          originalPrice: 65000,
          stock: 15,
          durationDays: 30,
          description: '1 profile khusus 1 pengguna, anti limit screen',
        },
      },
    ],
  },
  {
    id: 'ord-init-04',
    invoiceNumber: 'YURA-261104-5410',
    totalAmount: 35000,
    discountAmount: 0,
    feeAmount: 0,
    paymentMethod: 'dana',
    paymentStatus: 'paid',
    customerName: 'Bagus Setiawan',
    customerEmail: 'bagus.setia@gmail.com',
    customerWhatsapp: '087822991044',
    createdAt: NOW - DAY_MS - 7 * 3600000,
    paidAt: NOW - DAY_MS - 7 * 3600000 + 150000,
    items: [
      {
        id: 'cart-init-04',
        productId: 'freefire-sultan',
        quantity: 1,
        addedAt: NOW - DAY_MS - 7 * 3600000,
        product: {
          id: 'freefire-sultan',
          name: 'Akun Free Fire Sultan (Old Vault Rame)',
          category: 'game',
          categoryLabel: 'Top Up & Akun Game',
          price: 35000,
          originalPrice: 60000,
          soldCount: 3840,
          stockCount: 15,
          brandColor: '#EA580C',
          iconType: 'freefire',
          deliveryType: 'instant',
          deliveryTimeEstimate: 'Bayar Langsung Kirim',
          features: [],
          rules: [],
          variants: [],
          description: '',
        },
        selectedVariant: {
          id: 'ff-polosan',
          name: 'Akun FF Polosan Lv 40+ (Siap Ranked)',
          price: 35000,
          originalPrice: 60000,
          stock: 15,
          durationDays: 365,
          description: 'Level 40+ • Siap tempur ranked • Monsep Google',
        },
      },
    ],
  },
  {
    id: 'ord-init-05',
    invoiceNumber: 'YURA-261103-4920',
    totalAmount: 150000,
    discountAmount: 0,
    feeAmount: 0,
    paymentMethod: 'dana',
    paymentStatus: 'paid',
    customerName: 'Kevin Wijaya',
    customerEmail: 'kevin.wijaya26@gmail.com',
    customerWhatsapp: '081900112233',
    createdAt: NOW - 2 * DAY_MS - 4 * 3600000,
    paidAt: NOW - 2 * DAY_MS - 4 * 3600000 + 45000,
    items: [
      {
        id: 'cart-init-05',
        productId: 'freefire-sultan',
        quantity: 1,
        addedAt: NOW - 2 * DAY_MS - 4 * 3600000,
        product: {
          id: 'freefire-sultan',
          name: 'Akun Free Fire Sultan (Old Vault Rame)',
          category: 'game',
          categoryLabel: 'Top Up & Akun Game',
          price: 150000,
          originalPrice: 275000,
          soldCount: 3840,
          stockCount: 2,
          brandColor: '#EA580C',
          iconType: 'freefire',
          deliveryType: 'instant',
          deliveryTimeEstimate: 'Bayar Langsung Kirim',
          features: [],
          rules: [],
          variants: [],
          description: '',
        },
        selectedVariant: {
          id: 'ff-evogun-max',
          name: 'Akun FF Sultan Evo Gun Max (AK/MP40)',
          price: 150000,
          originalPrice: 275000,
          stock: 2,
          durationDays: 365,
          description: 'Evo Gun Max Level 7 • Bundle langka • Full set sultan',
        },
      },
    ],
  },
  {
    id: 'ord-init-06',
    invoiceNumber: 'YURA-261103-3310',
    totalAmount: 29000,
    discountAmount: 0,
    feeAmount: 0,
    paymentMethod: 'dana',
    paymentStatus: 'paid',
    customerName: 'Dewi Anggraini',
    customerEmail: 'dewi.ang@designpro.id',
    customerWhatsapp: '081234455667',
    createdAt: NOW - 2 * DAY_MS - 8 * 3600000,
    paidAt: NOW - 2 * DAY_MS - 8 * 3600000 + 80000,
    items: [
      {
        id: 'cart-init-06',
        productId: 'canva-pro',
        quantity: 1,
        addedAt: NOW - 2 * DAY_MS - 8 * 3600000,
        product: {
          id: 'canva-pro',
          name: 'Canva Pro',
          category: 'desain',
          categoryLabel: 'Desain & Kreatif',
          price: 29000,
          originalPrice: 55000,
          soldCount: 539,
          stockCount: 25,
          brandColor: '#00C4CC',
          iconType: 'canva',
          deliveryType: 'instant',
          deliveryTimeEstimate: 'Bayar Langsung Kirim',
          features: [],
          rules: [],
          variants: [],
          description: '',
        },
        selectedVariant: {
          id: 'canva-1y',
          name: 'CANVA PRO 1 TAHUN LIFETIME GARANSI',
          price: 29000,
          originalPrice: 55000,
          stock: 25,
          durationDays: 365,
          description: 'Hemat maksimal, garansi 1 tahun penuh',
        },
      },
    ],
  },
  {
    id: 'ord-init-07',
    invoiceNumber: 'YURA-261102-2890',
    totalAmount: 95000,
    discountAmount: 0,
    feeAmount: 0,
    paymentMethod: 'dana',
    paymentStatus: 'paid',
    customerName: 'Aditya Nugraha',
    customerEmail: 'adit.nugraha@gmail.com',
    customerWhatsapp: '082155667788',
    createdAt: NOW - 3 * DAY_MS - 5 * 3600000,
    paidAt: NOW - 3 * DAY_MS - 5 * 3600000 + 110000,
    items: [
      {
        id: 'cart-init-07',
        productId: 'freefire-sultan',
        quantity: 1,
        addedAt: NOW - 3 * DAY_MS - 5 * 3600000,
        product: {
          id: 'freefire-sultan',
          name: 'Akun Free Fire Sultan (Old Vault Rame)',
          category: 'game',
          categoryLabel: 'Top Up & Akun Game',
          price: 95000,
          originalPrice: 160000,
          soldCount: 3840,
          stockCount: 4,
          brandColor: '#EA580C',
          iconType: 'freefire',
          deliveryType: 'instant',
          deliveryTimeEstimate: 'Bayar Langsung Kirim',
          features: [],
          rules: [],
          variants: [],
          description: '',
        },
        selectedVariant: {
          id: 'ff-master-pass',
          name: 'Akun FF Master + Booyah Pass Aktif',
          price: 95000,
          originalPrice: 160000,
          stock: 4,
          durationDays: 365,
          description: 'Rank Master • Booyah Pass aktif • Skin & Emote rame',
        },
      },
    ],
  },
  {
    id: 'ord-init-08',
    invoiceNumber: 'YURA-261101-1904',
    totalAmount: 28500,
    discountAmount: 0,
    feeAmount: 0,
    paymentMethod: 'dana',
    paymentStatus: 'paid',
    customerName: 'Putri Maharani',
    customerEmail: 'putri.m@outlook.com',
    customerWhatsapp: '085899001122',
    createdAt: NOW - 4 * DAY_MS - 6 * 3600000,
    paidAt: NOW - 4 * DAY_MS - 6 * 3600000 + 75000,
    items: [
      {
        id: 'cart-init-08',
        productId: 'netflix-uhd',
        quantity: 1,
        addedAt: NOW - 4 * DAY_MS - 6 * 3600000,
        product: {
          id: 'netflix-uhd',
          name: 'Netflix Premium UHD 4K',
          category: 'streaming',
          categoryLabel: 'Streaming',
          price: 28500,
          originalPrice: 42750,
          soldCount: 8004,
          stockCount: 29,
          brandColor: '#E50914',
          iconType: 'netflix',
          deliveryType: 'instant',
          deliveryTimeEstimate: 'Bayar Langsung Kirim',
          features: [],
          rules: [],
          variants: [],
          description: '',
        },
        selectedVariant: {
          id: 'netflix-sharing-1m',
          name: 'SHARING PROFILE 1 BULAN',
          price: 28500,
          originalPrice: 42750,
          stock: 29,
          durationDays: 30,
          description: '1 profile berdua, hemat dan legal 4K UHD',
        },
      },
    ],
  },
  {
    id: 'ord-init-09',
    invoiceNumber: 'YURA-261031-9011',
    totalAmount: 18500,
    discountAmount: 0,
    feeAmount: 0,
    paymentMethod: 'dana',
    paymentStatus: 'paid',
    customerName: 'Fajar Ramadhan',
    customerEmail: 'fajar.rama@gmail.com',
    customerWhatsapp: '081700224466',
    createdAt: NOW - 5 * DAY_MS - 4 * 3600000,
    paidAt: NOW - 5 * DAY_MS - 4 * 3600000 + 40000,
    items: [
      {
        id: 'cart-init-09',
        productId: 'spotify-premium',
        quantity: 1,
        addedAt: NOW - 5 * DAY_MS - 4 * 3600000,
        product: {
          id: 'spotify-premium',
          name: 'Spotify Premium',
          category: 'musik',
          categoryLabel: 'Musik & Audio',
          price: 18500,
          originalPrice: 30000,
          soldCount: 189,
          stockCount: 35,
          brandColor: '#1DB954',
          iconType: 'spotify',
          deliveryType: 'manual',
          deliveryTimeEstimate: 'Proses ±30 Menit',
          features: [],
          rules: [],
          variants: [],
          description: '',
        },
        selectedVariant: {
          id: 'spotify-fam-1m',
          name: 'FAMILY INVITATION 1 BULAN',
          price: 18500,
          originalPrice: 30000,
          stock: 35,
          durationDays: 30,
          description: 'Invite legal ke akun pribadi Anda',
        },
      },
    ],
  },
  {
    id: 'ord-init-10',
    invoiceNumber: 'YURA-261030-8022',
    totalAmount: 49900,
    discountAmount: 0,
    feeAmount: 0,
    paymentMethod: 'dana',
    paymentStatus: 'paid',
    customerName: 'Yusuf Iskandar',
    customerEmail: 'yusuf.isk@gmail.com',
    customerWhatsapp: '082233445566',
    createdAt: NOW - 6 * DAY_MS - 2 * 3600000,
    paidAt: NOW - 6 * DAY_MS - 2 * 3600000 + 90000,
    robloxUsername: 'YusufGamerZ',
    robloxMethod: 'login',
    items: [
      {
        id: 'cart-init-10',
        productId: 'roblox-login',
        quantity: 1,
        addedAt: NOW - 6 * DAY_MS - 2 * 3600000,
        product: {
          id: 'roblox-login',
          name: 'Robux Via Login Kilat',
          category: 'game',
          categoryLabel: 'Top Up & Akun Game',
          price: 49900,
          originalPrice: 60000,
          soldCount: 3820,
          stockCount: 999,
          brandColor: '#E65100',
          iconType: 'roblox',
          deliveryType: 'instant',
          deliveryTimeEstimate: 'Proses ±5 Menit',
          features: [],
          rules: [],
          variants: [],
          description: '',
        },
        selectedVariant: {
          id: 'rbx-lg-500',
          name: '500 R$ (Via Login)',
          price: 49900,
          originalPrice: 60000,
          stock: 999,
          durationDays: 1,
          description: 'Via Login • 500 Robux langsung masuk',
        },
      },
    ],
  },
];

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (raw) {
      const parsed: Order[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
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

export function deleteOrderFromStorage(orderOrId: string | Order, reason: string = 'Dihapus oleh Admin'): DeletedOrderLog | null {
  try {
    const existingOrders = getStoredOrders();
    let targetOrder: Order | undefined;

    if (typeof orderOrId === 'object' && orderOrId !== null) {
      targetOrder = orderOrId;
    } else {
      targetOrder = existingOrders.find((o) => o.id === orderOrId || o.invoiceNumber === orderOrId);
    }

    if (!targetOrder) return null;

    // Filter out from active orders
    const targetId = targetOrder.id;
    const targetInvoice = targetOrder.invoiceNumber;
    const updatedOrders = existingOrders.filter((o) => o.id !== targetId && o.invoiceNumber !== targetInvoice);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

    // Construct deletion log
    const itemsText = Array.isArray(targetOrder.items)
      ? targetOrder.items.map((it) => `${it.product?.name || 'Produk'} (${it.selectedVariant?.name || ''}) x${it.quantity}`).join(', ')
      : 'Produk Akun Premium';

    const logEntry: DeletedOrderLog = {
      id: `del-log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      orderId: targetOrder.id,
      invoiceNumber: targetOrder.invoiceNumber,
      customerName: targetOrder.customerName || 'Pelanggan',
      customerEmail: targetOrder.customerEmail || '-',
      customerWhatsapp: targetOrder.customerWhatsapp || '-',
      itemsSummary: itemsText || 'Produk Akun Premium',
      totalAmount: targetOrder.totalAmount,
      paymentStatus: targetOrder.paymentStatus,
      deletedAt: Date.now(),
      deletedBy: 'Admin Yuraa Store (Control Panel)',
      reason: reason.trim() || 'Dihapus dari Control Panel Admin',
      originalOrder: targetOrder,
    };

    const existingLogs = getDeletedOrders();
    const updatedLogs = [logEntry, ...existingLogs.filter((l) => l.orderId !== targetId && l.invoiceNumber !== targetInvoice)];
    localStorage.setItem(STORAGE_KEYS.DELETED_ORDERS, JSON.stringify(updatedLogs));

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

