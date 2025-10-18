-- 直接检查 RLS 策略
-- 在 Supabase 控制台执行此脚本

-- 1. 检查 user_profiles 表的 RLS 状态
SELECT 
    schemaname, 
    tablename, 
    rowsecurity, 
    hasrules 
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
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 3. 检查是否有默认的 RLS 策略
SELECT 
    'Current RLS Policies for user_profiles:' as info;

-- 4. 如果没有任何策略，显示建议的策略
-- 检查策略数量
SELECT 
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ 没有 RLS 策略 - 这可能导致权限问题'
        WHEN COUNT(*) < 3 THEN '⚠️ RLS 策略不完整 - 可能缺少某些操作权限'
        ELSE '✅ RLS 策略数量正常'
    END as status
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 5. 检查是否有允许用户创建自己配置的策略
SELECT 
    'Checking for INSERT policy:' as info;

SELECT 
    policyname,
    cmd,
    with_check,
    CASE 
        WHEN cmd = 'INSERT' AND with_check LIKE '%auth.uid()%' THEN '✅ 有允许用户创建自己配置的策略'
        WHEN cmd = 'INSERT' THEN '⚠️ 有 INSERT 策略，但可能不是针对用户自己的'
        ELSE '❌ 没有 INSERT 策略'
    END as insert_policy_status
FROM pg_policies 
WHERE tablename = 'user_profiles' 
AND cmd = 'INSERT';

-- 6. 检查是否有允许用户查看自己配置的策略
SELECT 
    'Checking for SELECT policy:' as info;

SELECT 
    policyname,
    cmd,
    qual,
    CASE 
        WHEN cmd = 'SELECT' AND qual LIKE '%auth.uid()%' THEN '✅ 有允许用户查看自己配置的策略'
        WHEN cmd = 'SELECT' THEN '⚠️ 有 SELECT 策略，但可能不是针对用户自己的'
        ELSE '❌ 没有 SELECT 策略'
    END as select_policy_status
FROM pg_policies 
WHERE tablename = 'user_profiles' 
AND cmd = 'SELECT';

-- 7. 如果策略不完整，提供修复建议
SELECT 
    'RLS Policy Analysis Complete' as info;

-- 8. 提供完整的 RLS 策略建议（如果需要修复）
-- 取消注释下面的代码来创建完整的 RLS 策略

/*
-- 删除现有策略（如果需要）
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- 创建完整的 RLS 策略
-- 允许用户查看自己的配置
CREATE POLICY "Users can view own profile" ON user_profiles
FOR SELECT USING (auth.uid() = id);

-- 允许用户创建自己的配置
CREATE POLICY "Users can insert own profile" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- 允许用户更新自己的配置
CREATE POLICY "Users can update own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

-- 允许用户删除自己的配置（可选）
CREATE POLICY "Users can delete own profile" ON user_profiles
FOR DELETE USING (auth.uid() = id);

-- 验证策略创建
SELECT 'RLS Policies Created Successfully' as result;
*/
