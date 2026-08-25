export const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'https://cairo-univ-appportal-api.onrender.com';

export const API_BASE = `${BACKEND_URL}/api`;

export default API_BASE;