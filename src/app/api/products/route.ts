import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { PLAN_LIMITS } from '@/types';

// GET /api/products - List vendor's products
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
    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', user.user_metadata.vendor_id)
      .single();

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendeur non trouvé' },
        { status: 404 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    // Build query
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('vendor_id', vendor.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (available !== null) {
      query = query.eq('is_available', available === 'true');
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Products fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'Erreur lors du chargement des produits' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
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
    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', user.user_metadata.vendor_id)
      .single();

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendeur non trouvé' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, price, description, image_url, category, tags, is_available, stock_quantity } = body;

    // Validation
    if (!name || !price || !image_url) {
      return NextResponse.json(
        { success: false, error: 'Nom, prix et image requis' },
        { status: 400 }
      );
    }

    if (price < 100) {
      return NextResponse.json(
        { success: false, error: 'Prix minimum : 100 FCFA' },
        { status: 400 }
      );
    }

    // Check plan limits
    const planLimits = PLAN_LIMITS[vendor.subscription_plan];
    
    if (planLimits.max_products !== null) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendor.id);

      if (count && count >= planLimits.max_products) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Limite atteinte (${planLimits.max_products} produits max). Passez à PRO pour débloquer l'illimité.`,
            upgrade_required: true,
          },
          { status: 402 }
        );
      }
    }

    // Generate slug
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    // Create product
    const { data: product, error: createError } = await supabase
      .from('products')
      .insert({
        vendor_id: vendor.id,
        name: name.trim(),
        slug,
        price,
        description: description?.trim() || null,
        image_url,
        category: category || null,
        tags: tags || [],
        is_available: is_available !== false,
        stock_quantity: stock_quantity || null,
      })
      .select()
      .single();

    if (createError) {
      console.error('Product creation error:', createError);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la création du produit' },
        { status: 500 }
      );
    }

    // Update vendor's updated_at
    await supabase
      .from('vendors')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', vendor.id);

    return NextResponse.json({
      success: true,
      product,
    }, { status: 201 });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
