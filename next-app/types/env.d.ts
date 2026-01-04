/**
 * 环境变量类型定义
 * 为 Next.js 环境变量提供 TypeScript 类型安全
 */

// 扩展 Next.js 的环境变量类型
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ==========================================
      // Supabase 配置
      // ==========================================
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;

      // ==========================================
      // Creem 支付网关配置
      // ==========================================
      CREEM_API_KEY: string;
      CREEM_WEBHOOK_SECRET: string;

      // ==========================================
      // Google OAuth 配置
      // ==========================================
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      // ==========================================
      // Cloudflare 配置
      // ==========================================
      CLOUDFLARE_ACCOUNT_ID: string;
      CLOUDFLARE_ACCESS_KEY: string;
      CLOUDFLARE_BUCKET: string;

      // ==========================================
      // 应用配置
      // ==========================================
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_APP_NAME: string;
    }
  }
}

export {};