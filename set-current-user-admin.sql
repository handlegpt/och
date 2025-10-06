-- 设置当前用户为管理员
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 1. 首先查看当前用户
SELECT 
  id,
  username,
  display_name,
  subscription_tier,
  is_admin,
  created_at
FROM user_profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. 将最新的用户设置为管理员
UPDATE user_profiles 
SET 
  subscription_tier = 'admin',
  is_admin = true
WHERE id IN (
  SELECT id FROM user_profiles 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- 3. 验证管理员设置
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