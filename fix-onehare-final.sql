-- 最终修复 onehare 用户配置
-- 处理用户名冲突问题

-- 临时禁用 RLS
SET row_security = off;

-- 1. 首先检查现有的用户配置
SELECT 
    'Current user profiles:' as info,
    id,
    username,
    display_name,
    subscription_tier,
    is_admin
FROM user_profiles 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e' 
   OR username = 'onehare'
   OR display_name = 'onehare';

-- 2. 删除可能存在的冲突记录
DELETE FROM user_profiles WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

-- 3. 检查是否还有其他 onehare 用户
SELECT 
    'Other onehare users:' as info,
    id,
    username,
    display_name,
    subscription_tier,
    is_admin
FROM user_profiles 
WHERE username LIKE 'onehare%' 
   OR display_name LIKE 'onehare%';

-- 4. 生成唯一的用户名
DO $$
DECLARE
    target_user_id UUID := '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';
    base_username TEXT := 'onehare';
    final_username TEXT := base_username;
    counter INTEGER := 1;
BEGIN
    -- 检查用户名是否已存在
    WHILE EXISTS (SELECT 1 FROM user_profiles WHERE username = final_username) LOOP
        final_username := base_username || counter::TEXT;
        counter := counter + 1;
        
        -- 防止无限循环
        IF counter > 100 THEN
            final_username := base_username || '_' || substring(target_user_id::TEXT, -8);
            EXIT;
        END IF;
    END LOOP;
    
    -- 插入用户配置
    INSERT INTO user_profiles (
        id, 
        username, 
        display_name, 
        subscription_tier, 
        is_admin,
        created_at,
        updated_at
    ) VALUES (
        target_user_id,
        final_username,
        base_username,  -- 显示名称使用原始名称
        'admin',        -- 设置为管理员
        true,           -- 设置为管理员
        NOW(),
        NOW()
    );
    
    RAISE NOTICE '用户配置已创建，用户名: %', final_username;
END $$;

-- 5. 验证结果
SELECT 
    'Final result:' as info,
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

-- 6. 测试 RLS 策略
SELECT 
    'RLS Test:' as info,
    id,
    username,
    display_name,
    subscription_tier,
    is_admin
FROM user_profiles 
WHERE id = '531cb8fd-cf3b-4f98-836a-fd79e6e0bd0e';

