-- 修复成本控制RLS策略
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 添加INSERT策略，允许用户插入自己的成本记录
CREATE POLICY "Users can insert own cost records" ON api_cost_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 添加UPDATE策略，允许用户更新自己的成本记录
CREATE POLICY "Users can update own cost records" ON user_cost_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- 添加INSERT策略，允许系统插入用户成本统计
CREATE POLICY "System can insert user cost stats" ON user_cost_stats
  FOR INSERT WITH CHECK (true);

-- 添加UPDATE策略，允许系统更新用户成本统计
CREATE POLICY "System can update user cost stats" ON user_cost_stats
  FOR UPDATE USING (true);

-- 添加INSERT策略，允许系统插入成本预警
CREATE POLICY "System can insert cost alerts" ON cost_alerts
  FOR INSERT WITH CHECK (true);

-- 添加INSERT策略，允许系统插入系统成本统计
CREATE POLICY "System can insert system cost stats" ON system_cost_stats
  FOR INSERT WITH CHECK (true);

-- 添加UPDATE策略，允许系统更新系统成本统计
CREATE POLICY "System can update system cost stats" ON system_cost_stats
  FOR UPDATE USING (true);

-- 验证策略是否创建成功
SELECT 'RLS policies for cost control have been fixed!' as status;
