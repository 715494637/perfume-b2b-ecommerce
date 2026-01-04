'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// 客户端 Supabase 客户端
// 用于在客户端组件中访问 Supabase
export const createClient = () => createClientComponentClient()