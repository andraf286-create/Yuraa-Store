import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Send, X, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

export interface EmailToastData {
  id: string;
  email: string;
  invoiceNumber: string;
  customerName: string;
  itemsSummary: string;
  isRoblox?: boolean;
}

interface EmailCredentialsSentToastProps {
  toast: EmailToastData | null;
  onClose: () => void;
  onViewDetails?: () => void;
}

export const EmailCredentialsSentToast: React.FC<EmailCredentialsSentToastProps> = ({
  toast,
  onClose,
  onViewDetails,
}) => {
  const [isSending, setIsSending] = useState(true);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!toast) return;

    // Reset sending state when a new toast arrives
    setIsSending(true);
    setProgress(20);

    const step1 = setTimeout(() => {
      setProgress(65);
    }, 400);

    const step2 = setTimeout(() => {
      setProgress(100);
      setIsSending(false);
    }, 1100);

    // Auto-dismiss after 8 seconds
    const dismissTimer = setTimeout(() => {
      onClose();
    }, 8500);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(dismissTimer);
    };
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 sm:right-6 z-[100] max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="relative rounded-2xl bg-[#0b1324]/95 backdrop-blur-xl border border-blue-500/50 p-4 shadow-2xl shadow-blue-500/20 text-slate-100 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                isSending
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/20'
              }`}
            >
              {isSending ? (
                <Send className="w-4 h-4 animate-bounce text-blue-400" />
              ) : (
                <Mail className="w-4 h-4 text-emerald-400 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  {isSending ? 'Mengirim ke Email...' : 'Kredensial Terkirim ke Email!'}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono border ${
                    isSending
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {isSending ? 'PROSES' : 'TERKIRIM'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Invoice #{toast.invoiceNumber}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar (smooth visual sending) */}
        {isSending && (
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden my-2.5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Content Body */}
        <div className="pt-2.5 space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono">
            <span className="text-slate-400 truncate">Email Tujuan:</span>
            <span className="font-bold text-cyan-300 truncate select-all">{toast.email}</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            {toast.isRoblox ? (
              <>
                Detail pesanan Top Up Robux &amp; status pengisian telah dikirimkan ke email{' '}
                <strong className="text-white font-mono">{toast.email}</strong>. Cek folder Inbox atau Spam!
              </>
            ) : (
              <>
                Username, password, dan panduan profil akun <strong className="text-white">{toast.itemsSummary}</strong>{' '}
                telah dikirim otomatis ke <strong className="text-white font-mono">{toast.email}</strong>.
              </>
            )}
          </p>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Garansi 100% Aktif
            </span>
            <span className="text-slate-500">Otomatis terkirim oleh Yuraa Mailer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
