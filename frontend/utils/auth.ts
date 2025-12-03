/**
 * Authenticated API request utility
 * Automatically includes JWT token in requests
 */

import { buildApiUrl } from './api';

export interface AuthenticatedRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Make an authenticated API request with JWT token
 */
export async function authenticatedFetch(
  endpoint: string,
  options: AuthenticatedRequestOptions = {}
): Promise<Response> {
  const { requireAuth = true, headers = {}, ...rest } = options;

  // Get JWT token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  if (requireAuth && !token) {
    throw new Error('No authentication token found. Please login.');
  }

  // Build headers with JWT token
  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(buildApiUrl(endpoint), {
    ...rest,
    headers: authHeaders,
    credentials: 'include', // Still include credentials for backward compatibility
  });

  // If unauthorized, clear token and redirect to login
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = '/admin/login';
  }

  return response;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('adminToken');
}

/**
 * Get current admin from localStorage
 */
export function getCurrentAdmin() {
  if (typeof window === 'undefined') return null;
  const adminData = localStorage.getItem('admin');
  return adminData ? JSON.parse(adminData) : null;
}

/**
 * Logout - clear tokens and admin data
 */
export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('adminToken');
  localStorage.removeItem('admin');
  window.location.href = '/admin/login';
}
