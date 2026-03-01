// Database types matching PostgreSQL schema from specifications

export type SubscriptionPlan = 'free' | 'pro' | 'business';

export interface Vendor {
  id: string;
  username: string;
  full_name: string;
  whatsapp_number: string;
  email: string | null;
  subscription_plan: SubscriptionPlan;
  subscription_expires_at: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  theme_color: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  total_visits: number;
  total_whatsapp_clicks: number;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  price: number; // in FCFA
  description: string | null;
  image_url: string;
  additional_images: string[];
  is_available: boolean;
  stock_quantity: number | null;
  category: string | null;
  tags: string[];
  view_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
  sort_order: number;
}

export interface Visit {
  id: string;
  vendor_id: string;
  session_id: string;
  source: string | null; // 'tiktok' | 'instagram' | 'facebook' | 'direct' | 'google' | 'other'
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  ip_address: string | null;
  user_agent: string | null;
  device_type: string | null; // 'mobile' | 'tablet' | 'desktop'
  country: string | null;
  city: string | null;
  duration_seconds: number;
  whatsapp_clicked: boolean;
  clicked_product_id: string | null;
  whatsapp_opened: boolean;
  opened_at: string | null;
  created_at: string;
}

export interface ProductView {
  id: string;
  visit_id: string;
  product_id: string;
  duration_seconds: number;
  clicked: boolean;
  viewed_at: string;
}

export interface Payment {
  id: string;
  vendor_id: string;
  amount: number; // in FCFA
  currency: string; // 'XAF'
  method: 'mtn_momo' | 'orange_money';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  momo_transaction_id: string | null;
  subscription_plan: SubscriptionPlan | null;
  subscription_duration: number; // days
  metadata: Record<string, any>;
  created_at: string;
  completed_at: string | null;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface AuthSession {
  user: Vendor;
  token: string;
}

export interface OTPRequest {
  whatsapp_number: string;
  action: 'signup' | 'login';
}

export interface OTPVerification {
  whatsapp_number: string;
  code: string;
  username?: string;
  full_name?: string;
}

// Analytics types
export interface AnalyticsOverview {
  period: '7d' | '30d' | '90d' | 'all';
  metrics: {
    total_visits: number;
    unique_visitors: number;
    whatsapp_clicks: number;
    whatsapp_opens: number;
    click_rate: number; // percentage
    open_rate: number; // percentage
  };
  comparison?: {
    visits_change: number; // percentage
    clicks_change: number; // percentage
  };
  top_sources: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
  daily_stats: Array<{
    date: string;
    visits: number;
    clicks: number;
  }>;
}

// Form types
export interface ProductFormData {
  name: string;
  price: number;
  description?: string;
  image_url: string;
  additional_images?: string[];
  category?: string;
  tags?: string[];
  is_available?: boolean;
  stock_quantity?: number;
}

export interface VendorProfileFormData {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  theme_color?: string;
}

// Client-side tracking event
export interface TrackingEvent {
  event: 'page_view' | 'product_view' | 'whatsapp_click' | 'whatsapp_open';
  vendor_username: string;
  session_id: string;
  product_id?: string;
  metadata?: {
    source?: string;
    duration?: number;
    device_type?: string;
  };
}

// Plan limits
export interface PlanLimits {
  max_products: number | null; // null = unlimited
  max_visitors_per_month: number | null; // null = unlimited
  has_analytics_advanced: boolean;
  has_auto_reminders: boolean;
  max_bio_links: number;
  has_custom_theme: boolean;
  has_priority_support: boolean;
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    max_products: 10,
    max_visitors_per_month: 100,
    has_analytics_advanced: false,
    has_auto_reminders: false,
    max_bio_links: 1,
    has_custom_theme: false,
    has_priority_support: false,
  },
  pro: {
    max_products: null,
    max_visitors_per_month: null,
    has_analytics_advanced: true,
    has_auto_reminders: true,
    max_bio_links: 3,
    has_custom_theme: true,
    has_priority_support: false,
  },
  business: {
    max_products: null,
    max_visitors_per_month: null,
    has_analytics_advanced: true,
    has_auto_reminders: true,
    max_bio_links: 10,
    has_custom_theme: true,
    has_priority_support: true,
  },
};

// Pricing
export const PRICING: Record<SubscriptionPlan, number> = {
  free: 0,
  pro: 5000, // FCFA/month
  business: 15000, // FCFA/month
};
