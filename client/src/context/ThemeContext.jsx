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

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentThemeKey, setCurrentThemeKey] = useState(() => {
    return localStorage.getItem('ssa_active_theme') || 'classic-gold-blue';
  });

  const [activeTheme, setActiveTheme] = useState(THEMES[currentThemeKey] || THEMES['classic-gold-blue']);

  // مزامنة المظهر عند التحميل من الخادم
  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/settings`)
      .then((res) => {
        if (res.data && res.data.activeTheme && THEMES[res.data.activeTheme]) {
          setCurrentThemeKey(res.data.activeTheme);
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

  // دالة تبديل المظهر وحفظه عالمياً
  const switchTheme = async (themeKey) => {
    if (THEMES[themeKey]) {
      setCurrentThemeKey(themeKey);
      localStorage.setItem('ssa_active_theme', themeKey);

      // حفظ التفضيل عالمياً في الباك إند
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

  return (
    <ThemeContext.Provider value={{ currentThemeKey, activeTheme, switchTheme, availableThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
