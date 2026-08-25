// عنوان الواجهة البرمجية الأساسي (Dynamic API Base URL)
export const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'https://cairo-univ-portal-api.onrender.com'; // (ضع رابط سيرفرك هنا لو عندك رابط محدد، أو اترك الرابط الاحتياطي)

export const API_BASE = `${BACKEND_URL}/api`;

export default API_BASE;