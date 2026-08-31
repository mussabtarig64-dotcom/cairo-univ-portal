import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, X, Moon, Heart, Flame } from 'lucide-react';

export default function OccasionBanner() {
  const { currentOccasion, customOccasionGreeting, occasionMode } = useTheme();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !currentOccasion || currentOccasion.id === 'none' || occasionMode === 'none') {
    return null;
  }

  const greetingText = customOccasionGreeting || currentOccasion.bannerText;
  if (!greetingText) return null;

  const isRamadan = currentOccasion.id === 'ramadan';
  const isEid = currentOccasion.id === 'eid-fitr' || currentOccasion.id === 'eid-adha';
  const isNational = currentOccasion.id === 'sudan-national';

  return (
    <div
      className="relative z-40 w-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md"
      dir="rtl"
      style={{
        background: isRamadan
          ? 'linear-gradient(90deg, #07192f 0%, #1e3a5f 50%, #07192f 100%)'
          : isEid
          ? 'linear-gradient(90deg, #4a044e 0%, #831843 50%, #064e3b 100%)'
          : 'linear-gradient(90deg, #064e3b 0%, #111827 50%, #7f1d1d 100%)',
        borderBottom: isRamadan
          ? '1px solid rgba(245, 158, 11, 0.4)'
          : isEid
          ? '1px solid rgba(236, 72, 153, 0.4)'
          : '1px solid rgba(16, 185, 129, 0.4)',
        color: '#ffffff',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-base sm:text-lg animate-pulse">{currentOccasion.icon}</span>
          <span className="font-bold text-amber-300 hidden sm:inline">[{currentOccasion.name}]:</span>
          <span className="text-slate-100 tracking-wide">{greetingText}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setDismissed(true)}
            title="إخفاء الشريط مؤقتاً"
            className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
