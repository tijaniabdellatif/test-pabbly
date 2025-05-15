import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Add any Node.js modules that might cause issues
        net: false,
        tls: false,
        dns: false,
        fs: false,
        path: false,
        http: false,
        https: false,
        crypto: false,
      };
    }
    return config;
  },
 
};

export default nextConfig;
