-- 更新订阅层级以支持新的定价结构和视频生成权限控制
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 1. 添加 is_admin 字段（如果不存在）
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. 更新现有的 subscription_tier 值
UPDATE user_profiles 
SET subscription_tier = CASE 
  WHEN subscription_tier = 'pro' THEN 'basic'
  WHEN subscription_tier = 'enterprise' THEN 'pro'
  ELSE subscription_tier
END
WHERE subscription_tier IN ('pro', 'enterprise');

-- 3. 更新 subscription_tier 的 CHECK 约束
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_subscription_tier_check;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'basic', 'pro', 'max', 'admin'));

-- 4. 验证更新结果
SELECT 
  subscription_tier, 
  is_admin,
  COUNT(*) as user_count 
FROM user_profiles 
GROUP BY subscription_tier, is_admin
ORDER BY subscription_tier, is_admin;
