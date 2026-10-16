// ========================================================
// إعدادات الروابط والاتصال بالسيرفر (API & Socket.IO)
// ديناميكي: Render للإنتاج و Localhost للتطوير المحلي
// ========================================================

// رابط الباك إند الحي على Render (وضع الإنتاج)
export const PRODUCTION_BACKEND_URL = 'https://cairo-univ-portal.onrender.com';

// رابط الباك إند المحلي (وضع التطوير)
export const LOCAL_BACKEND_URL = 'http://localhost:5000';

// فحص البيئة الحالية بدقة (تطوير محلي أم إنتاج)
const isDev = Boolean(
  import.meta.env?.DEV ||
  import.meta.env?.MODE === 'development' ||
  (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.endsWith('.local')) &&
    import.meta.env?.MODE !== 'production')
);

// تحديد الرابط الأساسي للسيرفر:
// 1. إذا وُجد متغير بيئة صريح في .env.development أو .env.production يتم استخدامه
// 2. في وضع التطوير المحلي (Development)، يتجه تلقائياً إلى http://localhost:5000
// 3. في وضع الإنتاج (Production على Hostinger أو Vercel)، يتجه تلقائياً إلى https://cairo-univ-portal.onrender.com
const envBackendUrl = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) ||
  ''
).trim().replace(/\/+$/, '');

export const BACKEND_URL =
  envBackendUrl || (isDev ? LOCAL_BACKEND_URL : PRODUCTION_BACKEND_URL);

// رابط الـ API الرئيسي
const envApiBase = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  ''
).trim().replace(/\/+$/, '');

export const API_BASE = envApiBase || `${BACKEND_URL}/api`;

// رابط خادم Socket.IO الحي
const envSocketUrl = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SOCKET_URL) ||
  ''
).trim().replace(/\/+$/, '');

export const SOCKET_URL = envSocketUrl || BACKEND_URL;

export default {
  PRODUCTION_BACKEND_URL,
  LOCAL_BACKEND_URL,
  BACKEND_URL,
  API_BASE,
  SOCKET_URL,
};