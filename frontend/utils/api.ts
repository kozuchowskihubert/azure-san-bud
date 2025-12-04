/**
 * API utility functions
 */

/**
 * Get the API base URL from environment variables
 */
export const getApiUrl = (): string => {
  // In production, if NEXT_PUBLIC_API_URL is not set, use the production backend URL
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If we're in production (deployed) and no env var is set, use production URL
  if (!envUrl && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'sanbud24.pl' || hostname === 'www.sanbud24.pl') {
      return 'https://app-sanbud-api-prod.azurewebsites.net';
    }
    if (hostname.includes('azurestaticapps.net')) {
      return 'https://app-sanbud-api-prod.azurewebsites.net';
    }
  }
  
  return envUrl || 'http://localhost:5002';
};

/**
 * Build a full API endpoint URL
 */
export const buildApiUrl = (path: string): string => {
  const baseUrl = getApiUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};

/**
 * Get authentication headers with JWT token
 */
export const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add JWT token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

/**
 * Authenticated fetch wrapper
 */
export const authFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const url = buildApiUrl(path);
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
};
