-- 全面诊断脚本 - 确认问题根本原因
-- 在 Supabase 控制台执行此脚本

-- 1. 检查 RLS 状态和策略
SELECT 
    'RLS Status Check' as step,
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    hasrules as has_policies
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 2. 查看所有 RLS 策略详情
SELECT 
    'RLS Policies Detail' as step,
    policyname,
    cmd as operation,
    qual as select_condition,
    with_check as insert_condition,
    roles
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- 3. 检查认证上下文（在 Supabase 控制台执行时）
SELECT 
    'Auth Context in Console' as step,
    current_user,
    session_user,
    current_setting('request.jwt.claims', true) as jwt_claims;

-- 4. 检查用户配置表结构
SELECT 
    'Table Structure' as step,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- 5. 检查是否有用户配置记录
SELECT 
    'User Profiles Count' as step,
    COUNT(*) as total_count,
    COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_count,
    COUNT(CASE WHEN subscription_tier = 'admin' THEN 1 END) as admin_tier_count
FROM user_profiles;

-- 6. 查看所有用户配置记录（如果有的话）
SELECT 
    'All User Profiles' as step,
    id,
    username,
    display_name,
    subscription_tier,
    is_admin,
    created_at
FROM user_profiles
ORDER BY created_at DESC;

-- 7. 检查特定用户是否存在
SELECT 
    'Specific User Check' as step,
    CASE 
        WHEN EXISTS(SELECT 1 FROM user_profiles WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as user_exists,
    CASE 
        WHEN EXISTS(SELECT 1 FROM user_profiles WHERE username = 'onehare') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as username_exists;

-- 8. 测试 RLS 策略是否工作
-- 临时禁用 RLS 来测试
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

-- 重新启用 RLS
SET row_security = on;

-- 9. 检查 auth.users 表中的用户
SELECT 
    'Auth Users Check' as step,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'onehare@gmail.com';

-- 10. 检查是否有外键约束问题
SELECT 
    'Foreign Key Check' as step,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'user_profiles';
