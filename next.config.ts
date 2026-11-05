import type { NextConfig } from "next";

/**
 * PGlite là DB dạng file (single-process). Khi Next.js build song song nhiều worker,
 * mỗi worker sẽ cố mở cùng một file DB -> PGlite abort với "RuntimeError: Aborted()".
 * Vì vậy: nếu đang dùng PGlite (không có DATABASE_URL postgres), ép build chạy 1 worker
 * và tắt worker threads để toàn bộ build dùng chung 1 instance DB.
 */
const usingPglite = !/^postgres(ql)?:\/\//i.test(
  (process.env.DATABASE_URL ?? "").trim(),
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // PGlite phải được bundle ngoài để Node đọc được file WASM/data dir
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
  ...(usingPglite
    ? {
        experimental: {
          cpus: 1,
          workerThreads: false,
        },
      }
    : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/product/:id", destination: "/san-pham", permanent: false },
      { source: "/category/:slug", destination: "/danh-muc/:slug", permanent: true },
      { source: "/blogs/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
