/**
 * API utility functions
 */

/**
 * Get the API base URL from environment variables
 */
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
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
