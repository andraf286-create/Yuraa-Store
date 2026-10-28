import { Product } from '../types';

export const STORE_INFO = {
  name: 'Yuraa Store',
  danaNumber: '08984436849',
  danaName: 'YURAA STORE / DANA',
  whatsappNumber: '628984436849',
  whatsappDisplay: '+62 898-4436-849',
  operatingHours: '08:00 - 23:00 WIB',
};

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'netflix-uhd',
    name: 'Netflix Premium UHD 4K',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 28500,
    originalPrice: 42750,
    soldCount: 8004,
    stockCount: 29,
    isTrending: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#E50914',
    iconType: 'netflix',
    description: `🎬 Netflix Premium
Store: Yuraa Store

Halo Kak, untuk paket Netflix Premium, berikut benefit order melalui Yuraa Store:

✅ Full garansi dari toko
✅ Harga terjangkau
✅ Bisa diakses di semua jenis device
✅ Legal & tanpa VPN
✅ Kualitas gambar Ultra HD 4K

📌 Perbedaan Sharing Profile & Private Profile

👥 Sharing Profile
* 1 profile berisi 2 pengguna
* Ada kemungkinan terjadi limit screen jika digunakan bersamaan

👤 Private Profile
* 1 profile hanya untuk 1 pengguna
* Lebih nyaman digunakan
* Jarang / hampir tidak pernah mengalami limit screen

🔥 Ready sekarang & langsung diproses

Stok terbatas ya Kak. Silakan langsung diorder, karena yang lebih cepat akan lebih dulu diproses 😊`,
    features: [
      'KUALITAS SAMPAI 4K ULTRA HD + HDR',
      'TERMASUK NETFLIX SPATIAL AUDIO',
      'SUPPORT SMART TV, HP, TABLET & PC',
      'GARANSI FULL REPLACE SELAMA PERIODE'
    ],
    rules: [
      'Gunakan 1 profil yang sudah ditentukan',
      'Dilarang mengubah email atau password',
      'Dilarang sharing profil ke orang lain'
    ],
    variants: [
      {
        id: 'netflix-sharing-1m',
        name: 'SHARING PROFILE 1 BULAN',
        price: 28500,
        originalPrice: 42750,
        stock: 29,
        durationDays: 30,
        description: '1 profile berdua, hemat dan legal 4K UHD'
      },
      {
        id: 'netflix-private-1m',
        name: 'PRIVATE PROFILE 1 BULAN',
        price: 47500,
        originalPrice: 65000,
        stock: 15,
        durationDays: 30,
        description: '1 profile khusus 1 pengguna, anti limit screen'
      },
      {
        id: 'netflix-sharing-3m',
        name: 'SHARING PROFILE 3 BULAN',
        price: 82500,
        originalPrice: 125000,
        stock: 12,
        durationDays: 90,
        description: 'Paket hemat 3 bulan nonstop tanpa ganti akun tiap bulan'
      },
      {
        id: 'netflix-full-account',
        name: 'FULL AKUN PRIVATE 1 BULAN (4 SCREEN)',
        price: 139000,
        originalPrice: 186000,
        stock: 5,
        durationDays: 30,
        description: 'Akun private milik sendiri, bebas bikin 5 profil & 4 screen nonton bersamaan'
      }
    ]
  },
  {
    id: 'spotify-premium',
    name: 'Spotify Premium',
    category: 'musik',
    categoryLabel: 'Musik & Audio',
    price: 28000,
    originalPrice: 42000,
    soldCount: 189,
    stockCount: 0,
    isTrending: false,
    deliveryType: 'manual',
    deliveryTimeEstimate: 'Proses ±30 Menit',
    brandColor: '#1DB954',
    iconType: 'spotify',
    description: `🎵 Spotify Premium
Store: Yuraa Store

Dengarkan jutaan lagu dan podcast tanpa jeda iklan dengan kualitas audio Extreme 320 kbps!

✅ Bebas Iklan selamanya selama masa aktif
✅ Bisa download lagu & dengarkan offline tanpa kuota
✅ Kualitas audio jernih Extreme 320 kbps
✅ Bisa untuk HP Android, iPhone, Laptop & Smart Speaker
✅ Tersedia opsi perpanjang akun lama atau akun baru

📌 Pilihan Paket:
• Family Invite: Invite resmi ke Family Plan, akun milik sendiri
• Individual: Plan personal khusus tanpa gabung grup

Garansi full replace jika terjadi kendala!`,
    features: [
      'AUDIO EXTREME 320 KBPS & DOLBY AUDIO',
      'DOWNLOAD LAGU OFFLINE SEPUASNYA',
      'UNLIMITED SKIP LAGU BEBAS',
      'GARANSI REPLACE ANTI DROP'
    ],
    rules: [
      'Untuk Family Invite: region akun harus Indonesia',
      'Kirimkan email Spotify saat checkout atau via WA'
    ],
    variants: [
      {
        id: 'spotify-indiv-1m',
        name: 'INDIVIDUAL PLAN 1 BULAN',
        price: 28000,
        originalPrice: 42000,
        stock: 20,
        durationDays: 30,
        description: 'Plan individu akun personal'
      },
      {
        id: 'spotify-fam-1m',
        name: 'FAMILY INVITATION 1 BULAN',
        price: 18500,
        originalPrice: 30000,
        stock: 35,
        durationDays: 30,
        description: 'Invite legal ke akun pribadi Anda'
      },
      {
        id: 'spotify-fam-3m',
        name: 'FAMILY INVITATION 3 BULAN',
        price: 49000,
        originalPrice: 75000,
        stock: 18,
        durationDays: 90,
        description: 'Paket langganan 3 bulan praktis'
      }
    ]
  },
  {
    id: 'prime-video',
    name: 'Prime Video',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 8500,
    originalPrice: 12750,
    soldCount: 4408,
    stockCount: 12,
    isTrending: false,
    deliveryType: 'manual',
    deliveryTimeEstimate: 'Proses ±30 Menit',
    brandColor: '#00A8E1',
    iconType: 'prime',
    description: `🍿 Amazon Prime Video
Store: Yuraa Store

Streaming serial hits dunia, The Boys, Rings of Power, Reacher, dan ribuan film blockbuster!

✅ Kualitas Ultra HD 4K & HDR
✅ Subtitle Bahasa Indonesia resmi
✅ Support Smart TV, Android, iOS, & PC
✅ Garansi full 30 hari ganti baru

Harga super hemat hanya di Yuraa Store!`,
    features: [
      'KUALITAS ULTRA HD 4K & HDR10',
      'SUBTITLE INDONESIA LENGKAP',
      'BISA DI SMART TV DAN HP',
      'GARANSI 100% AMAN & RESMI'
    ],
    rules: [
      'Gunakan profil yang telah diberikan',
      'Jangan edit pengaturan billing akun'
    ],
    variants: [
      {
        id: 'prime-sharing-1m',
        name: 'SHARING 1 BULAN (HP / PC / TV)',
        price: 8500,
        originalPrice: 12750,
        stock: 12,
        durationDays: 30,
        description: '1 profil pribadi, hemat terlaris'
      },
      {
        id: 'prime-private-1m',
        name: 'PRIVATE FULL AKUN 1 BULAN',
        price: 29000,
        originalPrice: 45000,
        stock: 8,
        durationDays: 30,
        description: 'Akun milik sendiri bebas profil'
      }
    ]
  },
  {
    id: 'disney-hotstar',
    name: 'Disney+ Hotstar Premium',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 24900,
    originalPrice: 37350,
    soldCount: 2325,
    stockCount: 5,
    isTrending: true,
    isUrgent: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#113CCF',
    iconType: 'disney',
    description: `✨ Disney+ Hotstar Premium
Store: Yuraa Store

Akses seluruh semesta Marvel Studios, Star Wars, Pixar Animation, Disney Classics, dan Film Indonesia Box Office!

✅ Kualitas 4K Ultra HD & Dolby Atmos
✅ Bisa tonton di Android TV, Web, iOS, Android
✅ Subtitle & Dubbing Indonesia
✅ Garansi aktif 30 hari penuh

Langsung diproses otomatis setelah pembayaran!`,
    features: [
      '4K ULTRA HD + DOLBY VISION',
      'DOLBY ATMOS AUDIO SPASIAL',
      'BEBAS IKLAN 100%',
      'SUPPORT SMART TV & HP'
    ],
    rules: [
      '1 Device aktif bersamaan untuk paket standar',
      'Dilarang membagikan kredensial ke publik'
    ],
    variants: [
      {
        id: 'disney-1m',
        name: 'PREMIUM 1 BULAN (1 DEVICE)',
        price: 24900,
        originalPrice: 37350,
        stock: 5,
        durationDays: 30,
        description: 'Bisa di HP, Laptop, atau Smart TV'
      },
      {
        id: 'disney-3m',
        name: 'PREMIUM 3 BULAN (1 DEVICE)',
        price: 69000,
        originalPrice: 99000,
        stock: 4,
        durationDays: 90,
        description: 'Masa aktif 90 hari garansi penuh'
      }
    ]
  },
  {
    id: 'hbo-max',
    name: 'HBO Max UHD 4K',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 27900,
    originalPrice: 41850,
    soldCount: 2603,
    stockCount: 5,
    isTrending: true,
    isUrgent: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#5822B4',
    iconType: 'hbomax',
    description: `🐉 HBO Max UHD 4K
Store: Yuraa Store

Tonton House of the Dragon, The Last of Us, Harry Potter Universe, DC Comics, dan Warner Bros premier!

✅ Resolusi 4K UHD + HDR10
✅ Audio Dolby 5.1 & Atmos
✅ Subtitle Bahasa Indonesia
✅ Akun legal dengan garansi 100%`,
    features: [
      'KUALITAS ULTRA HD 4K & HDR',
      'SUBTITLE INDO RESMI TERUPDATE',
      'AKUN LEGAL BERGARANSI'
    ],
    rules: ['Gunakan profil yang dialokasikan'],
    variants: [
      {
        id: 'hbo-1m',
        name: 'SHARING 1 BULAN (1 PROFIL)',
        price: 27900,
        originalPrice: 41850,
        stock: 5,
        durationDays: 30,
        description: 'Profil khusus ber-PIN'
      }
    ]
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    category: 'desain',
    categoryLabel: 'Desain & Kreatif',
    price: 9000,
    originalPrice: 13500,
    soldCount: 539,
    stockCount: 14,
    isTrending: true,
    isUrgent: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#00C4CC',
    iconType: 'canva',
    description: `🎨 Canva Pro
Store: Yuraa Store

Buka potensi kreativitas tanpa batas! Semua fitur Canva Pro langsung aktif di akun email pribadi Anda!

✅ Invite langsung ke email pribadi Anda (Desain lama tetap aman)
✅ Magic Studio AI: Background Remover, Magic Eraser, Magic Switch
✅ Akses 100+ Juta foto, font, grafis, dan video premium
✅ Export High Quality PNG transparan & SVG
✅ Full Garansi ganti tim baru jika sewaktu-waktu downgrade`,
    features: [
      'INVITE KE EMAIL PRIBADI AMAN',
      'BACKGROUND REMOVER & AI TOOLS',
      '100+ JUTA ASET PREMIUM BEBAS AKSES',
      'GARANSI RESMI YURAA STORE'
    ],
    rules: [
      'Cantumkan email Canva saat memesan',
      'Cek inbox atau invitation email untuk join tim'
    ],
    variants: [
      {
        id: 'canva-1m',
        name: 'CANVA PRO 1 BULAN (EMAIL SENDIRI)',
        price: 9000,
        originalPrice: 13500,
        stock: 14,
        durationDays: 30,
        description: 'Invite resmi ke email kamu'
      },
      {
        id: 'canva-1y',
        name: 'CANVA PRO 1 TAHUN LIFETIME GARANSI',
        price: 29000,
        originalPrice: 55000,
        stock: 25,
        durationDays: 365,
        description: 'Hemat maksimal, garansi 1 tahun penuh'
      }
    ]
  },
  {
    id: 'viki-rakuten',
    name: 'Viki Rakuten',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 16900,
    originalPrice: 25350,
    soldCount: 64,
    stockCount: 0,
    deliveryType: 'manual',
    deliveryTimeEstimate: 'Proses ±30 Menit',
    brandColor: '#0085FF',
    iconType: 'viki',
    description: `🌸 Viki Rakuten Pass
Store: Yuraa Store

Nonton drama Korea on-going, Drama China historikal, Drama Jepang & Taiwan terlengkap dengan subtitle multi bahasa tercepat!

✅ Standard & Plus Pass
✅ Akses duluan tanpa menunggu episode gratis
✅ Kualitas Full HD 1080p tanpa jeda iklan
✅ Garansi full 30 hari`,
    features: [
      'FULL HD 1080P STREAMING',
      'AKSES DRAMA ONGOING TERCEPAT',
      'SUBTITLE INDONESIA & MULTI-BAHASA'
    ],
    rules: ['Gunakan akun untuk tontonan pribadi'],
    variants: [
      {
        id: 'viki-std-1m',
        name: 'STANDARD PASS 1 BULAN',
        price: 16900,
        originalPrice: 25350,
        stock: 10,
        durationDays: 30,
        description: 'Akses penuh drama Asia ongoing'
      }
    ]
  },
  {
    id: 'loktv',
    name: 'LokTV',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 21500,
    originalPrice: 32250,
    soldCount: 6803,
    stockCount: 18,
    isTrending: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#7C3AED',
    iconType: 'loktv',
    description: `📺 LokTV Smart HD
Store: Yuraa Store

Aplikasi streaming ribuan film bioskop box office dan serial drama populer dengan server kecepatan tinggi.

✅ Kualitas Smart HD TV jernih
✅ Server responsif tanpa buffering
✅ Full unlocked semua koleksi film`,
    features: [
      'SMART HD TV STREAMING',
      'SERVER ANTI BUFFERING CEPAT',
      'GARANSI AKTIF 30 HARI'
    ],
    rules: ['Gunakan login sesuai format'],
    variants: [
      {
        id: 'loktv-vip-1m',
        name: 'VIP SMART HD 1 BULAN',
        price: 21500,
        originalPrice: 32250,
        stock: 18,
        durationDays: 30,
        description: 'Unlocked semua saluran'
      }
    ]
  },
  {
    id: 'viu',
    name: 'Viu',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 12000,
    originalPrice: 18000,
    soldCount: 732,
    stockCount: 35,
    isTrending: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#F59E0B',
    iconType: 'viu',
    description: `💛 Viu Premium VIP
Store: Yuraa Store

Surganya drakor dan variety show Asia! Running Man, Viu Originals Indonesia, dan anime tayang bersamaan dengan Korea!

✅ Bebas iklan pengganggu
✅ Bisa disambungkan ke akun email pribadi Anda
✅ Download episode sepuasnya untuk ditonton offline
✅ Resolusi Full HD 1080p`,
    features: [
      'BEBAS IKLAN 100%',
      'BISA KE EMAIL SENDIRI',
      'DOWNLOAD OFFLINE UNLIMITED',
      'SUPPORT SMARTPHONE & LAPTOP'
    ],
    rules: ['Bisa upgrade akun lama pembeli'],
    variants: [
      {
        id: 'viu-vip-1m',
        name: 'VIU VIP 1 BULAN (AKUN PRIBADI)',
        price: 12000,
        originalPrice: 18000,
        stock: 35,
        durationDays: 30,
        description: 'Bisa email sendiri / email toko'
      },
      {
        id: 'viu-vip-6m',
        name: 'VIU VIP 6 BULAN (SUPER HEMAT)',
        price: 49000,
        originalPrice: 75000,
        stock: 15,
        durationDays: 180,
        description: 'Aktif 6 bulan tenang'
      }
    ]
  },
  {
    id: 'iqiyi-vip',
    name: 'iQIYI VIP',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 11900,
    originalPrice: 17850,
    soldCount: 4262,
    stockCount: 9,
    isTrending: true,
    isUrgent: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#10B981',
    iconType: 'iqiyi',
    description: `🥝 iQIYI VIP Standard
Store: Yuraa Store

Platform drama China romantis & wuxia terbaik! Dilengkapi dengan fitur Dolby Atmos & Vision untuk pengalaman bioskop.

✅ Akses tayang lebih awal untuk episode ongoing
✅ Kualitas 1080p Full HD hingga 4K
✅ Subtitle Indonesia akurat
✅ Garansi full 30 hari`,
    features: [
      'DOLBY ATMOS & VISION',
      'UNLOCK SEMUA DRAMA VIP',
      'DOWNLOAD CEPAT TANPA KUOTA'
    ],
    rules: ['1 Akun 1 Profil Sharing'],
    variants: [
      {
        id: 'iqiyi-std-1m',
        name: 'STANDARD VIP 1 BULAN',
        price: 11900,
        originalPrice: 17850,
        stock: 9,
        durationDays: 30,
        description: 'Full akses VIP 30 hari'
      }
    ]
  },
  {
    id: 'wetv-vip',
    name: 'WeTV VIP',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 13500,
    originalPrice: 20250,
    soldCount: 2166,
    stockCount: 10,
    isTrending: true,
    isUrgent: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#F97316',
    iconType: 'wetv',
    description: `🟠 WeTV VIP
Store: Yuraa Store

Nonton serial original Indonesia viral dan Drama Mandarin terhits!

✅ Fast track tayang lebih awal
✅ Kualitas HD 1080p bebas watermark & iklan
✅ Bisa login di HP dan Laptop`,
    features: [
      'FAST TRACK ACCESS',
      'BEBAS IKLAN 1080P',
      'GARANSI 100% GANTI BARU'
    ],
    rules: ['Login via nomor ponsel / barcode'],
    variants: [
      {
        id: 'wetv-vip-1m',
        name: 'VIP SHARING 1 BULAN',
        price: 13500,
        originalPrice: 20250,
        stock: 10,
        durationDays: 30,
        description: 'Aktif 30 hari legal'
      }
    ]
  },
  {
    id: 'vision-plus',
    name: 'Vision+ Sport',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 28500,
    originalPrice: 42750,
    soldCount: 29,
    stockCount: 0,
    deliveryType: 'manual',
    deliveryTimeEstimate: 'Proses ±30 Menit',
    brandColor: '#06B6D4',
    iconType: 'visionplus',
    description: `⚽ Vision+ Premium Sports
Store: Yuraa Store

Streaming pertandingan sepak bola Timnas Indonesia, AFC Champions League, MotoGP, BWF Badminton, dan tayangan TV kabel.

✅ Saluran olahraga terlengkap di Indonesia
✅ Tayangan jernih tanpa putus
✅ Garansi full 30 hari`,
    features: [
      'LIVE TIMNAS & AFC MATCHES',
      'BWF BADMINTON & MOTOGP',
      'CHANNEL TV NASIONAL LENGKAP'
    ],
    rules: ['Jangan ubah profil'],
    variants: [
      {
        id: 'vision-sport-1m',
        name: 'PREMIUM SPORTS 1 BULAN',
        price: 28500,
        originalPrice: 42750,
        stock: 8,
        durationDays: 30,
        description: 'Siaran langsung olahraga terlengkap'
      }
    ]
  },
  {
    id: 'youtube-premium',
    name: 'Youtube Premium',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 19900,
    originalPrice: 29850,
    soldCount: 696,
    stockCount: 0,
    isTrending: true,
    isSoldOut: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#FF0000',
    iconType: 'youtube',
    description: `🔴 YouTube Premium + Music
Store: Yuraa Store

Nonton YouTube tanpa gangguan iklan sedikitpun, dengan fitur putar di latar belakang (background playback) dan download offline!

✅ Bebas iklan di semua video
✅ Putar video sambil buka WhatsApp atau kunci layar
✅ Termasuk YouTube Music Premium gratis
✅ Download video kualitas Full HD`,
    features: [
      'BEBAS IKLAN VIDEO 100%',
      'BACKGROUND PLAYBACK',
      'TERMASUK YOUTUBE MUSIC',
      'DOWNLOAD OFFLINE FULL HD'
    ],
    rules: ['Invite Family Plan ke email Google Anda'],
    variants: [
      {
        id: 'yt-prem-1m',
        name: 'FAMILY INVITATION 1 BULAN',
        price: 19900,
        originalPrice: 29850,
        stock: 0,
        durationDays: 30,
        description: 'Stok sedang habis'
      }
    ]
  },
  {
    id: 'vidio-premier',
    name: 'Vidio Premier Platinum',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 19890,
    originalPrice: 29835,
    soldCount: 2846,
    stockCount: 3,
    isTrending: true,
    isUrgent: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#E61E54',
    iconType: 'vidio',
    description: `⚽ Vidio Premier Platinum
Store: Yuraa Store

Saksikan Liga 1 BRI, Piala Dunia, Vidio Original Series hits, dan channel TV Indonesia premium.

✅ Kualitas Full HD jernih
✅ Bebas jeda iklan
✅ Support HP, Tablet, Laptop, dan Smart TV`,
    features: [
      'LIGA 1 INDONESIA & BRI LEAGUE',
      'ORIGINAL SERIES EKSKLUSIF',
      'SUPPORT SEMUA DEVICE'
    ],
    rules: ['Gunakan profil yang dibagikan'],
    variants: [
      {
        id: 'vidio-plat-1m',
        name: 'PLATINUM 1 BULAN (ALL DEVICE)',
        price: 19890,
        originalPrice: 29835,
        stock: 3,
        durationDays: 30,
        description: 'Serial & drama platinum'
      },
      {
        id: 'vidio-diamond-1m',
        name: 'DIAMOND 1 BULAN (EPL LIGA INGGRIS)',
        price: 49000,
        originalPrice: 79000,
        stock: 5,
        durationDays: 30,
        description: 'Termasuk siaran langsung Liga Inggris'
      }
    ]
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    category: 'musik',
    categoryLabel: 'Musik & Audio',
    price: 21000,
    originalPrice: 35000,
    soldCount: 1120,
    stockCount: 15,
    isTrending: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#FA233B',
    iconType: 'applemusic',
    description: `🍎 Apple Music Lossless
Store: Yuraa Store

Audio lossless kualitas studio hingga 24-bit/192kHz dan Spatial Audio Dolby Atmos untuk pengalaman mendengarkan musik terbaik!`,
    features: [
      'LOSSLESS & HI-RES AUDIO',
      'SPATIAL AUDIO DOLBY ATMOS',
      'SUPPORT IPHONE & ANDROID'
    ],
    rules: ['Region Apple ID harus Indonesia'],
    variants: [
      {
        id: 'am-fam-1m',
        name: 'FAMILY INVITATION 1 BULAN',
        price: 21000,
        originalPrice: 35000,
        stock: 15,
        durationDays: 30,
        description: 'Invite resmi ke Apple ID kamu'
      }
    ]
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus / OpenAI',
    category: 'desain',
    categoryLabel: 'Desain & Kreatif',
    price: 45000,
    originalPrice: 65000,
    soldCount: 3410,
    stockCount: 8,
    isTrending: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#10A37F',
    iconType: 'chatgpt',
    description: `🤖 ChatGPT Plus (GPT-4o)
Store: Yuraa Store

Akses model kecerdasan buatan nomor 1 di dunia! Dilengkapi dengan browsing, image generation DALL-E, data analysis dan voice mode.`,
    features: [
      'AKSES MODEL GPT-4o TERBARU',
      'DALL-E 3 GENERASI GAMBAR',
      'RESPONS CEPAT PRIORITAS'
    ],
    rules: ['Akun login diberikan seller'],
    variants: [
      {
        id: 'gpt-share-1m',
        name: 'SHARING 1 BULAN (FULL FITUR)',
        price: 45000,
        originalPrice: 65000,
        stock: 8,
        durationDays: 30,
        description: 'Akses penuh GPT-4o'
      }
    ]
  },
  {
    id: 'capcut-pro',
    name: 'CapCut Pro',
    category: 'desain',
    categoryLabel: 'Desain & Kreatif',
    price: 17500,
    originalPrice: 28000,
    soldCount: 2190,
    stockCount: 11,
    isTrending: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#000000',
    iconType: 'capcut',
    description: `✂️ CapCut Pro
Store: Yuraa Store

Edit video TikTok dan Reels tanpa watermark! Unlock efek sinematik premium, auto-captions, dan template viral.`,
    features: [
      'EXPORT 4K TANPA WATERMARK',
      'AUTO CAPTIONS OTOMATIS',
      'RATUSAN FILTER & EFEK PRO'
    ],
    rules: ['Bisa di Android, iPhone & PC'],
    variants: [
      {
        id: 'capcut-1m',
        name: 'PRO ACCOUNT 1 BULAN (HP & PC)',
        price: 17500,
        originalPrice: 28000,
        stock: 11,
        durationDays: 30,
        description: 'Aktif 30 hari'
      }
    ]
  },
  {
    id: 'nordvpn-premium',
    name: 'NordVPN Premium 2026',
    category: 'vpn',
    categoryLabel: 'VPN & Cloud',
    price: 29000,
    originalPrice: 45000,
    soldCount: 980,
    stockCount: 16,
    isTrending: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#4687FF',
    iconType: 'nordvpn',
    description: `🛡️ NordVPN Premium
Store: Yuraa Store

Keamanan internet kelas militer dan bypass blokir streaming di seluruh dunia dengan 6000+ server super cepat.`,
    features: [
      'ENKRIPSI MILITER AES-256',
      'BYPASS BLOKIR REGION STREAMING',
      'SPEED TINGGI UNLIMITED BANDWIDTH'
    ],
    rules: ['1 device per session'],
    variants: [
      {
        id: 'nordvpn-1m',
        name: '1 BULAN 1 DEVICE PRIVATE',
        price: 29000,
        originalPrice: 45000,
        stock: 16,
        durationDays: 30,
        description: 'Koneksi aman 30 hari'
      }
    ]
  },
  {
    id: 'pulsa-tsel-25k',
    name: 'Telkomsel Pulsa Reguler 25.000',
    category: 'pulsa',
    categoryLabel: 'Pulsa',
    price: 24800,
    originalPrice: 26500,
    soldCount: 5670,
    stockCount: 99,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#ED0226',
    iconType: 'telkomsel',
    description: `📲 Telkomsel Pulsa Reguler
Store: Yuraa Store

Isi pulsa SimPATI, Kartu As, Loop, dan By.U. Menambah masa aktif kartu 30 hari. Pengiriman instan otomatis!`,
    features: [
      'PENGIRIMAN 1-5 DETIK OTOMATIS',
      'MENAMBAH MASA AKTIF KARTU',
      'HARGA DI BAWAH NOMINAL PULSA'
    ],
    rules: ['Pastikan nomor tidak dalam masa tenggang'],
    variants: [
      {
        id: 'tsel-25k',
        name: 'PULSA RP 25.000',
        price: 24800,
        originalPrice: 26500,
        stock: 99,
        durationDays: 30,
        description: 'Pulsa reguler Telkomsel'
      },
      {
        id: 'tsel-50k',
        name: 'PULSA RP 50.000',
        price: 49500,
        originalPrice: 52000,
        stock: 99,
        durationDays: 45,
        description: 'Pulsa reguler Telkomsel'
      },
      {
        id: 'tsel-100k',
        name: 'PULSA RP 100.000',
        price: 98500,
        originalPrice: 102000,
        stock: 99,
        durationDays: 60,
        description: 'Pulsa reguler Telkomsel'
      }
    ]
  },
  {
    id: 'pulsa-isat-25k',
    name: 'Indosat Pulsa Reguler 25.000',
    category: 'pulsa',
    categoryLabel: 'Pulsa',
    price: 24500,
    originalPrice: 26000,
    soldCount: 4320,
    stockCount: 88,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#FFCB05',
    iconType: 'indosat',
    description: `📱 IM3 Ooredoo Pulsa Reguler
Store: Yuraa Store

Isi pulsa Indosat IM3 dengan tarif agen termurah. Otomatis masuk ke nomor HP tujuan.`,
    features: [
      'MENAMBAH MASA AKTIF INDOSAT',
      'MASUK KILAT 24 JAM OTOMATIS'
    ],
    rules: ['Nomor Indosat benar dan aktif'],
    variants: [
      {
        id: 'isat-25k',
        name: 'PULSA RP 25.000',
        price: 24500,
        originalPrice: 26000,
        stock: 88,
        durationDays: 30,
        description: 'Pulsa IM3 Ooredoo'
      },
      {
        id: 'isat-50k',
        name: 'PULSA RP 50.000',
        price: 49200,
        originalPrice: 51500,
        stock: 88,
        durationDays: 45,
        description: 'Pulsa IM3 Ooredoo'
      }
    ]
  },
  {
    id: 'pulsa-xl-25k',
    name: 'XL & AXIS Pulsa Reguler 25.000',
    category: 'pulsa',
    categoryLabel: 'Pulsa',
    price: 24600,
    originalPrice: 26000,
    soldCount: 3100,
    stockCount: 75,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#00529C',
    iconType: 'xl',
    description: `📶 XL & AXIS Pulsa
Store: Yuraa Store

Isi pulsa reguler XL dan AXIS harga grosir langsung dari distributor resmi.`,
    features: [
      'PROSES INSTAN 24 JAM',
      'PERPANJANG MASA AKTIF NOMOR'
    ],
    rules: ['Periksa nomor sebelum checkout'],
    variants: [
      {
        id: 'xl-25k',
        name: 'PULSA RP 25.000',
        price: 24600,
        originalPrice: 26000,
        stock: 75,
        durationDays: 30,
        description: 'Pulsa XL / AXIS'
      }
    ]
  },
  {
    id: 'data-tsel-omg',
    name: 'Paket Data Telkomsel OMG! 20GB',
    category: 'paket_data',
    categoryLabel: 'Paket Data',
    price: 58500,
    originalPrice: 65000,
    soldCount: 1920,
    stockCount: 40,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#ED0226',
    iconType: 'telkomsel_data',
    description: `🌐 Telkomsel OMG! 20GB 30 Hari
Store: Yuraa Store

Kuota 20GB (15GB Kuota Utama 24 Jam Nasional + 5GB Kuota OMG YouTube, TikTok, Sosmed). Masa aktif 30 Hari.`,
    features: [
      '15GB KUOTA UTAMA 24 JAM',
      '5GB KUOTA OMG SOSMED & NONTON',
      'MASA AKTIF 30 HARI PENUH'
    ],
    rules: ['Nomor Telkomsel tidak dalam masa tenggang'],
    variants: [
      {
        id: 'tsel-omg-20gb',
        name: 'TELKOMSEL OMG! 20GB / 30 HARI',
        price: 58500,
        originalPrice: 65000,
        stock: 40,
        durationDays: 30,
        description: '15GB Utama + 5GB OMG'
      },
      {
        id: 'tsel-omg-35gb',
        name: 'TELKOMSEL OMG! 35GB / 30 HARI',
        price: 89000,
        originalPrice: 105000,
        stock: 30,
        durationDays: 30,
        description: '28GB Utama + 7GB OMG'
      }
    ]
  },
  {
    id: 'data-isat-freedom',
    name: 'Paket Data Indosat Freedom 30GB',
    category: 'paket_data',
    categoryLabel: 'Paket Data',
    price: 53000,
    originalPrice: 60000,
    soldCount: 1480,
    stockCount: 35,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#FFCB05',
    iconType: 'indosat_data',
    description: `🌐 Indosat Freedom Internet 30GB
Store: Yuraa Store

Kuota Utama 30GB 24 Jam di semua jaringan 2G/3G/4G/5G tanpa pembagian waktu ataupun wilayah.`,
    features: [
      '30GB FULL KUOTA UTAMA 24 JAM',
      'GRATIS TELPON KE SESAMA IM3 & TRI',
      'MASA AKTIF 30 HARI'
    ],
    rules: ['Nomor Indosat aktif'],
    variants: [
      {
        id: 'isat-freedom-30gb',
        name: 'FREEDOM INTERNET 30GB / 30 HARI',
        price: 53000,
        originalPrice: 60000,
        stock: 35,
        durationDays: 30,
        description: 'Full kuota 24 jam'
      }
    ]
  },
  {
    id: 'duolingo-super',
    name: 'Duolingo Super VIP',
    category: 'desain',
    categoryLabel: 'Desain & Kreatif',
    price: 15000,
    originalPrice: 25000,
    soldCount: 654,
    stockCount: 22,
    isTrending: true,
    deliveryType: 'instant',
    deliveryTimeEstimate: 'Bayar Langsung Kirim',
    brandColor: '#58CC02',
    iconType: 'duolingo',
    description: `🦉 Duolingo Super
Store: Yuraa Store

Belajar bahasa Inggris, Jepang, Mandarin, dan puluhan bahasa lain tanpa batas hati (Unlimited Hearts)!

✅ Unlimited Hearts bebas salah
✅ Tanpa iklan pengganggu
✅ Review latihan kesalahan pribadi
✅ Invite Family ke email Duolingo Anda`,
    features: [
      'UNLIMITED HEARTS (HATI TAK TERBATAS)',
      'BEBAS IKLAN 100%',
      'INVITE FAMILY AMAN KE EMAIL PRIBADI'
    ],
    rules: ['Kirim email Duolingo saat order'],
    variants: [
      {
        id: 'duo-super-1m',
        name: 'SUPER DUOLINGO 1 BULAN',
        price: 15000,
        originalPrice: 25000,
        stock: 22,
        durationDays: 30,
        description: 'Belajar tanpa batasan'
      }
    ]
  },
  {
    id: 'bstation-premium',
    name: 'Bstation / Bilibili Premium',
    category: 'streaming',
    categoryLabel: 'Streaming',
    price: 14500,
    originalPrice: 22000,
    soldCount: 1430,
    stockCount: 19,
    deliveryType: 'manual',
    deliveryTimeEstimate: 'Proses ±30 Menit',
    brandColor: '#23ADE5',
    iconType: 'bstation',
    description: `📺 Bstation / Bilibili Premium
Store: Yuraa Store

Platform streaming anime nomor 1 di Asia! Tonton anime ongoing dengan resolusi 4K 60FPS dan audio Dolby Atmos!`,
    features: [
      'KUALITAS 4K 60FPS & DOLBY AUDIO',
      'ANIME TAYANG SERENTAK',
      'BEBAS IKLAN'
    ],
    rules: ['Akun login disiapkan seller'],
    variants: [
      {
        id: 'bstation-1m',
        name: 'PREMIUM VIP 1 BULAN',
        price: 14500,
        originalPrice: 22000,
        stock: 19,
        durationDays: 30,
        description: 'Aktif 30 hari legal'
      }
    ]
  },
  {
    id: 'grammarly-premium',
    name: 'Grammarly Premium',
    category: 'desain',
    categoryLabel: 'Desain & Kreatif',
    price: 18000,
    originalPrice: 30000,
    soldCount: 890,
    stockCount: 12,
    deliveryType: 'manual',
    deliveryTimeEstimate: 'Proses ±30 Menit',
    brandColor: '#15C39A',
    iconType: 'grammarly',
    description: `✍️ Grammarly Premium Business
Store: Yuraa Store

Perbaiki tata bahasa, struktur kalimat, nada bicara, serta cek plagiarisme tulisan esai dan dokumen kerja internasional.`,
    features: [
      'ADVANCED GRAMMAR & VOCABULARY',
      'PLAGIARISM CHECKER AKSES PENUH',
      'TONE ADJUSTMENT'
    ],
    rules: ['Akun sharing bisnis aman'],
    variants: [
      {
        id: 'grammarly-1m',
        name: 'SHARING BISNIS 1 BULAN',
        price: 18000,
        originalPrice: 30000,
        stock: 12,
        durationDays: 30,
        description: 'Akses penuh fitur premium'
      }
    ]
  },
  {
    id: 'truecaller-gold',
    name: 'Truecaller Gold Premium',
    category: 'vpn',
    categoryLabel: 'VPN & Cloud',
    price: 12000,
    originalPrice: 20000,
    soldCount: 410,
    stockCount: 7,
    deliveryType: 'manual',
    deliveryTimeEstimate: 'Proses ±30 Menit',
    brandColor: '#D4AF37',
    iconType: 'truecaller',
    description: `⭐ Truecaller Gold Premium
Store: Yuraa Store

Identifikasi panggilan telepon emas (Gold Caller ID), auto-block nomor spam dan penipuan, serta fitur Incognito.`,
    features: [
      'GOLD CALLER ID EKSKLUSIF',
      'BLOKIR SPAM OTOMATIS TINGKAT LANJUT',
      'WHO VIEWED MY PROFILE'
    ],
    rules: ['Khusus pengguna Android'],
    variants: [
      {
        id: 'truecaller-1m',
        name: 'GOLD PLAN 1 BULAN',
        price: 12000,
        originalPrice: 20000,
        stock: 7,
        durationDays: 30,
        description: 'Status Gold aktif'
      }
    ]
  }
];
