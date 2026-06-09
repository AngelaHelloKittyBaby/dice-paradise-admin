/** @type {import('next').NextConfig} */
const {
  API_VERSION_PATH,
  DEFAULT_BACKEND_ORIGIN,
  normalizeBackendOrigin,
} = require('./config/backend');

const apiProxyTarget = normalizeBackendOrigin(process.env.API_PROXY_TARGET || DEFAULT_BACKEND_ORIGIN);

const nextConfig = {
  async rewrites() {
    return [
      {
        source: `${API_VERSION_PATH}/:path*`,
        destination: `${apiProxyTarget}${API_VERSION_PATH}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
