-- Och AI 完整数据库Schema
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户配置表（扩展 auth.users）
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 AI 生成记录表 (generation_history)
CREATE TABLE IF NOT EXISTS generation_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  transformation_key VARCHAR(100) NOT NULL,
  transformation_type VARCHAR(50) NOT NULL,
  input_image_url TEXT,
  content_url TEXT,
  output_image_url TEXT,
  prompt TEXT,
  custom_prompt TEXT,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户收藏表 (user_favorites)
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content_url TEXT,
  transformation_key VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建使用统计表
CREATE TABLE IF NOT EXISTS usage_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  generations_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 创建速率限制表
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  identifier VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建订阅计划表
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_yearly DECIMAL(10,2) DEFAULT 0,
  daily_limit INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户订阅表
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建系统设置表
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_generation_history_user_id ON generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_history_created_at ON generation_history(created_at);
CREATE INDEX IF NOT EXISTS idx_generation_history_transformation_key ON generation_history(transformation_key);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_stats_user_date ON usage_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_rate_limits_key_timestamp ON rate_limits(key, timestamp);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);

-- 插入默认订阅计划
INSERT INTO subscription_plans (name, price_monthly, price_yearly, daily_limit, features) VALUES
('free', 0, 0, 50, '["基础 AI 生成", "标准质量", "社区支持"]'),
('pro', 9.99, 99.99, 100, '["高级 AI 生成", "高质量输出", "优先处理", "邮件支持"]'),
('enterprise', 29.99, 299.99, 1000, '["企业级 AI 生成", "最高质量", "API 访问", "专属支持", "自定义模型"]')
ON CONFLICT (name) DO NOTHING;

-- 插入默认系统设置
INSERT INTO system_settings (key, value, description) VALUES
('maintenance_mode', 'false', '系统维护模式'),
('max_file_size_mb', '10', '最大文件上传大小(MB)'),
('allowed_file_types', '["jpg", "jpeg", "png", "webp"]', '允许的文件类型'),
('api_rate_limit', '100', 'API 速率限制(每分钟)'),
('rate_limit_enabled', 'true', 'Enable rate limiting'),
('rate_limit_cleanup_interval', '24', 'Rate limit cleanup interval (hours)'),
('rate_limit_retention_days', '7', 'Rate limit record retention days')
ON CONFLICT (key) DO NOTHING;

-- 设置 Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 用户配置表 RLS 策略
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 生成历史表 RLS 策略
CREATE POLICY "Users can view own generation history" ON generation_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generation history" ON generation_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generation history" ON generation_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generation history" ON generation_history
  FOR DELETE USING (auth.uid() = user_id);

-- 用户收藏表 RLS 策略
CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 使用统计表 RLS 策略
CREATE POLICY "Users can view own usage stats" ON usage_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage stats" ON usage_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 速率限制表 RLS 策略
CREATE POLICY "Users can insert their own rate limit records" ON rate_limits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own rate limit records" ON rate_limits
  FOR SELECT USING (true);

CREATE POLICY "System can delete expired records" ON rate_limits
  FOR DELETE USING (timestamp < NOW() - INTERVAL '1 day');

-- 用户订阅表 RLS 策略
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- 创建触发器：自动创建用户配置
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 创建函数：检查用户使用限制
CREATE OR REPLACE FUNCTION check_user_usage_limit(user_uuid UUID)
RETURNS TABLE(
  daily_limit INTEGER,
  used_today INTEGER,
  remaining INTEGER,
  can_generate BOOLEAN
) AS $$
DECLARE
  user_tier VARCHAR(20);
  limit_count INTEGER;
  used_count INTEGER;
BEGIN
  -- Get user subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = user_uuid;
  
  -- Set default value
  user_tier := COALESCE(user_tier, 'free');
  
  -- Set limits based on subscription tier
  CASE user_tier
    WHEN 'free' THEN limit_count := 50;
    WHEN 'pro' THEN limit_count := 100;
    WHEN 'enterprise' THEN limit_count := 1000;
    WHEN 'admin' THEN limit_count := 10000;
    ELSE limit_count := 50;
  END CASE;
  
  -- Calculate today's usage
  SELECT COUNT(*) INTO used_count
  FROM generation_history
  WHERE user_id = user_uuid
    AND DATE(created_at) = CURRENT_DATE
    AND status = 'completed';
  
  -- Return results
  RETURN QUERY SELECT
    limit_count,
    used_count,
    GREATEST(0, limit_count - used_count),
    (used_count < limit_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：检查速率限制
CREATE OR REPLACE FUNCTION check_rate_limit(
  limit_key VARCHAR(255),
  identifier VARCHAR(255),
  max_requests INTEGER,
  window_minutes INTEGER
)
RETURNS TABLE(
  allowed BOOLEAN,
  remaining INTEGER,
  reset_time TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  window_start TIMESTAMP WITH TIME ZONE;
  request_count INTEGER;
  reset_timestamp TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate window start time
  window_start := NOW() - (window_minutes || ' minutes')::INTERVAL;
  
  -- Count requests within the window
  SELECT COUNT(*) INTO request_count
  FROM rate_limits
  WHERE key = limit_key
    AND identifier = check_rate_limit.identifier
    AND timestamp >= window_start;
  
  -- Calculate reset time
  SELECT COALESCE(MIN(timestamp), NOW()) + (window_minutes || ' minutes')::INTERVAL
  INTO reset_timestamp
  FROM rate_limits
  WHERE key = limit_key
    AND identifier = check_rate_limit.identifier
    AND timestamp >= window_start;
  
  -- Return results
  RETURN QUERY SELECT
    (request_count < max_requests),
    GREATEST(0, max_requests - request_count - 1),
    reset_timestamp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：清理过期的速率限制记录
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
  -- Delete records older than 7 days
  DELETE FROM rate_limits 
  WHERE timestamp < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
