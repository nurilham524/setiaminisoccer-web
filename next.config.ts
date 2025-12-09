import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Jika nanti Anda pakai gambar dari Google/tempat lain, tambah disini
    ],
  },
};

export default nextConfig;