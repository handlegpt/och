-- 测试实际的权限问题
-- 在 Supabase 控制台执行此脚本

-- 1. 首先查看具体的策略内容
SELECT 
    'Current RLS Policies' as step,
    policyname,
    cmd as operation,
    qual as condition,
    with_check as insert_condition
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- 2. 检查当前认证上下文
SELECT 
    'Auth Context' as step,
    current_user,
    session_user,
    current_setting('request.jwt.claims', true)::json->>'sub' as auth_user_id,
    current_setting('request.jwt.claims', true)::json->>'email' as auth_email;

-- 3. 尝试直接查询用户配置（测试 SELECT 权限）
SELECT 
    'Test SELECT Permission' as step,
    id,
    username,
    display_name,
    subscription_tier,
    is_admin
FROM user_profiles 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

-- 4. 如果查询失败，尝试绕过 RLS 测试
SET row_security = off;

SELECT 
    'Test Without RLS' as step,
    id,
    username,
    display_name,
    subscription_tier,
    is_admin
FROM user_profiles 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

SET row_security = on;

-- 5. 检查是否有任何用户配置记录
SELECT 
    'All User Profiles' as step,
    COUNT(*) as total_profiles
FROM user_profiles;

-- 6. 如果没有任何记录，尝试创建测试记录
-- 注意：这可能会因为 RLS 而失败
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
    'admin',
    true
) ON CONFLICT (id) DO UPDATE SET
    subscription_tier = EXCLUDED.subscription_tier,
    is_admin = EXCLUDED.is_admin,
    updated_at = NOW();

-- 7. 验证插入结果
SELECT 
    'Verification' as step,
    id,
    username,
    display_name,
    subscription_tier,
    is_admin,
    created_at,
    updated_at
FROM user_profiles 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

