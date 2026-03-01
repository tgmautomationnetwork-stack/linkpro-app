import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

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
    const period = searchParams.get('period') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date(vendor.created_at);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get current period stats
    const { data: currentVisits } = await supabase
      .from('visits')
      .select('*', { count: 'exact' })
      .eq('vendor_id', vendor.id)
      .gte('created_at', startDate.toISOString());

    const totalVisits = currentVisits?.length || 0;
    const uniqueVisitors = new Set(currentVisits?.map(v => v.session_id)).size;
    const whatsappClicks = currentVisits?.filter(v => v.whatsapp_clicked).length || 0;
    const whatsappOpens = currentVisits?.filter(v => v.whatsapp_opened).length || 0;

    const clickRate = totalVisits > 0 ? (whatsappClicks / totalVisits) * 100 : 0;
    const openRate = whatsappClicks > 0 ? (whatsappOpens / whatsappClicks) * 100 : 0;

    // Get comparison period stats if requested
    let comparison = null;
    if (searchParams.get('compare') === 'true') {
      const periodMs = now.getTime() - startDate.getTime();
      const compareStartDate = new Date(startDate.getTime() - periodMs);
      
      const { data: compareVisits } = await supabase
        .from('visits')
        .select('*')
        .eq('vendor_id', vendor.id)
        .gte('created_at', compareStartDate.toISOString())
        .lt('created_at', startDate.toISOString());

      const compareTotal = compareVisits?.length || 0;
      const compareClicks = compareVisits?.filter(v => v.whatsapp_clicked).length || 0;

      comparison = {
        visits_change: compareTotal > 0 ? ((totalVisits - compareTotal) / compareTotal) * 100 : 0,
        clicks_change: compareClicks > 0 ? ((whatsappClicks - compareClicks) / compareClicks) * 100 : 0,
      };
    }

    // Get top sources
    const sourceCounts: Record<string, number> = {};
    currentVisits?.forEach(visit => {
      const source = visit.source || 'direct';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    const topSources = Object.entries(sourceCounts)
      .map(([source, visits]) => ({
        source,
        visits,
        percentage: totalVisits > 0 ? (visits / totalVisits) * 100 : 0,
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);

    // Get daily stats
    const dailyStats: Record<string, { visits: number; clicks: number }> = {};
    
    currentVisits?.forEach(visit => {
      const date = visit.created_at.split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { visits: 0, clicks: 0 };
      }
      dailyStats[date].visits++;
      if (visit.whatsapp_clicked) {
        dailyStats[date].clicks++;
      }
    });

    const dailyStatsArray = Object.entries(dailyStats)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      success: true,
      period,
      metrics: {
        total_visits: totalVisits,
        unique_visitors: uniqueVisitors,
        whatsapp_clicks: whatsappClicks,
        whatsapp_opens: whatsappOpens,
        click_rate: Math.round(clickRate * 100) / 100,
        open_rate: Math.round(openRate * 100) / 100,
      },
      comparison,
      top_sources: topSources,
      daily_stats: dailyStatsArray,
    });

  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
