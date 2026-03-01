import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

type SubscriptionPlan = 'free' | 'pro' | 'business';

interface PlanLimits {
  max_products: number | null;
}

const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: { max_products: 10 },
  pro: { max_products: null },
  business: { max_products: null },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      price,
      category,
      description,
      image_url,
      is_available = true,
    } = body;

    // Validation
    if (!name || !price || !image_url) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and image are required' },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be positive' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Get vendor
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', user.user_metadata.vendor_id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Check plan limits
    const plan = (vendor.subscription_plan || 'free') as SubscriptionPlan;
    const planLimits = PLAN_LIMITS[plan];
    
    if (planLimits.max_products !== null) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendor.id);

      if (count && count >= planLimits.max_products) {
        return NextResponse.json(
          {
            success: false,
            error: `Plan ${vendor.subscription_plan} limited to ${planLimits.max_products} products`,
          },
          { status: 403 }
        );
      }
    }

    // Create product
    const { data: product, error: createError } = await supabase
      .from('products')
      .insert({
        vendor_id: vendor.id,
        name,
        price,
        category,
        description,
        image_url,
        is_available,
      })
      .select()
      .single();

    if (createError) {
      console.error('Product creation error:', createError);
      return NextResponse.json(
        { success: false, error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Get vendor
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id')
      .eq('id', user.user_metadata.vendor_id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Get products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('vendor_id', vendor.id)
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Products fetch error:', productsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, products: products || [] });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
