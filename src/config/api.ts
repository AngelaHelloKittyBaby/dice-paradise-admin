import { API_VERSION_PATH, normalizeApiBaseUrl } from '../../config/backend';

export { API_VERSION_PATH, normalizeApiBaseUrl };
export const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || API_VERSION_PATH);
