import { TestimonialItem, FaqItem } from '../types';

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'testi-1',
    name: 'Ahmad Rizky',
    rating: 5,
    comment: 'Akun langsung dikirim setelah bayar, mantap!',
    avatarBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600',
    avatarEmoji: '👨🏽‍💼',
    productBought: 'Netflix Premium UHD 4K',
    date: '2 jam yang lalu'
  },
  {
    id: 'testi-2',
    name: 'Siti Nurhaliza',
    rating: 5,
    comment: 'Sudah langganan di sini, aman dan terpercaya.',
    avatarBg: 'bg-sky-100 dark:bg-sky-900/40 text-sky-600',
    avatarEmoji: '🧕🏻',
    productBought: 'Canva Pro Lifetime',
    date: '5 jam yang lalu'
  },
  {
    id: 'testi-3',
    name: 'Dimas Putra',
    rating: 5,
    comment: 'Pelayanan cepat, customer service ramah.',
    avatarBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600',
    avatarEmoji: '🧑🏻‍💻',
    productBought: 'Spotify Premium 1 Bulan',
    date: '1 hari yang lalu'
  },
  {
    id: 'testi-4',
    name: 'Budi Santoso',
    rating: 5,
    comment: 'Proses QRIS nya instan banget, 3 detik langsung dapet email dan password. Terbaik!',
    avatarBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600',
    avatarEmoji: '🧔🏻',
    productBought: 'Disney+ Hotstar',
    date: '1 hari yang lalu'
  },
  {
    id: 'testi-5',
    name: 'Clarissa Maharani',
    rating: 5,
    comment: 'Awalnya ragu, pas coba beli Prime Video langsung bisa nonton tanpa kendala. Bakal repurchase!',
    avatarBg: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600',
    avatarEmoji: '👩🏻‍🦰',
    productBought: 'Prime Video',
    date: '2 hari yang lalu'
  }
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Berapa lama proses pengiriman akun?',
    answer: 'Untuk produk bertanda "Bayar Langsung Kirim", akun akan otomatis terkirim ke layar dan WhatsApp Anda dalam hitungan detik setelah pembayaran diverifikasi. Untuk produk "Proses ±30 Menit", tim admin kami akan memproses manual maksimal 15–30 menit pada jam kerja (08:00 - 23:00 WIB).'
  },
  {
    id: 'faq-2',
    question: 'Apakah akun ini legal dan aman?',
    answer: 'Semua akun di Yuraa Store adalah akun legal resmi, dibeli secara sah menggunakan metode pembayaran resmi dan family subscription terpercaya. Tidak ada metode cracking atau carding, sehingga aman digunakan di semua perangkat Anda.'
  },
  {
    id: 'faq-3',
    question: 'Bagaimana jika akun mengalami kendala?',
    answer: 'Kami memberikan GARANSI 100% Full Replace selama masa langganan aktif. Jika akun mengalami error, password berubah, atau screen limit, Anda cukup menekan tombol "Klaim Garansi" atau WhatsApp CS, akun pengganti akan segera dikirimkan.'
  },
  {
    id: 'faq-4',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: 'Kami mendukung QRIS (BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, LinkAja tanpa biaya admin), Virtual Account (BCA, Mandiri, BRI, BNI, Permata) serta pemotongan langsung dari Saldo TokoAkun / Member Yuraa Store.'
  }
];

export const LIVE_SALES_FEED = [
  { buyer: 'p*****a', product: 'Sharing Mobile 1 Bulan – Platinum', time: '2 menit yang lalu' },
  { buyer: 'C******r', product: 'Khusus HP/Laptop/Tablet 1 Bulan', time: '4 menit yang lalu' },
  { buyer: 'H*****A', product: 'Invitation 1 Bulan - Spotify Family', time: '7 menit yang lalu' },
  { buyer: 'r*****y', product: 'Netflix Premium UHD 4K - 1 Profil', time: '11 menit yang lalu' },
  { buyer: 'd*****i', product: 'Canva Pro Lifetime Garansi 1 Tahun', time: '15 menit yang lalu' },
  { buyer: 'k*****n', product: 'Disney+ Hotstar 1 Bulan Private', time: '18 menit yang lalu' },
  { buyer: 'a*****f', product: 'YouTube Premium 1 Bulan Family', time: '22 menit yang lalu' },
  { buyer: 'm*****z', product: 'ChatGPT Plus GPT-4o 1 Bulan', time: '29 menit yang lalu' }
];
