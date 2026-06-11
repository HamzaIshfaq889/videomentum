import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   basePath: "/v3",

   async redirects() {
    return [
      // Redirect root to /v3/watch (handles localhost:3000)
      {
        source: "/",
        destination: "/v3/watch",
        permanent: false,
        basePath: false, // This redirect applies before basePath
      },
      {
        source: "/home",
        destination: "/watch",
        permanent: false, // set true if you want 301
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "videomentum.com", pathname: "/**" },
      { protocol: "https", hostname: "bigscreenaction.com", pathname: "/**" },
      { protocol: "https", hostname: "deadlygrace.com", pathname: "/**" },
      { protocol: "https", hostname: "amerikickaction.com", pathname: "/**" },
      { protocol: "https", hostname: "screencombat.com", pathname: "/**" },
      { protocol: "https", hostname: "deadlydymes.com", pathname: "/**" },
      { protocol: "https", hostname: "supersistas.com", pathname: "/**" },
      { protocol: "https", hostname: "goddessfury.com", pathname: "/**" },
      { protocol: "https", hostname: "finishergirls.com", pathname: "/**" },
      { protocol: "https", hostname: "killercontinent.com", pathname: "/**" },
      { protocol: "https", hostname: "ironnoise.com", pathname: "/**" },
      { protocol: "https", hostname: "mashanavision.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
