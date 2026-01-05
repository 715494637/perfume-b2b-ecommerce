-- 删除 Supabase Auth 相关的触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 修改 profiles 表，添加自定义认证字段
ALTER TABLE profiles
ADD COLUMN password_hash TEXT NOT NULL,
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_token TEXT,
ADD COLUMN verification_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN reset_token TEXT,
ADD COLUMN reset_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE;

-- 由于不再依赖 auth.users，需要设置默认值
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 创建索引以提高查询性能
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_verification_token ON profiles(verification_token);
CREATE INDEX idx_profiles_reset_token ON profiles(reset_token);
CREATE INDEX idx_profiles_email_verified ON profiles(email_verified);

-- 创建更新 updated_at 的触发器函数（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 profiles 表创建更新触发器
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();