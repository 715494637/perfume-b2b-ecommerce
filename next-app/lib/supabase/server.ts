import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// 服务端 Supabase 客户端
// 用于在服务端组件中访问 Supabase 数据库
export const createClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Admin 客户端 - 使用 service role key 绕过 RLS 策略
// 仅用于服务端需要绕过 RLS 的操作（如检查重复邮箱）
export const createAdminClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}