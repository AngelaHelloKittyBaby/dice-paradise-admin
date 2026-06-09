const API_VERSION_PATH = '/api/v1';

export function normalizeApiBaseUrl(baseUrl?: string) {
  const normalizedUrl = (baseUrl?.trim() || API_VERSION_PATH).replace(/\/+$/, '');

  return normalizedUrl.endsWith(API_VERSION_PATH) ? normalizedUrl : `${normalizedUrl}${API_VERSION_PATH}`;
}

export const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
