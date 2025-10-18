-- 检查 RLS 策略和用户配置问题
-- 用户ID: 531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e

-- 1. 检查 user_profiles 表的 RLS 状态
SELECT schemaname, tablename, rowsecurity, hasrls 
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 2. 查看 user_profiles 表的所有 RLS 策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 3. 检查用户是否存在
SELECT 
    id, 
    email, 
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

-- 4. 直接查询用户配置（绕过 RLS）
SET row_security = off;
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
SET row_security = on;

-- 5. 检查当前认证上下文
SELECT 
    current_user,
    session_user,
    current_setting('request.jwt.claims', true)::json->>'sub' as auth_user_id,
    current_setting('request.jwt.claims', true)::json->>'email' as auth_email;

-- 6. 临时禁用 RLS 并创建/更新用户配置
SET row_security = off;

-- 删除可能存在的冲突记录
DELETE FROM user_profiles WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

-- 插入新的用户配置
INSERT INTO user_profiles (
    id, 
    username, 
    display_name, 
    subscription_tier, 
    is_admin
) VALUES (
    '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e',
    'onehare_admin',
    'onehare',
    'admin',
    true
);

-- 验证插入结果
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

SET row_security = on;
