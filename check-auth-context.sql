-- 检查认证上下文
-- 在 Supabase 控制台执行此脚本

-- 1. 检查当前认证上下文
SELECT 
    'Auth Context Check' as step,
    current_user,
    session_user,
    current_setting('request.jwt.claims', true)::json->>'sub' as auth_user_id,
    current_setting('request.jwt.claims', true)::json->>'email' as auth_email,
    current_setting('request.jwt.claims', true)::json->>'role' as auth_role;

-- 2. 测试 RLS 策略是否正常工作
-- 尝试查询用户配置（这应该会触发 RLS 策略）
SELECT 
    'RLS Policy Test' as step,
    id,
    username,
    display_name,
    subscription_tier,
    is_admin
FROM user_profiles 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

-- 3. 如果查询失败，尝试绕过 RLS 测试
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

-- 4. 检查 auth.uid() 函数是否正常工作
SELECT 
    'Auth UID Test' as step,
    auth.uid() as current_auth_uid,
    '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e' as target_user_id,
    CASE 
        WHEN auth.uid() = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e'::uuid THEN '✅ auth.uid() 匹配目标用户'
        WHEN auth.uid() IS NULL THEN '❌ auth.uid() 返回 NULL'
        ELSE '⚠️ auth.uid() 不匹配目标用户'
    END as auth_uid_status;

-- 5. 检查是否有其他可能影响 RLS 的因素
SELECT 
    'Additional Checks' as step,
    CASE 
        WHEN current_setting('request.jwt.claims', true) IS NULL THEN '❌ JWT claims 为空'
        ELSE '✅ JWT claims 存在'
    END as jwt_status,
    CASE 
        WHEN current_user = 'anon' THEN '⚠️ 当前用户是匿名用户'
        WHEN current_user = 'authenticated' THEN '✅ 当前用户已认证'
        ELSE 'ℹ️ 当前用户: ' || current_user
    END as user_status;

