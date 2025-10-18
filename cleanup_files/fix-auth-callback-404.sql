-- 修复认证回调 404 错误的 Supabase 配置检查
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 检查当前的重定向 URL 配置
-- 注意：这个脚本主要用于验证，实际的 URL 配置需要在 Supabase Dashboard 中设置

-- 验证认证配置
SELECT 
  'Authentication Configuration Check' as check_type,
  'Please verify the following URLs are configured in Supabase Dashboard > Authentication > URL Configuration:' as instructions;

-- 需要配置的重定向 URL 列表
SELECT 
  'Required Redirect URLs' as url_type,
  'https://och.ai/auth/callback' as production_url,
  'http://localhost:4173/auth/callback' as development_url,
  'http://localhost:3000/auth/callback' as alternative_dev_url;

-- 需要配置的 Site URL
SELECT 
  'Required Site URL' as url_type,
  'https://och.ai' as production_site_url,
  'http://localhost:4173' as development_site_url;

-- 检查用户认证状态
SELECT 
  'User Authentication Status' as check_type,
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;

-- 检查最近的认证错误（如果有的话）
SELECT 
  'Recent Auth Events' as check_type,
  'Check Supabase Dashboard > Authentication > Logs for recent errors' as instructions;
