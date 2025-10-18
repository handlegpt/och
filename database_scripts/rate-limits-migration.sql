-- Rate Limiting Migration Script
-- Run this script in Supabase Dashboard SQL Editor to update existing functions

-- Drop existing functions to avoid type conflicts
DROP FUNCTION IF EXISTS check_user_usage_limit(UUID);
DROP FUNCTION IF EXISTS check_rate_limit(VARCHAR, VARCHAR, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS cleanup_expired_rate_limits();

-- Recreate cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
  -- Delete records older than 7 days
  DELETE FROM rate_limits 
  WHERE timestamp < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Recreate user usage limit function
CREATE OR REPLACE FUNCTION check_user_usage_limit(user_uuid UUID)
RETURNS TABLE(
  daily_limit INTEGER,
  used_today INTEGER,
  remaining INTEGER,
  can_generate BOOLEAN
) AS $$
DECLARE
  user_tier VARCHAR(20);
  limit_count INTEGER;
  used_count INTEGER;
BEGIN
  -- Get user subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = user_uuid;
  
  -- Set default value
  user_tier := COALESCE(user_tier, 'free');
  
  -- Set limits based on subscription tier
  CASE user_tier
    WHEN 'free' THEN limit_count := 50;
    WHEN 'pro' THEN limit_count := 100;
    WHEN 'enterprise' THEN limit_count := 1000;
    WHEN 'admin' THEN limit_count := 10000;
    ELSE limit_count := 50;
  END CASE;
  
  -- Calculate today's usage
  SELECT COUNT(*) INTO used_count
  FROM ai_generations
  WHERE user_id = user_uuid
    AND DATE(created_at) = CURRENT_DATE
    AND status = 'completed';
  
  -- Return results
  RETURN QUERY SELECT
    limit_count,
    used_count,
    GREATEST(0, limit_count - used_count),
    (used_count < limit_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate rate limit checking function
CREATE OR REPLACE FUNCTION check_rate_limit(
  limit_key VARCHAR(255),
  identifier VARCHAR(255),
  max_requests INTEGER,
  window_minutes INTEGER
)
RETURNS TABLE(
  allowed BOOLEAN,
  remaining INTEGER,
  reset_time TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  window_start TIMESTAMP WITH TIME ZONE;
  request_count INTEGER;
  reset_timestamp TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate window start time
  window_start := NOW() - (window_minutes || ' minutes')::INTERVAL;
  
  -- Count requests within the window
  SELECT COUNT(*) INTO request_count
  FROM rate_limits
  WHERE key = limit_key
    AND identifier = check_rate_limit.identifier
    AND timestamp >= window_start;
  
  -- Calculate reset time
  SELECT COALESCE(MIN(timestamp), NOW()) + (window_minutes || ' minutes')::INTERVAL
  INTO reset_timestamp
  FROM rate_limits
  WHERE key = limit_key
    AND identifier = check_rate_limit.identifier
    AND timestamp >= window_start;
  
  -- Return results
  RETURN QUERY SELECT
    (request_count < max_requests),
    GREATEST(0, max_requests - request_count - 1),
    reset_timestamp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify functions were created successfully
SELECT 'Migration completed successfully' as status;
