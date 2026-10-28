import { UserProfile } from '../types';

export interface ReferralCoupon {
  code: string;
  title: string;
  discountPercent?: number;
  discountFixed?: number;
  isUsed: boolean;
  minSpend?: number;
  expiry: string;
}

export interface ReferralData {
  referralCode: string;
  totalFriendsInvited: number;
  totalRewardsEarned: number;
  coupons: ReferralCoupon[];
  recentActivities: {
    id: string;
    friendName: string;
    productName: string;
    reward: string;
    date: string;
  }[];
}

const STORAGE_KEYS = {
  REFERRAL_DATA: 'yuraa_referral_data',
  APPLIED_REF: 'yuraa_applied_referral_code',
};

const DEFAULT_COUPONS: ReferralCoupon[] = [
  {
    code: 'TEMANHEMAT',
    title: 'Diskon 10% Spesial Referral Teman',
    discountPercent: 10,
    isUsed: false,
    expiry: '31 Des 2026',
  },
  {
    code: 'PANDA5K',
    title: 'Potongan Saldo Rp 5.000 Transaksi Berikutnya',
    discountFixed: 5000,
    isUsed: false,
    expiry: '31 Des 2026',
  },
  {
    code: 'PANDAVIP',
    title: 'Diskon VIP Member 15%',
    discountPercent: 15,
    isUsed: false,
    expiry: '31 Des 2026',
  },
];

export function generateUserReferralCode(user: UserProfile | null): string {
  if (user && user.name) {
    const clean = user.name.split(' ')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
    return `PANDA-${clean || 'VIP'}`;
  }
  return 'PANDA-SAHABAT';
}

export function getReferralData(user: UserProfile | null): ReferralData {
  const defaultCode = generateUserReferralCode(user);

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REFERRAL_DATA);
    if (saved) {
      const parsed: ReferralData = JSON.parse(saved);
      if (!parsed.referralCode) {
        parsed.referralCode = defaultCode;
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse referral data:', e);
  }

  const initialData: ReferralData = {
    referralCode: defaultCode,
    totalFriendsInvited: 3,
    totalRewardsEarned: 25000,
    coupons: DEFAULT_COUPONS,
    recentActivities: [
      {
        id: 'act-1',
        friendName: 'Rizky Fadillah',
        productName: 'Netflix Premium 1 Bulan',
        reward: '+10% Kupon (TEMANHEMAT)',
        date: 'Hari ini',
      },
      {
        id: 'act-2',
        friendName: 'Siti Nurhaliza',
        productName: 'Spotify Family 3 Bulan',
        reward: '+Rp 5.000 Diskon (PANDA5K)',
        date: 'Kemarin',
      },
      {
        id: 'act-3',
        friendName: 'Dimas Aditya',
        productName: 'YouTube Premium 1 Bulan',
        reward: '+15% Kupon (PANDAVIP)',
        date: '3 hari lalu',
      },
    ],
  };

  try {
    localStorage.setItem(STORAGE_KEYS.REFERRAL_DATA, JSON.stringify(initialData));
  } catch {
    // Ignore storage errors
  }

  return initialData;
}

export function saveReferralData(data: ReferralData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REFERRAL_DATA, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save referral data:', e);
  }
}

export function getAppliedReferralCode(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.APPLIED_REF);
  } catch {
    return null;
  }
}

export function setAppliedReferralCode(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPLIED_REF, code.trim().toUpperCase());
  } catch {
    // Ignore storage errors
  }
}

export function clearAppliedReferralCode(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.APPLIED_REF);
  } catch {
    // Ignore storage errors
  }
}

export interface CouponEvaluation {
  isValid: boolean;
  code: string;
  discountPercent: number;
  discountFixed: number;
  description: string;
}

export function evaluateDiscountCode(rawCode: string, subtotal: number): CouponEvaluation {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { isValid: false, code: '', discountPercent: 0, discountFixed: 0, description: '' };
  }

  // Check specific standard & referral promo codes
  if (code === 'TEMANHEMAT' || code === 'HEMAT10') {
    return {
      isValid: true,
      code,
      discountPercent: 10,
      discountFixed: 0,
      description: 'Kupon Referral Berhasil! Diskon 10% aktif.',
    };
  }

  if (code === 'PANDA5K') {
    return {
      isValid: true,
      code,
      discountPercent: 0,
      discountFixed: 5000,
      description: 'Kupon Referral Berhasil! Potongan langsung Rp 5.000.',
    };
  }

  if (code === 'PANDAVIP') {
    return {
      isValid: true,
      code,
      discountPercent: 15,
      discountFixed: 0,
      description: 'Kupon Spesial VIP Berhasil! Diskon 15% aktif.',
    };
  }

  if (code === 'PROMO2026') {
    return {
      isValid: true,
      code,
      discountPercent: 5,
      discountFixed: 0,
      description: 'Promo Spesial Yuraa Store 5% aktif.',
    };
  }

  // Any friend invite code starting with PANDA- or YURAA- or REF-
  if (code.startsWith('PANDA-') || code.startsWith('YURAA-') || code.startsWith('REF-')) {
    return {
      isValid: true,
      code,
      discountPercent: 10,
      discountFixed: 0,
      description: `Undangan Referral ${code} aktif! Diskon 10% dinikmati.`,
    };
  }

  return {
    isValid: false,
    code,
    discountPercent: 0,
    discountFixed: 0,
    description: 'Kode kupon / referral tidak valid atau telah kedaluwarsa.',
  };
}
