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
  try {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Smart fallback engine if Gemini key is not set or fails
    const getFallbackAnswer = (query: string): string => {
      const q = query.toLowerCase();
      if (q.includes('netflix')) {
        return `Halo Kak! 🐼 Untuk **Netflix Premium UHD 4K**, kami ada paket:\n• **Sharing Profile 1 Bulan**: Rp 28.500 (1 profile berdua, 4K UHD)\n• **Private Profile 1 Bulan**: Rp 47.500 (1 profile khusus 1 user, bebas limit screen)\n• **Sharing 3 Bulan**: Rp 82.500\n\nSemua bergaransi full replace! Pembayaran bisa langsung via **DANA 08984436849** atau scan QRIS, lalu kirim bukti ke WhatsApp kita ya Kak!`;
      }
      if (q.includes('dana') || q.includes('bayar') || q.includes('pembayaran') || q.includes('rekening') || q.includes('qris')) {
        return `Halo Kak! 💳 Pembayaran di Yuraa Store sangat mudah & aman:\n• **DANA**: \`08984436849\` (A/N YURAA STORE)\n• **QRIS**: Tersedia otomatis di halaman checkout\n\nSetelah transfer, cukup klik tombol **"Kirim Bukti Pembayaran ke WhatsApp"** agar akun langsung kami aktivasi dan kirimkan ke layar & WhatsApp Kakak! 🐼⚡`;
      }
      if (q.includes('sharing') || q.includes('private') || q.includes('beda')) {
        return `Perbedaan Sharing vs Private di Yuraa Store Kak: 🐼\n\n👥 **Sharing Profile**: 1 profil digunakan 2 pengguna secara bergantian. Sangat hemat dan kualitas tetap Ultra HD 4K, namun terkadang ada kemungkinan limit screen jika dipakai bersamaan.\n\n👤 **Private Profile**: 1 profil khusus hanya untuk Kakak seorang! Jauh lebih nyaman, bebas bikin PIN sendiri, dan anti limit screen.\n\nKeduanya bergaransi resmi dari Yuraa Store!`;
      }
      if (q.includes('spotify') || q.includes('lagu') || q.includes('musik')) {
        return `Untuk **Spotify Premium** kami ada:\n• **Family Invite 1 Bulan**: Rp 18.500 (Invite resmi ke email sendiri)\n• **Individual Plan 1 Bulan**: Rp 28.000\n\nBebas iklan, download lagu offline, kualitas audio extreme 320 kbps! Mau diorder sekarang Kak? 🐼`;
      }
      if (q.includes('canva') || q.includes('desain')) {
        return `Kabar gembira Kak! 🎨 **Canva Pro** kami lagi promo:\n• 1 Bulan: Rp 9.000\n• 1 Tahun Lifetime: Rp 29.000\n\nLangsung invite ke email pribadi Kakak, jadi riwayat desain lama tetap aman & semua tools AI/Background remover aktif!`;
      }
      if (q.includes('garansi') || q.includes('aman') || q.includes('legal')) {
        return `Yuraa Store memberikan **GARANSI 100% Full Replace** Kak! 🛡️ Semua akun kami resmi dan legal. Jika terjadi kendala seperti error login atau limit, tinggal hubungi kami via WhatsApp di **08984436849**, tim admin langsung ganti akun baru tanpa ribet! 🐼`;
      }
      return `Halo Kak! 🐼 Saya **Yuraa Panda AI**, asisten jualan resmi Yuraa Store. Ada yang bisa saya bantu carikan? Kami menyediakan Netflix UHD 4K, Spotify, Prime Video, Disney+, Canva Pro, ChatGPT Plus, dan pulsa dengan harga termurah!\n\nPembayaran via **DANA 08984436849** atau QRIS instan bergaransi 100%. Silakan tanya apa saja ya Kak!`;
    };

    if (!ai || !process.env.GEMINI_API_KEY) {
      const fallbackReply = getFallbackAnswer(lastUserMessage);
      return res.json({ reply: fallbackReply });
    }

    // Call Gemini API via @google/genai SDK
    const systemInstruction = `Kamu adalah 'Yuraa Panda AI', asisten jualan resmi dari Yuraa Store (yuraastore.id).
Toko ini menjual akun langganan premium digital (Netflix, Spotify, Prime Video, Disney+, HBO Max, Viu, Canva, YouTube, ChatGPT, Vidio, Pulsa).
Nomor DANA Pembayaran toko: 08984436849 (A/N YURAA STORE).
WhatsApp CS: 08984436849 (+62 898-4436-849).

Aturan Karakter & Jawaban:
1. Panggil customer dengan panggilan 'Kak' atau 'Sahabat Yuraa'.
2. Gunakan emoji panda 🐼 dan gaya ramah, sopan, meyakinkan, dan profesional khas customer service fintech Indonesia.
3. Bantu rekomendasikan paket terbaik (jelaskan perbedaan Sharing vs Private bila ditanyakan).
4. Tekankan bahwa pembayaran utama saat ini adalah transfer DANA ke nomor 08984436849 atau scan QRIS, lalu kirim bukti pembayaran ke WhatsApp agar pesanan langsung diproses kilat.
5. Berikan jawaban yang to-the-point dan jelas tanpa bertele-tele.`;

    const chatHistory = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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
    // Graceful fallback
    const lastUserMessage = req.body?.messages?.slice(-1)[0]?.content || '';
    const fallbackAnswer = `Halo Kak! 🐼 Terima kasih telah menghubungi Yuraa Store. Untuk pemesanan akun premium, Anda bisa langsung memilih variasi produk di katalog dan transfer ke DANA \`08984436849\` (A/N YURAA STORE) atau scan QRIS. Setelah transfer, kirim bukti ke WhatsApp kami di 08984436849 ya Kak!`;
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
