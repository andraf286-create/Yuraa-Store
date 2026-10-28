export type ProductCategory = 
  | 'all'
  | 'pulsa'
  | 'paket_data'
  | 'streaming'
  | 'desain'
  | 'musik'
  | 'vpn';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "1 Bulan - Sharing", "1 Bulan - Private (1 Device)"
  price: number;
  originalPrice: number;
  stock: number;
  durationDays: number;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice: number;
  soldCount: number;
  stockCount: number;
  isTrending?: boolean;
  isUrgent?: boolean;
  deliveryType: 'instant' | 'manual';
  deliveryTimeEstimate: string; // "±30 Menit" or "Langsung Kirim"
  isSoldOut?: boolean;
  badgeLabel?: string;
  brandColor: string;
  iconType: string;
  description: string;
  features: string[];
  rules: string[];
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  addedAt: number;
}

export type PaymentMethodType = 
  | 'qris'
  | 'bca_va'
  | 'mandiri_va'
  | 'bni_va'
  | 'bri_va'
  | 'gopay'
  | 'dana'
  | 'ovo'
  | 'shopeepay'
  | 'user_balance';

export interface DeliveredAccount {
  email: string;
  password?: string;
  profileName?: string;
  pin?: string;
  duration: string;
  expiredDate: string;
  rulesNotes: string;
  warrantyUntil: string;
}

export interface AccountInventoryItem {
  id: string;
  productId: string;
  email: string;
  password: string;
  profilePin?: string;
  profileName?: string;
  notes?: string;
  isUsed: boolean;
  usedByInvoice?: string;
  usedAt?: number;
  createdAt: number;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  feeAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'pending' | 'paid' | 'cancelled' | 'refunded';
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  createdAt: number;
  paidAt?: number;
  deliveredAccounts?: DeliveredAccount[];
  vaNumber?: string;
  qrisPayload?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  balance: number;
  avatarUrl?: string;
  isMember: boolean;
  tier: 'Silver' | 'Gold' | 'VIP';
}

export interface TestimonialItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatarBg: string;
  avatarEmoji: string;
  productBought: string;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
