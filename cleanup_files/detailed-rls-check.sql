-- 详细的 RLS 策略检查
-- 在 Supabase 控制台执行此脚本

-- 1. 查看所有 RLS 策略的详细信息
SELECT 
    'Detailed RLS Policies' as step,
    policyname,
    cmd as operation,
    permissive,
    roles,
    qual as condition,
    with_check as insert_condition
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- 2. 分析每个策略的作用
SELECT 
    'Policy Analysis' as step,
    cmd as operation,
    COUNT(*) as policy_count,
    CASE 
        WHEN cmd = 'SELECT' AND COUNT(*) > 0 THEN '✅ 有查询策略'
        WHEN cmd = 'SELECT' AND COUNT(*) = 0 THEN '❌ 缺少查询策略'
        WHEN cmd = 'INSERT' AND COUNT(*) > 0 THEN '✅ 有插入策略'
        WHEN cmd = 'INSERT' AND COUNT(*) = 0 THEN '❌ 缺少插入策略'
        WHEN cmd = 'UPDATE' AND COUNT(*) > 0 THEN '✅ 有更新策略'
        WHEN cmd = 'UPDATE' AND COUNT(*) = 0 THEN '❌ 缺少更新策略'
        ELSE '其他策略'
    END as status
FROM pg_policies 
WHERE tablename = 'user_profiles'
GROUP BY cmd
ORDER BY cmd;

-- 3. 检查策略条件是否正确
SELECT 
    'Policy Condition Check' as step,
    policyname,
    cmd as operation,
    CASE 
        WHEN cmd = 'SELECT' AND qual LIKE '%auth.uid()%' THEN '✅ 正确的用户查询条件'
        WHEN cmd = 'SELECT' AND qual NOT LIKE '%auth.uid()%' THEN '⚠️ 查询条件可能不正确'
        WHEN cmd = 'INSERT' AND with_check LIKE '%auth.uid()%' THEN '✅ 正确的用户插入条件'
        WHEN cmd = 'INSERT' AND with_check NOT LIKE '%auth.uid()%' THEN '⚠️ 插入条件可能不正确'
        WHEN cmd = 'UPDATE' AND qual LIKE '%auth.uid()%' THEN '✅ 正确的用户更新条件'
        WHEN cmd = 'UPDATE' AND qual NOT LIKE '%auth.uid()%' THEN '⚠️ 更新条件可能不正确'
        ELSE '其他条件'
    END as condition_status
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- 4. 检查是否有管理员相关的策略
SELECT 
    'Admin Policy Check' as step,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_profiles' 
            AND (qual LIKE '%admin%' OR with_check LIKE '%admin%')
        ) THEN '✅ 有管理员相关策略'
        ELSE '❌ 没有管理员相关策略'
    END as admin_policy_status;

-- 5. 总结和建议
SELECT 
    'Summary' as step,
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_profiles') = 0 
        THEN '❌ 没有任何 RLS 策略'
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_profiles' AND cmd = 'INSERT') = 0
        THEN '❌ 缺少 INSERT 策略 - 用户无法创建配置'
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_profiles' AND cmd = 'SELECT') = 0
        THEN '❌ 缺少 SELECT 策略 - 用户无法查看配置'
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_profiles' AND cmd = 'UPDATE') = 0
        THEN '❌ 缺少 UPDATE 策略 - 用户无法更新配置'
        ELSE '✅ RLS 策略看起来完整'
    END as overall_status;

