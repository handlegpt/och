-- 修复 ai_generations 表缺失的字段
-- 在 Supabase SQL Editor 中运行此脚本

-- 1. 检查当前表结构
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'ai_generations' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. 添加缺失的字段
-- 添加 content_url 字段
ALTER TABLE ai_generations 
ADD COLUMN IF NOT EXISTS content_url TEXT;

-- 添加 title 字段  
ALTER TABLE ai_generations 
ADD COLUMN IF NOT EXISTS title TEXT;

-- 3. 验证字段已添加
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'ai_generations' 
  AND table_schema = 'public'
  AND column_name IN ('content_url', 'title')
ORDER BY column_name;

-- 4. 更新现有记录（可选）
-- 为现有记录设置默认的 title
UPDATE ai_generations 
SET title = COALESCE(title, 'AI生成_' || transformation_type || '_' || to_char(created_at, 'YYYY-MM-DD'))
WHERE title IS NULL;

-- 5. 验证修复结果
SELECT 
  id,
  transformation_type,
  created_at,
  content_url,
  title
FROM ai_generations 
LIMIT 5;
