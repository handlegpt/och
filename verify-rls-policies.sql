-- 验证 RLS 策略是否正确应用
-- 在 Supabase 控制台执行此脚本

-- 1. 检查 user_profiles 表的 RLS 状态
SELECT 
    'RLS Status Check' as step,
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    hasrules as has_rules
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 2. 列出所有 user_profiles 表的 RLS 策略
SELECT 
    'Current RLS Policies' as step,
    policyname,
    cmd as operation,
    permissive,
    roles,
    qual as condition,
    with_check as insert_condition
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- 3. 检查策略数量
SELECT 
    'Policy Count' as step,
    COUNT(*) as total_policies,
    COUNT(CASE WHEN cmd = 'SELECT' THEN 1 END) as select_policies,
    COUNT(CASE WHEN cmd = 'INSERT' THEN 1 END) as insert_policies,
    COUNT(CASE WHEN cmd = 'UPDATE' THEN 1 END) as update_policies,
    COUNT(CASE WHEN cmd = 'DELETE' THEN 1 END) as delete_policies
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 4. 检查是否有正确的用户策略
SELECT 
    'User-specific Policies Check' as step,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_profiles' 
            AND cmd = 'SELECT' 
            AND qual LIKE '%auth.uid()%'
        ) THEN '✅ 有用户查看自己配置的策略'
        ELSE '❌ 缺少用户查看自己配置的策略'
    END as select_policy_status,
    
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_profiles' 
            AND cmd = 'INSERT' 
            AND with_check LIKE '%auth.uid()%'
        ) THEN '✅ 有用户创建自己配置的策略'
        ELSE '❌ 缺少用户创建自己配置的策略'
    END as insert_policy_status,
    
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_profiles' 
            AND cmd = 'UPDATE' 
            AND qual LIKE '%auth.uid()%'
        ) THEN '✅ 有用户更新自己配置的策略'
        ELSE '❌ 缺少用户更新自己配置的策略'
    END as update_policy_status;

-- 5. 如果策略缺失，提供修复方案
SELECT 
    'Fix Recommendations' as step,
    CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_profiles'
        ) THEN '🚨 严重问题：user_profiles 表没有任何 RLS 策略！'
        WHEN NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_profiles' 
            AND cmd = 'INSERT' 
            AND with_check LIKE '%auth.uid()%'
        ) THEN '⚠️ 问题：缺少允许用户创建自己配置的策略'
        ELSE '✅ RLS 策略看起来正常'
    END as diagnosis;

-- 6. 如果需要修复，取消注释下面的代码
/*
-- 删除现有策略（如果需要重新创建）
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- 重新创建正确的 RLS 策略
CREATE POLICY "Users can view own profile" ON user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- 验证策略创建成功
SELECT 'RLS Policies Recreated Successfully' as result;
*/
