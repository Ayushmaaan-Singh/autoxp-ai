import { apiFetch } from './api';

/**
 * Register a new account. Returns { access_token, user }.
 * Stores the JWT in localStorage automatically.
 */
export async function registerUser(displayName, email, password) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ displayName, email, password }),
  });
  if (data.access_token) {
    localStorage.setItem('autoxp_token', data.access_token);
  }
  return data;
}

/**
 * Login with email + password. Returns { access_token, user }.
 * Stores the JWT in localStorage automatically.
 */
export async function loginUser(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.access_token) {
    localStorage.setItem('autoxp_token', data.access_token);
  }
  return data;
}

/**
 * Fetch the currently authenticated user profile from /api/auth/me.
 * Returns the user object, or null if not authenticated / token expired.
 */
export async function fetchCurrentUser() {
  const token = localStorage.getItem('autoxp_token');
  if (!token) return null;
  try {
    return await apiFetch('/auth/me');
  } catch {
    localStorage.removeItem('autoxp_token');
    return null;
  }
}

/**
 * Update user profile fields (displayName, location, phone).
 */
export async function updateUserProfile(updates) {
  return apiFetch('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export function logout() {
  localStorage.removeItem('autoxp_token');
}

export function getStoredToken() {
  return localStorage.getItem('autoxp_token');
}
