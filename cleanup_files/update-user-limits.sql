-- 更新用户限制函数 - 匹配新的定价结构
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
  -- 获取用户订阅层级
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = user_uuid;
  
  -- 设置默认值
  user_tier := COALESCE(user_tier, 'free');
  
  -- 根据新的定价结构设置限制
  CASE user_tier
    WHEN 'free' THEN limit_count := 3;        -- 免费用户：3次/月
    WHEN 'basic' THEN limit_count := 50;      -- 基础版：50次/月
    WHEN 'pro' THEN limit_count := 200;       -- 专业版：200次/月
    WHEN 'max' THEN limit_count := 500;       -- 旗舰版：500次/月
    WHEN 'admin' THEN limit_count := 10000;   -- 管理员：10000次/月
    ELSE limit_count := 3;  -- 默认免费用户限制
  END CASE;
  
  -- 计算本月使用量（注意：这里实际是每月限制，但函数名保持daily_limit以兼容现有代码）
  SELECT COUNT(*) INTO used_count
  FROM ai_generations
  WHERE user_id = user_uuid
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    AND status = 'completed';
  
  -- 返回结果
  RETURN QUERY SELECT
    limit_count,
    used_count,
    GREATEST(0, limit_count - used_count),
    (used_count < limit_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 验证函数创建成功
SELECT 'Function updated successfully' as status;

-- 显示新的限制设置
SELECT 
  'Updated user limits:' as message,
  'Free: 3/month, Basic: 50/month, Pro: 200/month, Max: 500/month' as limits;
