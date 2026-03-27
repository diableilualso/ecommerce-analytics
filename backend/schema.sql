-- Ecommerce Analytics Database Schema
-- For Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User data table
CREATE TABLE IF NOT EXISTS user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_platform ON user_data(platform);
CREATE INDEX IF NOT EXISTS idx_user_data_created_at ON user_data(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Public read access to users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Public insert access to users" ON users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for user_data table
CREATE POLICY "Public read access to user_data" ON user_data
  FOR SELECT USING (true);

CREATE POLICY "Public insert access to user_data" ON user_data
  FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_data_updated_at
    BEFORE UPDATE ON user_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO users (email) VALUES 
  ('demo1@example.com'),
  ('demo2@example.com'),
  ('demo3@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_data (user_id, platform, metrics) 
SELECT 
  u.id,
  CASE 
    WHEN random() < 0.33 THEN 'shopify'
    WHEN random() < 0.66 THEN 'woocommerce'
    ELSE 'amazon'
  END as platform,
  jsonb_build_object(
    'revenue', floor(random() * 10000 + 1000),
    'orders', floor(random() * 100 + 10),
    'visitors', floor(random() * 10000 + 1000),
    'conversion_rate', round(random() * 0.05 + 0.01, 3),
    'average_order_value', round(random() * 50 + 10, 2)
  ) as metrics
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM user_data WHERE user_id = u.id)
LIMIT 5;

-- View for analytics dashboard
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  COUNT(DISTINCT u.id) as total_users,
  COUNT(ud.id) as total_data_entries,
  jsonb_object_agg(
    ud.platform, 
    COUNT(ud.id)
  ) FILTER (WHERE ud.platform IS NOT NULL) as platform_distribution,
  MAX(ud.created_at) as latest_data_entry
FROM users u
LEFT JOIN user_data ud ON u.id = ud.user_id;

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores registered user information';
COMMENT ON TABLE user_data IS 'Stores ecommerce platform metrics for users';
COMMENT ON VIEW analytics_summary IS 'Summary view for analytics dashboard';