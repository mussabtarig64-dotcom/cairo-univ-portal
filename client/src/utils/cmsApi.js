import { API_BASE } from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('ssa_token');
  return {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchHubContent = async (hub, params = {}) => {
  try {
    const query = new URLSearchParams({ ...params, _t: Date.now() }).toString();
    const url = `${API_BASE}/cms/${hub}${query ? `?${query}` : ''}`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch hub content (${res.status})`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn(`[CMS API] Fetch failed for hub ${hub}:`, err.message);
    return [];
  }
};

export const createHubContent = async (hub, contentData) => {
  const url = `${API_BASE}/cms/${hub}`;
  const isFormData = contentData instanceof FormData;
  const authHeaders = getAuthHeaders();

  const headers = { ...authHeaders };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: isFormData ? contentData : JSON.stringify(contentData),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to create content');
  }
  return data.data;
};

export const updateHubContent = async (id, updateData, hub = null) => {
  const url = hub ? `${API_BASE}/cms/${hub}/${id}` : `${API_BASE}/cms/${id}`;
  const isFormData = updateData instanceof FormData;
  const authHeaders = getAuthHeaders();

  const headers = { ...authHeaders };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: isFormData ? updateData : JSON.stringify(updateData),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update content');
  }
  return data.data;
};

export const deleteHubContent = async (id, hub = null) => {
  const url = hub ? `${API_BASE}/cms/${hub}/${id}` : `${API_BASE}/cms/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to delete content');
  }
  return data.deletedId || id;
};

