import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, './app'),
      components: resolve(__dirname, './app/_components'),
      utils: resolve(__dirname, './app/_lib/utils'),
      ui: resolve(__dirname, './app/_components/ui'),
      lib: resolve(__dirname, './app/_lib'),
      hooks: resolve(__dirname, './app/_hooks'),
    };
    return config;
  },
};

export default nextConfig;