-- 测试使用限制函数的SQL脚本
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 1. 检查用户配置表
SELECT id, subscription_tier FROM user_profiles LIMIT 5;

-- 2. 检查AI生成记录表
SELECT user_id, COUNT(*) as generation_count, DATE(created_at) as date
FROM ai_generations 
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY user_id, DATE(created_at)
LIMIT 5;

-- 3. 测试使用限制函数（替换为实际的用户ID）
-- SELECT * FROM check_user_usage_limit('your-user-id-here'::UUID);

-- 4. 检查函数是否存在
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'check_user_usage_limit';

-- 5. 检查表结构
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('user_profiles', 'ai_generations', 'usage_stats')
ORDER BY table_name, ordinal_position;
