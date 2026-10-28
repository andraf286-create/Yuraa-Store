export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp').trim();
}

export function calculateDiscountPercent(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

export function generateRandomInvoice(): string {
  const prefix = 'YURA';
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${rand}`;
}

export function generateRandomVANumber(bank: string): string {
  const bankCodes: Record<string, string> = {
    bca_va: '12688',
    mandiri_va: '88708',
    bni_va: '8277',
    bri_va: '10777',
  };
  const prefix = bankCodes[bank] || '88000';
  const randomSuffix = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  return `${prefix}${randomSuffix.slice(0, 11)}`;
}
