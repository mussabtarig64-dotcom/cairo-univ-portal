import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { X } from 'lucide-react';

export default function OccasionBanner() {
  const { currentOccasion, customOccasionGreeting, occasionMode, activeTheme } = useTheme();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !currentOccasion || currentOccasion.id === 'none' || occasionMode === 'none') {
    return null;
  }

  const greetingText = customOccasionGreeting || currentOccasion.bannerText;
  if (!greetingText) return null;

  const isRamadan = currentOccasion.id === 'ramadan';
  const isEidAdha = currentOccasion.id === 'eid-adha';
  const isEidFitr = currentOccasion.id === 'eid-fitr';
  const isNational = currentOccasion.id === 'sudan-national';

  // خلفيات متناسقة للمناسبات تراعي الوضع الداكن والنهاري
  const backgroundStyle = isRamadan
    ? 'linear-gradient(90deg, #07192f 0%, #1e3a5f 50%, #07192f 100%)'
    : isEidAdha
    ? 'linear-gradient(90deg, #064e3b 0%, #047857 50%, #064e3b 100%)'
    : isEidFitr
    ? 'linear-gradient(90deg, #4a044e 0%, #831843 50%, #064e3b 100%)'
    : isNational
    ? 'linear-gradient(90deg, #064e3b 0%, #111827 50%, #7f1d1d 100%)'
    : 'linear-gradient(90deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)';

  const borderStyle = isRamadan
    ? '1px solid rgba(245, 158, 11, 0.45)'
    : isEidAdha
    ? '1px solid rgba(52, 211, 153, 0.5)'
    : isEidFitr
    ? '1px solid rgba(236, 72, 153, 0.45)'
    : '1px solid rgba(16, 185, 129, 0.45)';

  return (
    <div
      className="relative z-40 w-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md backdrop-blur-md"
      dir="rtl"
      style={{
        background: backgroundStyle,
        borderBottom: borderStyle,
        color: '#ffffff',
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* نص التهنئة والمناسبة */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
          {/* أيقونة المناسبة مع تمييز خاص لعيد الأضحى ورمضان */}
          {isEidAdha ? (
            <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-inner">
              <span className="text-base sm:text-lg animate-bounce-subtle">🐑</span>
              <span className="text-[11px] font-extrabold text-amber-300 hidden sm:inline">أضحى مبارك</span>
            </div>
          ) : isRamadan ? (
            <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-inner">
              <span className="text-base sm:text-lg animate-pulse">🏮</span>
              <span className="text-[11px] font-extrabold text-amber-300 hidden sm:inline">رمضان كريم</span>
            </div>
          ) : (
            <span className="text-base sm:text-xl shrink-0 animate-soft-glow drop-shadow">
              {currentOccasion.icon}
            </span>
          )}
          
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <span className="font-bold text-amber-300 hidden md:inline shrink-0">
              [{currentOccasion.name}]:
            </span>
            <span className="text-slate-100 tracking-wide text-xs sm:text-sm truncate sm:overflow-visible sm:whitespace-normal">
              {greetingText}
            </span>
          </div>
        </div>

        {/* زر الإغلاق المؤقت مع مساحة لمس مريحة */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setDismissed(true)}
            aria-label="إغلاق الشريط"
            title="إخفاء الشريط مؤقتاً"
            className="text-slate-300 hover:text-white p-1.5 sm:p-1 rounded-lg hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

