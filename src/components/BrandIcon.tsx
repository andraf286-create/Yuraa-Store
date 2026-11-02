import React from 'react';

interface BrandIconProps {
  iconType: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandIcon: React.FC<BrandIconProps> = ({ iconType, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-16 h-16 rounded-xl text-sm',
    lg: 'w-24 h-24 rounded-2xl text-base',
  };

  const currentSize = sizeClasses[size];

  switch (iconType) {
    case 'netflix':
      return (
        <div className={`bg-black flex items-center justify-center font-black ${currentSize} ${className} shadow-md border border-neutral-800`}>
          <span className="text-red-600 font-extrabold text-2xl tracking-tighter scale-y-125 select-none">N</span>
        </div>
      );

    case 'spotify':
      return (
        <div className={`bg-[#1DB954] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <svg className="w-3/5 h-3/5 text-black fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.309c-.216.353-.674.466-1.026.25-2.812-1.718-6.352-2.106-10.521-1.153-.404.093-.805-.16-.897-.564-.093-.405.159-.806.564-.898 4.568-1.042 8.487-.6 11.629 1.339.352.217.465.674.251 1.026zm1.469-3.267c-.272.443-.852.584-1.295.312-3.218-1.978-8.125-2.55-11.932-1.393-.497.151-1.026-.135-1.177-.633-.151-.497.135-1.025.633-1.177 4.356-1.322 9.774-.683 13.458 1.583.444.272.585.852.313 1.308zm.137-3.407c-3.858-2.29-10.222-2.502-13.906-1.383-.591.179-1.218-.16-1.398-.752-.179-.591.16-1.218.752-1.398 4.24-1.288 11.272-1.043 15.717 1.597.531.314.707 1.002.393 1.533-.315.531-1.003.708-1.558.403z"/>
          </svg>
        </div>
      );

    case 'prime':
      return (
        <div className={`bg-[#00A8E1] flex flex-col items-center justify-center p-1.5 ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-bold leading-tight text-xs tracking-tight">prime</span>
          <span className="text-white font-black leading-none text-xs">video</span>
          <div className="w-8 h-1 bg-amber-400 rounded-full mt-0.5"></div>
        </div>
      );

    case 'disney':
      return (
        <div className={`bg-[#05143a] flex flex-col items-center justify-center p-1 border border-blue-900/60 ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-serif italic font-bold text-sm tracking-wider">Disney+</span>
          <span className="text-[9px] text-cyan-300 font-medium">hotstar</span>
        </div>
      );

    case 'hbomax':
      return (
        <div className={`bg-gradient-to-br from-[#120826] to-[#4a154b] flex flex-col items-center justify-center p-1 border border-purple-900/60 ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-black text-sm tracking-tight">HBO</span>
          <span className="text-[10px] text-purple-200 font-bold -mt-1 tracking-wide">MAX</span>
        </div>
      );

    case 'viki':
      return (
        <div className={`bg-[#0085FF] flex flex-col items-center justify-center p-1 ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-extrabold text-base tracking-tighter">Viki</span>
          <span className="text-[9px] text-white/90 font-medium -mt-1">Rakuten</span>
        </div>
      );

    case 'loktv':
      return (
        <div className={`bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 flex flex-col items-center justify-center p-1 ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-black text-sm">LOKTV</span>
          <span className="text-[8px] text-white/80">Smart HD TV</span>
        </div>
      );

    case 'viu':
      return (
        <div className={`bg-[#FFB400] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
          </div>
        </div>
      );

    case 'iqiyi':
      return (
        <div className={`bg-[#00C234] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-extrabold text-xs tracking-wider">iQIYI</span>
        </div>
      );

    case 'wetv':
      return (
        <div className={`bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center border border-slate-800 ${currentSize} ${className} shadow-md`}>
          <div className="flex gap-0.5 items-center">
            <span className="text-orange-500 font-extrabold text-sm">We</span>
            <span className="text-blue-400 font-extrabold text-sm">TV</span>
          </div>
        </div>
      );

    case 'visionplus':
      return (
        <div className={`bg-[#0B1528] flex items-center justify-center border border-cyan-800/60 ${currentSize} ${className} shadow-md`}>
          <span className="text-cyan-400 font-black text-lg">V+</span>
        </div>
      );

    case 'canva':
      return (
        <div className={`bg-gradient-to-br from-[#00C4CC] via-[#7D2AE8] to-[#FF4E69] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-bold italic font-serif text-sm">Canva</span>
        </div>
      );

    case 'youtube':
      return (
        <div className={`bg-black flex items-center justify-center ${currentSize} ${className} shadow-md border border-neutral-800`}>
          <div className="w-8 h-6 bg-red-600 rounded-md flex items-center justify-center">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
          </div>
        </div>
      );

    case 'vidio':
      return (
        <div className={`bg-[#E61E54] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-black text-2xl italic font-serif">v</span>
        </div>
      );

    case 'applemusic':
      return (
        <div className={`bg-gradient-to-b from-[#FA233B] to-[#FB5C74] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <svg className="w-3/5 h-3/5 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 6v4.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.34 0 .66.07.95.2V7l4-1v2h-2.45z"/>
          </svg>
        </div>
      );

    case 'chatgpt':
      return (
        <div className={`bg-[#10A37F] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-bold text-xs">GPT-4</span>
        </div>
      );

    case 'capcut':
      return (
        <div className={`bg-black border border-neutral-700 flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-black text-xs tracking-tighter">CapCut</span>
        </div>
      );

    case 'nordvpn':
      return (
        <div className={`bg-[#4687FF] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-extrabold text-xs">VPN</span>
        </div>
      );

    case 'telkomsel':
    case 'telkomsel_data':
      return (
        <div className={`bg-[#ED0226] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-black text-xs">T-SEL</span>
        </div>
      );

    case 'indosat':
    case 'indosat_data':
      return (
        <div className={`bg-[#FFCB05] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-neutral-900 font-black text-xs">IM3</span>
        </div>
      );

    case 'xl':
      return (
        <div className={`bg-[#00529C] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-black text-xs">XL</span>
        </div>
      );

    case 'duolingo':
      return (
        <div className={`bg-[#58CC02] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-black text-sm">🦉</span>
        </div>
      );

    case 'bstation':
      return (
        <div className={`bg-[#23ADE5] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-black text-xs">Bili</span>
        </div>
      );

    case 'grammarly':
      return (
        <div className={`bg-[#15C39A] flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-black text-base">G</span>
        </div>
      );

    case 'truecaller':
      return (
        <div className={`bg-amber-500 flex items-center justify-center ${currentSize} ${className} shadow-md`}>
          <span className="text-white font-black text-xs">GOLD</span>
        </div>
      );

    case 'roblox':
    case 'roblox_login':
      return (
        <div className={`bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex flex-col items-center justify-center ${currentSize} ${className} shadow-md border border-neutral-800 relative overflow-hidden group`}>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rotate-[15deg] rounded-[3px] flex items-center justify-center shadow-md">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-neutral-950 rounded-[1px]"></div>
          </div>
          <span className="text-[8px] font-black text-neutral-300 tracking-wider uppercase mt-1">ROBLOX</span>
        </div>
      );

    case 'robux':
    case 'robux_gamepass':
      return (
        <div className={`bg-gradient-to-br from-emerald-950 via-neutral-950 to-slate-950 flex flex-col items-center justify-center ${currentSize} ${className} shadow-md border border-emerald-500/40 relative overflow-hidden`}>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 rounded-lg rotate-45 flex items-center justify-center shadow-lg border border-amber-200">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-neutral-950 rounded-sm"></div>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            <span className="text-[8px] font-black text-emerald-400 tracking-wider">GAMEPASS</span>
          </div>
        </div>
      );

    case 'roblox_premium':
      return (
        <div className={`bg-gradient-to-br from-slate-900 via-purple-950 to-neutral-950 flex flex-col items-center justify-center ${currentSize} ${className} shadow-md border border-purple-500/40 relative overflow-hidden`}>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-tr from-purple-400 via-indigo-300 to-amber-200 rotate-[15deg] rounded-[3px] flex items-center justify-center shadow-md">
            <span className="text-black font-black text-xs -rotate-[15deg]">P</span>
          </div>
          <span className="text-[8px] font-black text-purple-300 tracking-wider uppercase mt-1">PREMIUM</span>
        </div>
      );

    default:
      return (
        <div className={`bg-blue-600 flex items-center justify-center text-white font-bold ${currentSize} ${className} shadow-md`}>
          <span>★</span>
        </div>
      );
  }
};
