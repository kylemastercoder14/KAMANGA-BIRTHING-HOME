import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "scontent.fmnl19-1.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "one-market-philippines.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
