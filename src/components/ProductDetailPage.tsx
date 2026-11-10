import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  Users,
  Zap,
  ShieldCheck,
  Box,
  Check,
  Copy,
  CheckCircle2,
  MessageCircle,
  ShoppingBag,
  Clock,
  Eye,
  EyeOff,
  Gamepad2,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  MessageSquareQuote,
  Send,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, ProductVariant, UserProfile } from '../types';
import { BrandIcon } from './BrandIcon';
import { STORE_INFO } from '../data/products';
import { formatRupiah } from '../utils/formatters';
import { PANDA_ASSETS } from '../utils/assets';

interface ProductDetailPageProps {
  product: Product;
  allProducts?: Product[];
  user: UserProfile | null;
  onBack: () => void;
  onOpenAuth: () => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart: (
    product: Product,
    variant: ProductVariant,
    robloxData?: {
      robloxUsername?: string;
      robloxPassword?: string;
      robloxMethod?: 'gamepass' | 'login' | 'premium';
      robloxGamepassUrl?: string;
    }
  ) => void;
  onDirectBuy: (
    product: Product,
    variant: ProductVariant,
    customerData: {
      name: string;
      whatsapp: string;
      email: string;
      robloxUsername?: string;
      robloxPassword?: string;
      robloxMethod?: 'gamepass' | 'login' | 'premium';
      robloxGamepassUrl?: string;
    }
  ) => void;
}

interface ProductReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  itemBought: string;
  date: string;
  avatarBg: string;
  avatarEmoji: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts = [],
  user,
  onBack,
  onOpenAuth,
  onSelectProduct,
  onAddToCart,
  onDirectBuy,
}) => {
  const isRoblox = product.id.startsWith('roblox') || product.category === 'game';

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: `${product.id}-default`,
      name: 'Standard Paket',
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stockCount,
      durationDays: 30,
      description: 'Akses aktif instan',
    }
  );

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [email, setEmail] = useState(user?.email || '');
  const [copiedDana, setCopiedDana] = useState(false);

  // Roblox specific inputs
  const [robloxUsername, setRobloxUsername] = useState('');
  const [robloxPassword, setRobloxPassword] = useState('');
  const [showRobloxPassword, setShowRobloxPassword] = useState(false);
  const [robloxGamepassUrl, setRobloxGamepassUrl] = useState('');
  const [showGamepassGuide, setShowGamepassGuide] = useState(false);
  const [showPriceListPoster, setShowPriceListPoster] = useState(false);

  // Promo countdown timer (e.g. 02 : 03 : 18)
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 3, seconds: 18 });

  // Reviews state (customized for Roblox or general)
  const defaultRobloxReviews: ProductReview[] = [
    {
      id: 'rev-rbx-1',
      name: 'Fajar Ramadhan',
      rating: 5,
      comment:
        'Top up Robux 2.000 R$ via Gamepass beneran cuma 5 menit masuk! Pajak 30% ditanggung Yuraa Store, Robux bersih ga pake nunggu 5 hari kayak toko sebelah. Top markotop!',
      itemBought: 'Robux Via Link Gamepass (2000 R$)',
      date: '30 menit yang lalu',
      avatarBg: 'bg-emerald-500/20 text-emerald-400',
      avatarEmoji: '🎮',
    },
    {
      id: 'rev-rbx-2',
      name: 'Kevin Ardiansyah',
      rating: 5,
      comment:
        'Beli 5.000 Robux via Login kilat banget, admin ramah dan amanah. Akun Roblox aman sentosa anti-banned. Bakal langganan terus di Yuraa Store!',
      itemBought: 'Robux Via Login Kilat (5000 R$)',
      date: '1 jam yang lalu',
      avatarBg: 'bg-amber-500/20 text-amber-400',
      avatarEmoji: '😎',
    },
    {
      id: 'rev-rbx-3',
      name: 'Naufal Gaming',
      rating: 5,
      comment:
        'Langganan Roblox Subs Premium 1.000 R$ dapet badge premium dan bonus robux bulanan. Harganya jauh lebih murah dari in-game!',
      itemBought: 'Roblox Subs Premium (1000 R$)',
      date: '3 jam yang lalu',
      avatarBg: 'bg-purple-500/20 text-purple-400',
      avatarEmoji: '👑',
    },
    {
      id: 'rev-rbx-4',
      name: 'Raditya Pratama',
      rating: 5,
      comment:
        'Awalnya ragu beli Robux via Gamepass, ternyata tinggal kasih username doang tanpa password, 5 menit kemudian Robux udah masuk di balance! Recommended!',
      itemBought: 'Robux Via Link Gamepass (1000 R$)',
      date: '5 jam yang lalu',
      avatarBg: 'bg-cyan-500/20 text-cyan-400',
      avatarEmoji: '🕹️',
    },
    {
      id: 'rev-rbx-5',
      name: 'Daffa Maulana',
      rating: 5,
      comment:
        'Langganan Robux di sini tiap update event Blox Fruits, gapernah kecewa. Pembayaran via DANA langsung dikonfirmasi & beres.',
      itemBought: 'Robux Via Link Gamepass (1500 R$)',
      date: '1 hari yang lalu',
      avatarBg: 'bg-blue-500/20 text-blue-400',
      avatarEmoji: '⚡',
    },
  ];

  const defaultGeneralReviews: ProductReview[] = [
    {
      id: 'rev-gen-1',
      name: 'Ahmad Rizky',
      rating: 5,
      comment: 'Akun langsung dikirim setelah bayar, mantap!',
      itemBought: product.name,
      date: '2 jam yang lalu',
      avatarBg: 'bg-amber-500/20 text-amber-400',
      avatarEmoji: '👨🏽‍💼',
    },
    {
      id: 'rev-gen-2',
      name: 'Siti Nurhaliza',
      rating: 5,
      comment: 'Sudah langganan di sini, aman dan terpercaya kualitas gambarnya.',
      itemBought: product.name,
      date: '5 jam yang lalu',
      avatarBg: 'bg-sky-500/20 text-sky-400',
      avatarEmoji: '🧕🏻',
    },
    {
      id: 'rev-gen-3',
      name: 'Dimas Putra',
      rating: 5,
      comment: 'Pelayanan cepat, customer service ramah dan gercep!',
      itemBought: product.name,
      date: '1 hari yang lalu',
      avatarBg: 'bg-emerald-500/20 text-emerald-400',
      avatarEmoji: '🧑🏻‍💻',
    },
  ];

  const [reviewsList, setReviewsList] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem(`yuraa_reviews_${product.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return isRoblox ? defaultRobloxReviews : defaultGeneralReviews;
  });

  // User new review form modal state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedVariant(product.variants[0]);
    const saved = localStorage.getItem(`yuraa_reviews_${product.id}`);
    if (saved) {
      try {
        setReviewsList(JSON.parse(saved));
      } catch {
        setReviewsList(isRoblox ? defaultRobloxReviews : defaultGeneralReviews);
      }
    } else {
      setReviewsList(isRoblox ? defaultRobloxReviews : defaultGeneralReviews);
    }
  }, [product.id, isRoblox]);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!whatsapp) setWhatsapp(user.whatsapp);
      if (!email) setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyDana = () => {
    navigator.clipboard.writeText(STORE_INFO.danaNumber);
    setCopiedDana(true);
    setTimeout(() => setCopiedDana(false), 2000);
  };

  const getRobloxMethod = (): 'gamepass' | 'login' | 'premium' => {
    if (product.id === 'roblox-gamepass') return 'gamepass';
    if (product.id === 'roblox-premium') return 'premium';
    return 'login';
  };

  const handleProceedOrder = () => {
    if (!customerName.trim()) {
      alert('Mohon isi Nama Lengkap Anda terlebih dahulu');
      return;
    }
    if (!whatsapp.trim()) {
      alert('Mohon isi Nomor WhatsApp Anda untuk pengiriman & verifikasi');
      return;
    }

    if (isRoblox) {
      if (!robloxUsername.trim()) {
        alert('Mohon isi Username Roblox Anda!');
        return;
      }
      const method = getRobloxMethod();
      if ((method === 'login' || method === 'premium') && !robloxPassword.trim()) {
        alert('Untuk metode ' + (method === 'premium' ? 'Subs Premium' : 'Via Login') + ', mohon isi Password Akun Roblox Anda agar admin dapat memproses pengisian.');
        return;
      }
    }

    const robloxData = isRoblox
      ? {
          robloxUsername: robloxUsername.trim(),
          robloxPassword: robloxPassword.trim() || undefined,
          robloxMethod: getRobloxMethod(),
          robloxGamepassUrl: robloxGamepassUrl.trim() || undefined,
        }
      : undefined;

    onDirectBuy(product, selectedVariant, {
      name: customerName,
      whatsapp,
      email: email || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      ...robloxData,
    });
  };

  const handleAddToCartClick = () => {
    if (isRoblox && !robloxUsername.trim()) {
      alert('Mohon isi Username Roblox Anda terlebih dahulu');
      return;
    }

    const robloxData = isRoblox
      ? {
          robloxUsername: robloxUsername.trim(),
          robloxPassword: robloxPassword.trim() || undefined,
          robloxMethod: getRobloxMethod(),
          robloxGamepassUrl: robloxGamepassUrl.trim() || undefined,
        }
      : undefined;

    onAddToCart(product, selectedVariant, robloxData);
  };

  const handleDirectWhatsAppChat = () => {
    let extraRoblox = '';
    if (isRoblox) {
      const method = getRobloxMethod();
      extraRoblox = `\n- Username Roblox: ${robloxUsername || '(Belum diisi)'}\n- Metode Top Up: ${
        method === 'gamepass' ? 'Via Link Gamepass (Hanya Username)' : method === 'premium' ? 'Roblox Subs Premium' : 'Via Login Kilat'
      }`;
      if (robloxGamepassUrl) {
        extraRoblox += `\n- Link Gamepass: ${robloxGamepassUrl}`;
      }
    }

    const text = encodeURIComponent(
      `Halo Admin Yuraa Store 🐼, saya mau pesan:\n- Produk: ${product.name}\n- Variasi: ${selectedVariant.name}\n- Harga: ${formatRupiah(
        selectedVariant.price
      )}${extraRoblox}\n- Nama: ${customerName || 'Pelanggan'}\n- No WA: ${whatsapp || '-'}\n\nSaya mau bayar via DANA ${STORE_INFO.danaNumber}. Mohon segera diproses ya!`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) {
      alert('Mohon isi nama dan ulasan Anda');
      return;
    }

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim(),
      rating: reviewerRating,
      comment: reviewerComment.trim(),
      itemBought: `${product.name} (${selectedVariant.name})`,
      date: 'Baru saja',
      avatarBg: 'bg-emerald-500/20 text-emerald-400',
      avatarEmoji: isRoblox ? '🎮' : '⭐',
    };

    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    localStorage.setItem(`yuraa_reviews_${product.id}`, JSON.stringify(updated));
    setShowReviewForm(false);
    setReviewerName('');
    setReviewerComment('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      {/* Top Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors uppercase tracking-wider mb-3 py-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          KEMBALI KE KATALOG
        </button>

        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <span className="cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={onBack}>
            HOME
          </span>
          <span>/</span>
          <span className="text-slate-500 dark:text-slate-400">{product.categoryLabel.toUpperCase()}</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 truncate">{product.name.toUpperCase()}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* ROBLOX BANNER HEADER (Styled directly from user image) */}
        {isRoblox && (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-gradient-to-br from-neutral-950 via-[#0a141d] to-[#04121a] p-5 sm:p-6 text-white">
            {/* Top Brand Badges */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white rotate-[15deg] rounded-[3px] flex items-center justify-center shadow-md">
                  <div className="w-2.5 h-2.5 bg-neutral-950 rounded-[1px]"></div>
                </div>
                <span className="font-black text-lg tracking-wider">ROBLOX</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-neutral-900/90 text-neutral-200 border border-neutral-700 text-xs font-bold tracking-wider">
                YuraaStore
              </span>
            </div>

            {/* Banner Marketing Text from uploaded image */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-emerald-500/20 backdrop-blur-sm space-y-2">
              <p className="text-xs sm:text-sm font-extrabold text-white text-center leading-relaxed">
                Top up robux nggak perlu nunggu sampai 5 hari baru masuk,
                <br />
                <span className="text-amber-400">Top up di kami hanya perlu 5 menit aja!</span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs font-bold text-emerald-400">
                <span className="inline-flex items-center gap-1 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                  ✅ proses lebih cepat
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                  ✅ harga lebih murah
                </span>
              </div>
            </div>

            {/* Quick 3-Method Tabs from the Banner Image */}
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                PILIH METODE TOP UP:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    const found = allProducts.find((p) => p.id === 'roblox-gamepass');
                    if (found && onSelectProduct) onSelectProduct(found);
                  }}
                  className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    product.id === 'roblox-gamepass'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400">VIA LINK GAMEPASS</span>
                    {product.id === 'roblox-gamepass' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">Hanya username (Tanpa Sandi)</span>
                  <span className="text-[10px] font-bold text-emerald-400 font-mono mt-1 block">Mulai Rp 44.900</span>
                </button>

                <button
                  onClick={() => {
                    const found = allProducts.find((p) => p.id === 'roblox-login');
                    if (found && onSelectProduct) onSelectProduct(found);
                  }}
                  className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    product.id === 'roblox-login'
                      ? 'bg-amber-950/80 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400">ROBUX VIA LOGIN</span>
                    {product.id === 'roblox-login' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">Butuh username &amp; Pw</span>
                  <span className="text-[10px] font-bold text-amber-400 font-mono mt-1 block">Mulai Rp 49.900</span>
                </button>

                <button
                  onClick={() => {
                    const found = allProducts.find((p) => p.id === 'roblox-premium');
                    if (found && onSelectProduct) onSelectProduct(found);
                  }}
                  className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    product.id === 'roblox-premium'
                      ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-300">SUBS PREMIUM</span>
                    {product.id === 'roblox-premium' && <Check className="w-3.5 h-3.5 text-purple-300" />}
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">Butuh username &amp; Pw</span>
                  <span className="text-[10px] font-bold text-purple-300 font-mono mt-1 block">Mulai Rp 50.000</span>
                </button>
              </div>

              {/* Toggle to view official image price list flyer from user */}
              <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPriceListPoster(!showPriceListPoster)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{showPriceListPoster ? 'Tutup Gambar Brosur' : '🖼️ Lihat Brosur Pricelist Resmi'}</span>
                </button>
                <span className="text-[10px] text-neutral-400 font-mono">100% Legal &amp; Anti Banned</span>
              </div>

              {showPriceListPoster && (
                <div className="mt-3 p-2 rounded-2xl bg-black/80 border border-purple-500/40 animate-in fade-in duration-200">
                  <img
                    src={PANDA_ASSETS.robuxPriceListBanner}
                    alt="Daftar Harga Robux YuraaStore Resmi"
                    className="w-full max-h-[500px] object-contain rounded-xl mx-auto shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Visual & Header Card */}
        <div className="rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-7 shadow-lg dark:shadow-2xl relative overflow-hidden">
          {/* Top Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-bold border border-amber-500/30">
              <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-300" />
              TRENDING
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Users className="w-3 h-3" />
              {product.soldCount} TERJUAL
            </span>
          </div>

          {/* Big Brand Icon */}
          <div className="w-full flex items-center justify-center py-8 bg-slate-50 dark:bg-[#090e18] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <BrandIcon iconType={product.iconType} size="lg" className="scale-125" />
          </div>

          {/* Category Pill */}
          <div className="mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-xs tracking-wider border border-blue-500/20 uppercase">
              {isRoblox ? <Gamepad2 className="w-3.5 h-3.5 text-emerald-500" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {isRoblox ? 'TOP UP GAME RESMI' : 'AKUN PREMIUM'}
            </span>
          </div>

          {/* Title & Price */}
          <div className="mt-3 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              {product.name}
            </h1>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-500 font-mono tracking-tight">
              {formatRupiah(selectedVariant.price)}
            </div>
          </div>
        </div>

        {/* Section: Deskripsi */}
        <div className="rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-7 shadow-md dark:shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-blue-600 dark:text-blue-500 font-black text-lg">📘</span>
            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase">DESKRIPSI</h2>
          </div>

          <div className="prose max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {product.description}
          </div>
        </div>

        {/* Section: Keunggulan Produk */}
        <div className="rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-7 shadow-md dark:shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase">KEUNGGULAN PRODUK</h2>
          </div>

          <div className="space-y-2.5">
            {product.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* 3 Stats Highlights */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5">
                <Zap className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">PROSES</span>
              <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                {isRoblox ? '±5 MENIT' : product.deliveryType === 'instant' ? 'INSTAN' : '±30 MENIT'}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">GARANSI</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">100% AMAN</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-1.5">
                <Box className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">STOK</span>
              <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                {product.stockCount > 500 ? 'READY' : `${product.stockCount} UNIT`}
              </span>
            </div>
          </div>
        </div>

        {/* Section: TESTIMONI & ULASAN PELANGGAN (User Request) */}
        <div className="rounded-3xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-7 shadow-md dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase">
                {isRoblox ? 'TESTIMONI PEMBELI ROBUX' : 'TESTIMONI PELANGGAN'}
              </h2>
            </div>
            <button
              onClick={() => setShowReviewForm((prev) => !prev)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {showReviewForm ? 'Tutup Form' : '+ Tulis Testimoni'}
            </button>
          </div>

          {/* Overall Rating Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0b101c] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">4.9</span>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  99.8% Transaksi Berhasil {isRoblox ? '• Proses 5 Menit' : '• Garansi Penuh'}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                ✓ Terverifikasi Yuraa Store
              </span>
              <span className="text-[10px] text-slate-400">Berdasarkan {reviewsList.length * 350}+ transaksi</span>
            </div>
          </div>

          {/* Form Write Review if toggled */}
          {showReviewForm && (
            <form
              onSubmit={handleAddReviewSubmit}
              className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/30 space-y-3"
            >
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Bagikan Pengalaman Anda
              </h3>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Nama Anda:
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[5, 4, 3].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setReviewerRating(num)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        reviewerRating === num
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {num} Bintang ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Ulasan / Komentar:
                </label>
                <textarea
                  rows={2}
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="Ceritakan seberapa cepat Robux/Akun masuk..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Kirim Ulasan
                </button>
              </div>
            </form>
          )}

          {/* List of Reviews */}
          <div className="space-y-3 pt-1">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${rev.avatarBg}`}
                    >
                      <span>{rev.avatarEmoji}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">{rev.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                          ✓ Pembeli Terverifikasi
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400 mt-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic pl-1">
                  "{rev.comment}"
                </p>

                <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <ThumbsUp className="w-3 h-3 text-emerald-500" />
                  <span>Item dibeli: {rev.itemBought}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Proses Order */}
        <div className="rounded-3xl bg-white dark:bg-[#121929] border border-blue-200 dark:border-blue-500/30 p-5 sm:p-7 shadow-lg dark:shadow-2xl space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-blue-600 dark:text-blue-500 font-black text-lg">🛒</span>
            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase">PROSES ORDER</h2>
          </div>

          {/* Quick Login Banner */}
          {!user ? (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 dark:bg-[#152138] border border-blue-200 dark:border-blue-500/30 gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Punya akun? Login untuk auto-isi data!
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tidak perlu isi email &amp; WA setiap saat
                </p>
              </div>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                LOGIN
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  Login sebagai <strong>{user.name}</strong> ({user.whatsapp})
                </span>
              </div>
            </div>
          )}

          {/* Promo Terbatas Countdown Timer */}
          <div className="rounded-2xl bg-[#191512] border border-amber-600/30 p-4 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest text-amber-500 uppercase">
              <Zap className="w-3.5 h-3.5 fill-amber-500" />
              <span>PROMO TERBATAS HARI INI</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-500 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">JAM</span>
              </div>
              <span className="text-xl font-bold text-amber-500 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-500 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">MNT</span>
              </div>
              <span className="text-xl font-bold text-amber-500 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-500 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">DET</span>
              </div>
            </div>
          </div>

          {/* ROBLOX SPECIFIC INPUT FORM IF ROBLOX */}
          {isRoblox && (
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  DATA AKUN ROBLOX ({getRobloxMethod() === 'gamepass' ? 'HANYA USERNAME' : 'BUTUH USERNAME & PW'})
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  USERNAME ROBLOX *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={robloxUsername}
                    onChange={(e) => setRobloxUsername(e.target.value)}
                    placeholder="Contoh: GamerRoblox123 (tanpa spasi)"
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                    required
                  />
                  {robloxUsername && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      ✓ Valid
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Pastikan ejaan huruf besar/kecil sesuai akun Roblox Anda.
                </span>
              </div>

              {/* If Gamepass method */}
              {getRobloxMethod() === 'gamepass' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                      LINK GAMEPASS / PLACE (OPSIONAL)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGamepassGuide((prev) => !prev)}
                      className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Panduan Gamepass</span>
                      {showGamepassGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  <input
                    type="url"
                    value={robloxGamepassUrl}
                    onChange={(e) => setRobloxGamepassUrl(e.target.value)}
                    placeholder="https://www.roblox.com/game-pass/... atau nama Game"
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                  />

                  {showGamepassGuide && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-1.5">
                      <p className="font-bold text-white flex items-center gap-1">
                        <span>💡 Cara Bikin Gamepass Robux dalam 1 Menit:</span>
                      </p>
                      <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                        <li>Buka <strong>create.roblox.com/dashboard/creations</strong> di browser Anda.</li>
                        <li>Klik Place / Game bawaan Anda, lalu pilih tab <strong>"Associated Items" &gt; "Passes"</strong>.</li>
                        <li>Klik <strong>"Create a Pass"</strong>, beri nama bebas (misal: "Robux 500").</li>
                        <li>Buka pass tersebut, klik <strong>Sales</strong>, aktifkan <strong>Item for Sale</strong>, dan masukkan harga sesuai nominal Robux pesanan Anda.</li>
                        <li>Simpan! Pajak Roblox 30% sudah ditanggung Yuraa Store, Anda terima Robux bersih dalam 5 menit.</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* If Login or Subs Premium method */}
              {(getRobloxMethod() === 'login' || getRobloxMethod() === 'premium') && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      PASSWORD AKUN ROBLOX *
                    </label>
                    <div className="relative">
                      <input
                        type={showRobloxPassword ? 'text' : 'password'}
                        value={robloxPassword}
                        onChange={(e) => setRobloxPassword(e.target.value)}
                        placeholder="Kata sandi akun Roblox Anda"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 font-mono pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRobloxPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                      >
                        {showRobloxPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                    <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>Sandi aman terenkripsi &amp; hanya digunakan 1x untuk pengisian Robux kilat 5 menit.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customer Input Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                NAMA LENGKAP *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama kamu"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                WHATSAPP *
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08123456789"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                Notifikasi instan &amp; konfirmasi pengiriman akan dikirimkan ke WhatsApp ini.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                EMAIL PENGIRIMAN *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namakamu@gmail.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Section: Pilih Variasi Produk */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              📦 PILIH VARIASI NOMINAL *
            </label>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-[#18233c] border-blue-500 shadow-md dark:shadow-lg dark:shadow-blue-500/20'
                        : 'bg-slate-50 dark:bg-[#0e1422] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Checkmark badge */}
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}

                    <div className="flex items-start justify-between pr-8">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-wide uppercase">
                            {v.name}
                          </h3>
                          {v.durationDays > 1 && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {v.durationDays} HARI
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{v.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-base font-black text-blue-600 dark:text-blue-400">
                        {formatRupiah(v.price)}
                      </span>

                      {v.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          <Check className="w-3 h-3" />
                          READY (PROSES 5 MENIT)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          PROSES ±30 MENIT
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DANA Payment Details Banner */}
          <div className="rounded-2xl bg-sky-50 dark:bg-gradient-to-r dark:from-sky-950/60 dark:via-blue-950/40 dark:to-slate-900 border border-sky-300 dark:border-sky-500/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-black text-xs">DANA</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Nomor Pembayaran Resmi</span>
              </div>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">Aktif 24 Jam</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 border border-sky-200 dark:border-sky-500/30 shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  NOMOR DANA (A/N {STORE_INFO.danaName})
                </span>
                <span className="font-mono text-lg font-black text-sky-600 dark:text-sky-400 tracking-wider">
                  {STORE_INFO.danaNumber}
                </span>
              </div>
              <button
                onClick={handleCopyDana}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-transform active:scale-95 cursor-pointer"
              >
                {copiedDana ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDana ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              💡 <em>Setelah transfer, kirim bukti pembayaran DANA langsung ke WhatsApp toko untuk verifikasi &amp; pengisian otomatis!</em>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleProceedOrder}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 border border-blue-400/30 active:scale-[0.99] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              BELI SEKARANG (PROSES PEMBAYARAN)
            </button>

            <button
              onClick={handleDirectWhatsAppChat}
              className="w-full py-3.5 rounded-2xl bg-[#075E54] hover:bg-[#128C7E] text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-emerald-500/30 active:scale-[0.99] cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              KIRIM BUKTI PEMBAYARAN / ORDER VIA WA ({STORE_INFO.whatsappDisplay})
            </button>

            <button
              onClick={handleAddToCartClick}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#161f33] dark:hover:bg-[#1c2842] text-slate-800 dark:text-slate-200 font-bold text-xs tracking-wider uppercase border border-slate-200 dark:border-slate-700/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              TAMBAHKAN KE KERANJANG BELANJA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
