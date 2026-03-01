import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// GET /api/vendors/[username] - Get public vendor page data
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  const params = await context.params;

  try {
    const supabase = createServerSupabaseClient();
    const username = params.username.toLowerCase();

    // Get vendor
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, username, full_name, bio, avatar_url, theme_color, is_active, whatsapp_number')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { success: false, error: 'Boutique non trouvée' },
        { status: 404 }
      );
    }

    // Get active products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, price, description, image_url, is_available, view_count, click_count')
      .eq('vendor_id', vendor.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Products fetch error:', productsError);
      return NextResponse.json(
        { success: false, error: 'Erreur lors du chargement des produits' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      vendor: {
        username: vendor.username,
        full_name: vendor.full_name,
        bio: vendor.bio,
        avatar_url: vendor.avatar_url,
        theme_color: vendor.theme_color,
        whatsapp_number: vendor.whatsapp_number,
      },
      products: products || [],
    });

  } catch (error) {
    console.error('Vendor public page error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
