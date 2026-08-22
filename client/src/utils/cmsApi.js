import { API_BASE } from '../config/api';

export const fetchHubContent = async (hub, params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE}/cms/${hub}${query ? `?${query}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch hub content');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn(`[CMS API] Fetch failed for hub ${hub}:`, err.message);
    return [];
  }
};

export const createHubContent = async (hub, contentData) => {
  const url = `${API_BASE}/cms/${hub}`;
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(contentData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create content');
  return data.data;
};

export const updateHubContent = async (id, updateData) => {
  const url = `${API_BASE}/cms/${id}`;
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(updateData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update content');
  return data.data;
};

export const deleteHubContent = async (id) => {
  const url = `${API_BASE}/cms/${id}`;
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete content');
  return data.deletedId || id;
};
