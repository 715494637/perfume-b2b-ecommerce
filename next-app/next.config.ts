import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 环境变量配置 - 仅配置服务端使用的变量
  // NEXT_PUBLIC_* 前缀的变量会自动暴露到浏览器端，无需显式配置
  env: {
    // Supabase (服务端使用)
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

    // Creem 支付 (服务端使用)
    CREEM_API_KEY: process.env.CREEM_API_KEY,
    CREEM_WEBHOOK_SECRET: process.env.CREEM_WEBHOOK_SECRET,

    // Google OAuth (服务端使用)
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    // Cloudflare (服务端使用)
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_ACCESS_KEY: process.env.CLOUDFLARE_ACCESS_KEY,
    CLOUDFLARE_BUCKET: process.env.CLOUDFLARE_BUCKET,
  },
};

export default nextConfig;
