import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enables static exports
  basePath: process.env.NODE_ENV === 'production' ? '/vegetable-ordering' : '',
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
