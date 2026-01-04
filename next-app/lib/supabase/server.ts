import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 服务端 Supabase 客户端
// 用于在服务端组件中访问 Supabase，自动处理会话 cookies
export const createClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            cookieStore.set(name, value)
          )
        },
      },
    }
  )
}