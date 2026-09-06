const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('autoxp_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  
  if (res.status === 401) {
    localStorage.removeItem('autoxp_token');
    // We could reload here, but returning a specific error might be better
    // so the app can handle it gracefully.
    throw new Error('Unauthorized');
  }
  
  if (!res.ok) {
    const errText = await res.text();
    try {
        const errJson = JSON.parse(errText);
        throw new Error(errJson.message || errJson.error || 'API Error');
    } catch (e) {
        throw new Error(errText || 'API Error');
    }
  }
  
  // Handle empty responses
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
