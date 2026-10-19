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

// دالة فحص وتحديد المناسبة الرسمية آلياً وفقاً للتقويم الهجري والميلادي بدقة تامة
export function detectCurrentOccasionFromCalendar(date = new Date()) {
  try {
    // 1. فحص المناسبات الوطنية السودانية (التقويم الميلادي: عيد الاستقلال 1 - 7 يناير)
    const month = date.getMonth(); // 0 = يناير
    const day = date.getDate();
    if (month === 0 && day >= 1 && day <= 7) {
      return 'sudan-national';
    }

    // 2. فحص المناسبات الإسلامية عبر التقويم الهجري الدقيق المعتمد في المتصفح
    const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
    });
    const parts = hijriFormatter.formatToParts(date);
    let hijriMonth = null;
    let hijriDay = null;
    for (const part of parts) {
      if (part.type === 'month') hijriMonth = parseInt(part.value, 10);
      if (part.type === 'day') hijriDay = parseInt(part.value, 10);
    }

    // شهر رمضان المبارك (الشهر التاسع كاملاً)
    if (hijriMonth === 9) {
      return 'ramadan';
    }

    // عيد الفطر المبارك (شوال: الشهر 10، الأيام 1 إلى 4)
    if (hijriMonth === 10 && hijriDay >= 1 && hijriDay <= 4) {
      return 'eid-fitr';
    }

    // عيد الأضحى المبارك (ذو الحجة: الشهر 12، الأيام 9 إلى 13)
    if (hijriMonth === 12 && hijriDay >= 9 && hijriDay <= 13) {
      return 'eid-adha';
    }
  } catch (err) {
    console.warn('Calendar detection note:', err.message);
  }

  // إذا لم تكن هناك مناسبة نشطة حالياً في التقويم، نعود للوضع الطبيعي
  return 'none';
}

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentThemeKey, setCurrentThemeKey] = useState(() => {
    return localStorage.getItem('ssa_active_theme') || 'classic-gold-blue';
  });

  const [occasionMode, setOccasionMode] = useState(() => {
    return localStorage.getItem('ssa_occasion_mode') || 'none';
  });

  const [customOccasionGreeting, setCustomOccasionGreeting] = useState(() => {
    return localStorage.getItem('ssa_occasion_greeting') || '';
  });

  const [activeTheme, setActiveTheme] = useState(THEMES[currentThemeKey] || THEMES['classic-gold-blue']);

  // مزامنة المظهر والمناسبات عند التحميل من الخادم وقاعدة البيانات
  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/settings`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      })
      .then((res) => {
        const data = res.data?.settings || res.data;
        if (data) {
          if (data.activeTheme && THEMES[data.activeTheme]) {
            setCurrentThemeKey(data.activeTheme);
            localStorage.setItem('ssa_active_theme', data.activeTheme);
          }
          if (data.occasionMode) {
            setOccasionMode(data.occasionMode);
            localStorage.setItem('ssa_occasion_mode', data.occasionMode);
          }
          if (data.occasionGreeting !== undefined && data.occasionGreeting !== null) {
            setCustomOccasionGreeting(data.occasionGreeting);
            localStorage.setItem('ssa_occasion_greeting', data.occasionGreeting);
          }
        }
      })
      .catch((err) => {
        console.warn('Theme settings sync note:', err.message);
      });
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

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('ssa_token') ||
      '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // دالة تبديل المظهر: تدعم التبديل المحلي الشخصي أو الحفظ العالمي للأدمن
  const switchTheme = async (themeKey, options = {}) => {
    const { persistGlobally = false } = options;
    if (THEMES[themeKey]) {
      setCurrentThemeKey(themeKey);
      try {
        localStorage.setItem('ssa_active_theme', themeKey);
      } catch (e) {}

      // حفظ في خادم MongoDB فقط إذا كان التغيير مخصصاً للنشر العام بواسطة الأدمن
      if (persistGlobally) {
        try {
          await axios.post(
            `${API_BASE}/admin/settings`,
            {
              activeTheme: themeKey,
              themeTitle: THEMES[themeKey].name,
              occasionMode,
              occasionGreeting: customOccasionGreeting,
            },
            {
              headers: getAuthHeaders(),
            }
          );
        } catch (e) {
          console.log('Settings save note:', e.message);
        }
      }
    }
  };

  // دالة تبديل وضع المناسبات وتحديثها
  const switchOccasionMode = async (modeKey, greeting = undefined) => {
    setOccasionMode(modeKey);
    try {
      localStorage.setItem('ssa_occasion_mode', modeKey);
    } catch (e) {}

    const updatedGreeting = greeting !== undefined ? greeting : customOccasionGreeting;
    if (greeting !== undefined) {
      setCustomOccasionGreeting(greeting);
      try {
        localStorage.setItem('ssa_occasion_greeting', greeting);
      } catch (e) {}
    }

    // إذا تم اختيار مناسبة يدوية محددة ولها ثيم مرتبط بها، نقوم بتطبيقه
    let targetThemeId = currentThemeKey;
    if (modeKey !== 'auto' && OCCASIONS[modeKey] && OCCASIONS[modeKey].themeId) {
      targetThemeId = OCCASIONS[modeKey].themeId;
      setCurrentThemeKey(targetThemeId);
      try {
        localStorage.setItem('ssa_active_theme', targetThemeId);
      } catch (e) {}
    }

    try {
      await axios.post(
        `${API_BASE}/admin/settings`,
        {
          occasionMode: modeKey,
          occasionGreeting: updatedGreeting,
          activeTheme: targetThemeId,
          themeTitle: THEMES[targetThemeId]?.name || 'الكحلي والذهب الكلاسيكي',
        },
        {
          headers: getAuthHeaders(),
        }
      );
    } catch (e) {
      console.log('Occasion save note:', e.message);
    }
  };

  // دالة مخصصة وموثوقة لحفظ نص عبارة التهنئة المخصصة في قاعدة البيانات و localStorage مع توكن المصادقة
  const saveOccasionGreeting = async (greeting) => {
    const text = typeof greeting === 'string' ? greeting : '';
    setCustomOccasionGreeting(text);
    try {
      localStorage.setItem('ssa_occasion_greeting', text);
    } catch (e) {}

    try {
      const res = await axios.post(
        `${API_BASE}/admin/settings`,
        {
          occasionGreeting: text,
          occasionMode,
          activeTheme: currentThemeKey,
          themeTitle: THEMES[currentThemeKey]?.name || 'الكحلي والذهب الكلاسيكي',
        },
        {
          headers: getAuthHeaders(),
        }
      );
      if (res.data?.settings && res.data.settings.occasionGreeting !== undefined) {
        setCustomOccasionGreeting(res.data.settings.occasionGreeting);
      }
      return { success: true };
    } catch (e) {
      console.warn('Occasion greeting save note:', e.message);
      return { success: false, error: e.message };
    }
  };

  // تحديد المناسبة النشطة بدقة مع فرض الأولوية الصارمة:
  // إذا تم ضبط occasionMode صراحة (مثل 'none' أو 'ramadan' أو وضع مخصص)،
  // يتم تجاوز وإيقاف الكشف التلقائي القائم على التقويم تماماً، ولا يُفعّل الفحص التقويمي إلا إذا كانت القيمة صراحة 'auto'.
  let resolvedOccasionKey = 'none';
  if (occasionMode === 'auto') {
    resolvedOccasionKey = detectCurrentOccasionFromCalendar();
  } else if (occasionMode) {
    resolvedOccasionKey = occasionMode;
  }

  const currentOccasion = OCCASIONS[resolvedOccasionKey] || {
    id: resolvedOccasionKey,
    name: resolvedOccasionKey,
    icon: '✨',
    bannerText: '',
  };

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
        setCustomOccasionGreeting,
        saveOccasionGreeting,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

