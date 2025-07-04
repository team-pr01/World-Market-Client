import type { NextConfig } from "next";

const securityHeaders: { key: string; value: string }[] = [
     {
          key: "Content-Security-Policy",
          value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://unpkg.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      connect-src 'self' https://api.worldmerket.com wss://api.worldmerket.com;
      frame-ancestors 'none';
    `
               .replace(/\s{2,}/g, " ")
               .trim(),
     },
     {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
     },
     {
          key: "X-Frame-Options",
          value: "DENY",
     },
     {
          key: "Cross-Origin-Resource-Policy",
          value: "same-origin",
     },
     {
          key: "X-Content-Type-Options",
          value: "nosniff",
     },
];

const nextConfig: NextConfig = {
     reactStrictMode: true,

     async headers() {
          return [
               {
                    source: "/(.*)",
                    headers: securityHeaders,
               },
          ];
     },
};

export default nextConfig;
