import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { PANDA_ASSETS } from '../utils/assets';
import { STORE_INFO } from '../data/products';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductByName?: (productName: string) => void;
}

export const getLocalAssistantAnswer = (query: string): string => {
  const q = query.toLowerCase();

  // 1. Sharing vs Private
  if (
    q.includes('sharing') ||
    q.includes('private') ||
    q.includes('beda') ||
    q.includes('perbedaan') ||
    q.includes('profil')
  ) {
    return `Halo Kak! 🐼 Berikut perbedaan detail antara **Sharing Profile** dan **Private Profile** di Yuraa Store:

👥 **1. SHARING PROFILE**:
• 1 profil digunakan oleh 2 orang pengguna secara bergantian.
• **Kelebihan**: Harga sangat murah & hemat kantong (contoh Netflix UHD 4K cuma **Rp 28.500/bulan**!).
• **Kualitas**: Kualitas gambar tetap maksimal **4K Ultra HD + HDR**.
• **Catatan**: Karena dipakai berdua, ada kemungkinan terjadi *limit screen* (peringatan terlalu banyak layar) jika diputar bersamaan di jam yang sama.

👤 **2. PRIVATE PROFILE**:
• 1 profil khusus hanya untuk Kakak seorang (eksklusif 1 pengguna).
• **Kelebihan**: Jauh lebih nyaman, bebas pasang PIN profil sendiri, riwayat tontonan pribadi aman, dan **anti limit screen** (bebas nonton kapan saja!).
• **Harga**: Mulai **Rp 47.500/bulan**.

🛡️ Keduanya bergaransi resmi **100% Full Replace** dari Yuraa Store ya Kak! Kakak tertarik ambil yang mana? 😊`;
  }

  // 2. Free Fire Accounts Ready Stock
  if (
    q.includes('fire') ||
    q.includes('free fire') ||
    q.includes('ff') ||
    q.includes('sultan') ||
    q.includes('evogun') ||
    q.includes('monsep')
  ) {
    return `Halo Kak! 🔥 Kami punya **Ready Stock Akun Free Fire Sultan (Anti Hackback)** di Yuraa Store:

🛡️ **Keunggulan Akun FF Yuraa Store**:
• **100% Monsep**: Data akun (email & password) bisa langsung diganti total ke nomor HP & email pribadi Kakak!
• **Garansi Anti Hackback (Anti HB) 30 Hari**: Jaminan replace atau uang kembali jika ada kendala.
• **Kirim Instan**: Begitu bayar via DANA (\`${STORE_INFO.danaNumber}\`), data login langsung muncul di layar & dikirim ke email!
• **Vault Rame, Old & Siap Ranked**: Akun fresh anti cheat.

📋 **Daftar Pilihan Akun FF**:
• **Akun FF Polosan Lv 40+ (Siap Ranked)**: Rp 35.000
• **Akun FF Sultan Old Vault Rame + SG2**: Rp 65.000
• **Akun FF Master + Booyah Pass Aktif**: Rp 95.000
• **Akun FF Sultan Evo Gun Max (AK/MP40)**: Rp 150.000

Stok terbatas ya Kak! Mau langsung pesan sekarang via DANA? 🐼🔥`;
  }

  // 3. Roblox & Robux Top Up
  if (
    q.includes('robux') ||
    q.includes('roblox') ||
    q.includes('gamepass') ||
    q.includes('game')
  ) {
    return `Halo Kak! 🎮 Top Up **Robux di Yuraa Store** super kilat hanya perlu **±5 menit** aja (nggak perlu nunggu 5 hari baru masuk!).

Tersedia 3 metode pilihan resmi & aman:
🛡️ **1. Robux Via Link Gamepass (HANYA USERNAME)**:
• Tidak butuh password sama sekali! 100% aman anti hack.
• Pajak resmi 30% ditanggung toko, Robux bersih masuk ke akun!
• Harga: 500 R$ (Rp 44.900) s/d 5.000 R$ (Rp 399.900).

⚡ **2. Robux Via Login Kilat (Username & Pw)**:
• Langsung masuk akun tanpa repot bikin gamepass.
• Sandi dienkripsi & langsung dihapus otomatis setelah pengisian.
• Harga: 500 R$ (Rp 49.900) s/d 5.000 R$ (Rp 409.900).

⭐ **3. Roblox Subs Premium**:
• Dapatkan badge Premium resmi di avatar, bonus 10% Robux extra tiap belanja game, dan benefit trading!
• 500 R$ (Rp 50.000) | 1000 R$ (Rp 110.000) | 2200 R$ (Rp 209.000).

Pembayaran via **DANA 08984436849**. Robux langsung kami proses dalam 5 menit! ⚡`;
  }

  // 3. Netflix
  if (q.includes('netflix') || q.includes('nonton') || q.includes('film')) {
    return `Halo Kak! 🎬 Untuk **Netflix Premium UHD 4K**, kami ada paket:
• **Sharing Profile 1 Bulan**: Rp 28.500 (hemat, 4K Ultra HD)
• **Private Profile 1 Bulan**: Rp 47.500 (khusus 1 user, bebas limit screen)
• **Sharing Profile 3 Bulan**: Rp 82.500 (hemat 3 bulan nonstop)
• **Full Akun Private (4 Screen)**: Rp 139.000 (bisa bikin 5 profil & nonton 4 layar bersamaan)

Semua bergaransi full replace dan support di Smart TV, HP, Laptop, & Tablet! Mau langsung order Kak? 🐼`;
  }

  // 4. Pembayaran & DANA
  if (
    q.includes('dana') ||
    q.includes('bayar') ||
    q.includes('pembayaran') ||
    q.includes('rekening') ||
    q.includes('transfer')
  ) {
    return `Halo Kak! 💳 Pembayaran di Yuraa Store menggunakan transfer nomor DANA resmi:
• **Nomor DANA**: \`${STORE_INFO.danaNumber}\`
• **Atas Nama**: **${STORE_INFO.danaName}**
• **Biaya Admin**: Bebas Biaya Admin (Rp 0)

Setelah transfer, klik tombol **"Kirim Bukti Pembayaran ke WhatsApp"** di website atau hubungi WA **${STORE_INFO.whatsappDisplay}** agar pesanan langsung diverifikasi & dikirimkan secepat kilat! ⚡`;
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

  // 7. Garansi & Kendala
  if (q.includes('garansi') || q.includes('aman') || q.includes('legal') || q.includes('banned') || q.includes('kendala') || q.includes('error')) {
    return `🛡️ **GARANSI 100% Full Replace** di Yuraa Store Kak!
Semua akun dan top up Robux kami legal & resmi dibeli melalui jalur official. Jika ada kendala login, limit screen, atau error sebelum masa aktif habis, silakan hubungi WhatsApp kami di **${STORE_INFO.whatsappDisplay}**, tim admin langsung bantu ganti baru tanpa ribet! 🐼`;
  }

  return `Halo Kak! 🐼 Saya **Yuraa Panda AI**, asisten jualan resmi Yuraa Store.
Ada yang bisa saya bantu carikan hari ini?
• Tanya perbedaan **Sharing Profile vs Private Profile**
• Top Up **Robux kilat 5 menit** (Via Gamepass / Via Login / Subs Premium)
• Rekomendasi akun streaming (Netflix, Spotify, Prime Video, Disney+)
• Cara pembayaran via **DANA ${STORE_INFO.danaNumber}**

Silakan tanyakan apa saja ya Kak, saya siap menjawab dengan jelas! 😊`;
};

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProductByName,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Halo Kak! 🐼 Saya **Yuraa Panda AI**, asisten jualan resmi Yuraa Store.

Ada yang bisa saya bantu hari ini?
• Ready Stock **Akun Free Fire Sultan (Monsep & Anti HB)**
• Top Up **Robux Roblox kilat 5 menit** (Via Gamepass / Via Login / Subs Premium)
• Tanya **Perbedaan Sharing Profile vs Private Profile**
• Rekomendasi akun Netflix UHD 4K, Spotify, Canva Pro
• Info pembayaran via **DANA 08984436849**

Tanyakan apa saja pertanyaan atau keluhan Kakak ya! 😊`,
      timestamp: 'Baru saja',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Akun Free Fire Sultan Monsep',
    'Top Up Robux kilat 5 menit',
    'Beda Sharing vs Private profile',
    'Rekomendasi Netflix UHD 4K',
    'Cara bayar via DANA 08984436849',
    'Apakah akun legal & bergaransi?',
    'Paket Canva Pro 1 Tahun',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let replyText = '';
      try {
        const response = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.reply) {
            replyText = data.reply;
          }
        }
      } catch (e) {
        console.warn('API fetch warning, using smart local engine:', e);
      }

      if (!replyText) {
        replyText = getLocalAssistantAnswer(query);
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat failed:', err);
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: getLocalAssistantAnswer(query),
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md h-full bg-[#0d1320] border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#111929]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
              <img
                src={PANDA_ASSETS.avatarLogo}
                alt="Panda AI Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">Yuraa Panda AI</h3>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded border border-blue-500/30">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Asisten Jualan Resmi Yuraa Store</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isAI = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isAI
                      ? 'bg-[#152033] border border-slate-700/60 text-slate-200'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-medium'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.content}</div>
                  <div
                    className={`text-[9px] mt-1.5 text-right ${
                      isAI ? 'text-slate-400' : 'text-blue-100'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
                {!isAI && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-[11px] font-medium">Yuraa Panda sedang mengetik...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-[#0b101c] overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700/60 transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-[#111929]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya harga, promo, atau cara order..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#080d16] border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-transform active:scale-95 shadow-md shadow-blue-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
