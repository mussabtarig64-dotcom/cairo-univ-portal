import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Sparkles, Moon, Star } from 'lucide-react';

export default function SeasonalDecorations() {
  const { currentOccasion, occasionMode } = useTheme();
  const [closedOccasion, setClosedOccasion] = useState(null);

  if (!currentOccasion || currentOccasion.id === 'none' || occasionMode === 'none') {
    return null;
  }

  // If user dismissed this specific occasion decoration
  if (closedOccasion === currentOccasion.id) {
    return null;
  }

  const isRamadan = currentOccasion.id === 'ramadan';
  const isEidAdha = currentOccasion.id === 'eid-adha';
  const isEidFitr = currentOccasion.id === 'eid-fitr';

  if (!isRamadan && !isEidAdha && !isEidFitr) {
    return null;
  }

  return (
    <>
      {/* 1. زينة شهر رمضان المبارك (فوانيس رمضانية معلقة وإضاءات دافئة) */}
      {isRamadan && (
        <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
          {/* فانوس معلق يمين الشاشة */}
          <div
            className="absolute top-0 right-4 sm:right-10 origin-top animate-lantern-swing hidden sm:block"
            style={{ filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.45))' }}
          >
            {/* خيط التعليق الذهبي */}
            <div className="w-0.5 h-16 sm:h-24 bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 mx-auto" />
            
            {/* جسم الفانوس التراثي الأنيق */}
            <div className="relative w-12 sm:w-16 h-20 sm:h-24">
              <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-md">
                {/* حلقة التعليق */}
                <circle cx="50" cy="10" r="7" fill="none" stroke="#f59e0b" strokeWidth="3" />
                {/* قمة الفانوس */}
                <path d="M30 20 L70 20 L60 38 L40 38 Z" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
                <path d="M25 38 L75 38 L80 50 L20 50 Z" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                {/* زجاج الفانوس والوهج الداخلي */}
                <path d="M22 50 L78 50 L68 115 L32 115 Z" fill="url(#ramadanLanternGlow1)" stroke="#f59e0b" strokeWidth="2" />
                {/* شعلة مضيئة */}
                <circle cx="50" cy="80" r="10" fill="#fef08a" opacity="0.9" className="animate-pulse" />
                <circle cx="50" cy="80" r="18" fill="rgba(251, 191, 36, 0.35)" className="animate-ping" />
                {/* زخارف أضلاع الفانوس */}
                <line x1="50" y1="50" x2="50" y2="115" stroke="#92400e" strokeWidth="1.5" />
                <line x1="36" y1="50" x2="42" y2="115" stroke="#92400e" strokeWidth="1.2" />
                <line x1="64" y1="50" x2="58" y2="115" stroke="#92400e" strokeWidth="1.2" />
                {/* قاعدة الفانوس */}
                <path d="M30 115 L70 115 L78 135 L22 135 Z" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                <rect x="25" y="135" width="50" height="6" rx="2" fill="#b45309" />
                {/* تدرج إضاءة الفانوس */}
                <defs>
                  <radialGradient id="ramadanLanternGlow1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#fde047" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.85" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* فانوس معلق يسار الشاشة */}
          <div
            className="absolute top-0 left-4 sm:left-10 origin-top animate-lantern-swing-delay hidden sm:block"
            style={{ filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.45))' }}
          >
            {/* خيط التعليق الذهبي */}
            <div className="w-0.5 h-10 sm:h-16 bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 mx-auto" />
            
            {/* الفانوس */}
            <div className="relative w-10 sm:w-14 h-16 sm:h-20">
              <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-md">
                <circle cx="50" cy="10" r="7" fill="none" stroke="#f59e0b" strokeWidth="3" />
                <path d="M30 20 L70 20 L60 38 L40 38 Z" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
                <path d="M25 38 L75 38 L80 50 L20 50 Z" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                <path d="M22 50 L78 50 L68 115 L32 115 Z" fill="url(#ramadanLanternGlow2)" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="50" cy="80" r="8" fill="#fef08a" opacity="0.95" className="animate-pulse" />
                <line x1="50" y1="50" x2="50" y2="115" stroke="#92400e" strokeWidth="1.5" />
                <path d="M30 115 L70 115 L78 135 L22 135 Z" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                <rect x="25" y="135" width="50" height="6" rx="2" fill="#b45309" />
                <defs>
                  <radialGradient id="ramadanLanternGlow2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0.85" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* هلال ونجوم متلألئة ناعمة في أعلى الزاوية */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-80 pointer-events-none">
            <span className="text-amber-300 text-xs animate-pulse">✦</span>
            <span className="text-amber-200 text-sm animate-ping">✨</span>
            <span className="text-amber-300 text-xs animate-pulse">✦</span>
          </div>
        </div>
      )}

      {/* 2. زينة عيد الأضحى المبارك (رمز وشخصية خروف العيد الأنيقة مع تهنئة مبهجة) */}
      {isEidAdha && (
        <aside
          aria-label="تهنئة عيد الأضحى المبارك"
          className="fixed bottom-20 left-4 sm:left-6 z-40 animate-bounce-subtle pointer-events-auto"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(16, 185, 129, 0.35))' }}
        >
          <div className="relative group bg-gradient-to-br from-slate-900/95 via-emerald-950/90 to-slate-900/95 border-2 border-emerald-500/50 hover:border-emerald-400 rounded-2xl p-3 sm:p-3.5 backdrop-blur-xl text-white shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3">
            {/* زر إغلاق مصغر */}
            <button
              onClick={() => setClosedOccasion('eid-adha')}
              className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 hover:bg-red-600 border border-emerald-500/40 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all text-xs cursor-pointer shadow-md"
              title="إخفاء زينة العيد"
              aria-label="إغلاق التهنئة"
            >
              <X size={12} />
            </button>

            {/* رسمة خروف العيد النظيفة والأنيقة (Clean Illustrated Eid Sheep Graphic) */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow">
                {/* خلفية هالة ضوئية دافئة */}
                <circle cx="50" cy="50" r="42" fill="rgba(16, 185, 129, 0.15)" />
                
                {/* قرون الخروف الذهبية الملتوية */}
                <path
                  d="M26 35 C15 28, 12 45, 24 45 C30 45, 30 35, 26 35 Z"
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth="2"
                />
                <path
                  d="M74 35 C85 28, 88 45, 76 45 C70 45, 70 35, 74 35 Z"
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth="2"
                />

                {/* صوف الخروف الأبيض السحابي (Cloud-like Wool Body) */}
                <circle cx="50" cy="58" r="26" fill="#ffffff" />
                <circle cx="34" cy="50" r="14" fill="#f8fafc" />
                <circle cx="66" cy="50" r="14" fill="#f8fafc" />
                <circle cx="38" cy="68" r="12" fill="#f1f5f9" />
                <circle cx="62" cy="68" r="12" fill="#f1f5f9" />
                <circle cx="50" cy="74" r="12" fill="#e2e8f0" />

                {/* أقدام الخروف الصغيرة */}
                <rect x="40" y="78" width="6" height="12" rx="3" fill="#334155" />
                <rect x="54" y="78" width="6" height="12" rx="3" fill="#334155" />

                {/* وجه الخروف البشوش */}
                <ellipse cx="50" cy="46" rx="16" ry="18" fill="#1e293b" />
                
                {/* عيون لامعة وجميلة */}
                <circle cx="44" cy="42" r="3.5" fill="#ffffff" />
                <circle cx="45" cy="42" r="2" fill="#0f172a" />
                <circle cx="56" cy="42" r="3.5" fill="#ffffff" />
                <circle cx="55" cy="42" r="2" fill="#0f172a" />

                {/* أنف وابتسامة خروف العيد */}
                <ellipse cx="50" cy="50" rx="3" ry="2" fill="#f472b6" />
                <path d="M47 54 Q50 57 53 54" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />

                {/* خصلة صوف ناصعة فوق الرأس */}
                <circle cx="50" cy="30" r="7" fill="#ffffff" />
                <circle cx="44" cy="32" r="5" fill="#f8fafc" />
                <circle cx="56" cy="32" r="5" fill="#f8fafc" />

                {/* فيونكة العيد الاحتفالية */}
                <polygon points="50,60 44,56 44,64" fill="#ef4444" />
                <polygon points="50,60 56,56 56,64" fill="#ef4444" />
                <circle cx="50" cy="60" r="2" fill="#fbbf24" />
              </svg>
            </div>

            {/* نص التهنئة المصاحب */}
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Sparkles size={13} className="text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>عيد أضحى مبارك! 🐑</span>
              </div>
              <div className="text-[11px] text-slate-200 font-medium mt-0.5 leading-tight">
                كل عام وأنتم بخير وعساكم من عواده ✨
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 3. زينة عيد الفطر المبارك */}
      {isEidFitr && (
        <aside
          aria-label="تهنئة عيد الفطر المبارك"
          className="fixed bottom-20 left-4 sm:left-6 z-40 animate-bounce-subtle pointer-events-auto"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(236, 72, 153, 0.35))' }}
        >
          <div className="relative group bg-gradient-to-br from-slate-900/95 via-pink-950/90 to-slate-900/95 border-2 border-pink-500/50 hover:border-pink-400 rounded-2xl p-3 sm:p-3.5 backdrop-blur-xl text-white shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3">
            <button
              onClick={() => setClosedOccasion('eid-fitr')}
              className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 hover:bg-red-600 border border-pink-500/40 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all text-xs cursor-pointer shadow-md"
              title="إخفاء زينة العيد"
              aria-label="إغلاق التهنئة"
            >
              <X size={12} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-2xl shrink-0">
              🎉
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
                <Sparkles size={13} className="text-amber-400" />
                <span>عيد فطر سعيد ومبارك! 🎉</span>
              </div>
              <div className="text-[11px] text-slate-200 font-medium mt-0.5 leading-tight">
                تقبل الله منا ومنكم صالح الأعمال والطاعات ✨
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
