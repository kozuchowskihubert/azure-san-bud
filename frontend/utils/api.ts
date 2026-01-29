/**
 * API utility functions
 */

/**
 * Get the API base URL from environment variables
 */
export const getApiUrl = (): string => {
  // For Next.js API routes, we want to use relative paths (same origin)
  // regardless of environment (dev or prod)
  return '';
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
    // No credentials needed - using JWT in Authorization header
  });
};
