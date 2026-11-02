import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google GenAI if key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// AI Sales Assistant endpoint
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  const getFallbackAnswer = (query: string): string => {
    const q = query.toLowerCase();

    // 1. Sharing vs Private
    if (
      q.includes('sharing') ||
      q.includes('private') ||
      q.includes('beda') ||
      q.includes('perbedaan') ||
      q.includes('profil')
    ) {
      return `Halo Kak! 🐼 Berikut perbedaan jelas antara **Sharing Profile** dan **Private Profile** di Yuraa Store:

👥 **Sharing Profile**:
• 1 profil digunakan oleh 2 orang pengguna secara bergantian.
• **Kelebihan**: Harga sangat hemat & terjangkau (contoh Netflix UHD 4K cuma Rp 28.500/bulan!).
• **Kualitas**: Tetap Ultra HD 4K jernih.
• **Catatan**: Ada potensi mengalami *limit screen* (layar penuh) jika ditonton bersamaan di saat yang sama.

👤 **Private Profile**:
• 1 profil khusus hanya untuk Kakak seorang (eksklusif 1 pengguna).
• **Kelebihan**: Jauh lebih nyaman, bebas pasang PIN profil sendiri, dan anti limit screen!
• **Rekomendasi**: Sangat cocok jika Kakak ingin nonton santai kapan pun tanpa gangguan.

Keduanya bergaransi resmi 100% Full Replace dari Yuraa Store ya Kak! Mau pesan yang mana hari ini? 😊`;
    }

    // 2. Roblox & Robux Top Up
    if (
      q.includes('robux') ||
      q.includes('roblox') ||
      q.includes('gamepass') ||
      q.includes('game')
    ) {
      return `Halo Kak! 🎮 Top up **Robux di Yuraa Store** super kilat hanya perlu **±5 menit** aja (nggak perlu nunggu 5 hari baru masuk!).

Tersedia 3 metode pilihan resmi:
🛡️ **1. Robux Via Link Gamepass (HANYA USERNAME)**:
• Tidak perlu password sama sekali! 100% aman anti hack.
• Pajak resmi 30% ditanggung toko, Robux bersih masuk ke akun!
• Harga: 500 R$ (Rp 35.500) s/d 5.000 R$ (Rp 363.000).

⚡ **2. Robux Via Login Kilat (Username & Pw)**:
• Langsung masuk akun tanpa repot bikin gamepass.
• Data sandi dienkripsi & langsung dihapus setelah pengisian.
• Harga: 500 R$ (Rp 39.500) s/d 5.000 R$ (Rp 377.000).

⭐ **3. Roblox Subs Premium**:
• Dapatkan badge Premium resmi di profil, bonus 10% Robux extra tiap beli game, dan benefit trading!
• 500 R$ (Rp 50.000) | 1000 R$ (Rp 110.000) | 2200 R$ (Rp 209.000).

Pembayaran via **DANA 08984436849** atau QRIS. Robux langsung kami kirim dalam 5 menit ya Kak! 🐼⚡`;
    }

    // 3. Netflix
    if (q.includes('netflix') || q.includes('nonton') || q.includes('film')) {
      return `Halo Kak! 🎬 Untuk **Netflix Premium UHD 4K**, kami ada pilihan paket:
• **Sharing Profile 1 Bulan**: Rp 28.500 (hemat, 4K Ultra HD)
• **Private Profile 1 Bulan**: Rp 47.500 (khusus 1 user, bebas limit screen)
• **Sharing Profile 3 Bulan**: Rp 82.500 (hemat 3 bulan nonstop)
• **Full Akun Private (4 Screen)**: Rp 139.000 (bisa bikin 5 profil & nonton 4 layar bersamaan)

Semua bergaransi full replace dan support di HP, Laptop, Tablet, & Smart TV Kak! 🐼`;
    }

    // 4. Pembayaran & DANA
    if (
      q.includes('dana') ||
      q.includes('bayar') ||
      q.includes('pembayaran') ||
      q.includes('rekening') ||
      q.includes('qris') ||
      q.includes('transfer')
    ) {
      return `Halo Kak! 💳 Pembayaran di Yuraa Store sangat mudah:
• **DANA**: \`08984436849\` (A/N YURAA STORE)
• **QRIS Instan**: Scan langsung via BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay.

Setelah transfer, klik tombol **"Kirim Bukti Pembayaran ke WhatsApp"** di website kami atau hubungi WA **08984436849** agar pesanan langsung kami verifikasi & kirimkan secepat kilat! ⚡`;
    }

    // 5. Spotify & Musik
    if (q.includes('spotify') || q.includes('lagu') || q.includes('musik')) {
      return `Untuk **Spotify Premium** kami ada:
• **Family Invite 1 Bulan**: Rp 18.500 (Invite resmi ke email pribadi)
• **Individual Plan 1 Bulan**: Rp 28.000

Bebas iklan, download lagu offline, kualitas audio Extreme 320 kbps! 🎵`;
    }

    // 6. Canva & Desain
    if (q.includes('canva') || q.includes('desain')) {
      return `🎨 **Canva Pro** di Yuraa Store:
• 1 Bulan: Rp 9.000
• 1 Tahun Lifetime: Rp 29.000

Langsung invite ke email pribadi Kakak, riwayat desain lama tetap aman & semua template pro + AI background remover aktif!`;
    }

    // 7. Garansi & Legalitas
    if (q.includes('garansi') || q.includes('aman') || q.includes('legal') || q.includes('banned') || q.includes('resmi')) {
      return `🛡️ **GARANSI 100% Full Replace** di Yuraa Store Kak!
Semua akun dan top up Robux kami legal & resmi dibeli melalui jalur official. Jika ada kendala login, limit screen, atau error sebelum masa aktif habis, silakan hubungi WhatsApp kami di **08984436849**, tim admin langsung bantu ganti baru! 🐼`;
    }

    return `Halo Kak! 🐼 Saya **Yuraa Panda AI**, asisten jualan resmi Yuraa Store.
Ada yang bisa saya bantu?
• Rekomendasi akun streaming (Netflix, Prime, Disney+, HBO Max)
• Top Up Robux kilat 5 menit (Via Gamepass / Via Login / Subs Premium)
• Perbedaan akun Sharing vs Private
• Pembayaran via DANA (08984436849) atau scan QRIS

Silakan tanyakan pertanyaan atau keluhan Kakak, saya siap bantu! 😊`;
  };

  try {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    if (!ai || !process.env.GEMINI_API_KEY) {
      const fallbackReply = getFallbackAnswer(lastUserMessage);
      return res.json({ reply: fallbackReply });
    }

    // Call Gemini API via @google/genai SDK
    const systemInstruction = `Kamu adalah 'Yuraa Panda AI', asisten jualan resmi dari Yuraa Store (yuraastore.id).
Toko ini menjual akun langganan premium digital (Netflix UHD 4K, Spotify, Prime Video, Disney+, HBO Max, Viu, Canva, YouTube, ChatGPT, Vidio, Pulsa) dan TOP UP ROBUX ROBLOX KILAT 5 MENIT.
Nomor DANA Pembayaran toko: 08984436849 (A/N YURAA STORE).
WhatsApp CS: 08984436849 (+62 898-4436-849).

Pengetahuan Produk Penting:
1. PERBEDAAN SHARING VS PRIVATE:
- Sharing Profile: 1 profil digunakan berdua (2 pengguna). Harga paling hemat (Netflix Rp 28.500/bln), kualitas 4K UHD, tapi ada kemungkinan limit screen jika dipakai bersamaan.
- Private Profile: 1 profil khusus 1 pengguna (hanya pembeli sendiri). Bebas pasang PIN profil, nyaman, anti limit screen (Netflix Rp 47.500/bln).

2. TOP UP ROBUX ROBLOX (PROSES 5 MENIT, ANTI NUNGGU 5 HARI!):
- Robux Via Link Gamepass: Hanya butuh Username Roblox (tanpa password!). Pajak 30% ditanggung toko, Robux bersih masuk. Harga mulai 500 R$ (Rp 35.500) sampai 5.000 R$ (Rp 363.000).
- Robux Via Login: Butuh Username & Password Roblox. Cocok jika tidak mau buat gamepass. Harga mulai 500 R$ (Rp 39.500) sampai 5.000 R$ (Rp 377.000).
- Roblox Subs Premium: Butuh Username & Password. Dapatkan badge Premium di avatar, bonus 10% Robux extra tiap belanja game, dan bonus Robux (500 R$ Rp 50.000 | 1000 R$ Rp 110.000 | 2200 R$ Rp 209.000).

3. PEMBAYARAN:
- Transfer DANA ke 08984436849 (A/N YURAA STORE) atau Scan QRIS Instan.
- Kirim bukti pembayaran ke WhatsApp toko (08984436849) untuk verifikasi instan.

4. GARANSI:
- Garansi 100% Full Replace selama periode aktif.

Aturan Karakter & Jawaban:
1. Panggil customer dengan panggilan 'Kak' atau 'Sahabat Yuraa'.
2. Gunakan emoji panda 🐼 dan bahasa Indonesia yang ramah, sopan, jelas, terstruktur (bullet points), dan meyakinkan.
3. Jawab keluhan dan pertanyaan customer secara akurat sesuai konteks toko!`;

    const chatHistory = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: chatHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || getFallbackAnswer(lastUserMessage);
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error generating assistant reply:', error);
    const lastUserMessage = req.body?.messages?.slice(-1)[0]?.content || '';
    const fallbackAnswer = getFallbackAnswer(lastUserMessage);
    return res.json({ reply: fallbackAnswer });
  }
});

// Vite Middleware for dev & static for prod
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    // SPA Fallback for all unknown routes (including 404 handled gracefully on frontend)
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Yuraa Store server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
