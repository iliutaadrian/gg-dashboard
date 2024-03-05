/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["img.youtube.com"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
};

module.exports = nextConfig;
