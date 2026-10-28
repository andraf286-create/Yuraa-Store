import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { LIVE_SALES_FEED } from '../data/extras';

export const LiveSalesToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LIVE_SALES_FEED.length);
        setIsVisible(true);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed) return null;

  const currentItem = LIVE_SALES_FEED[currentIndex];

  return (
    <div
      className={`fixed bottom-20 left-4 z-40 max-w-xs sm:max-w-sm transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex items-start gap-3">
        {/* Live Badge */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md shadow-red-600/30">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            LIVE
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <span>🎉</span>
            <span className="font-mono">{currentItem.buyer}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
            Baru saja membeli{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {currentItem.product}
            </span>
          </p>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">
            {currentItem.time}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full transition-colors"
          aria-label="Tutup notifikasi"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
