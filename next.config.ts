import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",   // generates a static /out folder — hostable anywhere
  images: {
    unoptimized: true, // required for static export (no Next.js image server)
  },
};

export default nextConfig;
