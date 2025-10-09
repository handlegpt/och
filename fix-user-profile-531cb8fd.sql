-- 修复用户配置问题
-- 用户ID: 531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e
-- 用户邮箱: onehare@gmail.com

-- 1. 检查用户是否存在
SELECT 
  id, 
  email, 
  created_at 
FROM auth.users 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

-- 2. 检查用户配置是否存在
SELECT 
  id, 
  username, 
  display_name, 
  subscription_tier, 
  is_admin,
  created_at,
  updated_at
FROM user_profiles 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

-- 3. 如果用户配置不存在，创建它
INSERT INTO user_profiles (
  id, 
  username, 
  display_name, 
  subscription_tier, 
  is_admin
) VALUES (
  '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e',
  'onehare',
  'onehare',
  'admin',  -- 设置为管理员
  true      -- 设置为管理员
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.display_name,
  subscription_tier = EXCLUDED.subscription_tier,
  is_admin = EXCLUDED.is_admin,
  updated_at = NOW();

-- 4. 验证修复结果
SELECT 
  id, 
  username, 
  display_name, 
  subscription_tier, 
  is_admin,
  created_at,
  updated_at
FROM user_profiles 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

-- 5. 检查 RLS 策略是否允许访问
-- 查看当前用户权限
SELECT 
  current_user,
  session_user,
  current_setting('request.jwt.claims', true)::json->>'sub' as auth_user_id;
