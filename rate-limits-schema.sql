-- Rate Limiting Schema
-- Run this script in Supabase Dashboard SQL Editor

-- Create rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  identifier VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_key_timestamp ON rate_limits(key, timestamp);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limits_timestamp ON rate_limits(timestamp);

-- Create function to cleanup expired records
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
  -- Delete records older than 7 days
  DELETE FROM rate_limits 
  WHERE timestamp < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Create automatic cleanup scheduled task (requires pg_cron extension)
-- Note: This needs to be manually enabled in Supabase
-- SELECT cron.schedule('cleanup-rate-limits', '0 2 * * *', 'SELECT cleanup_expired_rate_limits();');

-- Drop existing function if it exists to avoid type conflicts
DROP FUNCTION IF EXISTS check_user_usage_limit(UUID);

-- Create function to check user usage limits
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
    WHEN 'free' THEN limit_count := 10;
    WHEN 'pro' THEN limit_count := 100;
    WHEN 'enterprise' THEN limit_count := 1000;
    WHEN 'admin' THEN limit_count := 10000;
    ELSE limit_count := 10;
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

-- Drop existing function if it exists to avoid type conflicts
DROP FUNCTION IF EXISTS check_rate_limit(VARCHAR, VARCHAR, INTEGER, INTEGER);

-- Create function to check rate limits
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

-- Enable Row Level Security (RLS)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow all users to insert their own records
CREATE POLICY "Users can insert their own rate limit records" ON rate_limits
  FOR INSERT WITH CHECK (true);

-- Create policy: Allow all users to view their own records
CREATE POLICY "Users can view their own rate limit records" ON rate_limits
  FOR SELECT USING (true);

-- Create policy: Allow system to cleanup expired records
CREATE POLICY "System can delete expired records" ON rate_limits
  FOR DELETE USING (timestamp < NOW() - INTERVAL '1 day');

-- Create policy: Admins can view all records
CREATE POLICY "Admins can view all rate limit records" ON rate_limits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND subscription_tier = 'admin'
    )
  );

-- Create policy: Admins can delete all records
CREATE POLICY "Admins can delete all rate limit records" ON rate_limits
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND subscription_tier = 'admin'
    )
  );

-- Insert default system settings (if not exists)
INSERT INTO system_settings (key, value, description) VALUES
('rate_limit_enabled', 'true', 'Enable rate limiting'),
('rate_limit_cleanup_interval', '24', 'Rate limit cleanup interval (hours)'),
('rate_limit_retention_days', '7', 'Rate limit record retention days')
ON CONFLICT (key) DO NOTHING;
