-- 直接修复用户配置问题
-- 用户ID: 531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e
-- 用户邮箱: onehare@gmail.com

-- 临时禁用 RLS 以进行修复
SET row_security = off;

-- 删除可能存在的冲突记录
DELETE FROM user_profiles WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

-- 插入新的用户配置
INSERT INTO user_profiles (
    id, 
    username, 
    display_name, 
    subscription_tier, 
    is_admin,
    created_at,
    updated_at
) VALUES (
    '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e',
    'onehare_admin',
    'onehare',
    'admin',
    true,
    NOW(),
    NOW()
);

-- 验证修复结果
SELECT 
    id, 
    username, 
    display_name, 
    subscription_tier, 
    is_admin,
    created_at,
    updated_at
FROM user_profiles 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

-- 重新启用 RLS
SET row_security = on;

-- 测试 RLS 策略是否正常工作
SELECT 
    id, 
    username, 
    display_name, 
    subscription_tier, 
    is_admin
FROM user_profiles 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';
