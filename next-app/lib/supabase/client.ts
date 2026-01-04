'use client'

import { createBrowserClient } from '@supabase/ssr'

// 客户端 Supabase 客户端
// 用于在客户端组件中访问 Supabase
export const createClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)