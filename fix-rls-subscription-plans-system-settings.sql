-- 修复 subscription_plans 和 system_settings 表的 RLS 问题
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 为 subscription_plans 表启用 RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- 为 system_settings 表启用 RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- 为 subscription_plans 表创建 RLS 策略
-- 允许所有用户查看订阅计划（这是公开信息）
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans
  FOR SELECT USING (true);

-- 只允许管理员修改订阅计划
CREATE POLICY "Only admins can modify subscription plans" ON subscription_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND subscription_tier = 'admin'
    )
  );

-- 为 system_settings 表创建 RLS 策略
-- 允许所有用户查看系统设置（某些设置可能需要公开）
CREATE POLICY "Anyone can view system settings" ON system_settings
  FOR SELECT USING (true);

-- 只允许管理员修改系统设置
CREATE POLICY "Only admins can modify system settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND subscription_tier = 'admin'
    )
  );

-- 验证 RLS 已启用
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('subscription_plans', 'system_settings')
  AND schemaname = 'public';
