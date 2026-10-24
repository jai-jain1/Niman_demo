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
  // Until there is a Niman homepage, the root opens the live demo invitation.
  async redirects() {
    return [{ source: "/", destination: "/i/arjun-weds-meera", permanent: false }];
  },
};

export default nextConfig;
