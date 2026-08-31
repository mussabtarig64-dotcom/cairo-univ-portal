import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/api';

export const THEMES = {
  'classic-gold-blue': {
    id: 'classic-gold-blue',
    name: 'الكحلي والذهب الكلاسيكي (Classic Gold & Dark Blue)',
    badge: '🏛️ الكحلي والذهب',
    primary: '#f59e0b',
    primaryHover: '#d97706',
    secondary: '#1e3a8a',
    accent: '#fbbf24',
    accentLight: '#fde68a',
    bgDark: '#0b132b',
    bgCard: '#1c2541',
    border: '#2a3859',
    textMain: '#ffffff',
    textMuted: '#94a3b8',
    heroGradient: 'linear-gradient(135deg, #1e3a8a 0%, #0b132b 100%)',
    tag: 'كلاسيكي داكن',
    isDark: true,
  },
  'ramadan-night': {
    id: 'ramadan-night',
    name: 'أجواء رمضان المبارك (Ramadan Kareem Glow)',
    badge: '🌙 نفحات رمضانية',
    primary: '#f59e0b',
    primaryHover: '#d97706',
    secondary: '#064e3b',
    accent: '#34d399',
    accentLight: '#fde68a',
    bgDark: '#07101e',
    bgCard: '#0f1f38',
    border: '#1f385c',
    textMain: '#ffffff',
    textMuted: '#93c5fd',
    heroGradient: 'radial-gradient(ellipse at top, #1e3a5f 0%, #07101e 100%)',
    tag: 'مناسبات | رمضان',
    isDark: true,
    occasion: 'ramadan',
  },
  'eid-celebration': {
    id: 'eid-celebration',
    name: 'بهجة العيد المبارك (Eid Celebration)',
    badge: '🎉 بهجة العيد',
    primary: '#ec4899',
    primaryHover: '#db2777',
    secondary: '#047857',
    accent: '#fbbf24',
    accentLight: '#fef08a',
    bgDark: '#0c0a1a',
    bgCard: '#1f1538',
    border: '#3c246b',
    textMain: '#ffffff',
    textMuted: '#c4b5fd',
    heroGradient: 'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 50%, #0c0a1a 100%)',
    tag: 'مناسبات | الأعياد',
    isDark: true,
    occasion: 'eid',
  },
  'sudan-glory': {
    id: 'sudan-glory',
    name: 'راية السودان والمناسبات الوطنية (Sudan Pride & Glory)',
    badge: '🇸🇩 المجد الوطني',
    primary: '#10b981',
    primaryHover: '#059669',
    secondary: '#b91c1c',
    accent: '#f59e0b',
    accentLight: '#fde68a',
    bgDark: '#0a101d',
    bgCard: '#131e33',
    border: '#1e3354',
    textMain: '#ffffff',
    textMuted: '#94a3b8',
    heroGradient: 'linear-gradient(135deg, #064e3b 0%, #111827 50%, #7f1d1d 100%)',
    tag: 'مناسبات | وطني',
    isDark: true,
    occasion: 'sudan-national',
  },
  'emerald-green': {
    id: 'emerald-green',
    name: 'الزمردي والأخضر الملكي (Emerald Green & Dark)',
    badge: '🌿 الزمردي الملكي',
    primary: '#047857',
    primaryHover: '#059669',
    secondary: '#064e3b',
    accent: '#10b981',
    accentLight: '#34d399',
    bgDark: '#0b1622',
    bgCard: '#112233',
    border: '#1e3851',
    textMain: '#ffffff',
    textMuted: '#94a3b8',
    heroGradient: 'linear-gradient(135deg, #064e3b 0%, #0b1622 100%)',
    tag: 'زمردي رسمي',
    isDark: true,
  },
  'royal-purple': {
    id: 'royal-purple',
    name: 'البنفسجي الملكي والذهبي (Royal Purple & Gold)',
    badge: '👑 البنفسجي الملكي',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    secondary: '#4338ca',
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    bgDark: '#0f0d1b',
    bgCard: '#1e1b4b',
    border: '#3730a3',
    textMain: '#ffffff',
    textMuted: '#a5b4fc',
    heroGradient: 'linear-gradient(135deg, #4338ca 0%, #0f0d1b 100%)',
    tag: 'ملكي فاخر',
    isDark: true,
  },
  'cyberpunk-neon': {
    id: 'cyberpunk-neon',
    name: 'السايبربانك النيوني (Cyberpunk Neon Cyan & Pink)',
    badge: '⚡ سايبربانك نيوني',
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    secondary: '#db2777',
    accent: '#38bdf8',
    accentLight: '#ec4899',
    bgDark: '#030712',
    bgCard: '#0f172a',
    border: '#1e293b',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    heroGradient: 'linear-gradient(135deg, #0e7490 0%, #1e1b4b 60%, #030712 100%)',
    tag: 'نيوني حديث',
    isDark: true,
  },
  'clean-light': {
    id: 'clean-light',
    name: 'المظهر النهاري الأنيق (Clean Modern Light Mode)',
    badge: '☀️ نهاري نقي',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    secondary: '#0ea5e9',
    accent: '#f59e0b',
    accentLight: '#d97706',
    bgDark: '#f8fafc',
    bgCard: '#ffffff',
    border: '#e2e8f0',
    textMain: '#0f172a',
    textMuted: '#64748b',
    heroGradient: 'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)',
    tag: 'نهاري أبيض',
    isDark: false,
  },
};

export const OCCASIONS = {
  'none': {
    id: 'none',
    name: 'الوضع الطبيعي بدون مناسبة',
    icon: '✨',
    bannerText: '',
  },
  'ramadan': {
    id: 'ramadan',
    name: 'شهر رمضان المبارك',
    icon: '🌙',
    bannerText: 'رمضان كريم 🌙 تقبل الله منا ومنكم صالح الأعمال والطاعات | رابطة العلوم جامعة القاهرة تبارك لكم الشهر الفضيل',
    themeId: 'ramadan-night',
  },
  'eid-fitr': {
    id: 'eid-fitr',
    name: 'عيد الفطر المبارك',
    icon: '🎉',
    bannerText: 'عيد فطر مبارك وسعيد 🎉 كل عام وأنتم بخير وصحة وسلام | تقبل الله طاعاتكم وصالح أعمالكم',
    themeId: 'eid-celebration',
  },
  'eid-adha': {
    id: 'eid-adha',
    name: 'عيد الأضحى المبارك',
    icon: '🐑',
    bannerText: 'عيد أضحى مبارك 🐑 كل عام وأنتم إلى الله أقرب وعلى طاعته أدوم | عساكم من عواده',
    themeId: 'eid-celebration',
  },
  'sudan-national': {
    id: 'sudan-national',
    name: 'المناسبات الوطنية وعيد الاستقلال',
    icon: '🇸🇩',
    bannerText: 'عاش السودان حراً عزيزاً مستقلاً 🇸🇩 نجدد العهد بالوفاء للوطن والعطاء لطلابه',
    themeId: 'sudan-glory',
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentThemeKey, setCurrentThemeKey] = useState(() => {
    return localStorage.getItem('ssa_active_theme') || 'classic-gold-blue';
  });

  const [occasionMode, setOccasionMode] = useState(() => {
    return localStorage.getItem('ssa_occasion_mode') || 'auto';
  });

  const [customOccasionGreeting, setCustomOccasionGreeting] = useState('');
  const [activeTheme, setActiveTheme] = useState(THEMES[currentThemeKey] || THEMES['classic-gold-blue']);

  // مزامنة المظهر والمناسبات عند التحميل من الخادم
  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/settings`)
      .then((res) => {
        if (res.data) {
          if (res.data.activeTheme && THEMES[res.data.activeTheme]) {
            setCurrentThemeKey(res.data.activeTheme);
          }
          if (res.data.occasionMode) {
            setOccasionMode(res.data.occasionMode);
          }
          if (res.data.occasionGreeting) {
            setCustomOccasionGreeting(res.data.occasionGreeting);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const themeObj = THEMES[currentThemeKey] || THEMES['classic-gold-blue'];
    setActiveTheme(themeObj);
    localStorage.setItem('ssa_active_theme', currentThemeKey);

    // تطبيق متغيرات CSS custom variables عالمياً
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeObj.primary);
    root.style.setProperty('--bg-color', themeObj.bgDark);
    root.style.setProperty('--card-bg', themeObj.bgCard);
    root.style.setProperty('--border-color', themeObj.border);
    root.style.setProperty('--text-color', themeObj.textMain);

    root.style.setProperty('--color-primary', themeObj.primary);
    root.style.setProperty('--color-primary-hover', themeObj.primaryHover);
    root.style.setProperty('--color-secondary', themeObj.secondary);
    root.style.setProperty('--color-accent', themeObj.accent);
    root.style.setProperty('--color-accent-light', themeObj.accentLight);
    root.style.setProperty('--color-bg-dark', themeObj.bgDark);
    root.style.setProperty('--color-bg-card', themeObj.bgCard);
    root.style.setProperty('--color-border', themeObj.border);
    root.style.setProperty('--color-text-main', themeObj.textMain);
    root.style.setProperty('--color-text-muted', themeObj.textMuted);

    // ضبط لون خلفية الصفحة body
    document.body.style.backgroundColor = themeObj.bgDark;
    document.body.style.color = themeObj.textMain;
  }, [currentThemeKey]);

  // دالة تبديل المظهر وحفظه
  const switchTheme = async (themeKey) => {
    if (THEMES[themeKey]) {
      setCurrentThemeKey(themeKey);
      localStorage.setItem('ssa_active_theme', themeKey);

      try {
        await axios.post(`${API_BASE}/admin/settings`, {
          activeTheme: themeKey,
          themeTitle: THEMES[themeKey].name,
        });
      } catch (e) {
        console.log('Settings save note:', e.message);
      }
    }
  };

  // دالة تبديل وضع المناسبات
  const switchOccasionMode = async (modeKey, greeting = '') => {
    setOccasionMode(modeKey);
    localStorage.setItem('ssa_occasion_mode', modeKey);
    if (greeting !== undefined) setCustomOccasionGreeting(greeting);

    // إذا تم اختيار مناسبة محددة، نقوم بتطبيق الثيم المرتبط بها تلقائياً
    if (OCCASIONS[modeKey] && OCCASIONS[modeKey].themeId) {
      switchTheme(OCCASIONS[modeKey].themeId);
    }

    try {
      await axios.post(`${API_BASE}/admin/settings`, {
        occasionMode: modeKey,
        occasionGreeting: greeting,
      });
    } catch (e) {
      console.log('Occasion save note:', e.message);
    }
  };

  // التحقق من الوضع النشط للمناسبة الحالية
  const resolvedOccasionKey = occasionMode === 'auto' ? 'ramadan' : occasionMode;
  const currentOccasion = OCCASIONS[resolvedOccasionKey] || OCCASIONS['none'];

  return (
    <ThemeContext.Provider
      value={{
        currentThemeKey,
        activeTheme,
        switchTheme,
        availableThemes: THEMES,
        occasionMode,
        switchOccasionMode,
        currentOccasion,
        availableOccasions: OCCASIONS,
        customOccasionGreeting,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
