import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// 服务端 Supabase 客户端
// 用于在服务端组件中访问 Supabase，自动处理会话 cookies
export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}