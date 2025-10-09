-- 修复管理员权限问题
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 1. 添加 is_admin 字段（如果不存在）
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. 检查当前用户配置
SELECT 
  id,
  username,
  display_name,
  subscription_tier,
  is_admin,
  created_at
FROM user_profiles 
ORDER BY created_at DESC
LIMIT 10;

-- 3. 设置当前用户为管理员（请替换为您的实际用户ID或邮箱）
-- 方法1: 通过邮箱设置
UPDATE user_profiles 
SET 
  subscription_tier = 'admin',
  is_admin = true
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'  -- 替换为您的邮箱
);

-- 方法2: 通过用户ID设置（如果您知道用户ID）
-- UPDATE user_profiles 
-- SET 
--   subscription_tier = 'admin',
--   is_admin = true
-- WHERE id = 'your-user-id-here';  -- 替换为您的用户ID

-- 4. 验证管理员设置
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

-- 5. 检查认证用户信息
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at,
  up.username,
  up.display_name,
  up.subscription_tier,
  up.is_admin,
  up.created_at as profile_created_at
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC
LIMIT 5;
