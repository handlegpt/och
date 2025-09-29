-- Och AI Supabase 数据库设计
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

-- 创建 AI 生成记录表
CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transformation_type VARCHAR(50) NOT NULL,
  input_image_url TEXT,
  output_image_url TEXT,
  content_url TEXT,
  prompt TEXT,
  custom_prompt TEXT,
  title TEXT,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
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
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at ON ai_generations(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_stats_user_date ON usage_stats(user_id, date);

-- 插入默认订阅计划
INSERT INTO subscription_plans (name, price_monthly, price_yearly, daily_limit, features) VALUES
('free', 0, 0, 10, '["基础 AI 生成", "标准质量", "社区支持"]'),
('pro', 9.99, 99.99, 100, '["高级 AI 生成", "高质量输出", "优先处理", "邮件支持"]'),
('enterprise', 29.99, 299.99, 1000, '["企业级 AI 生成", "最高质量", "API 访问", "专属支持", "自定义模型"]')
ON CONFLICT (name) DO NOTHING;

-- 插入默认系统设置
INSERT INTO system_settings (key, value, description) VALUES
('maintenance_mode', 'false', '系统维护模式'),
('max_file_size_mb', '10', '最大文件上传大小(MB)'),
('allowed_file_types', '["jpg", "jpeg", "png", "webp"]', '允许的文件类型'),
('api_rate_limit', '100', 'API 速率限制(每分钟)')
ON CONFLICT (key) DO NOTHING;

-- 设置 Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 用户配置表 RLS 策略
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- AI 生成记录表 RLS 策略
CREATE POLICY "Users can view own generations" ON ai_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 使用统计表 RLS 策略
CREATE POLICY "Users can view own usage stats" ON usage_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage stats" ON usage_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

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
RETURNS JSON AS $$
DECLARE
  user_tier VARCHAR(20);
  daily_limit INTEGER;
  today_usage INTEGER;
  result JSON;
BEGIN
  -- 获取用户订阅等级
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = user_uuid;
  
  -- 获取每日限制
  SELECT daily_limit INTO daily_limit
  FROM subscription_plans
  WHERE name = COALESCE(user_tier, 'free');
  
  -- 获取今日使用量
  SELECT COALESCE(generations_count, 0) INTO today_usage
  FROM usage_stats
  WHERE user_id = user_uuid AND date = CURRENT_DATE;
  
  -- 构建结果
  result := json_build_object(
    'can_generate', (today_usage < daily_limit),
    'daily_limit', daily_limit,
    'used_today', today_usage,
    'remaining', GREATEST(0, daily_limit - today_usage),
    'subscription_tier', user_tier
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
