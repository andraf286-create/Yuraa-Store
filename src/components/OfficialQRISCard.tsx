import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Maximize2, X, Check, Copy, ShieldCheck, Sparkles } from 'lucide-react';

interface OfficialQRISCardProps {
  amount?: number;
  invoiceNumber?: string;
  className?: string;
  showActions?: boolean;
}

export const QRIS_DATA = {
  merchantName: 'ProdukDigitalPremium...',
  fullMerchantName: 'ProdukDigitalPremium',
  nmid: 'ID1026590167098',
  terminal: 'A01',
  dicetakOleh: '93600915',
  versiCetak: '1.0.29.10.26',
  aspiUrl: 'www.aspi-qris.id',
  // Official static QRIS EMV payload for NMID ID1026590167098
  rawPayload:
    '00020101021126660014ID.CO.QRIS.WWW01189360091536009150000215ID10265901670980303UMI51440014ID.CO.QRIS.WWW0215ID10265901670980303UMI5204581253033605802ID5920ProdukDigitalPremium6013Jakarta Pusat61051011062070703A016304F7F5',
};

export const OfficialQRISCard: React.FC<OfficialQRISCardProps> = ({
  amount,
  invoiceNumber,
  className = '',
  showActions = true,
}) => {
  const [qrSvg, setQrSvg] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedNmid, setCopiedNmid] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate clean vector SVG QR Code
    QRCode.toString(QRIS_DATA.rawPayload, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((svg) => {
        setQrSvg(svg);
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
      });
  }, []);

  const handleCopyNmid = () => {
    navigator.clipboard.writeText(QRIS_DATA.nmid);
    setCopiedNmid(true);
    setTimeout(() => setCopiedNmid(false), 2500);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Generate a high-resolution PNG of the placard
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 750;
      canvas.height = 1050;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Faint geometric background pattern
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Red left ribbon
      ctx.fillStyle = '#ea1c24';
      ctx.beginPath();
      ctx.moveTo(0, 220);
      ctx.lineTo(70, 290);
      ctx.lineTo(0, 360);
      ctx.closePath();
      ctx.fill();

      // Top QRIS header
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('QRIS', 40, 70);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText('QR Code Standar', 145, 55);
      ctx.fillText('Pembayaran Nasional', 145, 75);

      // GPN Logo header
      ctx.fillStyle = '#ea1c24';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('GARUDA GPN', 570, 70);

      // Merchant Name
      ctx.textAlign = 'center';
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(QRIS_DATA.merchantName, canvas.width / 2, 140);

      // NMID & Subcode
      ctx.fillStyle = '#4b5563';
      ctx.font = '22px monospace';
      ctx.fillText(`NMID : ${QRIS_DATA.nmid}`, canvas.width / 2, 185);
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(QRIS_DATA.terminal, canvas.width / 2, 225);

      // QR Code
      const qrDataUrl = await QRCode.toDataURL(QRIS_DATA.rawPayload, {
        margin: 1,
        width: 400,
        color: { dark: '#000000', light: '#ffffff' },
      });

      const qrImg = new Image();
      await new Promise((resolve) => {
        qrImg.onload = resolve;
        qrImg.src = qrDataUrl;
      });
      ctx.drawImage(qrImg, (canvas.width - 400) / 2, 260, 400, 400);

      // Satu QRIS untuk semua
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('SATU QRIS UNTUK SEMUA', canvas.width / 2, 710);

      ctx.fillStyle = '#4b5563';
      ctx.font = '18px sans-serif';
      ctx.fillText('Cek aplikasi penyelenggara di:', canvas.width / 2, 745);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(QRIS_DATA.aspiUrl, canvas.width / 2, 775);

      // Footer bottom left
      ctx.textAlign = 'left';
      ctx.fillStyle = '#374151';
      ctx.font = '16px monospace';
      ctx.fillText(`Dicetak oleh: ${QRIS_DATA.dicetakOleh}`, 40, 930);
      ctx.fillText(`Versi cetak: ${QRIS_DATA.versiCetak}`, 40, 960);

      // Footer bottom right red block
      ctx.fillStyle = '#ea1c24';
      ctx.beginPath();
      ctx.moveTo(380, 850);
      ctx.quadraticCurveTo(390, 840, 420, 840);
      ctx.lineTo(canvas.width, 840);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(360, canvas.height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Cara bayar dengan QRIS:', 430, 880);
      ctx.font = '12px sans-serif';
      ctx.fillText('1. Buka Aplikasi QRIS', 430, 920);
      ctx.fillText('2. Scan dan Cek', 430, 950);
      ctx.fillText('3. Bayar & Selesai', 430, 980);

      // Trigger download
      const link = document.createElement('a');
      link.download = `QRIS_ProdukDigitalPremium_${QRIS_DATA.nmid}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download QRIS failed', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Official QRIS Placard Container */}
      <div
        ref={cardRef}
        className="w-full max-w-[340px] sm:max-w-[370px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative text-slate-900 transition-all duration-300"
      >
        {/* Subtle traditional watermark background */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`,
            backgroundSize: '12px 12px',
          }}
        />

        {/* Official Red Left Chevron Flag */}
        <div
          className="absolute left-0 top-[190px] w-6 sm:w-8 h-20 sm:h-24 bg-[#ea1c24] pointer-events-none shadow-md"
          style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
        />

        {/* Top Header: QRIS Logo + GPN Logo */}
        <div className="pt-5 px-5 pb-2 flex items-center justify-between relative z-10 border-b border-slate-100/60">
          {/* Official QRIS Emblem */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {/* QRIS SVG Logo Vector */}
              <div className="relative font-black tracking-tighter text-2xl text-slate-900 leading-none">
                <span className="text-slate-900">QR</span>
                <span className="text-[#ea1c24] font-bold">I</span>
                <span className="text-slate-900">S</span>
              </div>
            </div>
            <div className="text-[9px] font-bold text-slate-700 leading-tight border-l-2 border-slate-300 pl-2">
              <div>QR Code Standar</div>
              <div className="text-slate-900">Pembayaran Nasional</div>
            </div>
          </div>

          {/* GPN Emblem */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-5 flex items-center justify-center">
              {/* Red Garuda Wing SVG */}
              <svg viewBox="0 0 32 20" className="w-full h-full fill-[#ea1c24]">
                <path d="M2 18 C 10 16, 20 10, 30 2 C 26 8, 22 14, 14 17 Z" />
                <path d="M6 18 C 13 14, 18 10, 24 5 C 20 10, 16 15, 10 18 Z" />
              </svg>
            </div>
            <span className="text-[11px] font-black text-slate-900 tracking-wider">GPN</span>
          </div>
        </div>

        {/* Merchant Information */}
        <div className="px-4 pt-3 pb-1 text-center relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
            {QRIS_DATA.merchantName}
          </h2>
          <div className="text-xs sm:text-sm font-mono font-semibold text-slate-600 tracking-wider mt-0.5">
            NMID : <span className="text-slate-900 font-bold">{QRIS_DATA.nmid}</span>
          </div>
          <div className="text-sm font-black text-slate-800 tracking-widest mt-0.5">
            {QRIS_DATA.terminal}
          </div>
        </div>

        {/* QR Code Center Display */}
        <div className="px-6 py-2 flex flex-col items-center justify-center relative z-10">
          <div className="w-56 h-56 sm:w-64 sm:h-64 bg-white p-2 rounded-2xl border border-slate-100 flex items-center justify-center shadow-inner">
            {qrSvg ? (
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full object-contain cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => setIsZoomed(true)}
                title="Klik untuk memperbesar QRIS"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            ) : (
              <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
                Memuat QRIS...
              </div>
            )}
          </div>
        </div>

        {/* Slogan and ASPI verification */}
        <div className="text-center px-4 pt-1 pb-3 relative z-10">
          <p className="text-xs sm:text-sm font-black tracking-widest text-slate-900 uppercase">
            SATU QRIS UNTUK SEMUA
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Cek aplikasi penyelenggara di:
          </p>
          <a
            href="https://www.aspi-qris.id"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold text-slate-800 hover:text-red-600 transition-colors inline-block"
          >
            {QRIS_DATA.aspiUrl}
          </a>
        </div>

        {/* Bottom Section: Footer Details + Red Step-by-Step Ribbon */}
        <div className="relative min-h-[90px] flex items-end justify-between bg-slate-50 border-t border-slate-100">
          {/* Left Footer: Print Info */}
          <div className="p-3.5 text-[9px] font-mono text-slate-600 leading-relaxed z-10">
            <div>Dicetak oleh: <span className="font-bold text-slate-800">{QRIS_DATA.dicetakOleh}</span></div>
            <div>Versi cetak: <span className="font-bold text-slate-800">{QRIS_DATA.versiCetak}</span></div>
          </div>

          {/* Right Red Ribbon with Official Step Icons */}
          <div className="w-[58%] sm:w-[56%] bg-[#ea1c24] text-white pt-2.5 pb-2.5 px-3 rounded-tl-3xl shadow-lg relative z-10 flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-tight text-white mb-1.5 self-start">
              Cara bayar dengan QRIS:
            </span>
            <div className="w-full grid grid-cols-3 gap-1 text-center">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xs">
                  <span className="text-[8px] font-black text-[#ea1c24]">QR</span>
                </div>
                <span className="text-[7px] leading-tight text-white font-medium mt-1">
                  Buka Aplikasi Berlogo QRIS
                </span>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xs">
                  <div className="w-3 h-3 border border-slate-900 rounded-[2px] flex items-center justify-center">
                    <div className="w-1.5 h-0.5 bg-[#ea1c24]" />
                  </div>
                </div>
                <span className="text-[7px] leading-tight text-white font-medium mt-1">
                  Scan dan Cek
                </span>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 text-[#ea1c24] stroke-[3]" />
                </div>
                <span className="text-[7px] leading-tight text-white font-medium mt-1">
                  Bayar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Helper Action Buttons below the QRIS */}
      {showActions && (
        <div className="w-full max-w-[370px] mt-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95 border border-slate-700 shadow-sm"
              title="Perbesar QRIS untuk discan"
            >
              <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Perbesar</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95 border border-slate-700 shadow-sm disabled:opacity-50"
              title="Simpan gambar QRIS ke galeri"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{downloading ? 'Menyimpan...' : 'Download'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyNmid}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95 border border-slate-700 shadow-sm"
              title="Salin nomor NMID QRIS"
            >
              {copiedNmid ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Salin NMID</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Guidance / Supported Apps */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="text-slate-200 font-semibold">Mendukung semua pembayaran:</span>{' '}
              BCA, Mandiri, BRI, BNI, BSI, GoPay, OVO, DANA, ShopeePay, LinkAja, &amp; Seabank.
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Magnify Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="bg-white p-4 rounded-3xl max-w-sm w-full shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-black text-slate-900 text-lg">QRIS RESMI</span>
              <span className="text-xs font-mono font-bold text-slate-500">NMID: {QRIS_DATA.nmid}</span>
            </div>

            <div className="py-2 text-center">
              <h3 className="font-extrabold text-slate-900 text-lg">{QRIS_DATA.merchantName}</h3>
              {amount && (
                <div className="text-base font-black text-red-600 mt-1 font-mono">
                  Rp {amount.toLocaleString('id-ID')}
                </div>
              )}
            </div>

            <div className="w-72 h-72 bg-white p-2 rounded-xl flex items-center justify-center">
              {qrSvg && (
                <div
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              )}
            </div>

            <div className="mt-2 text-center text-xs text-slate-500 font-medium">
              Arahkan kamera aplikasi bank / e-wallet Anda ke kode QR ini
            </div>

            <button
              onClick={() => setIsZoomed(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Tutup Tampilan Penuh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialQRISCard;
