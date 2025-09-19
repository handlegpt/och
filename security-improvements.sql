-- 安全改进SQL脚本
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 1. 修复速率限制表的RLS策略
DROP POLICY IF EXISTS "Users can view their own rate limit records" ON rate_limits;

CREATE POLICY "Users can view their own rate limit records" ON rate_limits
  FOR SELECT USING (
    identifier = auth.uid()::text OR 
    identifier = 'anonymous'
  );

-- 2. 添加管理员权限检查
CREATE POLICY "Admins can view all rate limit records" ON rate_limits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND subscription_tier = 'admin'
    )
  );

-- 3. 添加数据访问审计日志表
CREATE TABLE IF NOT EXISTS data_access_audit (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用RLS
ALTER TABLE data_access_audit ENABLE ROW LEVEL SECURITY;

-- 只有管理员可以查看审计日志
CREATE POLICY "Admins can view audit logs" ON data_access_audit
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND subscription_tier = 'admin'
    )
  );

-- 4. 添加敏感操作审计函数
CREATE OR REPLACE FUNCTION audit_data_access(
  p_user_id UUID,
  p_action VARCHAR(50),
  p_table_name VARCHAR(50),
  p_record_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO data_access_audit (
    user_id, action, table_name, record_id, ip_address, user_agent
  ) VALUES (
    p_user_id, p_action, p_table_name, p_record_id,
    inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 添加数据删除审计触发器
CREATE OR REPLACE FUNCTION audit_data_deletion()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM audit_data_access(
    OLD.user_id,
    'DELETE',
    TG_TABLE_NAME,
    OLD.id
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 为敏感表添加删除审计触发器
DROP TRIGGER IF EXISTS audit_ai_generations_deletion ON ai_generations;
CREATE TRIGGER audit_ai_generations_deletion
  BEFORE DELETE ON ai_generations
  FOR EACH ROW EXECUTE FUNCTION audit_data_deletion();

DROP TRIGGER IF EXISTS audit_user_privacy_settings_deletion ON user_privacy_settings;
CREATE TRIGGER audit_user_privacy_settings_deletion
  BEFORE DELETE ON user_privacy_settings
  FOR EACH ROW EXECUTE FUNCTION audit_data_deletion();

-- 6. 添加数据保留策略
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  -- 删除90天前的审计日志
  DELETE FROM data_access_audit 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. 添加系统健康检查函数
CREATE OR REPLACE FUNCTION system_security_health_check()
RETURNS TABLE(
  check_name TEXT,
  status TEXT,
  details TEXT
) AS $$
BEGIN
  -- 检查RLS是否启用
  RETURN QUERY SELECT 
    'RLS Status'::TEXT,
    CASE WHEN EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' 
      AND c.relname IN ('ai_generations', 'user_profiles', 'usage_stats')
      AND c.relrowsecurity = true
    ) THEN 'PASS' ELSE 'FAIL' END::TEXT,
    'Row Level Security enabled on sensitive tables'::TEXT;

  -- 检查审计日志表
  RETURN QUERY SELECT 
    'Audit Logs'::TEXT,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'data_access_audit'
    ) THEN 'PASS' ELSE 'FAIL' END::TEXT,
    'Data access audit logging enabled'::TEXT;

  -- 检查清理函数
  RETURN QUERY SELECT 
    'Cleanup Functions'::TEXT,
    CASE WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'cleanup_expired_rate_limits'
    ) THEN 'PASS' ELSE 'FAIL' END::TEXT,
    'Data cleanup functions available'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
