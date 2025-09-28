-- 数据库性能优化脚本
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 1. 为ai_generations表添加关键索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_user_created 
ON ai_generations(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_user_status 
ON ai_generations(user_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_created_at 
ON ai_generations(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_transformation_type 
ON ai_generations(transformation_type);

-- 2. 为user_favorites表添加索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_favorites_user_created 
ON user_favorites(user_id, created_at DESC);

-- 3. 为usage_stats表添加索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_stats_user_date 
ON usage_stats(user_id, date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_stats_date 
ON usage_stats(date DESC);

-- 4. 为user_profiles表添加索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_subscription_tier 
ON user_profiles(subscription_tier);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_created_at 
ON user_profiles(created_at DESC);

-- 5. 为public_gallery表添加索引（如果存在）
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_public_gallery_user_created 
ON public_gallery(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_public_gallery_created_at 
ON public_gallery(created_at DESC);

-- 6. 为gallery_likes表添加索引（如果存在）
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gallery_likes_gallery_id 
ON gallery_likes(gallery_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gallery_likes_user_id 
ON gallery_likes(user_id);

-- 7. 为api_cost_records表添加索引（成本控制）
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_cost_records_user_created 
ON api_cost_records(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_cost_records_operation_type 
ON api_cost_records(operation_type, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_cost_records_created_at 
ON api_cost_records(created_at DESC);

-- 8. 为user_cost_stats表添加索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_cost_stats_user_id 
ON user_cost_stats(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_cost_stats_last_updated 
ON user_cost_stats(last_updated DESC);

-- 9. 为cost_alerts表添加索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cost_alerts_user_created 
ON cost_alerts(user_id, sent_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cost_alerts_alert_type 
ON cost_alerts(alert_type, sent_at DESC);

-- 10. 为system_cost_stats表添加索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_system_cost_stats_date 
ON system_cost_stats(date DESC);

-- 11. 为rate_limits表添加索引（如果存在）
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limits_identifier 
ON rate_limits(identifier);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limits_created_at 
ON rate_limits(created_at DESC);

-- 12. 为data_access_audit表添加索引（如果存在）
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_access_audit_user_created 
ON data_access_audit(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_access_audit_action 
ON data_access_audit(action, created_at DESC);

-- 13. 创建复合索引用于复杂查询
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_user_status_created 
ON ai_generations(user_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_stats_user_date_count 
ON usage_stats(user_id, date DESC, generations_count);

-- 14. 为文本搜索添加GIN索引（如果支持）
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_prompt_gin 
-- ON ai_generations USING gin(to_tsvector('english', prompt));

-- 15. 创建部分索引用于活跃用户
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_active_users 
ON ai_generations(user_id, created_at DESC) 
WHERE created_at > NOW() - INTERVAL '30 days';

-- 16. 创建部分索引用于成本控制
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_cost_records_recent 
ON api_cost_records(user_id, created_at DESC) 
WHERE created_at > NOW() - INTERVAL '90 days';

-- 17. 优化统计查询的索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_daily_stats 
ON ai_generations(DATE(created_at), user_id, status);

-- 18. 为管理员查询添加索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_admin_stats 
ON ai_generations(created_at DESC, status, transformation_type);

-- 19. 创建用于分页的索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_pagination 
ON ai_generations(created_at DESC, id) 
WHERE status = 'completed';

-- 20. 为实时查询优化
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_realtime 
ON ai_generations(status, created_at DESC) 
WHERE status IN ('pending', 'processing');

-- 21. 创建用于清理旧数据的索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_cleanup 
ON ai_generations(created_at) 
WHERE created_at < NOW() - INTERVAL '1 year';

-- 22. 为成本分析查询优化
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_cost_records_cost_analysis 
ON api_cost_records(operation_type, created_at DESC, actual_cost);

-- 23. 为用户行为分析优化
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_user_behavior 
ON ai_generations(user_id, transformation_type, created_at DESC);

-- 24. 为性能监控添加索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_performance 
ON ai_generations(processing_time_ms, created_at DESC) 
WHERE processing_time_ms IS NOT NULL;

-- 25. 创建用于数据导出的索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_generations_export 
ON ai_generations(created_at DESC, user_id, status, transformation_type);

-- 更新表统计信息
ANALYZE ai_generations;
ANALYZE user_favorites;
ANALYZE usage_stats;
ANALYZE user_profiles;
ANALYZE api_cost_records;
ANALYZE user_cost_stats;
ANALYZE cost_alerts;
ANALYZE system_cost_stats;

-- 显示索引创建结果
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename IN (
  'ai_generations', 
  'user_favorites', 
  'usage_stats', 
  'user_profiles',
  'api_cost_records',
  'user_cost_stats',
  'cost_alerts',
  'system_cost_stats'
)
ORDER BY tablename, indexname;

-- 显示表大小信息
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE tablename IN (
  'ai_generations', 
  'user_favorites', 
  'usage_stats', 
  'user_profiles',
  'api_cost_records',
  'user_cost_stats',
  'cost_alerts',
  'system_cost_stats'
)
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

SELECT 'Database performance optimization completed successfully!' as status;
