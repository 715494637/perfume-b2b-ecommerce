import { createClient } from '@supabase/supabase-js'

// 管理员 Supabase 客户端
// 使用 service_role key，拥有最高权限，可以绕过 RLS 策略
// 注意：这个客户端只能在服务端使用，且要严格保密
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default supabaseAdmin