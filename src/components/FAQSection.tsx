import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_DATA } from '../data/extras';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="space-y-4 pt-6">
      <div className="text-center sm:text-left">
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
          BANTUAN &amp; INFORMASI
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          PERTANYAAN POPULER (QNA)
        </h2>
      </div>

      <div className="space-y-3">
        {FAQ_DATA.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl bg-white dark:bg-[#121929] border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-slate-800 hover:text-slate-950 dark:text-slate-100 dark:hover:text-white transition-colors cursor-pointer"
              >
                <span className="font-bold text-xs sm:text-sm tracking-wide">
                  {item.question}
                </span>
                <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-[#0d1424]">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
