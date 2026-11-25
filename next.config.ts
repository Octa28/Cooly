import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Onboarding isn't built yet, so everyone starts on the recipes screen (CLAUDE.md 8).
  async redirects() {
    return [{ source: "/", destination: "/recipes", permanent: false }];
  },
};

export default nextConfig;
