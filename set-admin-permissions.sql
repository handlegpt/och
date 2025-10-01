-- 设置管理员权限
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 将 subscription_tier 为 'admin' 的用户设置为管理员
UPDATE user_profiles 
SET is_admin = true 
WHERE subscription_tier = 'admin';

-- 验证管理员设置
SELECT 
  id,
  username,
  display_name,
  subscription_tier,
  is_admin,
  created_at
FROM user_profiles 
WHERE is_admin = true OR subscription_tier = 'admin'
ORDER BY created_at DESC;
