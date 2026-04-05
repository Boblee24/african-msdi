/** @type {import('next').NextConfig} */
const nextConfig = {
  // Leaflet requires this to avoid SSR issues with window
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
