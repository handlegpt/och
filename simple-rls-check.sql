-- 简单的 RLS 策略检查
-- 在 Supabase 控制台执行此脚本

-- 1. 检查 user_profiles 表是否存在
SELECT 
    'Table Check' as step,
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 2. 检查 RLS 策略
SELECT 
    'RLS Policies' as step,
    policyname,
    cmd as operation,
    qual as condition
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- 3. 统计策略数量
SELECT 
    'Policy Count' as step,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 4. 检查是否有用户相关的策略
SELECT 
    'User Policy Check' as step,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ 没有任何 RLS 策略'
        WHEN COUNT(CASE WHEN qual LIKE '%auth.uid()%' THEN 1 END) = 0 THEN '❌ 没有用户相关的策略'
        ELSE '✅ 有用户相关的策略'
    END as status
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 5. 如果没有任何策略，提供创建建议
SELECT 
    'Recommendation' as step,
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_profiles') = 0 
        THEN '需要创建 RLS 策略'
        ELSE 'RLS 策略已存在'
    END as action_needed;

