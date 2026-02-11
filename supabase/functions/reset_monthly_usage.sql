-- This function can be called via a cron job or scheduled task
-- to reset monthly usage for all users at the start of each month

CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS VOID AS $$
DECLARE
  user_record RECORD;
  first_day_of_month DATE;
  limits RECORD;
BEGIN
  first_day_of_month := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  
  -- For each user, create or reset their usage tracking for the new month
  FOR user_record IN SELECT id, subscription_tier FROM profiles LOOP
    -- Determine limits based on tier
    CASE user_record.subscription_tier
      WHEN 'free' THEN
        limits := ROW(5);
      WHEN 'pro' THEN
        limits := ROW(25);
      WHEN 'premium' THEN
        limits := ROW(999999); -- Large number for unlimited
      ELSE
        limits := ROW(5);
    END CASE;
    
    -- Insert or update usage tracking for the new month
    INSERT INTO usage_tracking (user_id, month, searches_used, searches_limit)
    VALUES (user_record.id, first_day_of_month, 0, limits.f1)
    ON CONFLICT (user_id, month) DO UPDATE
    SET searches_used = 0,
        updated_at = NOW();
  END LOOP;
END;
$$ LANGUAGE plpgsql;
