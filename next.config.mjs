// next.config.mjs
import withPWA from 'next-pwa';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

const withPwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

// Combine manually to avoid passing unwanted keys to GenerateSW
export default {
  ...baseConfig,
  ...withPwaConfig,
  webpack(config, options) {
    if (withPwaConfig.webpack) {
      return withPwaConfig.webpack(config, options);
    }
    return config;
  },
};
