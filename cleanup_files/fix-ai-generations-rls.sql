-- 修复 ai_generations 表的 RLS 策略问题
-- 在 Supabase SQL Editor 中运行此脚本

-- 1. 检查表是否存在
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'ai_generations';

-- 2. 检查 RLS 策略
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
WHERE tablename = 'ai_generations';

-- 3. 如果表不存在，创建表
CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transformation_type VARCHAR(50) NOT NULL,
  input_image_url TEXT,
  output_image_url TEXT,
  content_url TEXT,
  prompt TEXT,
  custom_prompt TEXT,
  title TEXT,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 启用 RLS
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- 5. 删除现有的策略（如果存在）
DROP POLICY IF EXISTS "Users can view own generations" ON ai_generations;
DROP POLICY IF EXISTS "Users can insert own generations" ON ai_generations;
DROP POLICY IF EXISTS "Users can update own generations" ON ai_generations;
DROP POLICY IF EXISTS "Users can delete own generations" ON ai_generations;

-- 6. 创建新的 RLS 策略
-- 允许用户查看自己的生成记录
CREATE POLICY "Users can view own generations" ON ai_generations
  FOR SELECT USING (auth.uid() = user_id);

-- 允许用户插入自己的生成记录
CREATE POLICY "Users can insert own generations" ON ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 允许用户更新自己的生成记录
CREATE POLICY "Users can update own generations" ON ai_generations
  FOR UPDATE USING (auth.uid() = user_id);

-- 允许用户删除自己的生成记录
CREATE POLICY "Users can delete own generations" ON ai_generations
  FOR DELETE USING (auth.uid() = user_id);

-- 7. 创建必要的索引
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at ON ai_generations(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_created ON ai_generations(user_id, created_at DESC);

-- 8. 验证策略是否正确创建
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
WHERE tablename = 'ai_generations'
ORDER BY policyname;

-- 9. 测试查询（可选）
-- 这个查询应该能正常工作，如果用户已认证
-- SELECT * FROM ai_generations WHERE user_id = auth.uid() LIMIT 5;
