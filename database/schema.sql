-- ============================================
-- LINKPRO - SUPABASE SQL SCHEMA
-- ============================================
-- Execute this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: vendors
-- ============================================
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  whatsapp_number VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255),
  subscription_plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'business')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  theme_color VARCHAR(7) DEFAULT '#7030A0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  total_visits INTEGER DEFAULT 0 NOT NULL,
  total_whatsapp_clicks INTEGER DEFAULT 0 NOT NULL
);

-- Indexes for vendors
CREATE UNIQUE INDEX idx_vendors_username ON vendors(LOWER(username));
CREATE INDEX idx_vendors_whatsapp ON vendors(whatsapp_number);
CREATE INDEX idx_vendors_subscription ON vendors(subscription_plan, subscription_expires_at);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: products
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 100),
  description TEXT,
  image_url TEXT NOT NULL,
  additional_images JSONB DEFAULT '[]'::jsonb,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  stock_quantity INTEGER,
  category VARCHAR(50),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  view_count INTEGER DEFAULT 0 NOT NULL,
  click_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL
);

-- Indexes for products
CREATE INDEX idx_products_vendor ON products(vendor_id, created_at DESC);
CREATE INDEX idx_products_available ON products(vendor_id, is_available, sort_order);
CREATE UNIQUE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category) WHERE category IS NOT NULL;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: visits (partitioned by month)
-- ============================================
CREATE TABLE visits (
  id UUID DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  session_id VARCHAR(64) NOT NULL,
  source VARCHAR(50),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR(20),
  country VARCHAR(2),
  city VARCHAR(100),
  duration_seconds INTEGER DEFAULT 0,
  whatsapp_clicked BOOLEAN DEFAULT FALSE,
  clicked_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  whatsapp_opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  partition_month DATE NOT NULL,
  PRIMARY KEY (id, partition_month)
) PARTITION BY RANGE (partition_month);

-- Create partitions for next 12 months
CREATE TABLE visits_2025_03 PARTITION OF visits
FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

CREATE TABLE visits_2025_04 PARTITION OF visits
FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');

CREATE TABLE visits_2025_05 PARTITION OF visits
FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');

-- Add more partitions as needed...

-- Indexes for visits
CREATE INDEX idx_visits_vendor_date ON visits(vendor_id, created_at DESC);
CREATE INDEX idx_visits_session ON visits(session_id, created_at DESC);
CREATE INDEX idx_visits_whatsapp ON visits(vendor_id, whatsapp_clicked, created_at) WHERE whatsapp_clicked = TRUE;

-- ============================================
-- TABLE: product_views
-- ============================================
CREATE TABLE product_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  duration_seconds INTEGER DEFAULT 0,
  clicked BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for product_views
CREATE INDEX idx_product_views_product ON product_views(product_id, viewed_at DESC);
CREATE INDEX idx_product_views_visit ON product_views(visit_id);

-- ============================================
-- TABLE: payments
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'XAF' NOT NULL,
  method VARCHAR(20) NOT NULL CHECK (method IN ('mtn_momo', 'orange_money')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  momo_transaction_id VARCHAR(100),
  subscription_plan VARCHAR(20),
  subscription_duration INTEGER DEFAULT 30,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for payments
CREATE INDEX idx_payments_vendor ON payments(vendor_id, created_at DESC);
CREATE INDEX idx_payments_status ON payments(status, created_at DESC);

-- ============================================
-- TABLE: otp_codes
-- ============================================
CREATE TABLE otp_codes (
  phone_number VARCHAR(15) PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_otp_expires ON otp_codes(expires_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Vendors policies
CREATE POLICY vendor_select_own ON vendors
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY vendor_update_own ON vendors
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Products policies
CREATE POLICY products_select_public ON products
  FOR SELECT USING (TRUE);

CREATE POLICY products_insert_own ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = products.vendor_id 
      AND auth.uid()::text = id::text
    )
  );

CREATE POLICY products_update_own ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = products.vendor_id 
      AND auth.uid()::text = id::text
    )
  );

CREATE POLICY products_delete_own ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = products.vendor_id 
      AND auth.uid()::text = id::text
    )
  );

-- Visits policies (vendors can only see their own)
CREATE POLICY visits_select_own ON visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = visits.vendor_id 
      AND auth.uid()::text = id::text
    )
  );

CREATE POLICY visits_insert_public ON visits
  FOR INSERT WITH CHECK (TRUE);

-- Payments policies
CREATE POLICY payments_select_own ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = payments.vendor_id 
      AND auth.uid()::text = id::text
    )
  );

-- ============================================
-- FUNCTIONS FOR ATOMIC INCREMENTS
-- ============================================

-- Increment vendor visits
CREATE OR REPLACE FUNCTION increment_vendor_visits(vendor_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE vendors
  SET total_visits = total_visits + 1
  WHERE id = vendor_id_param;
END;
$$ LANGUAGE plpgsql;

-- Increment vendor clicks
CREATE OR REPLACE FUNCTION increment_vendor_clicks(vendor_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE vendors
  SET total_whatsapp_clicks = total_whatsapp_clicks + 1
  WHERE id = vendor_id_param;
END;
$$ LANGUAGE plpgsql;

-- Increment product views
CREATE OR REPLACE FUNCTION increment_product_views(product_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET view_count = view_count + 1
  WHERE id = product_id_param;
END;
$$ LANGUAGE plpgsql;

-- Increment product clicks
CREATE OR REPLACE FUNCTION increment_product_clicks(product_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET click_count = click_count + 1
  WHERE id = product_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CLEANUP JOBS (Run periodically)
-- ============================================

-- Delete expired OTP codes (run every 10 minutes)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS VOID AS $$
BEGIN
  DELETE FROM otp_codes
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert test vendor
INSERT INTO vendors (username, full_name, whatsapp_number, bio)
VALUES (
  'marie_boutique',
  'Marie Fotso',
  '+237671234567',
  'Mode féminine & accessoires 👗 Douala, Cameroun 🇨🇲'
);

-- Note: Remember to set up Supabase Auth triggers
-- to sync auth.users with vendors table user_metadata
