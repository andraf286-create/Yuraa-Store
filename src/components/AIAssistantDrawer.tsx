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

Ada yang bisa saya bantu carikan hari ini?
• Butuh rekomendasi akun streaming (Netflix, Prime, Disney+)?
• Mau tahu perbedaan akun Sharing vs Private?
• Cara pembayaran instan via **DANA 08984436849** atau QRIS?

Tanyakan apa saja ya Kak! 😊`,
      timestamp: 'Baru saja',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Rekomendasi Netflix UHD 4K',
    'Beda Sharing vs Private profile',
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

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Halo Kak, ada yang bisa saya bantu lagi seputar akun premium Yuraa Store? 🐼',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat failed:', err);
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `Halo Kak! 🐼 Yuraa Store siap melayani Anda. Untuk memesan langsung, silakan pilih produk di katalog dan transfer ke DANA \`${STORE_INFO.danaNumber}\` (A/N ${STORE_INFO.danaName}) atau hubungi WhatsApp kami di ${STORE_INFO.whatsappDisplay} ya!`,
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
