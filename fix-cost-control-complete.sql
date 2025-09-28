-- 完整修复成本控制RLS策略和操作类型
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 1. 首先删除现有的表（如果存在）以重新创建
DROP TABLE IF EXISTS api_cost_records CASCADE;
DROP TABLE IF EXISTS user_cost_stats CASCADE;
DROP TABLE IF EXISTS cost_alerts CASCADE;
DROP TABLE IF EXISTS system_cost_stats CASCADE;

-- 2. 重新创建表，使用正确的操作类型
CREATE TABLE api_cost_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_type VARCHAR(50) NOT NULL CHECK (operation_type IN ('IMAGE_GENERATION', 'IMAGE_EDIT', 'VIDEO_GENERATION', 'TEXT_PROCESSING')),
  estimated_cost DECIMAL(10,4) NOT NULL DEFAULT 0,
  actual_cost DECIMAL(10,4),
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_cost_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  daily_cost DECIMAL(10,4) DEFAULT 0,
  monthly_cost DECIMAL(10,4) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cost_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('daily_limit', 'monthly_limit', 'single_request')),
  threshold_percent INTEGER NOT NULL,
  current_cost DECIMAL(10,4) NOT NULL,
  limit_cost DECIMAL(10,4) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT false
);

CREATE TABLE system_cost_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_daily_cost DECIMAL(10,4) DEFAULT 0,
  total_monthly_cost DECIMAL(10,4) DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  average_cost_per_user DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 启用行级安全策略
ALTER TABLE api_cost_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cost_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_cost_stats ENABLE ROW LEVEL SECURITY;

-- 4. 创建RLS策略
-- 用户只能查看自己的成本记录
CREATE POLICY "Users can view own cost records" ON api_cost_records
  FOR SELECT USING (auth.uid() = user_id);

-- 用户只能插入自己的成本记录
CREATE POLICY "Users can insert own cost records" ON api_cost_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户只能查看自己的成本统计
CREATE POLICY "Users can view own cost stats" ON user_cost_stats
  FOR SELECT USING (auth.uid() = user_id);

-- 系统可以插入和更新用户成本统计
CREATE POLICY "System can insert user cost stats" ON user_cost_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update user cost stats" ON user_cost_stats
  FOR UPDATE USING (true);

-- 用户只能查看自己的成本预警
CREATE POLICY "Users can view own cost alerts" ON cost_alerts
  FOR SELECT USING (auth.uid() = user_id);

-- 系统可以插入成本预警
CREATE POLICY "System can insert cost alerts" ON cost_alerts
  FOR INSERT WITH CHECK (true);

-- 管理员可以查看所有记录
CREATE POLICY "Admins can view all cost records" ON api_cost_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND subscription_tier = 'admin'
    )
  );

CREATE POLICY "Admins can view all cost stats" ON user_cost_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND subscription_tier = 'admin'
    )
  );

CREATE POLICY "Admins can view all cost alerts" ON cost_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND subscription_tier = 'admin'
    )
  );

CREATE POLICY "Admins can view system cost stats" ON system_cost_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND subscription_tier = 'admin'
    )
  );

-- 系统可以插入和更新系统成本统计
CREATE POLICY "System can insert system cost stats" ON system_cost_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update system cost stats" ON system_cost_stats
  FOR UPDATE USING (true);

-- 5. 创建索引
CREATE INDEX IF NOT EXISTS idx_api_cost_records_user_created 
ON api_cost_records(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_cost_records_operation_type 
ON api_cost_records(operation_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_cost_stats_user_id 
ON user_cost_stats(user_id);

CREATE INDEX IF NOT EXISTS idx_cost_alerts_user_created 
ON cost_alerts(user_id, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_system_cost_stats_date 
ON system_cost_stats(date DESC);

-- 6. 创建函数：更新用户成本统计
CREATE OR REPLACE FUNCTION update_user_cost_stats()
RETURNS TRIGGER AS $$
DECLARE
  user_tier VARCHAR(20);
  daily_limit DECIMAL(10,4);
  monthly_limit DECIMAL(10,4);
BEGIN
  -- 获取用户订阅层级
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = NEW.user_id;
  
  -- 设置默认值
  user_tier := COALESCE(user_tier, 'free');
  
  -- 根据用户层级设置限制
  CASE user_tier
    WHEN 'free' THEN 
      daily_limit := 0.10;
      monthly_limit := 2.00;
    WHEN 'standard' THEN 
      daily_limit := 5.00;
      monthly_limit := 100.00;
    WHEN 'professional' THEN 
      daily_limit := 20.00;
      monthly_limit := 500.00;
    WHEN 'enterprise' THEN 
      daily_limit := 100.00;
      monthly_limit := 2000.00;
    ELSE 
      daily_limit := 0.10;
      monthly_limit := 2.00;
  END CASE;
  
  -- 更新或插入用户成本统计
  INSERT INTO user_cost_stats (user_id, daily_cost, monthly_cost, last_updated)
  VALUES (
    NEW.user_id,
    (SELECT COALESCE(SUM(actual_cost), 0) FROM api_cost_records 
     WHERE user_id = NEW.user_id AND DATE(created_at) = CURRENT_DATE),
    (SELECT COALESCE(SUM(actual_cost), 0) FROM api_cost_records 
     WHERE user_id = NEW.user_id AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE))
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    daily_cost = (SELECT COALESCE(SUM(actual_cost), 0) FROM api_cost_records 
                  WHERE user_id = NEW.user_id AND DATE(created_at) = CURRENT_DATE),
    monthly_cost = (SELECT COALESCE(SUM(actual_cost), 0) FROM api_cost_records 
                   WHERE user_id = NEW.user_id AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)),
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. 创建触发器
DROP TRIGGER IF EXISTS trigger_update_user_cost_stats ON api_cost_records;
CREATE TRIGGER trigger_update_user_cost_stats
  AFTER INSERT OR UPDATE ON api_cost_records
  FOR EACH ROW
  EXECUTE FUNCTION update_user_cost_stats();

-- 8. 验证创建成功
SELECT 'Cost control schema has been completely fixed!' as status;
