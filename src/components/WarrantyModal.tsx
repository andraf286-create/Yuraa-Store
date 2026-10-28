import React, { useState } from 'react';
import { X, ShieldCheck, MessageCircle, AlertCircle, Send } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface WarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WarrantyModal: React.FC<WarrantyModalProps> = ({ isOpen, onClose }) => {
  const [invoice, setInvoice] = useState('');
  const [issue, setIssue] = useState('Password berubah / tidak bisa login');
  const [whatsapp, setWhatsapp] = useState('');
  const [detail, setDetail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Halo Tim Garansi Yuraa Store 🐼🛡️, saya mau klaim garansi:
- No. Invoice / Email: ${invoice || '-'}
- Kendala: ${issue}
- No. WhatsApp: ${whatsapp || '-'}
- Detail Tambahan: ${detail || '-'}

Mohon bantuan perbaikan / ganti akun baru ya Kak, terima kasih!`;

    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-700 p-6 text-slate-100 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            <h3 className="font-extrabold text-base text-white">Form Klaim Garansi 100%</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Nomor Invoice atau Email Akun *
            </label>
            <input
              type="text"
              required
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              placeholder="Contoh: YURA-261028-9123 atau email@kamu.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Pilih Jenis Kendala *
            </label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="Password berubah / tidak bisa login">Password berubah / tidak bisa login</option>
              <option value="Limit Screen / Terlalu banyak device">Limit Screen / Terlalu banyak device</option>
              <option value="Akun mendadak expired sebelum waktunya">Akun mendadak expired sebelum waktunya</option>
              <option value="Profil akun tertukar / terhapus">Profil akun tertukar / terhapus</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Nomor WhatsApp Anda *
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="08123456789"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Keterangan Tambahan
            </label>
            <textarea
              rows={2}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Jelaskan detail kendala singkat..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              Kirim Klaim Garansi ke WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
