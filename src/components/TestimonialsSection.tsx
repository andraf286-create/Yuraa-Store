import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/extras';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="rounded-3xl bg-white dark:bg-[#111929] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-7 shadow-lg dark:shadow-xl space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-500 uppercase tracking-tight">
          TESTIMONI
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">4.9</span>
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
          Dari 2.500+ pelanggan
        </p>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4 pt-1">
        {TESTIMONIALS_DATA.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800/80 shadow-sm"
          >
            {/* Avatar Emoji Box */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${item.avatarBg}`}
            >
              <span>{item.avatarEmoji}</span>
            </div>

            {/* Comment & Name */}
            <div className="flex-1">
              <p className="text-xs sm:text-sm italic text-slate-700 dark:text-slate-300 leading-snug font-medium">
                "{item.comment}"
              </p>
              <div className="mt-1 text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                  - {item.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
