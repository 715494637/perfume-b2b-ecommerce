-- ==========================================
-- 认证系统迁移：从 Supabase Auth 迁移到自定义认证
-- ==========================================

-- 步骤 1: 删除 Supabase Auth 触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 步骤 2: 修改 profiles 表结构
-- 添加认证相关字段
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verification_token TEXT,
  ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS reset_token TEXT,
  ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

-- 步骤 3: 设置 id 列默认值（不再依赖 auth.users）
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 步骤 4: 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_token ON profiles(verification_token);
CREATE INDEX IF NOT EXISTS idx_profiles_reset_token ON profiles(reset_token);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON profiles(email_verified);

-- 步骤 5: 更新 RLS 策略
-- 删除旧的 RLS 策略
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- 创建新的 RLS 策略
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

-- 步骤 6: 创建验证令牌清理函数
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  -- 清理过期的验证令牌
  UPDATE profiles
  SET verification_token = NULL,
      verification_token_expires_at = NULL
  WHERE verification_token_expires_at < NOW();

  -- 清理过期的重置令牌
  UPDATE profiles
  SET reset_token = NULL,
      reset_token_expires_at = NULL
  WHERE reset_token_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 步骤 7: 创建定时任务清理过期令牌（使用 pg_cron，如果已安装）
-- SELECT cron.schedule('cleanup-tokens', '0 2 * * *', 'SELECT cleanup_expired_tokens();');

-- 完成
-- 注意：现有用户数据需要迁移
-- 对于已注册用户（使用 Supabase Auth），需要：
-- 1. 创建新的密码哈希（需要用户重新设置密码）
-- 2. 或者提供密码重置流程