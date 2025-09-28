-- 成本控制数据库Schema
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 创建API成本记录表
CREATE TABLE IF NOT EXISTS api_cost_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_type VARCHAR(50) NOT NULL CHECK (operation_type IN ('IMAGE_GENERATION', 'IMAGE_EDIT', 'VIDEO_GENERATION', 'TEXT_PROCESSING')),
  estimated_cost DECIMAL(10,4) NOT NULL DEFAULT 0,
  actual_cost DECIMAL(10,4),
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户成本统计表（用于快速查询）
CREATE TABLE IF NOT EXISTS user_cost_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  daily_cost DECIMAL(10,4) DEFAULT 0,
  monthly_cost DECIMAL(10,4) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建成本预警表
CREATE TABLE IF NOT EXISTS cost_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('daily_limit', 'monthly_limit', 'single_request')),
  threshold_percent INTEGER NOT NULL,
  current_cost DECIMAL(10,4) NOT NULL,
  limit_cost DECIMAL(10,4) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT false
);

-- 创建系统成本统计表
CREATE TABLE IF NOT EXISTS system_cost_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_daily_cost DECIMAL(10,4) DEFAULT 0,
  total_monthly_cost DECIMAL(10,4) DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  average_cost_per_user DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全策略
ALTER TABLE api_cost_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cost_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_cost_stats ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的成本记录
CREATE POLICY "Users can view own cost records" ON api_cost_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own cost stats" ON user_cost_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own cost alerts" ON cost_alerts
  FOR SELECT USING (auth.uid() = user_id);

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

-- 创建索引以提高查询性能
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

-- 创建函数：更新用户成本统计
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
  
  -- 检查是否需要发送预警
  PERFORM check_and_send_cost_alert(NEW.user_id, daily_limit, monthly_limit);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_user_cost_stats ON api_cost_records;
CREATE TRIGGER trigger_update_user_cost_stats
  AFTER INSERT OR UPDATE ON api_cost_records
  FOR EACH ROW
  EXECUTE FUNCTION update_user_cost_stats();

-- 创建函数：检查并发送成本预警
CREATE OR REPLACE FUNCTION check_and_send_cost_alert(
  p_user_id UUID,
  p_daily_limit DECIMAL(10,4),
  p_monthly_limit DECIMAL(10,4)
)
RETURNS void AS $$
DECLARE
  daily_cost DECIMAL(10,4);
  monthly_cost DECIMAL(10,4);
  daily_percent INTEGER;
  monthly_percent INTEGER;
BEGIN
  -- 获取用户当前成本
  SELECT 
    COALESCE(SUM(actual_cost), 0),
    COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN actual_cost ELSE 0 END), 0)
  INTO monthly_cost, daily_cost
  FROM api_cost_records
  WHERE user_id = p_user_id;
  
  -- 计算使用百分比
  daily_percent := CASE WHEN p_daily_limit > 0 THEN (daily_cost / p_daily_limit * 100)::INTEGER ELSE 0 END;
  monthly_percent := CASE WHEN p_monthly_limit > 0 THEN (monthly_cost / p_monthly_limit * 100)::INTEGER ELSE 0 END;
  
  -- 检查是否需要发送预警（80% 或 100%）
  IF daily_percent >= 80 OR monthly_percent >= 80 THEN
    -- 检查是否已经发送过相同类型的预警
    IF NOT EXISTS (
      SELECT 1 FROM cost_alerts 
      WHERE user_id = p_user_id 
      AND alert_type = CASE WHEN daily_percent >= 100 OR monthly_percent >= 100 THEN 'daily_limit' ELSE 'monthly_limit' END
      AND DATE(sent_at) = CURRENT_DATE
    ) THEN
      -- 插入预警记录
      INSERT INTO cost_alerts (user_id, alert_type, threshold_percent, current_cost, limit_cost)
      VALUES (
        p_user_id,
        CASE WHEN daily_percent >= 100 OR monthly_percent >= 100 THEN 'daily_limit' ELSE 'monthly_limit' END,
        CASE WHEN daily_percent >= 100 OR monthly_percent >= 100 THEN 100 ELSE 80 END,
        CASE WHEN daily_percent >= 100 OR monthly_percent >= 100 THEN daily_cost ELSE monthly_cost END,
        CASE WHEN daily_percent >= 100 OR monthly_percent >= 100 THEN p_daily_limit ELSE p_monthly_limit END
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 创建函数：获取用户成本统计
CREATE OR REPLACE FUNCTION get_user_cost_stats(p_user_id UUID)
RETURNS TABLE(
  daily_cost DECIMAL(10,4),
  monthly_cost DECIMAL(10,4),
  daily_limit DECIMAL(10,4),
  monthly_limit DECIMAL(10,4),
  can_make_request BOOLEAN,
  remaining_daily DECIMAL(10,4),
  remaining_monthly DECIMAL(10,4)
) AS $$
DECLARE
  user_tier VARCHAR(20);
  daily_limit DECIMAL(10,4);
  monthly_limit DECIMAL(10,4);
  current_daily_cost DECIMAL(10,4);
  current_monthly_cost DECIMAL(10,4);
BEGIN
  -- 获取用户订阅层级
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = p_user_id;
  
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
  
  -- 获取当前成本
  SELECT 
    COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN actual_cost ELSE 0 END), 0),
    COALESCE(SUM(actual_cost), 0)
  INTO current_daily_cost, current_monthly_cost
  FROM api_cost_records
  WHERE user_id = p_user_id;
  
  -- 返回结果
  RETURN QUERY SELECT
    current_daily_cost,
    current_monthly_cost,
    daily_limit,
    monthly_limit,
    (current_daily_cost < daily_limit AND current_monthly_cost < monthly_limit),
    GREATEST(0, daily_limit - current_daily_cost),
    GREATEST(0, monthly_limit - current_monthly_cost);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：检查用户预算
CREATE OR REPLACE FUNCTION check_user_budget(
  p_user_id UUID,
  p_operation_type VARCHAR(50),
  p_estimated_cost DECIMAL(10,4)
)
RETURNS TABLE(
  allowed BOOLEAN,
  reason TEXT,
  daily_cost DECIMAL(10,4),
  monthly_cost DECIMAL(10,4),
  daily_limit DECIMAL(10,4),
  monthly_limit DECIMAL(10,4)
) AS $$
DECLARE
  user_tier VARCHAR(20);
  daily_limit DECIMAL(10,4);
  monthly_limit DECIMAL(10,4);
  max_single_request DECIMAL(10,4);
  current_daily_cost DECIMAL(10,4);
  current_monthly_cost DECIMAL(10,4);
BEGIN
  -- 获取用户订阅层级
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- 设置默认值
  user_tier := COALESCE(user_tier, 'free');
  
  -- 根据用户层级设置限制
  CASE user_tier
    WHEN 'free' THEN 
      daily_limit := 0.10;
      monthly_limit := 2.00;
      max_single_request := 0.05;
    WHEN 'standard' THEN 
      daily_limit := 5.00;
      monthly_limit := 100.00;
      max_single_request := 0.50;
    WHEN 'professional' THEN 
      daily_limit := 20.00;
      monthly_limit := 500.00;
      max_single_request := 2.00;
    WHEN 'enterprise' THEN 
      daily_limit := 100.00;
      monthly_limit := 2000.00;
      max_single_request := 10.00;
    ELSE 
      daily_limit := 0.10;
      monthly_limit := 2.00;
      max_single_request := 0.05;
  END CASE;
  
  -- 检查单次请求限制
  IF p_estimated_cost > max_single_request THEN
    RETURN QUERY SELECT
      false,
      'Single request cost exceeds limit',
      current_daily_cost,
      current_monthly_cost,
      daily_limit,
      monthly_limit;
  END IF;
  
  -- 获取当前成本
  SELECT 
    COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN actual_cost ELSE 0 END), 0),
    COALESCE(SUM(actual_cost), 0)
  INTO current_daily_cost, current_monthly_cost
  FROM api_cost_records
  WHERE user_id = p_user_id;
  
  -- 检查是否超出限制
  IF current_daily_cost + p_estimated_cost > daily_limit THEN
    RETURN QUERY SELECT
      false,
      'Daily cost limit would be exceeded',
      current_daily_cost,
      current_monthly_cost,
      daily_limit,
      monthly_limit;
  ELSIF current_monthly_cost + p_estimated_cost > monthly_limit THEN
    RETURN QUERY SELECT
      false,
      'Monthly cost limit would be exceeded',
      current_daily_cost,
      current_monthly_cost,
      daily_limit,
      monthly_limit;
  ELSE
    RETURN QUERY SELECT
      true,
      'Request allowed',
      current_daily_cost,
      current_monthly_cost,
      daily_limit,
      monthly_limit;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 测试函数
SELECT 'Cost control schema created successfully!' as status;
