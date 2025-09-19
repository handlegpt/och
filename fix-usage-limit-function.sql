-- 修复使用限制函数 - 更新表名和限制数量
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 删除现有函数
DROP FUNCTION IF EXISTS check_user_usage_limit(UUID);

-- 重新创建函数：检查用户使用限制
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
    WHEN 'free' THEN limit_count := 50;  -- 更新为50次
    WHEN 'pro' THEN limit_count := 100;
    WHEN 'enterprise' THEN limit_count := 1000;
    WHEN 'admin' THEN limit_count := 10000;
    ELSE limit_count := 50;
  END CASE;
  
  -- Calculate today's usage (使用正确的表名 ai_generations)
  SELECT COUNT(*) INTO used_count
  FROM ai_generations
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

-- 测试函数
SELECT * FROM check_user_usage_limit('00000000-0000-0000-0000-000000000000'::UUID);
