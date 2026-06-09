const API_VERSION_PATH = '/api/v1';

// 默认后端地址集中写在这里，后续换环境优先改这个值。
const DEFAULT_BACKEND_ORIGIN = 'http://192.168.21.17:8000';

function normalizeBackendOrigin(origin = DEFAULT_BACKEND_ORIGIN) {
  return origin.trim().replace(/\/+$/, '');
}

function normalizeApiBaseUrl(baseUrl = API_VERSION_PATH) {
  const normalizedUrl = baseUrl.trim().replace(/\/+$/, '');

  return normalizedUrl.endsWith(API_VERSION_PATH) ? normalizedUrl : `${normalizedUrl}${API_VERSION_PATH}`;
}

module.exports = {
  API_VERSION_PATH,
  DEFAULT_BACKEND_ORIGIN,
  normalizeApiBaseUrl,
  normalizeBackendOrigin,
};
