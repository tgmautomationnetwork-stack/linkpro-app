import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { detectSource, detectDeviceType } from '@/lib/utils';

// Rate limiting map for tracking (prevent spam)
const trackingAttempts = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      event, 
      vendor_username, 
      session_id, 
      product_id, 
      metadata 
    } = body;

    // Validation
    if (!event || !vendor_username || !session_id) {
      return NextResponse.json(
        { success: false, error: 'event, vendor_username et session_id requis' },
        { status: 400 }
      );
    }

    // Rate limiting (max 100 events per session per hour)
    const rateLimitKey = `${session_id}-${Date.now() / 3600000}`;
    const count = trackingAttempts.get(rateLimitKey) || 0;
    
    if (count > 100) {
      return NextResponse.json(
        { success: false, error: 'Trop de requêtes' },
        { status: 429 }
      );
    }
    
    trackingAttempts.set(rateLimitKey, count + 1);

    const supabase = createServerSupabaseClient();

    // Get vendor
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('username', vendor_username.toLowerCase())
      .single();

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendeur non trouvé' },
        { status: 404 }
      );
    }

    // Get request metadata
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || '';

    const source = metadata?.source || detectSource(referer);
    const deviceType = detectDeviceType(userAgent);

    switch (event) {
      case 'page_view': {
        // Check if visit already exists for this session
        const { data: existingVisit } = await supabase
          .from('visits')
          .select('id')
          .eq('session_id', session_id)
          .eq('vendor_id', vendor.id)
          .single();

        if (!existingVisit) {
          // Create new visit
          await supabase.from('visits').insert({
            vendor_id: vendor.id,
            session_id,
            source,
            utm_source: metadata?.utm_source || null,
            utm_medium: metadata?.utm_medium || null,
            utm_campaign: metadata?.utm_campaign || null,
            ip_address: ip,
            user_agent: userAgent,
            device_type: deviceType,
            partition_month: new Date().toISOString().slice(0, 7) + '-01',
          });

          // Increment vendor total visits
          await supabase.rpc('increment_vendor_visits', {
            vendor_id_param: vendor.id,
          });
        }
        break;
      }

      case 'product_view': {
        if (!product_id) {
          return NextResponse.json(
            { success: false, error: 'product_id requis pour product_view' },
            { status: 400 }
          );
        }

        // Get or create visit
        const { data: visit } = await supabase
          .from('visits')
          .select('id')
          .eq('session_id', session_id)
          .eq('vendor_id', vendor.id)
          .single();

        if (visit) {
          // Record product view
          await supabase.from('product_views').insert({
            visit_id: visit.id,
            product_id,
            duration_seconds: metadata?.duration || 0,
            clicked: false,
          });

          // Increment product view count
          await supabase.rpc('increment_product_views', {
            product_id_param: product_id,
          });
        }
        break;
      }

      case 'whatsapp_click': {
        if (!product_id) {
          return NextResponse.json(
            { success: false, error: 'product_id requis pour whatsapp_click' },
            { status: 400 }
          );
        }

        // Update visit
        const { data: visit } = await supabase
          .from('visits')
          .select('id')
          .eq('session_id', session_id)
          .eq('vendor_id', vendor.id)
          .single();

        if (visit) {
          await supabase
            .from('visits')
            .update({
              whatsapp_clicked: true,
              clicked_product_id: product_id,
            })
            .eq('id', visit.id);

          // Update product view as clicked
          await supabase
            .from('product_views')
            .update({ clicked: true })
            .eq('visit_id', visit.id)
            .eq('product_id', product_id);

          // Increment product click count
          await supabase.rpc('increment_product_clicks', {
            product_id_param: product_id,
          });

          // Increment vendor total clicks
          await supabase.rpc('increment_vendor_clicks', {
            vendor_id_param: vendor.id,
          });
        }
        break;
      }

      case 'whatsapp_open': {
        // Mark that WhatsApp actually opened
        const { data: visit } = await supabase
          .from('visits')
          .select('id')
          .eq('session_id', session_id)
          .eq('vendor_id', vendor.id)
          .single();

        if (visit) {
          await supabase
            .from('visits')
            .update({
              whatsapp_opened: true,
              opened_at: new Date().toISOString(),
            })
            .eq('id', visit.id);
        }
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Type d\'événement invalide' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
