-- 修复免费用户额度设置 - 统一为3次免费生成
-- 在 Supabase SQL Editor 中运行此脚本

-- 1. 删除现有的使用限制函数
DROP FUNCTION IF EXISTS check_user_usage_limit(UUID);

-- 2. 重新创建函数：检查用户使用限制
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
  -- 获取用户订阅层级
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = user_uuid;
  
  -- 设置默认值
  user_tier := COALESCE(user_tier, 'free');
  
  -- 根据用户层级设置限制
  CASE user_tier
    WHEN 'free' THEN limit_count := 3;  -- 免费用户：3次生成
    WHEN 'pro' THEN limit_count := 100;
    WHEN 'enterprise' THEN limit_count := 1000;
    WHEN 'admin' THEN limit_count := 10000;
    ELSE limit_count := 3;  -- 默认免费用户限制
  END CASE;
  
  -- 计算今日使用量
  SELECT COUNT(*) INTO used_count
  FROM ai_generations
  WHERE user_id = user_uuid
    AND DATE(created_at) = CURRENT_DATE
    AND status = 'completed';
  
  -- 返回结果
  RETURN QUERY SELECT
    limit_count,
    used_count,
    GREATEST(0, limit_count - used_count),
    (used_count < limit_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 验证函数创建成功
SELECT 'Function created successfully' as status;

-- 4. 测试函数（使用一个测试UUID）
SELECT * FROM check_user_usage_limit('00000000-0000-0000-0000-000000000000'::UUID);

-- 5. 显示当前设置
SELECT 
  'Free user limit set to 3 generations per day' as message,
  'This matches the homepage display' as note;
